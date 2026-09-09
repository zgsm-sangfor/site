import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { test } from 'node:test'
import { createLeadServer } from './enterpriseLead.mjs'

const ORIGIN = 'http://localhost:9016'
const TEST_WEBHOOK = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=TEST_ONLY'
const lead = () => ({
  requestId: randomUUID(),
  company: '本地测试公司',
  name: '测试',
  contact: '13800000000',
  scale: '20 人以下',
  message: '仅本地测试',
  consent: true,
})

async function fixture(t, options = {}) {
  const calls = []
  const server = createLeadServer({
    webhook: TEST_WEBHOOK,
    allowedOrigins: [ORIGIN],
    fetchImpl: async (url, init) => {
      calls.push({ url, body: JSON.parse(init.body) })
      return Response.json({ errcode: 0 })
    },
    ...options,
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(
    () =>
      new Promise((resolve) => {
        server.close(resolve)
        server.closeAllConnections()
      }),
  )
  const url = `http://127.0.0.1:${server.address().port}/api/enterprise-leads`
  const send = (body = lead(), headers = {}) =>
    fetch(url, {
      method: 'POST',
      headers: { Origin: ORIGIN, 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    })
  return { calls, send, url }
}

test('a validated lead reaches the simulated bot and receives an explicit success receipt', async (t) => {
  const { calls, send } = await fixture(t)
  const input = lead()
  const response = await send(input)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true, requestId: input.requestId })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].body.msgtype, 'text')
  assert.match(calls[0].body.text.content, /手机号：13800000000/)
  assert.match(calls[0].body.text.content, /公司：本地测试公司/)
})

test('email, missing consent, and oversized fields are rejected before contacting the bot', async (t) => {
  const { calls, send } = await fixture(t)
  for (const change of [
    { contact: 'test@example.com' },
    { consent: false },
    { company: 'x'.repeat(101) },
  ]) {
    assert.equal((await send({ ...lead(), ...change })).status, 400)
  }
  assert.equal(calls.length, 0)
})

test('foreign origins, non-JSON, malformed JSON, and oversized bodies are rejected', async (t) => {
  const { calls, send, url } = await fixture(t)
  assert.equal((await send(lead(), { Origin: 'https://other.example' })).status, 403)
  assert.equal((await send(lead(), { 'Content-Type': 'text/plain' })).status, 415)
  assert.equal((await send({ ...lead(), message: 'x'.repeat(9000) })).status, 413)
  const response = await fetch(url, {
    method: 'POST',
    headers: { Origin: ORIGIN, 'Content-Type': 'application/json' },
    body: '{',
  })
  assert.equal(response.status, 400)
  assert.equal(calls.length, 0)
})

test('a missing or invalid server secret never produces a success receipt', async (t) => {
  for (const webhook of ['', 'https://other.example/send?key=TEST_ONLY']) {
    const { calls, send } = await fixture(t, { webhook })
    assert.equal((await send()).status, 503)
    assert.equal(calls.length, 0)
  }
})

test('HTTP failure, business rejection, invalid response, and network failure do not report success', async (t) => {
  for (const fetchImpl of [
    async () => Response.json({ errcode: 0 }, { status: 400 }),
    async () => Response.json({ errcode: 93000, errmsg: 'rejected' }),
    async () => new Response('not-json'),
    async () => {
      throw new Error('unavailable')
    },
  ]) {
    const { send } = await fixture(t, { fetchImpl })
    const response = await send()
    assert.equal(response.status, 502)
    assert.equal((await response.json()).error, 'notification_failed')
  }
})

test('a timed-out bot call returns failure', async (t) => {
  const { send } = await fixture(t, {
    timeoutMs: 20,
    fetchImpl: (_url, { signal }) =>
      new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason))),
  })
  assert.equal((await send()).status, 502)
})

test('parallel submissions and successful retries with the same ID notify only once', async (t) => {
  const { send, calls } = await fixture(t)
  const input = lead()
  const responses = await Promise.all([send(input), send(input)])
  assert.deepEqual(
    responses.map((r) => r.status),
    [200, 200],
  )
  assert.equal((await send(input)).status, 200)
  assert.equal(calls.length, 1)
  assert.equal((await send({ ...input, company: '另一家公司' })).status, 409)
})

test('a failed request can be retried with the same ID', async (t) => {
  let attempts = 0
  const { send } = await fixture(t, {
    fetchImpl: async () => Response.json({ errcode: ++attempts === 1 ? 93000 : 0 }),
  })
  const input = lead()
  assert.equal((await send(input)).status, 502)
  assert.equal((await send(input)).status, 200)
  assert.equal(attempts, 2)
})

test('per-address and global limits prevent unbounded group notifications', async (t) => {
  const { send, calls } = await fixture(t)
  for (let i = 0; i < 15; i++) {
    assert.equal(
      (await send(lead(), { 'X-Real-IP': `127.0.0.${Math.floor(i / 5) + 1}` })).status,
      200,
    )
    if (i === 4) assert.equal((await send(lead(), { 'X-Real-IP': '127.0.0.1' })).status, 429)
  }
  assert.equal((await send(lead(), { 'X-Real-IP': '127.0.0.1' })).status, 429)
  assert.equal((await send(lead(), { 'X-Real-IP': '127.0.0.4' })).status, 429)
  assert.equal(calls.length, 15)
})

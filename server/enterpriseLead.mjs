import { createHash } from 'node:crypto'
import { createServer } from 'node:http'

const MAX_BODY_BYTES = 8192
const PHONE_PATTERN = /^1[3-9]\d{9}$/
const REQUEST_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** @param {string} value */
function isWecomWebhook(value) {
  try {
    const url = new URL(value)
    return (
      url.origin === 'https://qyapi.weixin.qq.com' &&
      url.pathname === '/cgi-bin/webhook/send' &&
      Boolean(url.searchParams.get('key')) &&
      !url.username &&
      !url.password &&
      !url.hash
    )
  } catch {
    return false
  }
}

/** @param {unknown} input */
function validateLead(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const value = /** @type {Record<string, unknown>} */ (input)
  const limits = { company: 100, name: 50, contact: 11, scale: 40, message: 255 }
  /** @type {Record<string, string>} */
  const lead = {}
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof value[key] !== 'string') return null
    const text = value[key].trim()
    if (
      text.length > limit ||
      (key !== 'message' && !text) ||
      /[\u0000-\u001f\u007f]/.test(text.replace(/\r?\n/g, ''))
    )
      return null
    lead[key] = text.replace(/[\r\n]+/g, ' ')
  }
  if (
    !PHONE_PATTERN.test(lead.contact) ||
    value.consent !== true ||
    typeof value.requestId !== 'string' ||
    !REQUEST_ID_PATTERN.test(value.requestId)
  )
    return null
  return { ...lead, requestId: value.requestId }
}

/** @param {import('node:http').ServerResponse} res @param {number} status @param {object} body */
function reply(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

/**
 * The server binds to loopback; only the local Nginx proxy may set X-Real-IP.
 * @param {{ webhook?: string, allowedOrigins?: string[], fetchImpl?: typeof fetch, timeoutMs?: number }} options
 */
export function createLeadServer({
  webhook = '',
  allowedOrigins = [],
  fetchImpl = fetch,
  timeoutMs = 8000,
} = {}) {
  const configured = isWecomWebhook(webhook)
  /** @type {Map<string, { count: number, expires: number }>} */
  const attempts = new Map()
  /** @type {Map<string, { digest: string, expires: number, result: Promise<{ status: number, body: object }> }>} */
  const requests = new Map()

  /** @param {Record<string, string>} lead */
  async function notify(lead) {
    const content = [
      '【官网企业版咨询】',
      `公司：${lead.company}`,
      `姓名：${lead.name}`,
      `手机号：${lead.contact}`,
      `团队规模：${lead.scale}`,
      ...(lead.message ? [`留言：${lead.message}`] : []),
      `咨询编号：${lead.requestId}`,
    ].join('\n')
    try {
      const response = await fetchImpl(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msgtype: 'text', text: { content } }),
        redirect: 'error',
        signal: AbortSignal.timeout(timeoutMs),
      })
      if (!response.ok) return { status: 502, body: { error: 'notification_failed' } }
      const result = await response.json()
      if (result?.errcode !== 0) return { status: 502, body: { error: 'notification_failed' } }
      return { status: 200, body: { success: true, requestId: lead.requestId } }
    } catch {
      // Never log the webhook URL, phone number, or submitted payload.
      return { status: 502, body: { error: 'notification_failed' } }
    }
  }

  const server = createServer(async (req, res) => {
    if (req.url !== '/api/enterprise-leads') return reply(res, 404, { error: 'not_found' })
    if (req.method !== 'POST') return reply(res, 405, { error: 'method_not_allowed' })
    if (!allowedOrigins.includes(String(req.headers.origin || '')))
      return reply(res, 403, { error: 'origin_not_allowed' })
    if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json')
      return reply(res, 415, { error: 'json_required' })
    if (!configured) return reply(res, 503, { error: 'not_configured' })

    /** @type {Buffer[]} */
    const chunks = []
    let bytes = 0
    try {
      for await (const chunk of req) {
        bytes += chunk.length
        if (bytes > MAX_BODY_BYTES) {
          reply(res, 413, { error: 'payload_too_large' })
          return
        }
        chunks.push(chunk)
      }
      const lead = validateLead(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      if (!lead) return reply(res, 400, { error: 'invalid_input' })

      const now = Date.now()
      for (const [key, value] of requests) if (value.expires < now) requests.delete(key)
      for (const [key, value] of attempts) if (value.expires < now) attempts.delete(key)
      const digest = createHash('sha256').update(JSON.stringify(lead)).digest('hex')
      const existing = requests.get(lead.requestId)
      if (existing) {
        if (existing.digest !== digest) return reply(res, 409, { error: 'request_conflict' })
        const result = await existing.result
        return reply(res, result.status, result.body)
      }

      // Bound outbound notifications globally and per client address.
      const ip = `ip:${req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown'}`
      for (const [key, limit] of [
        [ip, 5],
        ['global', 15],
      ]) {
        const count = attempts.get(String(key))?.count || 0
        if (count >= Number(limit)) {
          res.setHeader('Retry-After', '60')
          return reply(res, 429, { error: 'rate_limited' })
        }
      }
      for (const key of [ip, 'global']) {
        const previous = attempts.get(key)
        attempts.set(key, {
          count: (previous?.count || 0) + 1,
          expires: previous?.expires || now + 60000,
        })
      }

      const resultPromise = notify(lead)
      requests.set(lead.requestId, { digest, expires: now + 600000, result: resultPromise })
      const result = await resultPromise
      if (result.status !== 200) requests.delete(lead.requestId)
      reply(res, result.status, result.body)
    } catch {
      reply(res, 400, { error: 'invalid_json' })
    }
  })
  server.requestTimeout = 15000
  server.headersTimeout = 10000
  return server
}

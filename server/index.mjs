import { createLeadServer } from './enterpriseLead.mjs'
import { spawn } from 'node:child_process'

const port = Number(process.env.ENTERPRISE_LEAD_PORT || 3001)
const allowedOrigins = (
  process.env.ENTERPRISE_LEAD_ORIGINS || 'https://costrict.ai,https://www.costrict.ai'
)
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)
const server = createLeadServer({ webhook: process.env.ENTERPRISE_WECOM_WEBHOOK, allowedOrigins })
/** @type {import('node:child_process').ChildProcess | undefined} */
let nginx
let stopping = false

function shutdown(code) {
  if (stopping) return
  stopping = true
  const deadline = setTimeout(() => process.exit(1), 10000)
  deadline.unref()
  const nginxClosed =
    nginx && nginx.exitCode === null && nginx.signalCode === null
      ? new Promise((resolve) => {
          nginx.once('close', resolve)
          nginx.kill('SIGQUIT')
        })
      : Promise.resolve()
  Promise.all([nginxClosed, new Promise((resolve) => server.close(resolve))]).then(() =>
    process.exit(code),
  )
}

server.on('error', () => {
  console.error('[enterprise-leads] Server failed to start')
  shutdown(1)
})
server.listen(port, '127.0.0.1', () => {
  console.info(`[enterprise-leads] Listening on 127.0.0.1:${port}`)
  if (process.argv.includes('--with-nginx')) {
    nginx = spawn('nginx', ['-g', 'daemon off;'], { stdio: 'inherit' })
    nginx.once('error', () => shutdown(1))
    nginx.once('exit', () => {
      if (!stopping) shutdown(1)
    })
  }
})
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(0))
}

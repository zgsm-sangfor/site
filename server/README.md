> 历史实现：当前 `/enterprise` 已迁移至 Go API + SQLite + Turnstile，前端不再调用此 Node 服务，容器也不再启动它。新部署和企微通知配置见 [API 说明](../../costrict-ai-api/README.md)。以下仅保留旧实现参考。

# 企业咨询企微通知部署

网页 POST `/api/enterprise-leads`，由同机 Node 服务通知企微群。
只有企微 HTTP 成功且响应 `errcode: 0` 时，网页才显示成功。
联系方式只接受 11 位中国大陆手机号；没有邮件提交或邮件兜底。

## 上线人员需要做的事

1. 在企微群管理中作废此前暴露的机器人 webhook，并创建新的地址。
2. 在服务器的机密配置中设置 `ENTERPRISE_WECOM_WEBHOOK`，不要写进仓库、前端 `VITE_*` 变量或 Docker 构建参数。
3. 使用更新后的根目录 Dockerfile 构建并替换网站容器，保留现有域名、端口及静态目录挂载。该镜像同时启动 Nginx 和本地 Node 服务。
4. 将上述变量在运行时注入容器。默认允许 `https://costrict.ai` 和 `https://www.costrict.ai`；如有预发布域名，用 `ENTERPRISE_LEAD_ORIGINS` 配置逗号分隔的完整来源地址。
5. 经业务方允许后，提交一条明确标记为验收的咨询，确认正确企微群收到公司、姓名、手机号、团队规模、留言和咨询编号，且网页显示成功。

当前 `.github/workflows/blog-rebuild.yml` 只同步 `dist/`，不会安装或更新 Node 服务。
因此首次上线本功能必须更新容器和 Nginx 配置，不能只上传前端文件。
后续修改 `server/`、Dockerfile 或 Nginx 时也需要重建镜像；纯前端更新可继续同步静态文件。
如部署系统挂载了外部 Nginx 配置，需要同步根目录 `nginx.conf` 的 API location。

## 非容器部署

用 Node 20.19+ 启动 `node server/index.mjs`，由服务器进程管理器负责启动和重启。
默认监听 `127.0.0.1:3001`，不得将这个端口公开。
在 Nginx 中加入根目录 `nginx.conf` 的 `/api/enterprise-leads` 代理配置，并由 Nginx 覆盖 `X-Real-IP`。
前端、代理和 API 必须部署在同一个域名下。

## 本地开发与验收

- 启动 API：配置运行时变量后执行 `pnpm dev:leads`。
- 启动前端：`pnpm dev`。Vite 已将该 API 转发到本机 3001。
- `ENTERPRISE_LEAD_ORIGINS` 必须包含实际预览来源，例如 `http://127.0.0.1:9016`。
- `pnpm test:leads` 与 `pnpm exec vitest run tests/enterpriseLead.test.ts` 使用模拟响应，不会向群发消息。
- 未配置 webhook 时 API 返回 503，网页显示暂不可用并保留输入，不会假装成功。

## 验收范围与限制

- 空值、邮箱、无效手机号、未同意条款：前后端均拒绝，不发群通知。
- 企微 HTTP 失败、业务错误码、网络异常：不显示成功，输入保留，可重试。
- 提交中禁用按钮；相同咨询编号的并发请求及十分钟内成功重试只通知一次。
- 默认同一来源 IP 每分钟最多 5 次、整个服务最多 15 次新通知；429 时等待一分钟。
- 日志不记录手机号、正文或机器人密钥。
- 当前限流和去重在单进程内存中，服务重启后清空；多实例部署前需共享存储。
- 若企微已经接收但回执丢失，服务无法保证重试绝不重复。群消息中的咨询编号可用于人工识别；这类异常不会被当作已成功。
- 域名校验和限流不等于防机器人的身份验证；如有公开滥用，应在入口启用验证码或网关防护。
- 从源码删除旧密钥不会清除 Git 历史，必须在企微后台作废旧地址。

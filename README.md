# site
The official website of CoStrict


## 企业咨询表单

`/enterprise` 提交到 Go API 的 `/site/api/v1/enterprise`，使用 Turnstile 验证并保存 SQLite。

- API 本地启动：在 `costrict-ai-api` 执行 `CONFIG_PATH=config.local.example.yaml go run .`。
- 前端启动：`corepack pnpm dev`，访问 `http://localhost:9002/enterprise`。
- 未配置时默认访问 `https://api.costrict.ai`。本地调试可复制 `.env.example` 为 `.env.local`，显式设置 `VITE_API_BASE_URL=` 使用 Vite 代理；也可设置 `VITE_API_BASE_URL=http://127.0.0.1:8080` 直连本地 API，并在 API 配置前端来源的 CORS 白名单。修改后重启 Vite。
- `VITE_API_BASE_URL` 是构建时配置，生产默认值无需额外设置；已有进程环境变量的优先级高于 `.env.local`。不需要向前端写入 Turnstile 密钥。Site Key 从 `/cloudflare/turnstile/config` 获取，Secret Key 仅配置在 API。
- 详细 Turnstile 申请、测试密钥、CORS、SQLite、Docker、限流和企微通知说明见 [API README](../costrict-ai-api/README.md)。
- 验收可直接人工打开页面，不需要无头浏览器。

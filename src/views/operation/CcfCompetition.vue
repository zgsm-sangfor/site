<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import CoverBanner from '@/assets/operation/ccf/cover_banner.webp'
import QrCodeWechat from '@/assets/operation/ccf/qrcode_wechat.webp'

defineOptions({ name: 'CcfCompetition' })

const { t } = useI18n()

useHead({
  title: '深信服 CoStrict × CCF：AI 原生开发大赛赛事回顾',
  meta: [
    { name: 'description', content: '回顾 2026 年 CCF 服务计算创新大赛暨深信服 CoStrict AI 原生创新大赛（备案号：CCF-TC-26-399）。' },
    { property: 'og:title', content: '深信服 CoStrict × CCF：AI 原生开发大赛赛事回顾' },
    { property: 'og:description', content: '回顾 2026 年 CCF 服务计算创新大赛暨深信服 CoStrict AI 原生创新大赛。' },
    { property: 'og:url', content: 'https://costrict.ai/operation/ccf-competition' },
    { name: 'twitter:title', content: '深信服 CoStrict × CCF：AI 原生开发大赛赛事回顾' },
    { name: 'twitter:description', content: '回顾 2026 年 CCF 服务计算创新大赛暨深信服 CoStrict AI 原生创新大赛。' },
  ],
  link: [{ rel: 'canonical', href: 'https://costrict.ai/operation/ccf-competition' }],
})

const [
  coverRef,
  highlight1Ref,
  orgRef,
  topicRef,
  highlight2Ref,
  scheduleRef,
  ctaRef,
  downloadRef,
  contactRef,
  qrcodeRef,
] = useScrollAnimation(10)
</script>

<template>
  <div class="min-h-screen pt-16 bg-black text-white text-base leading-relaxed">
    <!-- Hero -->
    <header class="article-hero relative pt-[140px] pb-[60px] px-5 text-center overflow-hidden md:pt-[120px] md:pb-10 md:px-4">
      <div class="inline-flex items-center px-4 py-1.5 rounded-[40px] bg-white/[0.04] border border-white/[0.14] text-white/65 text-sm font-medium mb-6 relative z-[1]">
        <span>{{ t('operation.card4Badge') }}</span>
      </div>
      <h1 class="text-[clamp(24px,4vw,32px)] font-bold text-white leading-tight max-w-[1200px] mx-auto mb-5 relative z-[1]">
        深信服 CoStrict × CCF：AI 原生开发大赛
      </h1>
    </header>

    <!-- Article Content -->
    <article class="max-w-[800px] mx-auto px-5 pb-[100px] md:px-4 md:pb-[60px]">
      <!-- 比赛封面图 -->
      <div class="scroll-animation-wrapper mb-10" ref="coverRef">
        <img :src="CoverBanner" alt="2026 CCF 服务计算创新大赛暨深信服 CoStrict AI 原生创新大赛" class="w-full rounded-[20px] border border-white/10 block" />
      </div>

      <div class="article-content">
        <div class="scroll-animation-wrapper relative overflow-hidden rounded-[20px] p-6 my-8 bg-[rgba(0,102,255,0.08)] border border-[rgba(0,102,255,0.2)]" ref="highlight1Ref">
          <p>如果你正在关注 <strong>AI Native 应用</strong>、<strong>Agent 协作开发</strong>、<strong>软件工程新范式</strong>，这场比赛会是一次非常好的实战机会。把创意做成作品，把思路跑成系统，把能力交给结果来证明。</p>
        </div>

        <p>当前，大语言模型（LLM）驱动的人工智能技术正深刻改变软件的开发方式与应用形态，软件工程正在从"以人为中心的工具辅助开发"迈向"以智能体协作为核心的 AI Native 开发范式"。</p>

        <p>在此背景下，由<strong>中国计算机学会（CCF）</strong>主办，<strong>CCF 服务计算专业委员会</strong>、<strong>深信服</strong>、<strong>西南交通大学</strong>联合承办的<strong>2026 年 CCF 服务计算创新大赛暨深信服 CoStrict AI 原生创新大赛</strong>（备案号：CCF-TC-26-399）重磅启动！</p>

        <p>该赛事自 2016 年发起以来，已成功举办十届，取得了丰硕的竞赛成果。本届赛事聚焦服务计算前沿技术落地，立足 AI 大模型、智能体协作等核心趋势，面向全国高校学子搭建技术创新、工程实践与能力比拼的优质平台，助力青年开发者洞察 AI 原生研发新方向，解锁软件工程全新发展机遇。</p>

        <h2>1. 参赛组织</h2>
        <div class="scroll-animation-wrapper relative overflow-hidden rounded-[20px] p-6 my-6 bg-[#1e1e1e] border border-white/10 transition-all duration-[250ms] ease-in-out hover:border-[rgba(0,102,255,0.3)] hover:bg-white/[0.04]" ref="orgRef">
          <ul>
            <li><strong>主办单位：</strong>中国计算机学会（CCF）</li>
            <li><strong>承办单位：</strong>CCF 服务计算专业委员会</li>
            <li><strong>协办单位：</strong>深信服科技股份有限公司、西南交通大学</li>
            <li><strong>大赛组委会主席：</strong>刘譞哲（北京大学）</li>
          </ul>
        </div>
        <p><strong>大赛组委会委员（公司）：</strong>刘贵星、韦体东、鄢桥志、王洪军、黄云（深信服科技股份有限公司）</p>
        <p><strong>大赛组委会委员（高校）：</strong>王东京（杭州电子科技大学）、徐佳（安徽大学）</p>

        <h2>2. 参赛对象</h2>
        <ol>
          <li>全日制普通高等院校（含海外院校）的在籍学生（含本科生、研究生及以上学历）；</li>
          <li>参赛选手可以个人或以组队的形式递交作品。每队人数最多不超过 5 人，组队中队员排序和内部分工须明确。每名队员只能参加一个参赛团队；</li>
          <li>每个参赛团队可申报最多 1 名指导教师，每名指导教师最多指导三个团队。</li>
        </ol>

        <h2>3. 竞赛主题</h2>
        <p>本次大赛围绕 <strong>AI 原生应用创新</strong>与 <strong>AI Native 软件研发转型</strong>两大方向设置赛题，鼓励参赛学生探索大模型、智能体（Agent）、向量检索、多模态交互等关键技术在软件研发流程与应用系统中的深度融合，设计并实现具有工程价值与创新意义的智能系统解决方案。</p>

        <p>赛事旨在引导高校学生理解软件工程从传统开发模式向 AI 原生范式演进的趋势，提升复杂系统设计能力、智能体协作设计能力与工程落地能力，在实践中探索下一代软件开发与应用创新的新路径，共同推动 AI 时代软件工程人才培养模式的升级与发展。</p>

        <p>具体赛题内容如下（<strong>二选一参赛</strong>）：</p>

        <div class="scroll-animation-wrapper grid grid-cols-1 gap-4 my-6 sm:grid-cols-2" ref="topicRef">
          <div class="relative overflow-hidden rounded-[20px] p-6 transition-all duration-[250ms] ease-in-out hover:-translate-y-0.5 hover:border-[rgba(0,102,255,0.4)] hover:shadow-[0_8px_32px_rgba(0,102,255,0.1)] bg-gradient-to-br from-[rgba(0,102,255,0.08)] to-[rgba(0,255,183,0.04)] border border-[rgba(0,102,255,0.2)]">
            <div class="inline-block px-3 py-1 rounded-md bg-[rgba(0,102,255,0.15)] text-[#197dff] text-xs font-semibold mb-3 uppercase tracking-[0.5px]">赛题一</div>
            <h4 class="text-[#f4f8ff] mb-3 text-lg">无 AI 不运行 - 架构级 AI 原生应用开发</h4>
            <p class="text-white/50 text-sm mb-0 leading-[1.7]">基于 Claude Code、CoStrict 等 AI 编程工具，设计并实现一个从系统架构层面即以 AI 为核心驱动力构建的 AI 原生应用。</p>
          </div>
          <div class="relative overflow-hidden rounded-[20px] p-6 transition-all duration-[250ms] ease-in-out hover:-translate-y-0.5 hover:border-[rgba(0,102,255,0.4)] hover:shadow-[0_8px_32px_rgba(0,102,255,0.1)] bg-gradient-to-br from-[rgba(0,102,255,0.08)] to-[rgba(0,255,183,0.04)] border border-[rgba(0,102,255,0.2)]">
            <div class="inline-block px-3 py-1 rounded-md bg-[rgba(0,102,255,0.15)] text-[#197dff] text-xs font-semibold mb-3 uppercase tracking-[0.5px]">赛题二</div>
            <h4 class="text-[#f4f8ff] mb-3 text-lg">AI Native 软件研发智能体系统</h4>
            <p class="text-white/50 text-sm mb-0 leading-[1.7]">基于 FastGPT 或 Dify，构建面向工程实践的 AI Native 软件研发智能体系统，完成端到端软件研发流程闭环。</p>
          </div>
        </div>

        <h3>赛题一：无 AI 不运行 - 架构级 AI 原生应用开发</h3>
        <p>大模型并行推理服务创新及应用旨在探索大模型并行推理策略、资源管理优化、服务架构设计与实现，以及应用开发。可参考研究模型并行、数据并行等策略，设计高效资源管理机制，构建可扩展服务架构，并选择实际场景开发应用，鼓励在跨节点/异构硬件（如 GPU、CPU、NPU 等）环境下实现性能突破。</p>

        <p>大语言模型正在重新定义软件的形态与边界，推动应用从"功能驱动"向"智能驱动"转变。本赛题要求参赛团队基于 Claude Code、CoStrict 等 AI 编程工具提供的安全、合规或 DevOps 能力，结合大语言模型、智能体（Agent）、向量检索、多模态交互或实时推理等技术，设计并实现一个从系统架构层面即以 AI 为核心驱动力构建的 AI 原生应用。</p>

        <p>作品应体现 AI 对系统核心功能的主导作用（离开 AI 难以运转），而非传统软件功能的简单增强或接口调用封装。参赛作品可以面向教育、编程、创意生产、协同办公或生活服务等领域，重点探索自然语言、多模态或智能体驱动的新型交互方式与应用范式。</p>

        <h4>作品要求</h4>
        <ul>
          <li>系统核心功能必须依赖 AI 才能运行，例如由 AI 完成任务理解、流程规划、内容生成、状态决策或系统调度等关键能力；</li>
          <li>鼓励探索教育、创意、编程、协作、艺术、生活服务等领域的全新交互范式；</li>
          <li>提交材料需包含设计说明文档、作品介绍 PPT/文档、Demo 演示视频、源代码及运行说明、AI 工具使用报告。</li>
        </ul>

        <h4>评审重点</h4>
        <p>重点考察参赛作品的 AI 原生性、技术实现能力与应用创新价值，主要评估系统核心功能是否由大模型或智能体驱动、是否体现 AI 与具体应用场景的深度耦合，以及是否突破传统软件交互与功能实现方式，形成新的应用范式。同时关注系统架构设计的完整性与工程可运行性，包括多智能体协作机制、向量检索或推理流程设计等关键技术的实际应用情况。</p>

        <h3>赛题二：AI Native 软件研发智能体系统（AI Developer Agent System）</h3>
        <p>大语言模型（LLM）正在推动软件工程进入 AI Native 时代，软件研发正从 "人工主导、工具辅助" 转向 "人机协同、多智能体协作" 的新范式。传统 AI 编程工具主要集中在代码补全与片段生成层面，而真实的软件工程仍然涉及需求理解、系统设计、任务拆解、代码实现、测试验证、文档维护与部署发布等多个复杂环节。如何让 AI 深度参与并协同完成完整的软件研发流程，成为当前软件工程领域的重要探索方向。</p>

        <p>本赛题围绕真实开源项目的软件研发场景展开，基于指定的大型开源项目 <strong>FastGPT</strong> 或 <strong>Dify</strong>，鼓励参赛团队构建一个面向工程实践的 AI Native 软件研发智能体系统，探索 AI 在需求分析、任务拆解、代码生成、测试验证、文档生成及部署发布等关键环节中的协同能力，完成一次真实的软件特性增量开发闭环实践，验证 AI 在复杂工程环境中的研发协作能力。</p>

        <h4>作品要求</h4>
        <ul>
          <li>作品应体现 AI 参与软件研发流程的关键能力，并具备一定工程实现深度与创新性；</li>
          <li>需提交完整源代码，作品应能够复现核心功能流程；</li>
          <li>提交材料包括：设计说明文档、项目源代码及运行说明、系统演示视频、项目展示文档（PPT）。</li>
        </ul>

        <h4>评审重点</h4>
        <p>本赛题重点考察参赛团队在 AI Native 软件研发方向的系统设计能力、工程实现能力及创新能力，主要体现在是否能够完成从需求分析到功能实现与验证的完整研发闭环流程，是否能够设计并实现具备明确分工与协同机制的多智能体系统，是否能够正确理解并有效利用大型代码仓结构开展增量开发，以及在研发过程中体现较高程度的自动化能力与工程规范意识。</p>

        <div class="scroll-animation-wrapper relative overflow-hidden rounded-[20px] p-6 my-8 bg-[rgba(0,102,255,0.08)] border border-[rgba(0,102,255,0.2)]" ref="highlight2Ref">
          <p><strong>注意：</strong>一旦发现结果造假（包括但不限于使用测试集进行训练、结果伪造等），该队伍成绩为 0 分。</p>
        </div>

        <h2>4. 竞赛规则</h2>
        <p>竞赛评比分<strong>初赛</strong>和<strong>决赛</strong>。初赛报名采用提交报名表的方式，填写报名表发送至大赛指定邮箱，报名表参见附件 1 文档，作品提交模板见附件 2，<strong>大赛不收取报名费</strong>。</p>
        <p>初赛评审采用会议评审方式，每件作品由专家根据评分细则评审打分，汇总后按评分高低排名决定晋级决赛队伍。</p>
        <p>决赛采用现场答辩评审形式，决赛队伍需在大赛现场进行系统演示和说明，由评审委员会打分确定作品排序，最终决出一等奖、二等奖、三等奖及优秀奖作品。</p>

        <h2>5. 作品提交方式</h2>
        <ol>
          <li>参赛人（参赛队队长）申请百度网盘 <a href="http://pan.baidu.com/" target="_blank" rel="noopener">http://pan.baidu.com/</a>；</li>
          <li>参赛人用客户端等方式上传作品压缩文件到百度云盘，对该压缩文件"创建分享" &gt;&gt; "私密分享"（注意一旦分享后，不可以修改原文件内容，否则需要重新分享）；</li>
          <li>参赛人将作品的私密共享链接及访问密码发送到大赛指定邮箱，邮件主题命名方式为："2026NCSC 参赛作品" + 参赛学校。</li>
        </ol>

        <h2>6. 奖项设置</h2>
        <p>本次大赛设置<strong>一等奖、二等奖、三等奖及优秀奖</strong>，并为获奖团队和指导教师颁发奖金和获奖证书。所有奖项将于大赛同期学术会议上进行颁发。</p>

        <h2>7. 赛程安排</h2>
        <table class="scroll-animation-wrapper w-full border-collapse my-6 text-sm" ref="scheduleRef">
          <thead>
            <tr>
              <th class="px-4 py-3.5 text-left border-b border-white/10 text-[#f4f8ff] font-semibold bg-white/[0.03] text-sm">时间节点</th>
              <th class="px-4 py-3.5 text-left border-b border-white/10 text-[#f4f8ff] font-semibold bg-white/[0.03] text-sm">事项</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70 text-[#197dff] font-medium whitespace-nowrap">2026 年 06 月 15 日前</td>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70">参赛队伍报名，提交报名表至大赛指定邮箱</td>
            </tr>
            <tr>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70 text-[#197dff] font-medium whitespace-nowrap">2026 年 07 月 01 日前</td>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70">按要求提交作品相关内容</td>
            </tr>
            <tr>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70 text-[#197dff] font-medium whitespace-nowrap">2026 年 08 月 01 日前</td>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70">专家评审决定入围作品</td>
            </tr>
            <tr>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70 text-[#197dff] font-medium whitespace-nowrap">2026 年 08 月 17 日</td>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70">决赛，参加 CCF 2026 中国数智服务大会并现场进行演示</td>
            </tr>
            <tr>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70 text-[#197dff] font-medium whitespace-nowrap">2026 年 08 月 19 日</td>
              <td class="px-4 py-3.5 text-left border-b border-white/10 text-white/70">颁奖</td>
            </tr>
          </tbody>
        </table>

        <div class="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-10"></div>

        <div class="scroll-animation-wrapper relative overflow-hidden rounded-[20px] text-center my-12 py-10 px-8 md:py-8 md:px-5 cta-section" ref="ctaRef">
          <h3 class="text-[#f4f8ff] text-[22px] mb-3 relative">立即下载 CoStrict</h3>
          <p class="text-white/50 mb-6 relative">工欲善其事，必先利其器。用 CoStrict 开启你的 AI 原生开发之旅！</p>
          <div class="flex gap-3 justify-center flex-wrap relative">
            <a href="https://costrict.ai/download" class="inline-flex items-center gap-2 px-7 py-3 rounded-[40px] text-sm font-medium cursor-pointer transition-all duration-[250ms] ease-in-out no-underline bg-[#197dff] text-white border-none hover:bg-[#3d8fff] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(25,125,255,0.3)]" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              立即下载
            </a>
            <a href="https://github.com/zgsm-ai/costrict" class="inline-flex items-center gap-2 px-7 py-3 rounded-[40px] text-sm font-medium cursor-pointer transition-all duration-[250ms] ease-in-out no-underline bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub 开源
            </a>
          </div>
        </div>

        <h2>报名方式</h2>
        <ul>
          <li>下载并填写报名表（附件 1），发送至大赛指定邮箱（邮件主题格式："2026NCSC 参赛作品" + 参赛学校）</li>
          <li><strong>报名截止：</strong>2026 年 6 月 15 日</li>
          <li><strong>作品提交截止：</strong>2026 年 7 月 1 日</li>
        </ul>

        <h2>资料下载</h2>
        <p>参赛作品享有知识产权保护，竞赛组委会对所接触的参赛作品及资料负有保密义务。</p>
        <div class="scroll-animation-wrapper grid grid-cols-1 sm:grid-cols-2 gap-4 my-6" ref="downloadRef">
          <a href="/attachments/ccf-competition/报名表.doc" class="flex flex-col items-center text-center py-7 px-5 rounded-[20px] no-underline transition-all duration-[250ms] ease-in-out cursor-pointer bg-[#1e1e1e] border border-white/10 hover:border-[rgba(0,102,255,0.3)] hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,102,255,0.08)]" download target="_blank" rel="noopener">
            <div class="w-12 h-12 rounded-[10px] bg-[rgba(0,102,255,0.1)] border border-[rgba(0,102,255,0.2)] flex items-center justify-center mb-4 text-[#197dff]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div class="text-[#f4f8ff] text-base font-semibold mb-1.5">报名表（附件1）</div>
            <div class="text-white/50 text-sm">点击下载大赛报名表</div>
          </a>
          <a href="/attachments/ccf-competition/作品提交模板.docx" class="flex flex-col items-center text-center py-7 px-5 rounded-[20px] no-underline transition-all duration-[250ms] ease-in-out cursor-pointer bg-[#1e1e1e] border border-white/10 hover:border-[rgba(0,102,255,0.3)] hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,102,255,0.08)]" download target="_blank" rel="noopener">
            <div class="w-12 h-12 rounded-[10px] bg-[rgba(0,102,255,0.1)] border border-[rgba(0,102,255,0.2)] flex items-center justify-center mb-4 text-[#197dff]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div class="text-[#f4f8ff] text-base font-semibold mb-1.5">作品提交模板（附件2）</div>
            <div class="text-white/50 text-sm">点击下载作品提交模板</div>
          </a>
        </div>

        <h2>联系方式</h2>
        <div class="scroll-animation-wrapper relative overflow-hidden rounded-[20px] p-6 my-6 bg-[#1e1e1e] border border-white/10 transition-all duration-[250ms] ease-in-out hover:border-[rgba(0,102,255,0.3)] hover:bg-white/[0.04]" ref="contactRef">
          <ul>
            <li><strong>联系邮箱：</strong><a href="mailto:ncsc_contest@163.com" target="_blank" rel="noopener">ncsc_contest@163.com</a></li>
            <li><strong>联系人 - 王东京：</strong>13732205613</li>
            <li><strong>联系人 - 徐佳：</strong>13956972711</li>
            <li><strong>联系人 - 黄益城：</strong>13706652085</li>
          </ul>
        </div>

        <h3>扫码进群</h3>
        <div class="scroll-animation-wrapper text-center my-8" ref="qrcodeRef">
          <p class="mb-5">请参赛队伍扫码联系工作人员（黄益城）微信，工作人员将邀请您进入赛事沟通群。</p>
          <div class="inline-block p-4 bg-white rounded-[10px] border border-white/10 leading-none">
            <img :src="QrCodeWechat" alt="工作人员微信二维码" class="w-[200px] h-[200px] block rounded" />
          </div>
          <p class="text-white/50 text-sm mt-3">扫码添加微信：黄益城</p>
        </div>

        <div class="relative overflow-hidden rounded-[20px] p-6 my-8 bg-[rgba(0,102,255,0.08)] border border-[rgba(0,102,255,0.2)]">
          <p>如果你也认同严肃编程理念，欢迎深度参与 CoStrict 开源建设：<a href="https://github.com/zgsm-ai/costrict" target="_blank" rel="noopener">https://github.com/zgsm-ai/costrict</a></p>
          <p>在 GitHub 上为我们点亮 ⭐️：每一个 Star 都是我们前进的动力。</p>
          <p>即刻了解：<a href="https://costrict.ai/" target="_blank" rel="noopener">https://costrict.ai</a></p>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped lang="less">
.article-hero {
  &::before {
    content: '';
    position: absolute;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 600px;
    background: radial-gradient(ellipse at center, rgba(0, 102, 255, .15) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
}

.highlight-box,
.article-content > div:last-child {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #197dff, #00ffb7);
  }
}

.cta-section {
  background: linear-gradient(103deg, rgba(32, 204, 148, .08) 4%, rgba(28, 110, 255, .08) 67%);
  border: 1px solid transparent;
  background-clip: padding-box;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(103deg, rgba(32, 204, 148, .3) 4%, rgba(212, 212, 212, .2) 50%, rgba(28, 110, 255, .3) 67%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}

.article-content {
  h2 {
    font-size: 22px;
    font-weight: 600;
    color: #ffffff;
    margin: 48px 0 20px;
    padding-left: 16px;
    border-left: 4px solid #197dff;
    line-height: 1.25;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    margin: 32px 0 16px;
    line-height: 1.25;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #f4f8ff;
    margin: 24px 0 12px;
  }

  p {
    margin-bottom: 20px;
  }

  ul, ol {
    margin-bottom: 20px;
    padding-left: 24px;
  }

  li {
    margin-bottom: 10px;
  }

  ul li::marker {
    color: #197dff;
  }

  a {
    color: #c3defa;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all .15s ease;

    &:hover {
      color: #197dff;
      border-bottom-color: #197dff;
    }
  }

  strong {
    color: #ffffff;
    font-weight: 600;
  }
}

.schedule-table {
  tr:hover td {
    background: rgba(255, 255, 255, .02);
  }
}

@media screen and (max-width: 480px) {
  .article-content h2 {
    font-size: 18px;
  }
}
</style>

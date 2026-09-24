# 评审单：2026-09-24-fitness-animations

- **评审者**：独立评审 Agent（模型档位 reasoning；仅读 `PROJECT.md` / `CHANGE.md` 与产物，未读对话记录）
- **评审时间**：2026-09-24
- **信息隔离声明**：本次仅读取 `PROJECT.md`、`CHANGE.md` 与产物（`src/components/ExerciseAnim/`、7 篇正文、`src/theme/MDXComponents.js`、`src/css/custom.css`、`.workbuddy/fp-assert.cjs`、`.workbuddy/fp-assert-report.txt`）以及为判定所必需的 `node_modules/@docusaurus/*` 只读源码；**未读取创作过程的对话记录**（`.workbuddy/memory/`、会话摘要、REPLY.md 均未打开）。本变更目录下只有 `CHANGE.md` 一个文件，不存在 REPLY.md 可读。

## 结论

`有条件通过`

一句话理由：几何/登记/链接/文风四道自检闸门全绿（`fp-assert` fails=0、`check-doc-links` 0 处、`an-compliance` 9/9、`check-bold-render` 0 命中），53 条映射的 id 在注册表与正文中确认都存在；但新增的 `src/theme/MDXComponents.js` 把**全站 MDX 组件表整表替换**（未申报、无闸门覆盖、CI 也不会失败），另有映射表与实际产出对不上、`prefers-reduced-motion` 的手动播放按钮失效两处未满足，故须先处置三项阻断项并补齐构建/渲染实证，方可放行。

## 阻断项（必须改，否则不放行）

| # | 位置（文件:行 / 章节） | 问题 | 依据 | 判据来源 |
| --- | --- | --- | --- | --- |
| 1 | `src/theme/MDXComponents.js:31-34`（新增文件，`git status` 为 `??`） | 该文件是 Docusaurus 的全局 MDX 组件表 swizzle 点。它只 `export default { ExerciseAnim, ExerciseStrip }`，且**没有** `...@theme-original/MDXComponents`（同文件注释 7–15 行只讨论了「每篇 import vs 全局注册」的取舍，未提保留默认映射）。Docusaurus 默认表见 `node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/index.js:19-37`，注册了 `Head / details / Details / code / a / pre / ul / li / img / h1…h6 / admonition / mermaid` 共 18 个映射；消费点 `node_modules/@docusaurus/theme-classic/lib/theme/MDXContent/index.js:9-11`（`<MDXProvider components={MDXComponents}>`）**无合并逻辑**；组件解析在 `node_modules/hast-util-to-jsx-runtime/lib/index.js:711`（`own.call(state.components, name) ? state.components[name] : name`），所以「表里没有」就退化成字面标签。**这是一次全站范围的行为回归，而不是「新增两个正文标签」**。 | 实测影响面：①`admonition`——`:::note` 一类指令由 `node_modules/@docusaurus/mdx-loader/lib/remark/admonitions/index.js:70-79` 产出 `hName:'admonition'`；全站 docs 共 **40 篇**含行首 `:::(note\|tip\|info\|warning\|caution\|danger\|important)`，合计约 **327 行**（`grep` 实测）。②`h2…h6`——映射到 `@theme/Heading`，全站每一级标题的 `#` 锚点（`hash-link`、`anchor` 类、`brokenLinks.collectAnchor`）都由它提供（`node_modules/@docusaurus/theme-classic/lib/theme/Heading/index.js`）；丢失后全站 269 篇 docs + blog 的标题锚点一并消失。③`a`——映射到 `@docusaurus/Link`（客户端路由 + broken-link 收集，`…/MDXComponents/A/index.js`），丢失后全站正文链接退化为原生 `<a>`。④`details`——`docs/lifeforfun/invest/ultimate-investment-solution.md:314,323`。⑤`mermaid`——本项**不成立**，`docusaurus.config.js` 未启用 mermaid（全文无 `mermaid` 配置），故 2 处 ` ```mermaid ` 只是普通代码块，此项不影响。 | 验收标准第 7 条「现有约束未破坏」；且 §5 影响面（CHANGE.md:100-112）**未申报此项**——该表逐行走的是 12 条不变量，而本项不在任何一条不变量之下，属影响面表的盲区 |
| 2 | `CHANGE.md:36-73`（§2.3 映射表与合计行） vs 实际产出 | 变更卡称「53 个唯一动作，7 张动画条 + 16 处单卡 + 1 张复用条」。实测：注册表 **57** 个 id、正文实际引用 **55** 个 id、动画条 **9** 条、单卡 **17** 处（`.workbuddy/fp-assert-report.txt:3`）。三方差集（逐项可核）：<br>· 注册表 ⊃ 映射表，多 **4** 个：`planche-lean`、`pseudo-planche-pushup`（`src/components/ExerciseAnim/poses/upper.js:103,116`）、`ring-support`、`ring-dip`；<br>· 正文 ⊃ 映射表，多 **2** 个：`ring-support`（`core.md:88` 单卡、`functional.md:87` 条内）、`ring-dip`（`functional.md:87` 条内）——映射表无对应行；<br>· 注册表 ⊃ 正文，多 **2** 个：`planche-lean`、`pseudo-planche-pushup`，**全站零引用**（脚本自己列为「已注册但正文未用（2）」，report:132-134）；<br>· 第 9 条动画条 `functional.md:87`「吊环三件：拉、撑、推」在映射表中完全没有对应行（C 节只声明了 `weekly-plan.md` 的 1 张复用条）。 | ①映射表是本次「唯一 id → 归属文件」的契约，不完整即「逐行可核」不成立；②`PROJECT.md` §10-12 / §10-16 的教训正是「实际分布与申报不符」 |
| 3 | `src/components/ExerciseAnim/Figure.js:87-90`（配合 `:48`、`:183-187`） | `prefers-reduced-motion` 下的「手动播放按钮」**点不动**。效果体里写的是 `if (reduced \|\| !playing) { if (reduced) draw(staticAt ?? 0.5); return undefined; }`——只要 `reduced === true`，无论 `playing` 怎么切都直接 return，`requestAnimationFrame` 永不启动；按钮（183-187 行，仅 `reduced` 时渲染）只改文案不产生动画。同文件注释 15–16 行却写「改由读者点按钮播放」，实现与自述相反。另：`playing` 初值为 `true`（`:48`），降级态下按钮初始显示「暂停」而画面是静止的。 | 验收标准第 6 条「降级为静态姿势 + 手动播放按钮，不自动动」——静态姿势（✓）与不自动动（✓）成立，**「手动播放」不成立** |

> 阻断项 1 用脚本无法验证其后果：`fp-assert` 不检查组件表，`an-compliance` 不检查组件表，`check-doc-links` 不检查渲染，而 `npm run build` 也**不会**因此失败（无编译错误）。`deploy.yml:30-31` 只在构建失败时红，所以「交 CI 验证」这条路径**覆盖不到**本项。

## 建议项（可以不改）

| # | 位置 | 建议 | 不改的后果 |
| --- | --- | --- | --- |
| 1 | `poses/lower.js:11-12`、`poses/upper.js:15`、`poses/core.js:11` | 存在死导入：`lower.js` 导入的 `BAR_Y / FLOOR_TOP / HANG / ON_HANDS / STAND_FRONT / STAND_SIDE` 全部未使用；`upper.js` 的 `FREE / ON_HANDS / PLANK` 未使用；`core.js` 的 `ON_HANDS / PLANK` 未使用（逐符号 `grep` 计数实测：仅出现在 import 行）。 | 无功能影响，但读代码的人会以为这些常量参与了解算，属误导性注释面 |
| 2 | `.workbuddy/fp-assert.cjs:396-399`（报告口径） | 报告「接地差」列用的是**屏幕 y**（`FLOOR_TOP − min(cy)`），而闸门用的是**体坐标系**（`bodyY()` 还原 `FAR_OFF`，`:188,203,210`）。于是 `pushup` 报告值 3.36 > `TOL=3.0` 却判 PASS（真实体坐标间隙 1.96）。 | 「报告数字与阈值口径不一致」这种坑，正是本仓库 §10-14 记过的「断言误报致人改错内容」的同类风险 |
| 3 | `docs/selfdevelop/health/sports/fitnessplan/weekly-plan.md:120` 与动画名 `lower.js:70` | 巡回列表写的是「**深蹲** 20 次」，而条里对该格使用 `pistol-squat`，其显示名为「**自重单腿深蹲**」；读者会在同一屏看到「深蹲」与「自重单腿深蹲」两种说法。 | 与验收标准第 1 条「动画与动作说明严格一一对应」的字面口径有出入（不影响几何） |
| 4 | `CHANGE.md:20-29`（§2.1 新增路径表） | `src/components/ExerciseAnim/Scene.js`（172 行，被 `Figure.js:21` 引用）未在 §2.1 的路径说明中申报；§2.1 只写「动画引擎、注册表、图形组件与样式」。 | 影响面清单与实物少一项，与阻断项 2 同源 |

## 偏离项

`CHANGE.md` 说要 A，实际做成了 B 的地方。

| # | CHANGE.md 的原文 | 实际做法 | 是否已在交付说明里声明 |
| --- | --- | --- | --- |
| 1 | `CHANGE.md:73`「合计：53 个唯一动作，7 张动画条 + 16 处单卡 + 1 张复用条」 | 注册 57 / 正文引用 55 / 9 条 / 17 卡；多出 `ring-support` 单卡（core.md:88）与 `functional.md:87` 整条「吊环三件」 | 否 |
| 2 | `CHANGE.md:27-29`（§2.1）把 `src/theme/MDXComponents.js` 的作用写成「全局注册组件，正文无需 import 行」 | 实际等价于**整表替换** Docusaurus 默认 MDX 组件表（阻断项 1） | 否（§5 影响面 18 行逐条走不变量，无一行涉及此事） |
| 3 | `CHANGE.md:136-142`（待裁决 2）「断言 6：本轮一并修（忽略块引用与合法 JSX 标签；行号改回文件真实行号）」 | 已按此实施：`.workbuddy/an-compliance.js:117-158` 新增 `JSX_OPEN` 状态机、剥 `^\s*>+\s?` 与完整标签，行号一律 `i+1`；实测 9/9 PASS | 是（§7-2 已如实记录，含「会重新暴露 §10-14 那笔损失、本轮不擅自改回」） |
| 4 | `CHANGE.md:134-135`（待裁决 1）令牌 3 → 4 | 实施为 4 支：`custom.css:156-159`（浅）与 `:460-463`（深，选择器 `:424` `html:root[data-theme='dark']`） | 是 |
| 5 | `CHANGE.md:129-130`「回滚 = 删掉两行标签与新增的三个路径；`git revert` 单个提交即可全退」 | 改动目前**未成提交**（工作区状态），且工作区同时含 2 个与本变更无关的改动文件（`docs/growthtree/timeline/index.md:202`、`docs/growthtree/timeline/phase2/index.md:26`，均把链接 `promotio-plan.md` 改为 `promotion-plan.md`）。 | 否 |
| 6 | `CHANGE.md:81`「不改动正文任何措辞、表格结构、表格列数；只做插入」 | 已核对：`git diff --numstat` 显示 7 篇 docs 全部「新增 N / 删除 0」（18/6/6/20/2/36/6），`custom.css` 29/0 —— **纯插入成立**；每一处插入都是 `<ExerciseAnim …/>` 或 `<ExerciseStrip …/>` 标签 | 是（与声明一致） |

## 不变量核验

**逐条对照，不许跳过任何一条。**

| # | 不变量 | 结论（已核验 / 被破坏 / 无法判断） | 证据 |
| --- | --- | --- | --- |
| 1 | 四个板块目录名不可改 | 已核验（未触碰） | `git status --short` 无 `docs/` 下目录的新增/改名/移动；四个板块目录仍在 `sidebars.js` 声明的路径上 |
| 2 | 站点名 / URL / CNAME 不可改 | 已核验（未触碰） | `git status` 无 `CNAME`、无 `docusaurus.config.js`；`docusaurus.config.js:17` 仍为 `https://codethousand.cn` |
| 3 | 每个 docs 目录有 _category_.json + 非空 index.md | 已核验 | `an-compliance.js` 断言 9 PASS（`12 篇 md + _category_.json`，`index.md` 非空壳）；本变更未新建任何 docs 目录 |
| 4 | 排序只用 sidebar_position，无数字前缀 | 已核验 | `docs/.../fitnessplan/_category_.json` 未被改动（`position:4`、`label:"健身计划"`、`className:"selfdevelop"`、`collapsed:true`）；新增的只有 `src/components/ExerciseAnim/` 与 `src/theme/MDXComponents.js`（不在 docs 树内） |
| 5 | docs front matter 键位 | 已核验（遵守） | 断言 8 PASS（12 篇五键齐全）；7 篇的插入行均为组件标签，未触碰 front matter（`git diff` 纯插入） |
| 6 | blog front matter 五键 + 首行重复 H1 | 已核验（未触碰） | `git status` 无 `blog/` 下任何文件改动 |
| 7 | blog → docs 用绝对路径 | 已核验（未触碰） | 同上，blog 零改动 |
| 8 | 色令牌只在 custom.css §1，深色选择器写法 | 已核验（遵守） | 4 支令牌写在 `custom.css:156-159`（浅色块 `html:root`）与 `:460-463`（深色块，选择器在 `:424` `html:root[data-theme='dark']`，与 §1 注释 `:142-155` 自带对比度口径）；`styles.module.css` 中颜色 100% 走 `var()`，无硬编码色值 |
| 9 | 天空层只切 opacity | 已核验（未触碰） | `git status` 无 `src/theme/Root.js`、无 `src/components/SkyBackdrop`；`custom.css` 的 29 行插入全部落在两处令牌块内，未动天空层规则（`:1418-1426`） |
| 10 | 产物目录不被手工编辑 | 已核验（未触碰） | `git status` / `git diff` 无 `build/`、`build_old*/`、`.docusaurus/`（注：`build/__server` 的「移动不删除」处置**无法核验**，本机未构建） |
| 11 | 内链不带结尾斜杠 | 已核验（遵守） | 断言 7 PASS（0 处）；本变更 7 篇的插入内容全是组件标签，**未新增任何内链** |
| 12 | MDX 转义三条 | 已核验（遵守） | 断言 6 PASS（0 处，已改用真实文件行号）；断言 5 PASS（表格单元格内无加粗）；新增标签均为自闭合的 JSX 组件标签、且不在表格中间 |

## 验收标准逐条核验

（本节为本次评审按任务要求增补的章节，逐条对应 `CHANGE.md:88-98`。）

| # | 检查项 | 结论 | 证据 |
| --- | --- | --- | --- |
| 1 | 与动作说明一一对应 | **未满足** | 映射表的 53 个 id 确实在注册表与正文中都出现（逐条比对无误）；但映射表不是实际全集，且登记总数与实际不符——注册 57 / 引用 55 / 条 9 / 卡 17 对 53 / 8 / 16（阻断项 2）。另 `weekly-plan.md:120` 的「深蹲」与动画名「自重单腿深蹲」字面不一致（建议项 3） |
| 2 | 姿势合法 | **已满足（仅几何口径）** | `node .workbuddy/fp-assert.cjs --report` → `[PASS] fails=0 warns=2 anims=57`；含关节齐全、`ANGLE_RANGE` 域内、接触点容差、`cycle` 回路闭合、`mixPose` 单元回归 T1–T7。脚本自述「只证明几何合法，不证明生理正确」 |
| 3 | 构建 | **无法验证** | 本机沙箱禁止写 `node_modules/.cache`，未执行生产构建；CI（`deploy.yml:30-31`，push→master 触发）无运行记录可读；无 `build/sitemap.xml` 可查 |
| 4 | 页面真实渲染 | **无法验证** | 无浏览器截图、无两帧像素对比数据。**注意：本项恰是唯一能发现阻断项 1 的验收项，却被整体推迟**——CI 只因构建失败而红，不会因组件表被替换而红 |
| 5 | 明暗两套主题都可用 | **无法验证** | 令牌两套齐备（`custom.css:156-159` / `:460-463`），但无浅/深两张截图 |
| 6 | prefers-reduced-motion | **未满足** | 静态姿势与「不自动动」成立；「手动播放按钮」失效（阻断项 3，`Figure.js:87-90` vs `:183-187`） |
| 7 | 现有约束未破坏 | **部分满足** | `check-doc-links.js docs` → 共检查 269 个文件、问题 0 处；`check-bold-render.js docs` → 269 篇 0 命中；`an-compliance.js docs/selfdevelop/health/sports/fitnessplan` → 9/9 通过、结论「合规」（断言 6 亦已 PASS，不止「除断言 6 外」）。**但**「现有约束未破坏」在全站层面不成立：MDX 组件表被替换，40 篇 admonition 页与全站标题锚点受影响（阻断项 1） |
| 8 | 不变量未触碰 | **已满足** | 见上表 12 条，无一条被破坏 |
| 9 | 性能 | **无法验证** | 无实测数字。代码层可推断：`IntersectionObserver` 门控 rAF（`Figure.js:102-115`）、每帧只写 7 个属性（`Figure.js:68-84`）；单页最重的 `upper-body.md` 有 4 条（6+4+9+5=24 个小人）+ 1 个单卡，即约 25 个 `Figure`、25 个 `IntersectionObserver`——量级「合理」但**未实测** |

## 分歧点

评审者与协作者不一致的地方。**双方理由都要写全**，不要只写结论。

| # | 分歧 | 评审者的理由 | 协作者的理由 |
| --- | --- | --- | --- |
| 1 | 变更卡 §5「影响面」是否算申报完整 | 该表 18 行逐条对的是 12 条不变量，而本变更最大的影响面——替换全站 MDX 组件表——不在任何一条不变量之下，因此**表在结构上就装不下它**；结果是「逐条走完 12 条 = 未触碰」给出了一个不成立的安心信号（`CHANGE.md:100-112`） | **未提供**。本变更目录下只有 `CHANGE.md`，无 REPLY.md，且按信息隔离要求未读任何对话记录，故无法在此呈现协作者的理由 |
| 2 | §2.1 把 `src/theme/MDXComponents.js` 描述为「全局注册组件，正文无需 import 行」是否足够 | 该描述只说了收益（少写 import），未说代价（默认映射被替换）。文件自身的注释（`MDXComponents.js:7-15`）也只对比了 A/B 两条路，未提「要保留 `@theme-original`」 | **未提供**（同上） |
| 3 | 「交 CI 构建」是否足以替代本地验收 | CI 只跑 `npm ci` + `npm run build`（`deploy.yml:28-31`），**没有任何断言脚本、没有截图、没有渲染检查**。因此它只能证明「MDX 编译不炸」，不能覆盖验收 4/5/9，更不能覆盖阻断项 1 | **未提供**（同上）。`PROJECT.md` §6.2 / ADR-005 支持「不每次构建」（理由：一次构建两分多钟，链接问题在 sitemap 里就能判），这一层评审者认可——分歧只在「渲染期才显形的影响」是否也能这样省 |

## 待裁决

需要人来拍板的问题，**附上选项与各自代价**。（以下为待裁决项与代价，不含评审者的处置建议。）

| # | 问题 | 选项 A（代价） | 选项 B（代价） |
| --- | --- | --- | --- |
| 1 | 全站 MDX 组件表被替换（阻断项 1）如何处置 | 在本变更内补齐默认映射并重跑闸门（代价：改动面从 7 篇扩到「全站 269 篇 docs + blog + pages 的渲染回归验证」，本机又跑不了构建，验证只能落在 CI + 人工截图） | 接受现状并登记为已知回归（代价：40 篇 docs 的 admonition 渲染失效、全站标题 `#` 锚点与正文链接的 SPA 路由行为一并失效，且**无任何自动闸门能拦住继续恶化**） |
| 2 | 映射表 53 与实际 57/55 的差集如何收口（阻断项 2） | 以实际产出为准补全映射表并补记 `ring-support/ring-dip`（代价：变更卡需再改一轮，且要重新解释「为什么超出原定范围仍被交付」） | 以映射表为准收缩产出（代价：要撤掉 `core.md:88` 的单卡与 `functional.md:87` 整条，等于回退已完成的可视化，并重跑全部闸门） |
| 3 | `planche-lean` / `pseudo-planche-pushup` 两个零引用注册项 | 留作下一轮的准备期动作（`upper-body.md:62-63` 正文确实讲了这两个动作）（代价：注册表存在「有数据、无入口」的死条目） | 删除（代价：删掉已完成且通过几何断言的姿势数据；`fp-assert` 的 `unused` 告警会消失但能力也消失） |
| 4 | `prefers-reduced-motion` 下播放按钮失效（阻断项 3） | 在本变更内修（代价：需重新确认降级态交互，仍属无本机渲染可验的路径） | 本轮接受「降级=静态不可播放」，并把 `Figure.js:15-16` 的自述与验收标准第 6 条同步改口径（代价：触到「不变量/验收口径」，按 §5 前言需先走一轮「改道」） |
| 5 | 工作区 2 个越界改动（`docs/growthtree/timeline/index.md:202`、`phase2/index.md:26`，把 `promotio-plan.md` 链到 `promotion-plan.md`）是否属本变更 | 认定为本变更「顺手改」（代价：与 `PROJECT.md` §10-19「不要在别的变更里顺手改」冲突，且 §9 的「批量/越界须请示」没有落纸记录） | 认定为另一次未申报的在途改动（代价：本变更的「纯插入 + 单提交回滚」承诺在当前工作区状态下不成立，需要先把两者拆开） |
| 6 | 本机无法构建、渲染实证为空时能否放行（验收 3/4/5/9） | 放行并接受 CI 兜底（代价：CI 绿 ≠ 无回归，阻断项 1 就是这么溜过所有闸门的） | 待 CI 跑绿 + 补 4/5/9 的实证后再放行（代价：放行时间取决于 CI 与人工截图） |

## 未能验证的部分

**明确声明哪些我没有检查过。** 这一栏最容易被省略，也最不该省——
它守住了评审者不越界的底线：评审摆出的是事实和分歧，不是权威。

- 未执行生产构建（本机沙箱禁止写 `node_modules/.cache`），因此**MDX 编译是否通过、SSR 是否报错、`build/sitemap.xml` 是否生成**三项均未验证；`exit 0` 与 `[SUCCESS] Generated static files` 都没有实测依据。
- 未读 CI 运行记录（无法访问 GitHub Actions 状态），因此「CI 已绿」这一前提我**没有**独立确认。
- 未做浏览器截图与两帧像素对比 → 验收 4「动画确实在动」未验证；控制台是否有 error 未验证。
- 未实测浅色「春晓」/深色「夜幕」两套主题下的实际对比度与线条可见性 → 验收 5 未验证（只核对了令牌成对存在）。
- 未做性能实测（DOM 节点数、并发 rAF 数、视口外是否真停）→ 验收 9 的数字未验证；我的结论只到「代码层有 IntersectionObserver 门控」。
- 未实测移动端断点（`styles.module.css:176-183` 的 `@media (max-width: 480px)` 行为）。
- **未逐一肉眼核对** 53+ 个动画的姿势是否符合配套文字描述——我只核对了「id 一一对应」与「几何断言全绿」。`fp-assert.cjs` 自己声明它不证明生理正确性，我也不能替它越界。
- 未验证 `@theme-original/MDXComponents` 别名在本仓库解析是否可用（这是处置阻断项 1 时才需要的事实，与「当前是否回归」的判定无关）。
- 未读取 REPLY.md / `.workbuddy/memory/` / 任何会话摘要——按信息隔离要求主动排除，因此分歧点表中「协作者的理由」一栏为空是**刻意的空白**，不是漏填。

## 过闸检查（进入第⑤步前必须全部为是）

```text
[x] 结论明确（三选一）——有条件通过
[ ] 阻断项已有处置或已进入回应——尚无回应（本变更目录下只有 CHANGE.md）
[x] 不变量清单 12 条全部标注了结论
[x] 分歧点已显性化，双方理由齐全——协作者一方标注为「未提供」，并说明原因
[x] 待裁决项已给选项与代价
[x] 未能验证的部分已声明
[x] 没有提出修改方案（提了方案就等于失去独立性）
```

---

> 评审依据的一次性实测（评审当日重跑，非引用报告里的旧数字）：
> - `node .workbuddy/fp-assert.cjs --report` → `[INFO] registry ids = 57` / `docs-used = 55 (missing 0)` / `[WARN] registered but unused (2): planche-lean, pseudo-planche-pushup` / `[PASS] fails=0 warns=2 anims=57`（EXIT=0）
> - `node .workbuddy/check-doc-links.js docs` → `共检查 269 个文件，问题 0 处。`
> - `node .workbuddy/an-compliance.js docs/selfdevelop/health/sports/fitnessplan` → `9 / 9 条断言通过`、`结论：合规`
> - `node .workbuddy/check-bold-render.js docs` → `扫描 269 篇`、`命中 0 篇 / 0 处`
> - `git diff --numstat`（7 篇 docs + custom.css）→ 218 行插入 / 0 删除；`git status --short` → 另含 2 个越界改动文件与 3 个新增路径

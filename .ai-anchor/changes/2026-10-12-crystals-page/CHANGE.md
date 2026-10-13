# 变更卡：新增独立页面「岁月结晶」（/crystals），内容与渲染分文件

- **变更编号**：`2026-10-12-crystals-page`
- **日期**：2026-10-12
- **车道**：**标准道** —— 判定依据：本次**不触碰**第五格「不变量清单」中的任何一条（不动板块目录名、站点身份、front matter 约定、色令牌、产物）；但「新增目录 `src/components/Crystals/`」「改 `docusaurus.config.js`」「改 `src/components/` 下文件」三项命中 §9「必须请示人」，已获会话内授权（见下表）。

## 授权记录（§10 第 10 条：请示项当场落纸，不事后补记）

| 时点 | 请示项 | 人的裁决 |
| --- | --- | --- |
| 2026-10-12 会话中 | 新增目录 `src/components/Crystals/`（命 §9「新增/移动任何目录」） | **授权**。用户原话：「按照该效果在我的网站中实现」 |
| 2026-10-12 会话中 | 修改 `docusaurus.config.js` 的 `navbar.items`（命 §9「改 docusaurus.config.js」） | **授权**。同上；导航项 `{to:'/crystals', label:'岁月结晶'}` 由用户在前一轮预览中确认 |
| 2026-10-12 会话中 | 在 `src/components/` 下新增文件（命 §9「改任何 src/components/」） | **授权**。同上 |

## 意图

把上一轮人已确认的设计预览（`.workbuddy/preview/crystals-preview.html`）落成生产代码，在站点新增独立页面 `/crystals`「岁月结晶」，并在结构上做到**内容与渲染分文件**：条目内容只在 `src/config/crystals.js`，渲染与布局在 `src/components/Crystals/`，两者互不引用对方的实现细节。

**可验证形式**：`node .workbuddy/verify-crystals.cjs` 全绿（39 项断言，用 `react-dom/server` 真渲染组件后对产物 HTML 断言），退出码 0。

## 范围

**新增文件（4 个）**

| 文件 | 角色 | 说明 |
| --- | --- | --- |
| `src/config/crystals.js` | **数据（唯一内容源）** | 只导出 `CRYSTALS`（10 条）与 `CRYSTAL_CATEGORIES`（3 个类别中文名）。零 JSX、零 CSS、零 import —— 这一条由体检脚本断言 |
| `src/components/Crystals/index.js` | **渲染与布局** | 分组、统计、三级时间线、年份导航高亮、平滑滚动。唯一的外部依赖就是上面那个数据文件 |
| `src/components/Crystals/styles.module.css` | 样式 | 逐条移植预览样式；类名改 camelCase（站内惯例）；**零新增色令牌** |
| `src/pages/crystals.js` | 路由入口 | 与 `src/pages/thoughts.js` 同构：套 `Layout`，声明 title/description |

**修改文件（1 个）**

- `docusaurus.config.js`：`themeConfig.navbar.items` 在「随想」与「关于」之间插入一行，**只增不删**。

**锚点**

- `.ai-anchor/changes/2026-10-12-crystals-page/CHANGE.md`（本卡）
- `.ai-anchor/changes/2026-10-12-crystals-page/checks-01..04-*.txt`（四份体检原始输出）
- `.ai-anchor/PROJECT.md`：§10 追加第 26 条
- `.ai-anchor/DECISIONS.md`：「### 2026-10」下追加一行（待人在归集时落笔）

## 非目标

- **不做**：改 `sidebars.js`、`package.json`、`static/**`、`CNAME`、任何 `docs/` 或 `blog/` 文件。
- **不做**：改 `src/css/custom.css` —— 本页零新增色令牌，一个变量都不加。
- **不做**：碰任何 swizzle 点（`src/theme/*`）、新增插件或全局 provider。
- **不做**：跑生产构建。助手侧沙箱禁写 `node_modules/.cache`，生产构建必然要写（§10-21 已登记）。
- **不做**：处理 §10 第 9／13／18／19 条四类已裁决的登记项（`collapsed` 不统一、表格内加粗、`timeline/index.md` 的 `「」`、phase1–3 缺键位）——按「不要在别的变更里顺手改」的纪律。
- **不做**：顺手修随想页的两处既有偏差（运行时依赖 GitHub API、内容对搜索引擎不可见）。它们属 §10 已登记项，建议**另开一次变更**。
- **不做**：把预览里那 10 条示例内容替换成作者的真实条目 —— 需要作者自己写，本次原样搬运以保证页面首次上线不是空壳（见「待裁决 1」）。

## 验收标准

| # | 验收项 | 怎么验（命令 / 动作） | 通过标准 | 实测 |
| --- | --- | --- | --- | --- |
| 1 | 组件可渲染，结构完整 | `node .workbuddy/verify-crystals.cjs` | 39 项断言全 PASS，退出码 0 | ✅ 39 / 39（`checks-01`） |
| 2 | 数据文件与渲染/样式零耦合 | 同上（§1 三条结构断言） | 无 `import` / 无 JSX 标签 / 无 `className` | ✅ 三条全 PASS |
| 3 | 统计数字由数据派生 | 同上（§4） | 三格 = `10 / 419 / 2`，与数据一致 | ✅ 完全一致 |
| 4 | 三级时间线分区正确 | 同上（§5） | 年 2 / 月 6 / 条目 10；节点 2·6·10；两级倒序 | ✅ 全 PASS |
| 5 | 三类胶囊与里程碑计数正确 | 同上（§6） | growth 4 / moment 3 / insight 3；里程碑 2 | ✅ 全 PASS |
| 6 | 相关阅读链接指向真实页面 | 同上（§8） | 2 条，且 `/docs/...` 均有对应 md | ✅ 2 条，全部命中 |
| 7 | 内容含 `<` `&` `"` 时不产生真实标签 | 同上（§9，临时注入一条恶意条目） | 渲染为 `&lt;` / `&amp;` / `&quot;` | ✅ 全 PASS |
| 8 | HTML 用到的类名都在 CSS 里有定义 | 同上（§10） | 44 个类全部命中 | ✅ 全部命中（曾据此抓出 1 处 `.tl-month` 无规则） |
| 9 | 样式不含色值 | 同上（§10） | 除 mask 的 `#000`（透明通道，×4）外零 hex | ✅ 0 处多余色值 |
| 10 | CSS 无语法错误 | 同上（§10，postcss 真解析） | 解析不抛异常 | ✅ PASS |
| 11 | 语法与模块解析 | `node .workbuddy/fp-syntax.cjs` | `fails=0` | ✅ 17 文件 0 失败（`checks-02`） |
| 12 | 加粗定界符全库无残留 | `node .workbuddy/check-bold-render.js docs blog src` | 命中 0 | ✅ 311 篇 0 篇 / 0 处（`checks-03`） |
| 13 | 全库链接无失效 | `node .workbuddy/rn-verify.js` | 失败 0 条 | ✅ 870 条 / 失败 0 条（`checks-04`） |
| 14 | **构建通过（§6.2 两条判据）** | **需人在本机执行**：先 `Rename-Item build build_old`，带 `DOCUSAURUS_KEEP_SERVER_BUNDLE=true` 构建 | 日志有 `[SUCCESS] Generated static files` **且** `build/sitemap.xml` 存在，且 sitemap 含 `/crystals` | ⛔ **未执行**（助手侧无权限，见「未验证 / 遗留」） |

## 影响面

| 不变量 # | 本次是否触碰 | 说明 |
| --- | --- | --- |
| 1 | 否 | 四个板块目录名未动 |
| 2 | 否 | 站点名 / URL / `CNAME` 未动 |
| 3 | 否 | 未新增 docs 目录；本次不产生 docs 文件 |
| 4 | 否 | 未新增 docs 目录与 label |
| 5 | 否 | 未改任何 docs 文件的 front matter |
| 6 | 否 | 未动 blog |
| 7 | 否 | 未新增 blog 内链 |
| 8 | **否（被遵守）** | **未改 `custom.css`  §1**：本页零新增令牌，全部引用既有变量；`:root` 下未加任何一行 |
| 9 | 否 | 未碰天空层与 `src/theme/Root.js` |
| 10 | 否（被遵守） | 未编辑 `build/`、`build_old*/`、`node_modules/`、`.docusaurus/` 下任何文件 |
| 11 | 否（被遵守） | 页面内链 `/docs/selfdevelop/ability/ai`、`/docs/softwaremaster` 均不带结尾斜杠；导航用 `to: '/crystals'` |
| 12 | 否 | 未新增 MDX 正文；数据文件里的中文引号已按 §7 用全角 |

结论：**不触碰任何不变量** → 走标准道（① ② ③ ④ ⑤）。

**另需单开一行申报的全局面**（§10 第 22 条的教训：影响面表在结构上装不下 swizzle 点、插件与全局 provider）：

> 本次**未新增或修改** `src/theme/*` 下的任何 swizzle 点、**未新增插件**、**未加全局 provider**。
> 唯一的全站级改动是 `docusaurus.config.js` 的 `navbar.items` **追加一项**：它只影响导航栏多一个链接，
> 不合并也不替换任何默认表，不动 `colorMode` / `prerender` / `trailingSlash` / `onBrokenLinks`。
> → 这一行**无待申报项**。

**与设计预览的差异（逐条申报，均为有意为之）**

| # | 预览 | 落地实现 | 为什么 |
| --- | --- | --- | --- |
| 1 | 版心 1080px | **1140px**（站点的 `--ifm-container-width`） | 让页面与导航栏、首页、文档页对齐。差 60px，比例不变 |
| 2 | 自带模拟导航栏、主题切换按钮、预览页脚 | 全部移除 | 站点 `Layout` 自带这三样，重复即为错 |
| 3 | 页尾说明写「文件顶部的 `CRYSTALS` 数据区」 | 改写为「数据文件 `src/config/crystals.js`」 | 已经分文件，原文案会失真 |
| 4 | 正文引用用 `「」`（如「还有下一本吗」「够用就好」「每天」） | 改为全角 `“ ”`；仅「岁月结晶」「软件大师之路」保留 `「」` | 按 §7：`「」` 只用于栏目名与专名。这是**口径修正**，非风格改动 |
| 5 | 全局 `html { scroll-behavior: smooth }` | 移除；改为点击年份时 `scrollIntoView({behavior:'smooth'})` | 那条规则会改到全站每一页；把行为收在本页的点击处理里 |
| 6 | `new Date(date+'T00:00:00')` 按本地时区 | `${date}T00:00:00Z` 按 UTC | 构建机（UTC）与读者浏览器（UTC+8）本地解析可能算出不同的「时间跨度」，触发 hydration 不一致 |
| 7 | 月分行带 `tl-month` 类（无对应 CSS 规则） | 去掉该类，只留 `tlRow` | 类名无规则既无用又误导；由体检 §10 抓出 |

## 风险与回滚

- **最坏会怎样**：① 导航栏多出一项后，8 项在小屏可能折行（`nav-links` 由站点 navbar 控制，未验证）；② 首页「随想」之外再多一个信息流入口，若内容长期不更新，会变成半空壳页（本次已用 10 条示例内容兜底）；③ 页面渲染未经构建验证（§10-21），CSS Modules 装箱后的实际观感未在浏览器里确认。
- **怎么退回去**：新增的 4 个文件均为**未跟踪文件** → `git clean -fd src/components/Crystals src/config/crystals.js src/pages/crystals.js`（**不要**用递归删除去绕本机守卫）；`docusaurus.config.js` 用 `git checkout -- docusaurus.config.js` 还原（本次对它只有一行插入，摘掉即还原）。
- **回滚会不会丢内容**：会。`src/config/crystals.js` 里的条目是唯一副本。若需保留，先 `Copy-Item` 到 `.workbuddy/` 并校验字节。
- **风险缓解**：`verify-crystals.cjs` 可随时重跑（读源码，不依赖构建）；体检原始输出已随本卡归档。

## 待裁决

| # | 问题 | 选项 A | 选项 B | 现状与代价 |
| --- | --- | --- | --- | --- |
| 1 | 首批 10 条内容是**预览稿的示例**（含「阿不第一次独自读完一本文字书」等），不是作者的真实经历 | 逐条替换为真实条目后再提交 | 先提交示例，之后再改 | **当前按 B 落盘**。代价：若作者忘了替换，虚构的个人里程碑会公开挂在站点上 —— **提交前请务必过一遍 `src/config/crystals.js`** |
| 2 | 页尾「关于这一页」说明块是否要留在公开页面上 | 保留（与预览一致） | 删除 —— 它是写给作者/评审者看的元信息 | **已裁决为 B（删除）**，2026-10-12 同日执行，见文末「修订记录」。原按 A 保留，代价：读者会看到一段解释「本页内容来自哪个文件」的元信息 |
| 3 | 导航 label 用「岁月结晶」还是缩写「结晶」 | 「岁月结晶」——与页面 H1、副标题一致 | 「结晶」——导航更短，小屏更不易折行 | **当前按 A**。代价：导航共 8 项，窄屏可能折行（未验证） |

## 未验证 / 遗留

- **助手侧未跑生产构建**（§10-21：沙箱禁写 `node_modules/.cache`）。所以**本页在浏览器里的最终渲染未经构建验证**。能做的最近替代是这个变更新建的 `verify-crystals.cjs`：用 `react-dom/server` **真渲染**组件再断言（39 项），比上一轮预览的静态推断强一档，但仍**不覆盖** CSS Modules 真实装箱、浏览器交互与产物。
- **打桩处（唯二没跑到真实实现的地方）**：`@docusaurus/Link` 用最小桩（渲染成 `<a href>`）、`styles.module.css` 用原样返回类名的代理。这两处在真实构建里分别是 SPA 路由链接与哈希化类名。
- **需要人做的验收动作**：本机跑一次构建，判据是日志有 `[SUCCESS] Generated static files`、`build/sitemap.xml` 存在，且在 sitemap 里能查到 `/crystals` 这一个 URL（本页不产生 tag 页，增量应为 **+1**）。构建后另请目视三处：① 年份横贯线是否与年份文字视觉居中；② 卡片左竖条与日节点连线是否对齐；③ 窄屏（<760px）下时间线是否仍读得清。
- **一处已知的 React 19 行为**：`<time dateTime>` 被 React 19.3.0 原样渲染成 `dateTime="..."`（不再映射为小写），已实测确认。HTML 的属性名大小写不敏感，浏览器与爬虫解析到的仍是 `datetime`，功能无误；体检断言因此按大小写不敏感匹配。

## 收尾

- 更新 `PROJECT.md`：§10 追加第 26 条（记录新页面、授权、与设计预览的 7 处差异、未跑构建）。
- 在 `DECISIONS.md` 的「### 2026-10」下追加一行（**待人在归集时落笔**；一行草稿：「新增 /crystals「岁月结晶」页，内容与渲染分文件（`src/config/crystals.js` ↔ `src/components/Crystals/`），零新增色令牌」）。
- 过程材料留在 `.workbuddy/`：`verify-crystals.cjs`、`verify-crystals.txt`、`verify-crystals.html`（真渲染产物）、`gate-02..04-*.txt`。按 §9 红线 3，一律不发布进 `docs/` 或 `blog/`。

## 过闸检查（进入第②步前必须全部为是）

```text
[x] 验收标准可以被判定真假（14 条，其中 13 条可跑出命令结果，第 14 条明确标注需人执行）
[x] 非目标不是空的（7 条）
[x] 影响面已逐条对照不变量清单（12 条）＋ 单开一行申报全局面（无待申报项）＋ 7 处预览差异逐条申报
[x] 待裁决项给了选项与代价（3 项）
[x] 车道已判定并写明（标准道）
```

---

## 修订记录

### 2026-10-12 · 删除页尾「关于这一页」说明块

**裁决来源**：作者会话内指示（「把页尾的『关于这一页』删除」），即上表待裁决 2 的**选项 B**。

**改了什么**（两处，必须成对，否则留下死样式）：

| 文件 | 改动 |
| --- | --- |
| `src/components/Crystals/index.js` | 删除 `<aside className={styles.note}>…</aside>` 整块（含 `noteTitle` 标题与 `noteText` 正文），页尾不再有内容 |
| `src/components/Crystals/styles.module.css` | 删除 `.note` / `.noteTitle` / `.noteText` / `.noteText code` 四条规则与「页尾说明」小节注释 |

**为什么不能只删 JSX**：CSS Modules 不会做「未使用类剔除」，留下的四条规则会永远躺在样式文件里无人引用——既增体积又误导后来者以为还有块页尾说明。

**连带影响**：本卡「与设计预览的差异」表第 3 行（页尾说明由「文件顶部的数据区」改写为真文件路径）**随之作废**——那一块已不存在，不再是差异项。

**复验结果**（复跑同一套体检，全部通过）：

- `verify-crystals.cjs`：**39 项断言全 PASS**；其中「HTML 用到的模块类全部在 CSS 里有定义」的类名计数由 **44 降为 41**——恰好等于删掉的 `note` / `noteTitle` / `noteText` 三个类，说明 JSX 与 CSS 两侧同步清干净，无残留、无悬空引用。
- `fp-syntax.cjs`：17 文件 0 失败。
- `check-bold-render.js docs blog src`：311 篇 0 命中。
- `rn-verify.js`：870 条链接 0 失败。
- 已用 Grep 复查 `src/components/Crystals/` 全目录：`note` / `Note` / `关于这一页` **零命中**。

**未验证**：仍**未跑生产构建**（§10-21 同前）。本次改动为纯删除，未新增文件、未动配置、未改数据，故「＋1 个 html」与 `/crystals` 的 URL 计数不变，前文的三项目视验收（年份横贯线居中、左竖条与日节点对齐、<760px 可读性）仍然有效，且不再需要检查页尾那一块。

**回滚**：`git checkout -- src/components/Crystals/index.js src/components/Crystals/styles.module.css`（两文件均已跟踪，逐字节可还原）。

---

## 全量回退（2026-10-13）

**裁决来源**：作者会话内指示 —— 本页内容涉及**个人隐私泄露风险**，要求回退至该页存在之前的版本，删除全部代码、路由配置、组件引用与导航链接，并确认不影响其他页面。

### 一、已执行的删除

| 对象 | 处理 | 验收判据 |
| --- | --- | --- |
| `src/config/crystals.js` | 删除（曾被填入 30 条真实生活条目） | 工作区已不存在 |
| `src/pages/crystals.js` | 删除 | 工作区已不存在 |
| `src/components/Crystals/`（`index.js` ＋ `styles.module.css`） | 整个目录删除 | 工作区已不存在 |
| `docusaurus.config.js` 的 `navbar.items` 一行「岁月结晶」 | 用**本变更之前的提交** `241b4954^` 的版本还原 | `git diff --exit-code 241b4954^ -- docusaurus.config.js` **为 0**（逐字节相同，非数行数） |
| `build/crystals.html` | 删除（本地产物，gitignore 内） | 已不存在；`build/` 内其余页面仍残留指向 `/crystals` 的导航链接，属过期产物，下次构建整体重生成 |

### 二、零影响的验证

- `fp-syntax.cjs`：文件数 **17 → 14**，等于**本变更之前的基线**（MEMORY 记录为「14 文件 0 失败」）——这是文件集完全复原的硬证据；`fails=0`。
- `check-bold-render.js docs blog src`：311 篇 **0 命中**。
- `rn-verify.js`：870 条链接 **0 失败**。
- 全库 Grep（排除 `node_modules`／`build`／`.workbuddy`）：`crystals` / `Crystals` / `岁月结晶` **仅剩 1 处**，即 `blog/2023-02-11-kindergarten-open-day-activities.md` 的 **tag 值**，由老提交 `47f69675` 引入，与本页无关，按「登记不动手」未动。
- 导航项数由 8 回到 **7**。

### 三、工作区回退**不等于**清除（重要）

- 本变更的 4 个新文件与配置改动**已被作者在上一轮之后提交并推送**：提交 `241b4954`，`master` 与 `origin/master` 无差异。
- `.github/workflows/deploy.yml` 在 push 到 `master` 时自动 `npm run build` 并把 `./build` 发布到 **`gh-pages` 分支**（线上域名 `codethousand.cn`）。**提交即上线**——该页当时已公网可达，`gh-pages` 分支同样留有 `crystals.html`。
- 因此本次工作区回退**止住了后续**，但 `src/config/crystals.js` 的 253 行内容仍存在于 `origin/master` 的该提交及其父链、以及 `gh-pages` 的历史中。彻底清除需：**重写历史 ＋ 强制推送**（`git reset --soft HEAD~1` 后重建提交，或 `git filter-repo --path src/config/crystals.js --invert-paths`），必要时向 GitHub 申请清理缓存视图（force push 后旧对象仍可凭 SHA 访问一段时间）。
- **本卡原「怎么退回去」一节已失效**：它写的是「4 个文件均为未跟踪文件 → `git clean -fd`」，前提是**尚未提交**。教训：回退前必须用 `git log`／`git status` 现场核实跟踪状态，不能沿用写卡时的判断。

### 四、隐私清单（供以后新增内容页复用）

本页 30 条真实条目命中的敏感类别：① 家庭称谓与孩子小名；② 具体地点（居住城市、常去餐厅／公园／商圈、旅行地）；③ 就职单位与内部获奖（含领域名）；④ 外派去向与证件成绩（如语言考试成绩）；⑤ 具体商品型号（手机／音响）；⑥ 住址与家庭生活线索。
→ 含个人真实生活细节的页面，**提交前**先过这六类；本仓库「提交即上线」，没有「先提交再改」的中间态。

### 五、未动（供作者裁决）

- 变更卡与 `PROJECT.md` 第 26 条的记录**均未删除**：项目纪律是「归档完成不删」，且二者只含预览稿示例条目名，无个人数据。若作者要求连记录一并抹去，需另行指示（那会同时影响 `PROJECT.md` 与本文档）。
- `.workbuddy/verify-crystals.cjs`、`.workbuddy/verify-crystal-preview.cjs`：为该页写的验证脚本，现已失效（所断言文件已删，跑会报错）。两者都在 gitignore 内、不入库，故**保留为追溯材料**，未删。
- `blog/2023-02-11-kindergarten-open-day-activities.md` 的 tag 值 `岁月结晶`：老提交引入，与本次无关。

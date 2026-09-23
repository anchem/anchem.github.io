# 变更卡：修复加粗定界符失效（28 篇内容会把 `**` 漏到页面上）

- **变更编号**：`2026-09-23-bold-delimiter-fix`
- **日期**：2026-09-23
- **车道**：**标准道** —— 判定依据：本次不动第五格「不变量清单」中的任何一条（只改正文行内标记，不动结构、front matter、链接与配置）；但涉及「一次改动 28 个文件（超过 5 个）」，命中 §9「必须请示人」，已获会话内授权（见下表）。

## 授权记录（§10 第 10 条：请示项当场落纸，不事后补记）

| 时点 | 请示项 | 人的裁决 |
| --- | --- | --- |
| 2026-09-23 会话中 | 一次改动 28 个内容文件（超 §9 的 5 个阈值） | **授权** |
| 2026-09-23 会话中 | 修法本身：改内容，还是在构建期加插件兜底？ | **改内容 + 立防线**：把内侧标点移到标记外；同时把 `an-compliance.js` 的断言 2 从「只查引号」扩成「查全部标点」，并把本次的差分扫描固化成常驻体检脚本（否决了「加构建期插件、源码不动」这一项） |
| 2026-09-23 会话中 | 其中 2 处失效加粗落在表格单元格内，与 §7「表格单元格内不加粗」冲突，怎么处理？ | **按 §7 去掉加粗**（否决了「移标点、保留加粗并放宽断言 5」） |

## 意图

让「加粗」在所有已发布页面上都真正渲染成加粗，而不是把 `**` 当普通文字显示出来。

**根因（CommonMark 定界符规则）**：加粗标记两侧的字符类别决定它是否生效——
开定界符要求「后非空白 且（后非标点 或 前为空白/标点/行首）」，闭定界符要求「前非空白 且（前非标点 或 后为空白/标点/行尾）」。
于是 **`**` 内侧贴标点、外侧贴文字**时，定界符整体失效、加粗不成立，源码里的 `**` 被当作普通文字渲染：

- `**要点。**接着` → 页面显示 `**要点。**接着`（`. 前`是标点、后面紧跟汉字）
- `掌握**“话术”**：说明` → 页面显示 `**“话术”**`（前面紧跟汉字、`“` 是标点）

§7 原有的「加粗与引号相邻时，加粗加在引号内（写 `“**重点**”`）」正是这条规则的**引号特例**，本次把它推广到全部标点。

可验证形式：全库扫描残留 `**` 为 0；构建通过且 `build/sitemap.xml` 存在；受影响目录 9 条断言全过。

## 范围

**修改（28 个内容文件，68 行；`git diff --shortstat` = `28 files changed, 68 insertions(+), 68 deletions(-)`）**

- `docs/growthtree/timeline/phase3/study-and-live-abroad-planning.md`（1 行）
- `docs/lifeforfun/drama/ming-dynasty-1566.md`（5 行）
- `docs/lifeforfun/invest/dividend-etf-guide.md`（1 行）
- `docs/lifeforfun/invest/microcap-stocks-guide.md`（2 行）
- `docs/lifeforfun/invest/sse-composite-index-etf-guide.md`（4 行，含 2 行表格）
- `docs/selfdevelop/ability/ai/ai-learning-plan-for-beginner.md`（3 行）
- `docs/selfdevelop/ability/ai/phase-1-learning-materials.md`（3 行）
- `docs/selfdevelop/ability/language/expatriate/phase-2-learning-materials.md`（2 行）
- `docs/selfdevelop/ability/management/targetmanagement.md`（1 行）
- `docs/selfdevelop/health/sports/fitnessplan/` 下 8 篇：`diagnosis`（2）、`injury-prevention`（4）、`lower-body`（2）、`principles`（3）、`recovery`（9）、`roadmap`（2）、`upper-body`（1）、`weekly-plan`（6）
- `docs/softwaremaster/develop/development/implementation/refactor/safety-net.md`（1 行）
- `docs/softwaremaster/develop/development/verification/developer-testing/tdd.md`（1 行）
- `docs/softwaremaster/develop/foundation/big-data/batch-processing.md`（1 行）
- `docs/softwaremaster/develop/foundation/operating-system/memory-management.md`（1 行）
- `docs/softwaremaster/maintenance/maintain/adaptive.md`（1 行）
- `docs/softwaremaster/maintenance/maintain/linux-server/cpu.md`（2 行）
- `docs/softwaremaster/maintenance/maintain/linux-server/file-descriptor.md`（4 行）
- `docs/softwaremaster/maintenance/maintain/preventive.md`（1 行）
- `blog/2019-12-29-stay-serious.md`（3 行）
- `blog/2026-09-11-jump-out-of-life-loop.md`（1 行）
- `blog/2026-09-21-cognitive-anchors-ai-collaboration.md`（1 行）

处置口径（写死在修复脚本 `.workbuddy/bold-fix.mjs` 头部）：

| 情形 | 处置 | 例 |
| --- | --- | --- |
| 仅开头侧失效 | 把内侧前导标点串移到 `**` 之前 | `掌握**“话术”**：` → `掌握“**话术**”：` |
| 仅结尾侧失效 | 优先把「尾部整个括号组」移到 `**` 之后；无括号组则只移尾部标点串 | `**洗牌（shuffle）**是` → `**洗牌**（shuffle）是`；`**要点。**接着` → `**要点**。接着` |
| 两侧都失效 | 两侧各移一次（得到 §7 的规范形） | `健全**“长钱长投”**机制` → `健全“**长钱长投**”机制` |
| 表格行且确实失效 | 按 §7 去掉该行加粗标记 | `健全**“长钱长投”**机制` → `健全“长钱长投”机制` |

**新增（防线）**

- `.workbuddy/check-bold-render.js` —— 常驻体检脚本（零依赖，递归扫 docs / blog / src，有命中则退出码 1）。
  口径写死在文件头：只查 `**`（`_{2,}` 是填空线、`****` 是掩码，均非强调意图）；跳过代码围栏、行内代码、front matter；
  `**` 运行段按出现顺序两两配对；`**` 数为奇数的一行（跨行加粗）跳过。

**修改（防线）**

- `.workbuddy/an-compliance.js` —— 断言 2 由「只查引号相邻」扩为「查全部标点的定界符可用性」，复用 `check-bold-render.js` 的规则。

**锚点**

- `.ai-anchor/changes/2026-09-23-bold-delimiter-fix/CHANGE.md`（本卡）
- `.ai-anchor/PROJECT.md`：§7「加粗」行改写、§6.2 体检命令清单加一行、§10 新增第 13、14 条
- `.ai-anchor/DECISIONS.md`：「### 2026-09」下追加一行

## 非目标

- **不做**：改 §7 之外任何一行的文风约定（引号、字词口径、表格竖线等一律未动）。
- **不做**：处理 §10 第 13 条那 546 行「表格内加粗」（渲染正常，只是与 §7 不符）——按 §10 第 9 条的处置纪律，不在本次变更里顺手改。
- **不做**：修 `an-compliance.js` 断言 6 的误判（见 §10 第 14 条），也不把 `diagnosis.md` 那处块引用写回。
- **不做**：加构建期插件来兜底渲染（已在授权表里被否决）。
- **不做**：改 `docusaurus.config.js`、`sidebars.js`、`package.json`、`src/**`、`static/**`。
- **不做**：改任何 front matter、目录结构、文件路径与站内链接。
- **不做**：编辑 `build/` 与 `build_old*/`（§9 红线 1）。

## 验收标准

| # | 验收项 | 怎么验（命令 / 动作） | 通过标准 | 实测 |
| --- | --- | --- | --- | --- |
| 1 | 判定与改动完全对齐，无漏改无多改 | `bold-fix.mjs` 自带对账：读 `bold-audit2.json` 的命中集合，与本次改动集合逐行比对 | 漏改 0、多改 0 | ✅ 命中 68 行 vs 改动 68 行，漏改 0 / 多改 0 |
| 2 | 残留 `**` 归零（独立方法复验） | 换一套实现重扫全库 278 篇：`bold-audit2.mjs`（严格解析 vs 把标点替换后松弛解析，取差分） | 命中文件 0、命中行 0 | ✅ `hitFiles=0 hitLines=0 hitMarks=0` |
| 3 | 常驻脚本认定合规 | `node .workbuddy/check-bold-render.js docs blog src` | 命中 0 篇，退出码 0 | ✅ 扫描 278 篇，命中 0 篇 / 0 处 |
| 4 | 改动是纯行级替换、没夹带其它变化 | `git diff --shortstat` | 增删行数相等，且等于改动行数 | ✅ `28 files changed, 68 insertions(+), 68 deletions(-)` |
| 5 | 受影响目录断言全过 | `node .workbuddy/an-compliance.js docs/selfdevelop/health/sports/fitnessplan` | 9 / 9 通过 | ✅ 9 / 9，结论「合规」 |
| 6 | 新断言在别处也不误报 | `node .workbuddy/an-compliance.js docs/lifeforfun/invest` | 断言 2 = 0 处 | ✅ 断言 2「0 处」（该目录另有 4 条 FAIL 属既有问题，见「未验证/遗留」） |
| 7 | 站内链接无失效 | `node .workbuddy/check-doc-links.js docs` | 问题 0 处 | ✅ 共检查 250 个文件，问题 0 处 |
| 8 | 构建通过（§6.2 两条判据） | 先 `Rename-Item build build_old_20260923_bold`，带 `DOCUSAURUS_KEEP_SERVER_BUNDLE=true` 构建 | 日志有 `[SUCCESS] Generated static files` **且** `build/sitemap.xml` 存在 | ✅ 两条均满足；419 个 html；12 个 fitnessplan URL 全在 sitemap |
| 9 | 产物形态回到基线 | 构建后移动 `build/__server` 进 `.workbuddy/`（移动非删除） | `build/` 顶层 16 项 | ✅ 顶层 16 项，`__server` 已移至 `.workbuddy/__server_bold` |
| 10 | 不变量 12 条未被破坏 | 逐条核验 | 全部「已核验」 | ✅ 见「影响面」 |

> 验收 2、3 是**两套独立实现**互相印证：验收 2 用解析器差分（依赖 `node_modules` 里的 remark-parse / MDX），
> 验收 3 用零依赖的字符级规则。二者在本轮结论完全一致（修复前同为 68 行，修复后同为 0），这也是断言 2 敢用后者当规则的原因。

## 影响面

| 不变量 # | 本次是否触碰 | 说明 |
| --- | --- | --- |
| 1 | 否 | 四个板块目录名未动 |
| 2 | 否 | 站点名 / URL / `CNAME` 未动 |
| 3 | 否 | 未增删目录、未动任何 `index.md` 与 `_category_.json` |
| 4 | 否 | 未动 `sidebar_position`、目录名与 label |
| 5 | 否 | 未动任何 front matter（改动全在正文行内） |
| 6 | 否 | blog 三篇的 front matter 五键与首行 H1 未动 |
| 7 | 否 | 未新增或修改 blog 内的站内链接 |
| 8 | 否 | 未碰 `custom.css` |
| 9 | 否 | 未碰天空层 |
| 10 | 否（被遵守） | `build/` 只被构建写入与移动；未编辑任何产物目录内文件 |
| 11 | 否（被遵守） | 未动任何内链，链接体检 0 问题 |
| 12 | 否（被遵守） | 改动只涉及标点位置与 2 处 `**` 删除，未引入 `<` `>` 与表格竖线；构建成功即为证 |

结论：**不触碰任何不变量** → 走标准道（① ② ③ ④ ⑤）。

## 风险与回滚

- **最坏会怎样**：① 标点移出后，加粗的**强调范围发生可见变化**（原加粗的 `。` 或引号不再加粗）；② 少数只移出一侧引号的地方（如 `而是听「**音簇」和「节奏间隙」**。`），开头引号不加粗、结尾引号加粗，视觉上略不对称；③ 表格那 2 处直接去掉了加粗，强调消失。
- **怎么退回去**：`git checkout -- docs blog` 一次性还原全部 28 个文件；`.workbuddy/check-bold-render.js` 与 `an-compliance.js` 的断言 2 可单独保留（不影响站点）。
- **已声明并接受的代价**：本次采用**最小改动**口径——只移「导致失效的那一侧」的标点，不去重排强调结构。因此出现了两类并存写法：
  只移一侧的 `「**…」**` 与两侧都移的 `「**…**」`。两者**都能正常渲染**；统一成 `「**…**」` 需要改动更多强调范围，本轮不做。
- **风险缓解**：`.workbuddy/bold-fix-dryrun.txt` 与 `bold-fix-applied.txt` 保留了全部 68 处的「改动前 → 改动后」逐行对照，人可抽样复核；常驻脚本保证此后同类问题能在发布前被发现。

## 待裁决

| # | 问题 | 选项 A | 选项 B | 现状 |
| --- | --- | --- | --- | --- |
| 1 | 只移出一侧的引号写法（`「**音簇」和「节奏间隙」**。`）是否要统一成两侧都移（`「**音簇**」和「**节奏间隙**」`）？ | 保持现状（最小改动，渲染正确） | 另开变更统一成规范形，代价是强调范围变化更多 | **本轮按 A 执行**（未另行请示，人可推翻） |
| 2 | §10 第 13 条那 546 行表格内加粗，是去掉加粗还是改 §7 允许？ | 去掉加粗（合 §7） | 改 §7、撤掉断言 5 | **未处理**，留待另开变更 |
| 3 | `diagnosis.md` 里被改写掉的那处 `> ` 块引用是否写回？ | 写回（但原文已无留存，只能重写一句） | 保持现状 | **未处理**，随 §10 第 14 条一并决定 |

## 校核记录（换方法，非换角色）

本轮的校核**没有走「换角色的模型评审」，而是换了验证方法**，理由如下，一并说明其局限：

- 本次是机械式修复，判据可机器复算（「页面上是否真的漏出 `**`」可由解析器直接回答）。在这个问题上，模型评审能给出的结论强度**低于**解析器。
- 实际执行的校核有三层：
  1. **修复前**：先用解析器差分法定位（`bold-audit2.mjs`），再用 MDX 编译链路（`@mdx-js/mdx` 3.1.1，与站点构建同版本）对 21 个构造样本交叉验证「哪类组合真的会炸」，两条链路结论**零不一致**，9 个预期失败样本全部命中。
  2. **修复后**：换一套零依赖实现（`check-bold-render.js`）重扫，与解析器差分结论一致（均为 0）。
  3. **独立上下文的复核者**（子代理，只读、任务写死为**证伪**）主动找了 6 条证伪路径，结论为**「未能证伪」**，并给出可复算证据：
     - 用 remark 真实 AST 逐文件比对 HEAD 与工作区：HEAD 恰 68 行存在字面 `**` 文本节点，工作区为 0 → 漏改 0；
     - 逐条比对「改前是否真失效 / 改后是否真修好」→ 多改 0、未修好 0、`**` 奇偶性变化 0；
     - 绕开脚本的跳过规则全库扫描 278 篇，唯一残留字面 `**` 是 `phase-6-learning-materials.md:529` 的手机号掩码 `138****1234`（本意即字面）；
     - 去掉 `**` 并归一换行符后，**28/28 个文件的可见文本逐字符完全一致**，`sse-composite-index-etf-guide.md` 的 12 张表行列数与对齐全部不变；
     - 对「只移出一侧引号」那处实测加粗文本序列与改前一致，不会读成别的意思。
- **局限（不许美化）**：这次校核**没有经过「换厂商」的模型评审**（与本站前几轮同一档资源），也**没有做联网事实核查**（本次不改任何事实性内容，故不需要）。复核者同时提出了 4 条「能用但另一种写法更好」的观察（`microcap-stocks-guide.md:497`、`file-descriptor.md:145`、`:313`、`preventive.md:57` / `safety-net.md:21` 的引号不对称），我判断它们**渲染均正确**，属风格取舍而非缺陷，已记入「风险与回滚 → 已声明并接受的代价」与「待裁决 1」，**不做修改**。

## 收尾

- 更新 `PROJECT.md`：§7「加粗」行改写为全标点口径、§6.2 加一行体检命令、§10 追加第 13、14 条。
- 在 `DECISIONS.md` 的「### 2026-09」下追加一行。
- 过程材料留在 `.workbuddy/`：`bold-audit2.mjs`（差分定位）、`bold-fix.mjs`（修复）、`check-bold-render.js`（常驻体检）、
  `bold-probe2.mjs`（构造样本实验）、`bold-audit2.txt` / `bold-fix-dryrun.txt` / `bold-fix-applied.txt`（报告）。按 §9 红线 3，一律不发布进 `docs/`。

## 过闸检查（进入第②步前必须全部为是）

```text
[x] 验收标准可以被判定真假（10 条，全部能跑出命令结果）
[x] 非目标不是空的（6 条）
[x] 影响面已逐条对照不变量清单（12 条）
[x] 待裁决项给了选项与代价（3 项）
[x] 车道已判定并写明（标准道）
```

# 变更卡：把一份时间观与人生意义的源稿，评审后拆成两篇可发布的知识页

- **变更编号**：`2026-10-08-time-and-meaning`
- **日期**：2026-10-08
- **车道**：标准道，另含两项**需请示项**，均已在会话中获得人当面授权（见下）
- **授权记录（当场落纸，依 §10 第 10 条）**：
  - 授权 1 · 新增目录：人选择「新建 `outlook/timeandmeaning/` 模块目录（推荐）」——授权内容为在 `docs/selfdevelop/outlook/` 下新建第 3 层目录并配 `_category_.json` 与 `index.md`。
  - 授权 2 · 删除文件：人选择「就地删除」——授权删除 `docs/selfdevelop/时间与人生意义-思想史全景与实操手册.html`。

## 意图

把源稿评审后拆成两篇相互独立、可直接发布的知识页，并让四道静态体检全绿。

可验证形式：`docs/selfdevelop/outlook/timeandmeaning/` 下出现 3 篇 md + `_category_.json`，`an-compliance.js` 对该目录 9/9 PASS，`check-doc-links.js docs` 报 0 问题。

## 范围

新增：

- `docs/selfdevelop/outlook/timeandmeaning/_category_.json`
- `docs/selfdevelop/outlook/timeandmeaning/index.md`
- `docs/selfdevelop/outlook/timeandmeaning/research.md`（上篇：研究过程与结论）
- `docs/selfdevelop/outlook/timeandmeaning/practice.md`（下篇：实操方法与落地应用）
- `.ai-anchor/changes/2026-10-08-time-and-meaning/REVIEW.md`（源稿编辑评审单）

修改：

- `docs/selfdevelop/outlook/index.md`：内容清单追加一行
- `.ai-anchor/PROJECT.md`：§10 追加登记项、更新「最后更新」
- `.ai-anchor/DECISIONS.md`：追加一行

删除（已授权）：

- `docs/selfdevelop/时间与人生意义-思想史全景与实操手册.html`（**该文件此前未被 git 跟踪**，删除前已在 `.workbuddy/` 留一份字节校验过的副本作安全网）

## 非目标

- 不做：不移植源稿的三张内联 SVG 图（图 1 物理四拆解、图 2 三态回路、图 3 三锚）。站点长文无内联 SVG 先例，改用表格与文本块承载同一信息。
- 不做：不改 `docusaurus.config.js`、`sidebars.js`、`package.json`、`src/` 下任何文件；不新建板块目录；不动 `outlook` 下的既有四个子目录。
- 不做：不顺手修 §10 第 9、13、18、19、24 条那些已登记的既有偏差（同级 `_category_.json` 的 `collapsed` 不统一、表格内加粗等），一律登记不动手。
- 不做：不在本轮跑生产构建（助手侧写不了 `node_modules/.cache`，见 §10 第 21 条）。
- 不做：不新增 `blog/` 随笔、不改任何既有文章的正文。

## 验收标准

| # | 验收项 | 怎么验（命令 / 动作） | 通过标准 |
| --- | --- | --- | --- |
| 1 | 文风与标点断言 | `node .workbuddy/an-compliance.js docs/selfdevelop/outlook/timeandmeaning` | 9/9 PASS |
| 2 | 加粗定界符可渲染 | `node .workbuddy/check-bold-render.js docs blog src` | 命中 0 篇 |
| 3 | docs 链接与锚点 | `node .workbuddy/check-doc-links.js docs` | 0 问题 |
| 4 | 全库链接（含 blog 与站点绝对路径） | `node .workbuddy/rn-verify.js` | 结论：全部通过 |
| 5 | 表格结构自检 | `node .workbuddy/tm-check-tables.js` | 表结构全部通过（无缺分隔行、无列数不符、无裸花括号） |
| 6 | 源文件已从 docs 树移除 | `git status --porcelain` | 不再出现该 html 的未跟踪条目 |
| 7 | 两篇成品可被站点解析 | 人工构建后查 `build/sitemap.xml` | 出现 `…/outlook/timeandmeaning`、`/research`、`/practice` 三条路径（**由人执行**） |

## 影响面

| 不变量 # | 本次是否触碰 | 说明 |
| --- | --- | --- |
| 1 | 否 | 四个板块目录名未动；新增的是 `outlook/` 下第 3 层目录 |
| 2 | 否 | 站点名、URL、`CNAME` 未动 |
| 3 | 已满足 | 新目录同时具备 `_category_.json` 与非空 `index.md`，断言 9 PASS |
| 4 | 否 | 排序只用 `sidebar_position`（index 1 / 上篇 2 / 下篇 3）；目录名 `timeandmeaning` 与 label「时间与人生意义」均无数字前缀 |
| 5 | 否 | 三篇均备齐 `sidebar_position` / `title` / `description` / `tags` / `keywords`，断言 8 PASS |
| 6 | 否 | 未动 `blog/` |
| 7 | 否 | 未新增 blog 内容 |
| 8 | 否 | 未动 `src/css/custom.css` |
| 9 | 否 | 未动天空层 |
| 10 | 否 | 未编辑 `build/`、`build_old*/`、`node_modules/`、`.docusaurus/` |
| 11 | 否 | 内链一律不带结尾斜杠，断言 7 PASS |
| 12 | 否 | 正文无裸 `<` `>`（断言 6 PASS）；新增表格单元格内无 `|` 需转义处、无加粗（断言 5 PASS）；admonition 均不插在表格中间 |

结论：**不触碰任何不变量**。

另有两项落在「不变量之外的全局面」，单开申报（依 §10 第 22 条的教训）：

- **新增 2 个 tag 值**（`时间观`、`人生意义`）→ 构建后会多出 `docs/tags/时间观.html` 与 `docs/tags/人生意义.html` 两个页面，html 计数应为 **+5**（上篇、下篇、目录落地页、2 个 tag 页）。新增 tag 不属于 12 条不变量中的任何一条。
- **未使用任何 swizzle 点、插件或全局 provider**，本次不涉及默认表/默认行为。

## 风险与回滚

- **最坏会怎样**：`research.md` 有 539 行、`practice.md` 有 626 行，`practice.md` 略超 §7 的「单篇 600 行左右」参考线。代价是单页偏长，读者需要滚动多次；不构成渲染或链接风险。另一处风险是源稿三张 SVG 未移植，三态回路的「顺时针事实链 / 逆时针意义链」在纯文字里不如图形直观。
- **怎么退回去**：`git rm -r docs/selfdevelop/outlook/timeandmeaning` 并 `git checkout -- docs/selfdevelop/outlook/index.md`；`.ai-anchor/` 三个文件同样 `git checkout --`。源 HTML 的副本留在 `.workbuddy/source-timeandmeaning-2026-10-08.html`（已字节校验），需要时可直接复制回 `docs/selfdevelop/`。
- **回滚会不会丢内容**：不会。新增文件全部落在 git 可追踪的路径上；被删除的源稿有 `.workbuddy/` 副本。唯一不可自动恢复的是源稿的三张 SVG 图形本身——它们只存在于该副本里。

## 待裁决

| # | 选项 | 代价 | 我的倾向 |
| --- | --- | --- | --- |
| 1 | A：保持现状，`practice.md` 626 行不拆 / B：再拆出第三个文件（如把 M6、M7 与场景路线单独成页） | A：单页偏长，超出 §7 参考线约 4%；B：与「两篇」的原始要求不符，且会让下篇失去「一本手册」的整体感 | A |
| 2 | A：接受 SVG 不移植，用文本块表达 / B：破例在 MDX 里内联 SVG 复刻三张图 | A：三态回路与三锚关系不如原图直观；B：违反站点无内联 SVG 的既有做法，且直接触碰不变量 12 的转义要求 | A |
| 3 | A：本轮不跑构建，交 CI / 由人在本机构建对账 / B：请人在设置里放行 `node_modules/.cache` 后由助手跑 | A：`+5 个 html` 只有人的构建能对账；B：需要人改本机权限设置 | A |
| 4 | A：接受上篇 20669 字 / B：压缩 1.1 至 1.7 的谱系约 15%（主要动芝诺、斯多亚、伊壁鸠鲁、黑格尔、叔本华五处） / C：把谱系再拆一页 | 实测对照：站点既有最长篇 `human-abilities-in-ai-era.md` 为 16073 字 / 602 行；上篇 20669 字 / 540 行，比它长约 29%；下篇 13518 字，与它同量级。源稿正文 27132 字，两篇合计 34187 字，净增 26%（增量集中在实操，符合「适度扩展实操」的要求）。**A** 的代价是单页阅读负荷高于站点既有上限；**B** 的代价是删掉芝诺、斯多亚、伊壁鸠鲁、黑格尔、叔本华这五个出场者，而他们属「研究价值」的一部分；**C** 与「拆成两篇」的原始要求冲突 | A，但把 B 留给你判断 |

## 收尾

- `PROJECT.md` §10 追加本次登记项（新模块建成、SVG 未移植、`+5 html` 待对账）。
- `PROJECT.md` 抬头「最后更新」改为 2026-10-08。
- `DECISIONS.md` 追加一行：本次两项请示（新增目录、删除未跟踪文件）的授权与依据。
- 工作区日志 `.workbuddy/memory/2026-10-08.md` 追加本次记录。

## 过闸检查

```text
[x] 验收标准可以被判定真假
[x] 非目标不是空的（共五条）
[x] 影响面已逐条对照不变量清单，并额外申报了不变量之外的全局面（2 个新 tag）
[x] 待裁决项给了选项与代价
[x] 车道已判定并写明（标准道 + 两项已授权请示）
```

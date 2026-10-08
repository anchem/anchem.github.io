# 变更卡：新建「故事创作」板块，落一套人物塑造学习材料

- **变更编号**：`2026-10-08-storycraft-character`
- **日期**：2026-10-08
- **车道**：**标准道** —— 判定依据：本次**不触碰**第五格「不变量清单」中的任何一条（新增内容文件与一个子目录，不动板块目录名、站点身份、front matter 约定、色令牌、产物）；但「新增目录」与「一次新增 12 个文件（超 5 个阈值）」两项命中 §9「必须请示人」，已获会话内授权（见下表）。

## 授权记录（§10 第 10 条：请示项当场落纸，不事后补记）

| 时点 | 请示项 | 人的裁决 |
| --- | --- | --- |
| 2026-10-08 会话中 | 新增目录 `docs/lifeforfun/storycraft/`（命 §9「新增目录」） | **授权**。用户在需求中原话要求「在 docs 目录下建立合适的目录结构存放相关内容」，并授权由我方选定归属板块与目录名 |
| 2026-10-08 会话中 | 一次新增 11 篇 md + 1 个 `_category_.json`（超 §9 的 5 个阈值） | **授权**。这 12 个文件即是本次交付物本身 |
| 2026-10-08 会话中 | 是否顺带修 `docs/lifeforfun/basketball/index.md` 空壳、以及 `invest` / `drama` 两处 `_category_.json` 的 `position` 撞车 | **未请示、未处理**，登记为「提交前发现的问题」 |

## 意图

在 `docs/lifeforfun/` 下新建子目录 `storycraft`（sidebar label「故事创作」），交付一套以**人物塑造**为主线的学习材料：11 篇 md ＋ 1 个 `_category_.json`，覆盖「核心概念 → 原型与性格理论 → 塑造方法 → 五类原型逐类拆解（各含 8 节）→ 生活迁移总纲 → 材料与书目拆解」六层，并把整套知识落到识人、沟通、共情、边界、冲突、动机理解、自我反思与自我叙事上。

**可验证形式**：`node .workbuddy/an-compliance.js docs/lifeforfun/storycraft` 9/9 通过；`node .workbuddy/check-doc-links.js docs` 0 问题；`node .workbuddy/check-bold-render.js docs blog src` 退出码 0；`docs/` 下的 md 计数由 269 → 280。

## 范围

**新增目录**：`docs/lifeforfun/storycraft/`

**新增文件（12 个）**

| 文件 | 是什么 | 字数级 |
| --- | --- | --- |
| `_category_.json` | position 5 / label「故事创作」/ className `lifeforfun` / `collapsed: true`（第 2 层，按 §7） | — |
| `index.md` | 板块导览 ＋ 知识体系大纲 ＋ 阅读地图 ＋ 每篇类型页共用的 8 节模板说明 ＋ 三条使用纪律 | 中长 |
| `concepts.md` | 核心概念：人物＝欲望×阻碍×选择×代价；扁平与圆形；原型与刻板印象；性格/动机/弧线三层 | 中长 |
| `archetypes.md` | 原型与性格理论地图：荣格、坎贝尔、沃格勒、十二原型、大五、九型、依恋、霍妮、伯恩、戈夫曼、叙事认同 ＋ 工具组合顺序 ＋ 四类边界警告 | 长 |
| `methods.md` | 塑造方法九道：欲望—需求—谎言三角、压力下的选择、行为化、对白与潜台词、关系网、弧线设计、反派动机合理化、侧面细节、斯坦尼式场景推演 ＋ 十步工作流 ＋ 失败模式对照表 | 长 |
| `the-hero.md` | 英雄：3 亚型；案例＝《老人与海》／《肖申克的救赎》／维克多·弗兰克尔；4 场景推演；8 节完整 | 长 |
| `the-caregiver.md` | 照顾者：3 亚型＋专业型参照；案例＝《飘》梅兰妮／《东京物语》纪子／东亚「三明治一代」照护处境；8 节完整 | 长 |
| `the-shadow.md` | 阴影与对手：3 档强度；案例＝《悲惨世界》沙威／《绝命毒师》怀特／清代和珅；含冲突复盘表；8 节完整 | 长 |
| `the-trickster.md` | 骗子与搅局者：搅局者与骗子的分界判据；案例＝《西游记》孙悟空／《飞越疯人院》麦克墨菲／弗兰克·阿巴内尔公开自述；8 节完整 | 长 |
| `the-sage.md` | 智者与导师：3 亚型＋「把我知道当身份的权威」这一病理形态；案例＝《杀死一只知更鸟》阿提克斯／《死亡诗社》基廷／苏格拉底；8 节完整 | 长 |
| `life-transfer.md` | 生活迁移总纲（本次重点）：三条前置原则、识人四步法、翻译式沟通、共情三层与边界、设边界四步法与三种高频场景、冲突复盘表与四原则、动机三层询问与三种不可知、自我反思五问、自我叙事改写三动作、一页速查 | 长 |
| `readings.md` | 材料与书目拆解：四类来源逐本写「解决什么问题／能带走什么／注意什么」，含高频误读表与「只读三本」 | 长 |

**修改（3 个既有文件，全部为纯追加链接，不改正文）**

- `docs/lifeforfun/index.md`：追加「## 内容」一节，列出 5 个子模块（此前该页只有一段散文，没有模块索引；新目录若不在此页出现，只能靠 sidebar 发现）
- `docs/lifeforfun/drama/index.md`：在「## 关联主题」追加一行指向 `../storycraft/index.md`
- `docs/selfdevelop/outlook/humanity/index.md`：在「## 应用案例」追加一行指向 `../../../lifeforfun/storycraft/index.md`

**锚点**

- `.ai-anchor/changes/2026-10-08-storycraft-character/CHANGE.md`（本卡）
- `.ai-anchor/changes/2026-10-08-storycraft-character/checks-01..04-*.txt`（四份体检原始输出）
- `.ai-anchor/PROJECT.md`：§10 追加第 24 条
- `.ai-anchor/DECISIONS.md`：「### 2026-10」下追加一行

## 非目标

- **不做**：改 `docusaurus.config.js`、`sidebars.js`、`package.json`、`src/**`、`static/**`、`CNAME`。
- **不做**：动任何已有文章的正文（三个既有文件的改动全部是**末尾追加链接行**，不删不改原有内容）。
- **不做**：动 `blog/`（本次不产生随笔）。
- **不做**：跑生产构建。助手侧沙箱禁写 `node_modules/.cache`，而生产构建必然要写（PROJECT.md §10-21 已登记）。
- **不做**：处理 §10 第 9／13／18／19 条四类已裁决的登记项（`collapsed` 不统一、表格内加粗 546 行、`timeline/index.md` 的 `「」` 与缺 front matter、phase1–3 缺键位与断言 8 的 LF-only 正则）——按「不要在别的变更里顺手改」的处置纪律。
- **不做**：顺带修 `docs/lifeforfun/basketball/index.md` 的空壳，也不修 `invest` / `drama` 两处 `_category_.json` 的 `position` 撞车（见「提交前发现的问题」）。
- **不做**：为「故事创作」新建一级板块。四个板块按不变量 1 不可增改，本模块挂在 `lifeforfun` 下。

## 验收标准

| # | 验收项 | 怎么验（命令 / 动作） | 通过标准 | 实测 |
| --- | --- | --- | --- | --- |
| 1 | 新目录 9 条断言全过 | `node .workbuddy/an-compliance.js docs/lifeforfun/storycraft` | 9 / 9 通过，退出码 0 | ✅ 9 / 9，结论「合规」（`checks-03`） |
| 2 | 加粗定界符全库无残留 | `node .workbuddy/check-bold-render.js docs blog src` | 命中 0 篇 / 0 处，退出码 0 | ✅ 扫描 308 篇，命中 0 篇 / 0 处，`EXIT=0`（`checks-01`） |
| 3 | 站内链接（docs 树）无失效 | `node .workbuddy/check-doc-links.js docs` | 问题 0 处，退出码 0 | ✅ 共检查 280 个文件，问题 0 处（`checks-02`） |
| 4 | 全库链接（含 blog 与站点绝对路径）无失效 | `node .workbuddy/rn-verify.js` | 失败 0 条，退出码 0 | ✅ 852 条链接 / 失败 0 条，结论「全部通过」（`checks-04`） |
| 5 | 新增目录结构合规 | 人工 ＋ 断言 9 | `_category_.json` 存在且 `index.md` 非空壳 | ✅ 断言 9 PASS：「11 篇 md + _category_.json」 |
| 6 | front matter 键位一致 | 断言 8 | 五键齐全（`sidebar_position` / `title` / `description` / `tags` / `keywords`） | ✅ 断言 8 PASS「键位一致」 |
| 7 | 不变量 12 条未被破坏 | 逐条核验 ＋ 断言 6／7 | 全部「未触碰 / 被遵守」 | ✅ 见「影响面」 |
| 8 | 未误伤既有内容 | `git diff --stat` 只看三个既有文件 | 三个文件均**只有新增行**，无删除行 | ✅ 见「影响面 → 既有文件改动性质」 |
| 9 | **构建通过（§6.2 两条判据）** | **需人在本机执行**：先 `Rename-Item build build_old_sc`，带 `DOCUSAURUS_KEEP_SERVER_BUNDLE=true` 构建 | 日志有 `[SUCCESS] Generated static files` **且** `build/sitemap.xml` 存在，且 sitemap 含 12 个 storycraft URL | ⛔ **未执行**（助手侧无权限，见「未验证 / 遗留」） |

## 影响面

| 不变量 # | 本次是否触碰 | 说明 |
| --- | --- | --- |
| 1 | 否 | 四个板块目录名未动；新模块挂在既有 `lifeforfun` 之下 |
| 2 | 否 | 站点名 / URL / `CNAME` 未动 |
| 3 | 否（被遵守） | 新目录备齐 `_category_.json` 与非空壳 `index.md`（断言 9 PASS） |
| 4 | 否（被遵守） | 排序只用 `sidebar_position`（1–11 连续）；目录名 `storycraft` 与 label「故事创作」均无数字前缀 |
| 5 | 否（被遵守） | 11 篇新文件的 front matter 键位按 §7（断言 8 PASS）；未改任何既有文件的 front matter |
| 6 | 否 | 未动 blog |
| 7 | 否 | 未新增或修改 blog 内的站内链接（本次不产生 blog） |
| 8 | 否 | 未碰 `src/css/custom.css` |
| 9 | 否 | 未碰天空层与 `src/theme/Root.js` |
| 10 | 否（被遵守） | 未编辑 `build/`、`build_old*/`、`node_modules/`、`.docusaurus/` 下任何文件 |
| 11 | 否（被遵守） | 新内链一律不带结尾斜杠（断言 7 PASS「0 处」） |
| 12 | 否（被遵守） | 正文无裸 `< >`（断言 6 PASS「0 处」）；表格内未使用 `**`（断言 5 PASS）；admonition 未插在表格中间 |

结论：**不触碰任何不变量** → 走标准道（① ② ③ ④ ⑤）。

**另需单开一行申报的全局面**（§10 第 22 条的教训：影响面表在结构上装不下 swizzle 点、插件与全局 provider）：

> 本次**未新增或修改** `src/theme/*` 下的任何 swizzle 点、**未新增插件**、**未加全局 provider**。
> 唯一的全站级物件是 `docs/lifeforfun/storycraft/_category_.json`，它只决定该目录在侧边栏的显示名与**初始展开状态**，
> 不合并也不替换任何默认表，不影响其它目录的既有行为。→ 这一行**无待申报项**。

**既有文件改动性质（验收 8 的依据）**

| 文件 | 改动 | 是否删行 |
| --- | --- | --- |
| `docs/lifeforfun/index.md` | 末尾追加「## 内容」一节（1 行标题 ＋ 1 行导语 ＋ 5 行列表） | 否 |
| `docs/lifeforfun/drama/index.md` | 「## 关联主题」列表追加 1 行 | 否 |
| `docs/selfdevelop/outlook/humanity/index.md` | 「## 应用案例」列表追加 1 行 | 否 |

## 提交前发现的问题（不在本次范围，供人裁决）

| # | 现象 | 影响 | 建议 |
| --- | --- | --- | --- |
| 1 | `docs/lifeforfun/basketball/index.md` 只有一行 `# 篮球`，是空壳 | 命中不变量 3「`index.md` 不能是空壳」；首页书架统计虚高 | 另开变更写实（同类：`docs/selfdevelop/health/sports/pushup.md` 已是登记桩页，见 §10-11） |
| 2 | `docs/lifeforfun/invest/_category_.json` 与 `docs/lifeforfun/drama/_category_.json` 的 `position` 都是 4 | 侧边栏中两者的先后不确定 | 另开变更改一处的 position；**本次未动**（按「不在别的变更里顺手改」） |
| 3 | 因第 2 条，我新补的 `lifeforfun/index.md` 的「## 内容」清单里，影视剧与投资的先后也是未定的 | 无实质影响，只是列表顺序在不同构建下可能变 | 随第 2 条一并解决 |

## 风险与回滚

- **最坏会怎样**：① 新目录进入侧边栏与首页书架统计（篇数 +11）；② 内容里若存在口径或事实错误，会以「已发布」形态存在——这是本次最主要的实质风险，且助手侧无法用构建验证（§10-21）；③ 生活迁移篇涉及真人分析，若分寸失当会侵入他人（见「待裁决 1」的处置口径）。
- **怎么退回去**：`Remove-Item -Recurse docs/lifeforfun/storycraft`（整体删除新增目录，不牵连任何既有内容）＋ `git checkout -- docs/lifeforfun/index.md docs/lifeforfun/drama/index.md docs/selfdevelop/outlook/humanity/index.md`。
  注意：本机 safe-delete 守卫可能拦下递归删除；届时改用**逐个文件删除**，或 `git clean -fd docs/lifeforfun/storycraft`（新增文件未跟踪，`git clean` 是标准做法），**不要绕守卫**。
- **回滚会不会丢内容**：会。11 篇 md 全部是新写的，删除即丢失。若需保留，先 `Copy-Item -Recurse` 到 `.workbuddy/`（被忽略区）并逐文件校验字节，再退。
- **风险缓解**：新增内容全部落盘、可随时 `git diff` 复核；四份体检原始输出已随本卡归档在 `checks-01..04-*.txt`，人可复算。

## 待裁决

| # | 问题 | 选项 A | 选项 B | 现状与代价 |
| --- | --- | --- | --- | --- |
| 1 | 真实案例的分寸：用公开历史／公开出版物人物（弗兰克尔、苏格拉底、和珅、阿巴内尔、梅兰妮等），还是全部退回虚构？ | 用公开人物，每处写明**来源说明**与**分析角度**，并主动标注来源偏差与既有争议 | 全部改用虚构，安全但说服力弱、也难满足「现实案例」的交付要求 | **已按 A 执行**。代价：需要持续守住「只讨论一个角度、不推断私生活、不给整个人下结论」这三条；若人认为某一条越界，删掉那一段即可，不影响其余结构 |
| 2 | 目录归属：`lifeforfun`（与「影视剧」并列）还是 `selfdevelop/cognition`？ | A：放 `lifeforfun`，与既有「影视剧」最贴近，生活迁移部分靠跨板块内链接上 | B：放 `selfdevelop`，更贴「识人／共情」，但会与「故事创作」这个自我定位的题面不符 | **已按 A 执行**。代价：跨板块链接需要三条（已加），模块的「成长」属性靠 `life-transfer.md` 承载 |
| 3 | 第 1、2 条「提交前发现的问题」是否要现在处理？ | 另开变更 | 长期登记 | **未处理**。按 §10 第 9／13／18／19 条的处置纪律，登记不动手 |

## 未验证 / 遗留

- **助手侧未跑生产构建**（§10-21：沙箱禁写 `node_modules/.cache`，而生产构建必然要写）。因此**本次交付的渲染结果未经构建验证**。能做的最近替代是四类静态体检（断言 / 加粗 / 链接 / 结构），已全绿：
  - 断言：`storycraft` 9/9
  - 加粗：全库 308 篇，命中 0
  - docs 链接：280 文件 0 问题
  - 全库链接：852 条 0 失败
- **需要人做的验收动作**：本机跑一次构建，判据是日志有 `[SUCCESS] Generated static files`，`build/sitemap.xml` 存在，且在 sitemap 里能查到 `storycraft` 的 12 个 URL（`/docs/lifeforfun/storycraft` 与 `/docs/lifeforfun/storycraft/{concepts,archetypes,methods,the-hero,the-caregiver,the-shadow,the-trickster,the-sage,life-transfer,readings}`）。
  产物 html 数的增量应为 **+14**：11 篇文档 ＋ 1 个目录落地页（`/docs/lifeforfun/storycraft`）＝ +12，再加 2 个新 tag 落地页。本次引入的 tag 值只有两个（`故事创作`、`人物塑造`），此前全站未使用过；按「每个新 tag 值各生成一个 `docs/tags/<tag>.html`」的口径对账。
- **未做联网一手事实核查**。内容中的文学与历史事实依据的是公开通行的记述。其中三处已**主动标注**来源偏差或既有争议，请人在复核时重点看：
  1. 《设立守望者》与《杀死一只知更鸟》的关系及该书出版争议（`the-sage.md`）
  2. 弗兰克·阿巴内尔自传细节受媒体质疑（`the-trickster.md`）
  3. 米尔格拉姆实验方法与其结论被再分析修正（`readings.md`）
  另有若干处属于「引用大意而非逐字原文」（如麦基关于「压力下的选择」、沙威的临终反应、弗兰克尔关于「最后一块自由」的表述），已在行文中以「大意／据其自述」的方式标明，未伪造直接引语。
- **未走「换角色的多评审」**。本次只有执行者自检，没有独立评审单。若人认为该内容值得按本站长文的标准评审（像 `fitnessplan` 那样三份 REVIEW），建议另开一轮。

## 收尾

- 更新 `PROJECT.md`：§10 追加第 24 条（记录新模块、授权与遗留）。
- 在 `DECISIONS.md` 的「### 2026-10」下追加一行。
- 过程材料留在 `.workbuddy/`：`sc-bold2.txt`、`sc-links2.txt`、`sc-comp2.txt`、`sc-rnverify.txt`（四份体检输出）与 `sc-anchor-ls.txt`（锚点目录清单）。按 §9 红线 3，一律不发布进 `docs/` 或 `blog/`。

## 过闸检查（进入第②步前必须全部为是）

```text
[x] 验收标准可以被判定真假（9 条，其中 8 条可跑出命令结果，第 9 条明确标注需人执行）
[x] 非目标不是空的（7 条）
[x] 影响面已逐条对照不变量清单（12 条）＋ 单开一行申报全局面（无待申报项）
[x] 待裁决项给了选项与代价（3 项）
[x] 车道已判定并写明（标准道）
```

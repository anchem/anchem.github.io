# CHANGE —— 新增 `docs/selfdevelop/outlook/society/yantielun.md`

- **日期**：2026-10-13
- **变更卡**：`2026-10-13-society-yantielun`
- **车道判定**：内容变更（§6.1）。范围＝既有目录内新增 1 篇 ＋ 补同目录 `index.md` 导览 1 行，共 **2 个文件**；**不新增／移动／删除任何目录**，**不删除任何已发布内容**，未触及 `docusaurus.config.js`／`sidebars.js`／`src/`／色令牌。按 §9「AI 可以自主决定」条的「在既有目录内新增文章、补 index.md 导览」——**无需另行请示**。
- **授权情况**：本轮不含 §9 请示项，故没有待补记的会话内授权。**未执行部署**（不 push，不触发 `deploy.yml`）。

## 意图

把《盐铁论》读成一套可复用的判断工具（四层逻辑 ＋ 八条判断 ＋ 五问流程），新增为 `society` 目录下的一篇知识页，使读者读完能拆开日常现象、把钱与资源的事说完整；同时在同目录导览页收录，使其可从导览页进入。

## 范围

| 文件 | 动作 | 规模 |
| --- | --- | --- |
| `docs/selfdevelop/outlook/society/yantielun.md` | 新增 | 238 行 / 6632 字 |
| `docs/selfdevelop/outlook/society/index.md` | 追加 1 行（应用案例收录） | ＋1 行 |

**位置选择理由**：`society` 的目录定义为「记录对社会运行规则的基本认识……为个人决策提供现实坐标」，且该页已有用《大明王朝1566》做「应用案例」的先例——即「借一份文本观察政治与经济的运行规则」。本文属同一读法，落在同一栏目。按 §6.1 落盘门禁，落在既有目录，不新建目录。

## 非目标

1. **不改** `society/index.md` 的三条「整理中」占位（政治／经济／法律三模块是另一件事，本轮不碰）。
2. **不补** `society/index.md` 缺失的 front matter 四键（`title`／`description`／`tags`／`keywords`）——属既有缺口，按 §10 第 9／13／18／19 条同款纪律**登记不动手**。
3. **不做**任何跨目录改动：不新增 tag 值、不新增目录、不动 `_category_.json`、不动色令牌与 `src/`。
4. **不部署**：不 push。
5. **不移植** `.workbuddy/reading-yantielun/` 中的两张内联 SVG。

## 验收标准

1. `node .workbuddy/check-bold-render.js docs blog src` → 命中 0 篇 / 0 处。
2. `node .workbuddy/an-compliance.js docs/selfdevelop/outlook/society` → 断言 1–7、9 PASS；断言 8 为既有缺口（见「待裁决」2）。
3. `node .workbuddy/check-doc-links.js docs` → 0 问题。
4. `node .workbuddy/rn-verify.js` → 0 失败。
5. 新页 5 条内链逐条人工过目，均为合法 `](` 语法且目标文件存在。
6. （人侧）构建后新增页 URL 出现在 `build/sitemap.xml`，产物对账「＋1 个 html」，路径为 `build/selfdevelop/outlook/society/yantielun.html`。

## 影响面

**逐条对照 §5 十二条不变量**：1–4 不涉及；5 新页五键齐全（`sidebar_position`／`title`／`description`／`keywords`／`tags`），符合；6–7 不涉及 blog；8 不涉及色令牌；9 不涉及天空层；10 未编辑任何产物；11 内链无结尾斜杠；12 无裸 `<>`、表格内无 `|`、无表格内 admonition。

**不变量之外的全局面（单开一行申报，按 §10 第 22 条）**：本次**未使用任何 swizzle 点、插件、全局 provider**；新增 **0 个 tag 值**（复用既有 `决策能力`、`方法论`），因此**不新增标签落地页**；新增内容 html **1 个**。

## 风险与回滚

- **风险**：低。纯新增，不改既有文章的口径；`index.md` 仅追加 1 行。
- **回滚**：删 `yantielun.md` ＋ 摘掉 `index.md` 该行即可，两处均为本次引入，不涉及历史重写。
- **已声明代价**：两张内联 SVG（逻辑主线图、五问映射图）未移植——站点长文无内联 SVG 先例，改由文字与表格承载；代价是「四层逻辑」的层次感不如图形直观。

## 待裁决

1. `society/index.md` 正文原本恰为 **200 字**，而断言 9 的阈值是「大于 200」，因此**改动前就是 FAIL**。本次按导览要求追加收录行后，正文变为 284 字，断言 9 顺带转为 PASS。这是**顺带解决**、不是本次目标；若人认为顺带不合适，可回退该行，但新页将从导览页无法进入。
2. `society/index.md` 缺 front matter 四键，断言 8 仍 FAIL。已核对参照目录：`docs/lifeforfun/invest` 同样 FAIL，说明这是**全站面的既有缺口**。处置建议：**另开变更**统一补，不在本变更内顺手改。

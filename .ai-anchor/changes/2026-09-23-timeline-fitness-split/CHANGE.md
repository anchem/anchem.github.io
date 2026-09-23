# 变更卡：把 timeline/fitness/ 拆进既有的各阶段目录

- 日期：2026-09-23
- 车道：标准道（动了目录结构，且涉及 16 个文件的再分布）
- 状态：已执行，待归集

## 意图

`docs/growthtree/timeline/` 下不再有 `fitness/` 目录；运动这条线的分龄内容按站点既有的
`phaseN/` 规划落位，跨阶段的部分落在时间轴根目录的一篇总览里。

## 会话内授权（§9 必请示事项）

本轮属 §9 三类请示项中的两类：**新增目录**、**批量重构 5 个文件以上**。
人于 2026-09-23 会话中指示：「不要在 timeline 中新建 fitness 目录，而是按照既有的 timeline 规划，
把 fitness 目录下的内容拆到各个 phase 目录下，如果没有对应的 phase 目录就新建一个」，
并同步拍板两处结构选择：

1. 跨阶段内容（四段速览、与五阶段的对应、四条排课规则、特殊情况、检核点用法、进阶段条件）→
   **时间轴下留一篇总览**（不建目录）；
2. phase3（6–12 岁）下 → **保留两个文件**（6–9 与 9–12 分开）。

## 范围

### 新建

| 文件 | 来源 |
| --- | --- |
| `growthtree/timeline/fitness-overview.md` | 旧 `fitness/index.md` 全部 + `fitness/weekly-rhythm.md` 的跨阶段部分 + `fitness/checkpoints.md` 的跨阶段部分 |
| `growthtree/timeline/phase3/fitness-6-9.md` | 旧 `fitness/phase-6-9.md` + 本阶段周模板 + 本阶段检核表 |
| `growthtree/timeline/phase3/fitness-9-12.md` | 旧 `fitness/phase-9-12.md` + 本阶段周模板 + 本阶段检核表 |
| `growthtree/timeline/phase4/_category_.json` | 新建第四阶段目录（position 2.4） |
| `growthtree/timeline/phase4/index.md` | 新建，落地页（不变量 3 要求） |
| `growthtree/timeline/phase4/fitness-12-15.md` | 旧 `fitness/phase-12-15.md` + 本阶段周模板 + 本阶段检核表 |
| `growthtree/timeline/phase5/_category_.json` | 新建第五阶段目录（position 2.5） |
| `growthtree/timeline/phase5/index.md` | 新建，落地页（不变量 3 要求） |
| `growthtree/timeline/phase5/fitness-15-18.md` | 旧 `fitness/phase-15-18.md` + 本阶段周模板 + 本阶段检核表 |

### 移除（移出站点，非销毁）

`docs/growthtree/timeline/fitness/` 的 8 个文件（7 篇 md + `_category_.json`）
整体移动到 `.workbuddy/retired/timeline-fitness-20260923/`。`.workbuddy/` 不入库，
所以对站点而言该目录已不存在；保留副本是为了本轮可回溯，人可随时要求彻底清除。

### 改写的外部引用（8 处，逐条断言命中唯一）

- `growthtree/timeline/index.md`：底部链接清单由 1 条改为 4 条（各阶段 + 总览）
- `growthtree/classification/fitness/index.md`：2 处
- `growthtree/classification/fitness/physical-literacy.md`、`parents-and-school.md`、
  `muay-thai.md`、`injury-prevention.md`：各 1 处

### 顺带修正（口径，1 处）

`growthtree/timeline/index.md` 原写「9–11 小时」，与已统一的睡眠正本（6–12 岁 9–12 小时）
不一致，改为「9–12 小时」。这是 §10-15 点名要求不许再出现的跨篇矛盾，
且改动文件已在本次范围内，故一并修正并在此申报。

## 非目标

1. **不改 `classification/fitness/` 的 9 篇内容**，只改它们指向 timeline 的链接。
2. **不改各阶段正文的实质内容**。除搬运外，只做三类调整：章节号顺延、链接改指向、
   把改写时丢掉的引号与加粗补回（见校核）。
3. **不处理既有目录的既有违规**：phase1/phase2/phase3 缺 `index.md`（不变量 3）、
   `timeline/index.md` 无 front matter 且有约 39 处 `「」`（§7）。按 §10-9/13 的既定处置，
   另开变更统一，不在本轮顺手改。
4. **不做运动内容的新增或删减**。原四份独立评审的结论与处置不在本轮重开。

## 验收标准

| # | 标准 | 判定方式 |
| --- | --- | --- |
| A | 旧目录每一行内容都能在新位置找到 | `gf2-coverage.js` 覆盖审计，未覆盖行逐条人眼确认为「有意改写」 |
| B | 新位置无 `「」`、无表格内加粗、无裸 `<>`、front matter 五键齐 | `an-compliance.js`（timeline 根 / phase3 / phase4 / phase5 / classification/fitness 各跑一次） |
| C | 全站链接与锚点无失效 | `check-doc-links.js docs` 0 问题；`rn-verify.js` 0 失败 |
| D | 新文件里的链接形态均为合法 `](...)` | 全部链接打印人工过目，无非法形态 |
| E | 构建成功且新页面进 sitemap | 日志含 `[SUCCESS] Generated static files` + `build/sitemap.xml` 存在 + 新 URL 在其中 |

## 影响面（对照不变量清单）

| 不变量 | 是否触碰 | 说明 |
| --- | --- | --- |
| 1 四个板块目录名 | 否 | 只动 `growthtree/` 内部 |
| 3 每个 docs 目录有 `_category_.json` 与 `index.md` | **新建目录遵守** | phase4/phase5 补齐 `index.md`；phase1–3 的既有缺口不在本轮处理 |
| 4 排序只用 `sidebar_position`，不用数字前缀 | 否 | 目录名 `phase4`/`phase5` 沿用既有形式 |
| 5 front matter 键位 | 否 | 新文件均按 `sidebar_position/title/description/tags/keywords` 写 |
| 10 产物不手工编辑 | 否 | 只处理 `docs/` |
| 11 内链不带结尾斜杠 | 否 | 断言 7 五处均 0 处 |
| 12 MDX 不炸 | 否 | 断言 6 五处均 0 处 |

## 风险与回滚

**风险承重页**（按 §10-16 的新口径申报，覆盖三类）：

- **可执行性**：`fitness-overview.md` 是新的单点——排课规则、特殊情况、检核用法三块都集中在这一篇，
  它写错或写漏，四个阶段同时失去共用的规则。这是本轮最该盯的一页。
- **心理分寸**：四份阶段检核表从「集中一处」改为「分散在各阶段页」，检核表紧邻儿童正文出现，
  可能重新读成「晋级闸门」。处置：每张表前统一保留一句宽心话（体检表不是门槛），
  并统一指向总览的用法一节。
- **医学红线**：拆分过程中，红灯清单本体留在 `classification/fitness/injury-prevention.md` 未动，
  各阶段页只保留本阶段特有的红线。这一层未改写，风险主要在链接是否指得准（已由 A/C/D 覆盖）。

**回滚**：旧目录整体保留在 `.workbuddy/retired/timeline-fitness-20260923/`，
把该目录移回 `docs/growthtree/timeline/fitness/`、并把 8 处外部引用反向改回即可。
新文件为新增，删除即回滚。

## 待裁决

1. `.workbuddy/retired/timeline-fitness-20260923/` 的副本是否要彻底清除（当前只是移出站点）。
2. phase1/phase2/phase3 是否补 `index.md` 以统一满足不变量 3。
3. `timeline/index.md` 的约 39 处 `「」` 与缺失的 front matter 是否单开一轮处理。

## 收尾

- 更新 `PROJECT.md` §10-15（改写成新结构）并新增两条：phase1–3 缺 `index.md`；
  `timeline/index.md` 的 `「」` 与无 front matter。
- `DECISIONS.md` 落一行。
- 变更目录保留 `CHANGE.md` 与校核产物（`gf2-*.txt`），不删。

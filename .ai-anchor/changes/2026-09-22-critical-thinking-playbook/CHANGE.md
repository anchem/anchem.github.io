# 变更卡：为「思维」目录新增一篇《批判性思维实战手册》

- **变更编号**：`2026-09-22-critical-thinking-playbook`
- **日期**：2026-09-22
- **车道**：快车道 —— 本次只做「既有目录内新增一篇长文 + 两处索引补齐」，不触碰不变量清单任何一条，
  影响面限于 3 个内容文件，最坏情况可整文件回滚。提示词里已由人给出完整结构与内容要求，
  等效于**已定稿的变更卡**，故跳过第②步「共创」。

## 意图

在 `docs/selfdevelop/cognition/thinking/` 下新增一篇《批判性思维实战手册》，综合一份 28 本书的
书单（立锚时误写为 24，评审核对后已改正为 28），把它落成一套**可直接照做的工具与动作**，并把它挂进「思维」目录的导览。

**可验证**：新页面可被构建产出，且 `/docs/selfdevelop/cognition/thinking/critical-thinking-playbook`
出现在 `build/sitemap.xml`；`docs/selfdevelop/cognition/thinking/index.md` 里能点到它。

## 范围

- 新增：`docs/selfdevelop/cognition/thinking/critical-thinking-playbook.md`
- 修改：`docs/selfdevelop/cognition/thinking/index.md`（导览加一行）
- 修改：`docs/selfdevelop/cognition/thinking/criticalthinking.md`（末尾加一条指向手册的链接）
- 归档：`.ai-anchor/changes/2026-09-22-critical-thinking-playbook/`（CHANGE / REVIEW / REPLY）

## 非目标

- 不做：不新建任何目录（新建目录须请示人），因此手册以单篇长文承载，不拆成多章一套。
- 不做：不改 `docs/selfdevelop/cognition/index.md` 与 `docs/selfdevelop/ability/decisionmaking/*`
  ——它们的文案与结构本次不动，只在手册中链过去。
- 不做：不引入任何图片、组件或 `src/` 下的改动。
- 不做：不建 `_category_.json` 相关调整（目录已存在且配置齐全）。

## 验收标准

| # | 验收项 | 怎么验（命令 / 动作） | 通过标准 |
| --- | --- | --- | --- |
| 1 | 站内链接与锚点全部命中 | `node .workbuddy/check-doc-links.js docs` | 报出的问题数为 0（基线 0 问题） |
| 2 | 文风体检通过 | `node .workbuddy/check-style-one.js <新文件>` | 无非行首加粗、无正文 ASCII 直引号 |
| 3 | 结构合规 | `validate.py check --root docs/selfdevelop` | 新文件无 front matter 缺失、H1 唯一、非空壳 |
| 4 | 页面被构建产出 | 在 `build/sitemap.xml` 里查目标路径 | 路径存在 |
| 5 | 索引可达 | 人点开「思维」导览 | 能点到手册 |

## 影响面

逐条对照 `PROJECT.md` 第五节「不变量清单」：

| 不变量 # | 本次是否触碰 | 说明 |
| --- | --- | --- |
| 1 四个板块目录名 | 否 | 未动任何目录名 |
| 2 站点名 / URL / CNAME | 否 | 未动 |
| 3 每目录有 `_category_.json` 与 `index.md` | 否（是**被遵守**） | 只补 `index.md` 正文，未新增目录 |
| 4 排序只用 `sidebar_position` | 否 | 新文件用 `sidebar_position: 3`，目录内 1/2/3/5 无冲突 |
| 5 docs front matter 键位 | 否 | 用 `sidebar_position` / `title` / `tags` / `description` / `keywords` |
| 6 随笔 front matter 五键 | 否 | 未动 blog |
| 7 随笔内链写绝对路径 | 否 | 未动 blog |
| 8 色令牌 | 否 | 未动 CSS |
| 9 天空层 | 否 | 未动 |
| 10 产物目录 | 否 | 未动 `build/` |
| 11 内链不带结尾斜杠 | 是（**遵守**） | 全部内链不带结尾斜杠 |
| 12 MDX 转义 | 是（**遵守**） | 正文不出现裸 `<` `>`；表格内 `|` 转义 |

结论：**不触碰任何不变量** → 快车道。

## 风险与回滚

- 最坏会怎样：新文引用的书名 / 作者 / 观点有误，成为一篇看起来可信但站不住的材料。
  —— 已对 7 本不确定的书名做过公开检索核对（作者与出版社），并在文中单列去重说明。
- 最坏会怎样：改了 `criticalthinking.md` 这一已发布页面，动到既有口径。
  —— 本次只在其末尾**追加**一条链接，不删改任何原有句子。
- 怎么退回去：`git checkout -- <文件>`；新增文件直接删除即可（未改 URL、未动目录）。
- 回滚会不会丢内容：不会，本次无删除动作。

## 待裁决

| # | 选项 | 代价 | 我的倾向 |
| --- | --- | --- | --- |
| 1 | A：单篇长文放 `thinking/` ｜ B：拆成目录 `thinking/critical-thinking/` 下 5 至 6 章 | A 首屏很长，靠 TOC 导航；B 结构更清爽，但**新建目录须人批准**，且要同步 `_category_.json` 与 `index.md` | A（本次先按 A 交付；若想拆章，另开一次「结构变更」变更卡） |
| 2 | A：名录类书目（如《一读就上瘾的逻辑学》《思维的陷阱》）按主题采信 ｜ B：完全不用它们 | A 覆盖面全，但个别书的具体表述未经核实；B 更稳，但不满足「逐一梳理」 | A，并在附录 A 里标明哪几本只按主题采信 |

## 收尾

- `PROJECT.md` §10：本次若确认「单篇长文不宜再堆长」这一观察成立，则追加一条风险行；
  否则不动。§11 无。
- `DECISIONS.md`：追加一行。

## 过闸检查（进入第②步前必须全部为是）

```text
[x] 验收标准可以被判定真假
[x] 非目标不是空的（至少两条）
[x] 影响面已逐条对照不变量清单
[x] 待裁决项给了选项与代价
[x] 车道已判定并写明
```

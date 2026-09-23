# 变更卡：为长期徒手健身建立 `health/sports/fitnessplan` 分章手册

- **变更编号**：`2026-09-23-fitness-plan`
- **日期**：2026-09-23
- **车道**：**标准道** —— 判定依据：本次不动第五格「不变量清单」中的任何一条；但涉及「新增 1 个目录」与「一次改动 15 个文件（超过 5 个）」，两者都命中 §9「必须请示人」，已获会话内授权（见下表）。

## 授权记录（§10 第 10 条：请示项当场落纸，不事后补记）

| 时点 | 请示项 | 人的裁决 |
| --- | --- | --- |
| 2026-09-23 会话中 | 新增目录 `docs/selfdevelop/health/sports/fitnessplan/` | **授权**：走「新建目录分章」，不做单篇长文 |
| 2026-09-23 会话中 | 一次变更新增 13 个内容文件（超 §9 的 5 个阈值） | **授权** |
| 2026-09-23 会话中 | 是否顺带补齐既有桩页 `sports/pushup.md`、`sports/runningexercise.md` | **不授权**：本次只新增，不动现有页 |

## 意图

产出一份可**分章独立取用**的训练手册，让「工作日只有 17:30–18:30 一小时、徒手为主、拒绝补剂、怕受伤、想练到老」的读者能照着排出每周训练、看懂每个动作的台阶、并知道什么时候该进级、什么时候必须停。

可验证形式：`docs/selfdevelop/health/sports/fitnessplan/` 下每一篇都能从 `index.md` 点到；全站链接体检 0 问题；9 条文风断言全通过。

## 范围

**新增（13 个文件：12 篇 md ＋ 1 个 `_category_.json`）**

- `docs/selfdevelop/health/sports/fitnessplan/_category_.json`
- `docs/selfdevelop/health/sports/fitnessplan/index.md`（导览页）
- `.../diagnosis.md`（现状盘点与目标取舍）
- `.../principles.md`（训练总纲）
- `.../lower-body.md`（下肢）
- `.../upper-body.md`（上肢）
- `.../core.md`（核心）
- `.../feet-grip.md`（足踝与握力）
- `.../functional.md`（功能性与运动表现）
- `.../injury-prevention.md`（伤病预防）
- `.../weekly-plan.md`（周计划与日程）
- `.../recovery.md`（睡眠与饮食）
- `.../roadmap.md`（路线图与常见问题）

**修改（2 个文件，仅追加链接，不动正文口径）**

- `docs/selfdevelop/health/sports/index.md`
- `docs/selfdevelop/health/index.md`

**锚点（本次变更的过程记录）**

- `.ai-anchor/changes/2026-09-23-fitness-plan/{CHANGE,REVIEW-coach,REVIEW-rehab,REVIEW-editor,REPLY}.md`
- `.ai-anchor/PROJECT.md` §10 追加一行；`.ai-anchor/DECISIONS.md` 追加一行

## 非目标

- **不做**：修改 `sports/pushup.md` 与 `sports/runningexercise.md` 的任何内容（人已明确不授权，与本次大量重叠也不动）。
- **不做**：改 `docusaurus.config.js`、`sidebars.js`、`package.json`、`src/**`、`static/**`。
- **不做**：在 `fitnessplan/` 之下再建子目录，或动 `selfdevelop/` 以上任何结构。
- **不做**：发布任何评审记录、草稿或过程材料到 `docs/`（§9 红线 3）。
- **不做**：改动任何既有文章的正文口径、不编辑 `build/` 与 `build_old*/`。

## 验收标准

| # | 验收项 | 怎么验（命令 / 动作） | 通过标准 |
| --- | --- | --- | --- |
| 1 | 新目录结构合规 | `node .workbuddy/an-compliance.js docs/selfdevelop/health/sports/fitnessplan` | 断言 9 通过（`_category_.json` + 非空 `index.md`） |
| 2 | 9 条文风与标点断言全过 | 同上 | 退出码 0，输出「合规」 |
| 3 | front matter 五键齐全 | 同 #1 的断言 8 | 键位齐全（`sidebar_position` / `title` / `description` / `tags` / `keywords`） |
| 4 | 排序唯一连续 | 脚本读 12 篇的 `sidebar_position` | 取值 1..12，无重复无空缺 |
| 5 | 站内链接无失效 | `node .workbuddy/check-doc-links.js docs` | 问题 0 处（基线 238 篇） |
| 6 | 无非法链接形态 | 把全部 `](...)` 打印出来人工过目 | 无 `《x](y.md)` 这类方括号误写 |
| 7 | 三类角色独立评审各出一份评审单 | 子代理独立上下文，只读 `PROJECT.md` + 本卡 + 产物 | `REVIEW-coach.md` / `REVIEW-rehab.md` / `REVIEW-editor.md` 三份齐 |
| 8 | 阻断项全部处置 | `REPLY.md` 逐条回应 | 每条标注「已改（位置）」或「驳回（理由 + 证据）」 |
| 9 | 新页 URL 进 sitemap | 构建后查 `build/sitemap.xml` | 12 个 URL 全部命中 |
| 10 | 不变量 12 条未被破坏 | 逐条核验 | 全部「已核验」 |

> 验收 5、6 的口径分别来自 `PROJECT.md` §6.2 与 §6.2 的「0 问题的边界」一段；验收 2 的口径来自 `.workbuddy/an-compliance.js` 头部注释（脚本即口径的唯一出处）。

## 影响面

| 不变量 # | 本次是否触碰 | 说明 |
| --- | --- | --- |
| 1 | 否 | 四个板块目录名未动 |
| 2 | 否 | 站点名 / URL / `CNAME` 未动 |
| 3 | 否（被遵守） | 新目录有 `_category_.json`，`index.md` 是导览页不是空壳 |
| 4 | 否（被遵守） | 只用 `sidebar_position` 排序；目录名 `fitnessplan` 与 label「健身计划」均无数字前缀 |
| 5 | 否（被遵守） | 新文件 front matter 五键齐全，键位与既有长文一致 |
| 6 | 不适用 | 未改 blog |
| 7 | 不适用 | 未改 blog |
| 8 | 否 | 未碰 `custom.css` |
| 9 | 否 | 未碰天空层 |
| 10 | 否 | 未编辑任何产物目录 |
| 11 | 否（被遵守） | 内链一律相对 `.md` 路径、不带结尾斜杠 |
| 12 | 否（被遵守） | 正文无裸 `<` `>`；表格内不写 `\|` 以外的竖线；admonition 不插在表格中间 |

结论：**不触碰任何不变量** → 走标准道（① ② ③ ④ ⑤）。

## 风险与回滚

- **最坏会怎样**：新目录整体写偏（内容不专业、建议有伤病风险）；或新增 12 篇拉高首页书架统计、与既有 `pushup.md` / `runningexercise.md` 形成口径重叠。
- **怎么退回去**：`git checkout -- docs/selfdevelop/health/` 还原两篇导览页，再删除整个 `fitnessplan/` 目录即可；本次没有对任何既有正文做实质性改动，回滚不丢内容。
- **风险缓解**：`diagnosis.md`、`injury-prevention.md` 是本次的**风险承重页**，所有高风险动作（俄挺、单臂引体、人旗）都必须在文内显式设门槛并声明「以年为单位」；伤病相关内容一律不给出诊断结论，只给「什么时候停」。

## 待裁决

| # | 问题 | 选项 A | 选项 B | 我的倾向 |
| --- | --- | --- | --- | --- |
| 1 | `fitnessplan/_category_.json` 的 `collapsed` 取值：§7 明文要求第 2 层及以下为 `true`，但同级目录现状多为 `false`（§10 第 9 条待办） | 写 `true`（合 §7、不合现状，与上一轮 `criticalthinking/` 处置一致） | 写 `false`（合现状、违 §7） | **A**，并把「同级不一致」继续留在 §10 第 9 条另开变更统一 |
| 2 | 是否在本轮就引入「弹力带」这一件新器材 | 引入，并在文中说明它是**唯一的伤病预防投入** | 完全不引入，只用自重 + 已有器械 | **A**，但必须写明「不买也能练，代价是肩部养护选项变少」 |
| 3 | 目标冲突（腿围 vs 相对力量）的处置口径 | 主线定为相对力量，腿围按「低频高质、单侧为主」自然增长 | 主线定为腿围，暂缓单臂引体与俄挺 | **A**，理由写进 `diagnosis.md` |

> 本栏只有人能填。上表是 AI 起草的倾向，**须由人确认后才算成立**；若人未表态，按「我的倾向」执行并在 `REPLY.md` 中标注为「未经人确认的默认取值」。

## 收尾

- 更新 `PROJECT.md` §10：追加一行「`health/sports/fitnessplan/` 已建立，13 篇；两篇既有桩页 `pushup.md` / `runningexercise.md` 仍未写实」。
- 在 `DECISIONS.md` 的「### 2026-09」下追加一行。
- 若三类评审的隔离强度仍为「换档位、不换厂商」，按既有惯例写入 `DECISIONS.md` 的「不许美化」备注。

## 过闸检查（进入第②步前必须全部为是）

```text
[x] 验收标准可以被判定真假（10 条，其中 8 条能跑出命令结果）
[x] 非目标不是空的（5 条）
[x] 影响面已逐条对照不变量清单（12 条）
[x] 待裁决项给了选项与代价（3 项）
[x] 车道已判定并写明（标准道）
```

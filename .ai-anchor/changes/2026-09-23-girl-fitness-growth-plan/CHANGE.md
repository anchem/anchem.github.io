# 变更卡：为 6 岁女孩建立「运动与体能」方法论 ＋「分龄运动计划」两套目录

- **变更编号**：`2026-09-23-girl-fitness-growth-plan`
- **日期**：2026-09-23
- **车道**：**标准道** —— 判定依据：本次不动第五格「不变量清单」中的任何一条；但涉及「新增 2 个目录」与「一次改动 16 篇以上新文件（超过 §9 的 5 个阈值）」，两者都命中 §9「必须请示人」，已获会话内授权（见下表）。

## 授权记录（§10 第 10 条：请示项当场落纸，不事后补记）

| 时点 | 请示项 | 人的裁决 |
| --- | --- | --- |
| 2026-09-23 会话中 | 这份跨 6–18 岁的计划放在 growthtree 的哪个位置 | **授权**：**方法论放 `classification/` 下，分龄阶段计划放 `timeline/` 下，两侧做好索引关联**（否决了「单篇放进 phase3」「新建 growthtree 第三轴」两个备选） |
| 2026-09-23 会话中 | 一次变更新增 16 篇 md ＋ 2 个 `_category_.json`（超 §9 的 5 个阈值） | **授权**：由「合理拆分章节、提高可读性」这一要求所含 |
| 2026-09-23 会话中 | 孩子的格斗项目按哪个口径写（站内为「泰拳」，本轮指令为「拳击」） | **裁决**：**统一写「泰拳」** |

## 意图

给一个 6 岁女孩一份可以跟着她长到 18 岁的运动方案，让父母读完能做到三件事：

1. **知道每个年龄段该练什么、以及为什么是这些**——不是项目清单，是判断依据；
2. **知道在家、在学校两个场景当天怎么落地**——包括父母自己该做什么、不该做什么；
3. **知道什么时候该停、什么时候该看医生**——伤痛与恢复不靠感觉。

可验证形式：两个目录下每一篇都能从各自的 `index.md` 点到，两侧互链；全站链接体检 0 问题；文风与标点 9 条断言全过。

## 范围

**新增（18 个文件：16 篇 md ＋ 2 个 `_category_.json`）**

方法论侧 —— `docs/growthtree/classification/fitness/`（label「运动与体能」）

- `_category_.json`
- `index.md`（导览页：这套方法论解决什么问题，以及怎么和分龄计划配合）
- `physical-literacy.md`（身体素养：为什么先练「会动」而不是「练项目」；发展窗口期）
- `fitness-components.md`（身体素质的五个成分，以及每个成分在各年龄段的做法）
- `posture-and-habits.md`（体态、足弓、视力与日常习惯）
- `injury-prevention.md`（伤痛预防与恢复：疼痛分级、负荷管理、该停的红线）
- `fuel-and-sleep.md`（吃与睡，含女孩特有的营养问题）
- `mind-and-social.md`（自信、自立、自强、自尊，以及运动里的社会化）
- `muay-thai.md`（与泰拳怎么结合、结合到什么程度、如果不练了怎么办）
- `parents-and-school.md`（父母与学校各自做什么）

计划侧 —— `docs/growthtree/timeline/fitness/`（label「分龄运动计划」）

- `_category_.json`
- `index.md`（导览页：一页速览 ＋ 四阶段的衔接逻辑）
- `phase-6-9.md`
- `phase-9-12.md`
- `phase-12-15.md`
- `phase-15-18.md`
- `weekly-rhythm.md`（一周怎么排：家庭、学校、泰拳三份时间预算的合并）
- `checkpoints.md`（各阶段可观察的检核点与记录方式）

**修改（2 个文件，仅追加链接与一小句衔接，不动正文既有口径）**

- `docs/growthtree/classification/index.md`
- `docs/growthtree/timeline/index.md`

**锚点（本次变更的过程记录）**

- `.ai-anchor/changes/2026-09-23-girl-fitness-growth-plan/{CHANGE,REVIEW-expert,REVIEW-teacher,REVIEW-rehab,REVIEW-editor,REPLY}.md`
- `.ai-anchor/PROJECT.md` §10 追加一行；`.ai-anchor/DECISIONS.md` 追加一行

## 非目标

- **不做**：改 `growthtree/index.md` 里「主要内容包含以下 2 部分」这句表述（本次没有新增第三条轴）。
- **不做**：动 `docs/growthtree/timeline/phase1|phase2|phase3/` 下任何既有文件的正文（只允许在 `timeline/index.md` 里追加一行链接）。
- **不做**：改 `docusaurus.config.js`、`sidebars.js`、`package.json`、`src/**`、`static/**`、`CNAME`。
- **不做**：在 `classification/fitness/` 或 `timeline/fitness/` 之下再建子目录。
- **不做**：发布任何评审记录、草稿或过程材料到 `docs/`（§9 红线 3）。
- **不做**：编辑 `build/`、`build_old*/`、`node_modules/`。
- **不做**：为本次内容引入任何图片、视频或外链资源（保持纯文字，避免外链失效与版权问题）。

## 验收标准

| # | 验收项 | 怎么验（命令 / 动作） | 通过标准 |
| --- | --- | --- | --- |
| 1 | 两个新目录结构合规 | `node .workbuddy/an-compliance.js <目录>` 各跑一次 | 断言 9 通过（各有 `_category_.json` ＋ 非空 `index.md`） |
| 2 | 文风与标点 9 条断言全过 | 同上 | 两个目录均退出码 0，输出「合规」 |
| 3 | front matter 五键齐全 | 同 #1 的断言 8 | 键位齐全（`sidebar_position` / `title` / `description` / `tags` / `keywords`） |
| 4 | 排序唯一连续 | `node .workbuddy/gf-struct.js`（本轮新建，口径写死在脚本头部） | 两个目录各自取值 1..N，无重复无空缺 |
| 5 | 站内链接无失效 | `node .workbuddy/check-doc-links.js docs` | 问题 0 处（基线 250 篇） |
| 6 | 无非法链接形态 | 把两个目录的全部 `](...)` 打印出来人工过目 | 无 `《x](y.md)` 这类方括号误写 |
| 7 | 两侧互链真的连得上 | 从 `classification/index.md` 与 `timeline/index.md` 各点一次到对方 `index.md` | 两条路径均命中且方向正确 |
| 8 | 四类角色独立评审各出一份评审单 | 子代理独立上下文，只读 `PROJECT.md` ＋ 本卡 ＋ 产物 | `REVIEW-expert` / `REVIEW-teacher` / `REVIEW-rehab` / `REVIEW-editor` 四份齐 |
| 9 | 阻断项全部处置 | `REPLY.md` 逐条回应 | 每条标注「已改（位置）」或「驳回（理由 ＋ 证据）」 |
| 10 | 不变量 12 条未被破坏 | 逐条核验 | 全部「已核验」 |

> 验收 5、6 的口径分别来自 `PROJECT.md` §6.2 与 §6.2「0 问题的边界」一段；验收 2 的口径来自 `.workbuddy/an-compliance.js` 头部注释（脚本即口径的唯一出处）。

## 影响面

| 不变量 # | 本次是否触碰 | 说明 |
| --- | --- | --- |
| 1 | 否 | 四个板块目录名未动 |
| 2 | 否 | 站点名 / URL / `CNAME` 未动 |
| 3 | 否（被遵守） | 两个新目录都有 `_category_.json`，`index.md` 是导览页不是空壳 |
| 4 | 否（被遵守） | 只用 `sidebar_position` 排序；目录名 `fitness` 与两个 label 均无数字前缀 |
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

- **最坏会怎样**：运动方案对儿童而言，写偏的代价是真实的——过度训练、错误动作、把「还不该练的」提前搬给孩子、或者把心理部分写成励志口号。此外，站内已有一份成人徒手健身手册（`selfdevelop/health/sports/fitnessplan/`），两份内容存在读者混淆的可能。
- **怎么退回去**：删除 `docs/growthtree/classification/fitness/` 与 `docs/growthtree/timeline/fitness/` 两个目录，再把两份 `index.md` 的追加行还原即可；本次不对任何既有正文做实质性改动，回滚不丢内容。
- **风险缓解**：`injury-prevention.md`、`phase-12-15.md`、`checkpoints.md` 是本次的**风险承重页**，三处一律遵守两条硬约定——① 不给诊断结论，只给「什么时候停、什么时候看医生」；② 所有负荷与门槛都写成区间与相对量，不写成必须达成的成绩。心理相关的内容只写可观察的行为，不写「培养出自信」这类无法验收的目标。
- **与既有手册的边界**：`fitnessplan/` 面向成年人（作者自己）的力量训练处方；本次面向 6–18 岁的儿童与青少年，**两者的剂量与门槛不可互抄**，本次在两处导览页各写一句区分。

## 待裁决

| # | 问题 | 选项 A | 选项 B | 我的倾向 |
| --- | --- | --- | --- | --- |
| 1 | `fitness/_category_.json` 的 `collapsed` 取值（§7 要求第 2 层及以下为 `true`，同级现状多为 `false`） | 写 `true`（合 §7、不合现状） | 写 `false`（合现状、违 §7） | **A**，同级不一致继续留在 §10 第 9 条另开变更统一 |
| 2 | 分龄计划按 4 段（6–9 / 9–12 / 12–15 / 15–18）还是按站点既有的 5 阶段分 | 4 段，与「学龄期 / 青春期前 / 青春期」的运动发育窗口对齐 | 5 段，与 `timeline/` 既有五个 phase 完全对齐 | **A**，理由是运动能力的窗口期与心理社会分期本就不完全重合，另在 `index.md` 写明两者的对应关系 |
| 3 | 6–9 岁这一段是否写「体质健康测试」相关的应试内容 | 写，但只写「它测什么、别为它加练」 | 完全不写 | **A**，因为它客观上占用了孩子的运动时间，回避它反而不实用 |

> 本栏只有人能填。上表是 AI 起草的倾向，**须由人确认后才算成立**；若人未表态，按「我的倾向」执行并在 `REPLY.md` 中标注为「未经人确认的默认取值」。

## 收尾

- 更新 `PROJECT.md` §10：追加一行「`growthtree/classification/fitness/` 与 `growthtree/timeline/fitness/` 已建立，16 篇」。
- 在 `DECISIONS.md` 的「### 2026-09」下追加一行。
- 若四类评审的隔离强度仍为「换档位、不换厂商」，按既有惯例写入 `DECISIONS.md` 的「不许美化」备注。

## 过闸检查（进入第②步前必须全部为是）

```text
[x] 验收标准可以被判定真假（10 条，其中 7 条能跑出命令结果）
[x] 非目标不是空的（8 条）
[x] 影响面已逐条对照不变量清单（12 条）
[x] 待裁决项给了选项与代价（3 项）
[x] 车道已判定并写明（标准道）
```

# 变更卡：阶段目录落地页补齐（phase1–phase3）

- 日期：2026-09-23
- 类型：结构补齐（新建文件 × 3，必要的位置顺延 × 5）
- 执行者：助手

## 一、会话内授权（§9 必请示项）

人在会话中下了三条指令，逐条对应：

1. 「补齐 phase1-3 目录下的 index.md」——授权新建 3 个文件；
2. 「副本可以删除」——授权删除 `.workbuddy/retired/timeline-fitness-20260923/`（助手自留的可回溯副本，从未入库）；
3. 「不修复」——`timeline/index.md` 的 `「」` 与 front matter 缺陷本轮不动，维持 §10-18 的登记状态。

本次涉及 8 个文件（新建 3 + 修改 5），越过「一次涉及 5 个以上文件」的请示线；按令执行，抬头如实记时点：2026-09-23 15:57。

## 二、动机

`PROJECT.md` §10-17：`phase1` / `phase2` / `phase3` 缺 `index.md`，与不变量 3（每个 docs 目录必须有 `_category_.json` 与 `index.md`）不符；且同日新建的 `phase4` / `phase5` 已补齐，同一层级出现两种行为——点目录名，phase4/5 进落地页，phase1–3 只展开。

本变更即该条给出的第一条处置方案。

## 三、非目标

- 不动 `timeline/index.md`（§10-18，人已裁决不修）；
- 不动 `phase1` / `phase2` / `phase3` 既有文章的 front matter 与引号（既有缺口，见本轮新增的 §10-19）；
- 不为 `classification/` 侧目录做同类补齐（该侧现状另有登记，不在本轮）。

## 四、改动清单

新建三页：

- `docs/growthtree/timeline/phase1/index.md`
- `docs/growthtree/timeline/phase2/index.md`
- `docs/growthtree/timeline/phase3/index.md`

必要的位置顺延（`sidebar_position` 在同一目录内须唯一且连续，落地页占 1 位）：

| 文件 | 原值 | 新值 |
| --- | --- | --- |
| `phase1/18th-months-examination.md` | 1 | 2 |
| `phase2/promotio-plan.md` | 1 | 2 |
| `phase3/study-and-live-abroad-planning.md` | 1 | 2 |
| `phase3/fitness-6-9.md` | 2 | 3 |
| `phase3/fitness-9-12.md` | 3 | 4 |

## 五、落地页的写法

与 `phase4` / `phase5` 的两页同构，不复写 `timeline/index.md`：

养育重心一行 → 指向 `../index.md` 对应小节（整体功课）→ 本阶段运动底色（指向 `classification/fitness/index.md`）→ 本目录文件清单。

## 六、风险

| 风险 | 判断 |
| --- | --- |
| 落地页与 `timeline/index.md` 复写、日后口径分叉 | 只写一句话重心加指针，具体内容仍以 `timeline/index.md` 为正本 |
| 位置顺延改动既有文件 | 只改 `sidebar_position` 一键，不改正文；旧值已记录在上表 |
| 新增 URL 是否会断链 | 目录 URL（`.../timeline/phase1` 等）由落地页承载，此前为 404 或无承载，属净增，不断链 |

## 七、校核方式

纯结构补齐，无内容论断，不启用独立多角色评审；以脚本断言、链接体检与构建为准。判定标准：

- `an-compliance.js` 对三个目录的断言 9 转 PASS，且新建三页自身不引入新 FAIL；
- `check-doc-links.js docs` 与 `rn-verify.js` 无新增失败；
- 构建出现 `[SUCCESS] Generated static files`，`build/sitemap.xml` 含三个目录 URL。

## 八、校核结果（执行后填写）

| 项 | 结果 |
| --- | --- |
| 结构断言 `gf3-struct.js` | **8 / 8 通过**（含五个阶段目录位次唯一且连续 1..N、index.md 位次为 1、三页五键齐全、11 条内链全解析） |
| 断言体检（`an-compliance.js`） | `phase1` 8/9、`phase2` 8/9、`phase3` 5/9、`timeline` 根目录（既有项）；**断言 9 对三者全部转 PASS**，本轮新建三页自身 0 条 FAIL |
| 残留 FAIL 归属 | 全部落在既有文件上，已登记为 §10 第 19 条：`phase1` / `phase2` 两篇缺前置三键并因 CRLF 被断言 8 误报；`phase3/study-and-live-abroad-planning.md` 的 `「」`、表格内加粗、缺 `keywords`、块引用被断言 6 误判 |
| 链接体检 `check-doc-links.js docs` | 269 个文件，**问题 0 处**（上一轮 266） |
| 全库引用体检 `rn-verify.js` | **795 条链接、失败 0 条**（上一轮 784，净增 11 = 新建三页的内链） |
| 加粗渲染体检 | **297 篇扫描，0 命中** |
| 构建 | `[SUCCESS] Generated static files` ＋ `BUILD_EXIT=0` ＋ 无 broken link 警告；`build/sitemap.xml` 存在 |
| sitemap 核对 | 三个新 URL 全部在列（`/docs/growthtree/timeline/phase1`、`/phase2`、`/phase3`），旧 `timeline/fitness/*` 残留 **0** 条 |
| 产物差异对账 | 473 → 479 html（**+6**）：timeline 目录 +3（`phase1.html`、`phase2.html`、`phase3.html`）＋ 由此新增的三个 tag 聚合页（`docs/tags/婴幼儿期`、`学龄前`、`学龄期`）；反向确认 timeline 目录内**除这三页外无任何其它变化** |

## 九、执行中遇到的问题（如实记录）

1. **`an-compliance.js` 的断言 8 有 LF 盲区**：其正则写作 `^---\n`，只认 LF；两个既有文件是全篇 CRLF，被报成「无 front matter」。这是**工具缺陷，不是文件缺件**——本轮只登记不改（§10 第 19 条），我自己的 `gf3-struct.js` 已把正则改为容忍 `\r?\n`，否则它会把同样的假象再报一遍。
2. **一次被误判的删除失败**：删 `.workbuddy/retired/timeline-fitness-20260923/` 时，第一次调用返回 exit 1、输出与临时文件都没落地，看上去像被守卫拦了；第二次探测实测「目标在删除前就已不存在」——删除其实已生效，是 shell 在命令中途被终止。**教训：本机的长命令与递归删除一律以文件系统实测为准，退出码不可作判据**（与构建那条「只看 exit 0 会被骗」是同一个陷阱的另一面）。

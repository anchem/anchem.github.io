# 变更卡：回退 fitnessplan 的 MDX 动作动画

- 变更编号：`2026-09-24-fitness-animations-revert`
- 日期：2026-09-24
- 车道：**标准道** ——（判定依据：不触碰任何不变量；但涉及删除目录与批量改动 5 个以上文件，
  属 §9 请示项，六项均已在会话内由人逐项拍板，见下）
- 被回退的变更：[`../2026-09-24-fitness-animations/`](../2026-09-24-fitness-animations/CHANGE.md)

> **人维护人授权（会话内拍板，2026-09-24）**：人自行构建并预览后，判断「实际效果与预期相差较远」，
> 指示回退。三处判断题由人逐项裁决：

| # | 决策点 | 人的裁决 |
| --- | --- | --- |
| 1 | 动画源码去向（`ExerciseAnim/` 11 文件，git 未跟踪，删后不可回溯） | **彻底删除**（不做 `retired/` 副本） |
| 2 | 与动画无关的两处断链修复（`promotio-plan.md` → `promotion-plan.md`） | **保留** |
| 3 | `.ai-anchor/` 记录 | **只清动画条目 ＋ 另立回退归档**（通用教训保留） |

## 1. 意图（一句话）

把 `2026-09-24-fitness-animations` 引入的全部动画痕迹从站点清除，
并证明清除后**原有内容逐字节回到改动前**、页面结构未受损。

## 2. 范围

| 类别 | 对象 | 处理 |
| --- | --- | --- |
| 纯新增（删除） | `src/components/ExerciseAnim/`（11 文件）、`src/theme/MDXComponents.js` | 整目录／整文件删除 |
| 插在既有文件中（精准摘除） | `fitnessplan` 7 篇正文的 26 处 `<ExerciseAnim />` / `<ExerciseStrip />`；`src/css/custom.css` 两处 `--xd-*` 色令牌块 | 按锚点剔除，每处断言命中数 |
| 锚点（按性质分别处理） | `PROJECT.md`（清动画条目）、`DECISIONS.md`（保留原行＋追加回退行） | 依据 PROJECT.md 附则第一条 |
| 归档 | 原变更目录保留并加失效横幅；本目录新建 | 「完成不删」 |

## 3. 非目标

- 不做：不重做动画、不调整视觉方案、不动 `fitnessplan` 的任何**文字内容**（只摘标签）。
- 不做：不清理 `build/` 与 `build_old_fp/`（产物按 §10 第 10 条不手工编辑；见 §7 未闭环项）。
- 不做：不修 `diagnosis.md` 那处被改写成加粗的块引用（既存遗留，另开一轮）。
- 不做：不动 `an-compliance.js` 的断言 6 修复与 `punct-unify.js` 的跨行修复（通用工具修复，与动画无关）。

## 4. 验收标准与实测状态

| # | 验收项 | 怎么验 | 通过标准 | 实测 |
| --- | --- | --- | --- | --- |
| 1 | 8 个被改文件逐字节回到 HEAD | `git diff --exit-code -- docs/selfdevelop/health/sports/fitnessplan src/css/custom.css` | 无输出且 exit 0 | **exit=0** ✅ |
| 2 | 源码区零动画残留 | `rv-residual.cjs` 全库检索 | `ExerciseAnim`/`ExerciseStrip`/`--xd-`/`MDXComponents` 均 0 | **四项均 0** ✅ |
| 3 | 删除目标确已不存在 | `rv-delete.cjs` 逐个 `existsSync` 复核 | 两目标均不存在；`src/theme/` 只剩 `Root.js` | **通过** ✅ |
| 4 | 链接体检 | `node .workbuddy/check-doc-links.js docs` | 0 问题 | **269 文件 / 0 问题** ✅ |
| 5 | 加粗渲染体检 | `node .workbuddy/check-bold-render.js docs blog src` | 0 命中 | **297 篇 / 0 命中** ✅ |
| 6 | 文风断言（受害目录） | `node .workbuddy/an-compliance.js docs/selfdevelop/health/sports/fitnessplan` | 9/9 | **9/9 合规** ✅ |
| 7 | 文风断言（对照组） | `node .workbuddy/an-compliance.js` | 9/9 | **9/9 合规** ✅ |
| 8 | 引号普查 | `node .workbuddy/punct-unify.js docs blog` | 0 处待改 | **296 文件 / 0 待改** ✅ |
| 9 | src 语法与模块解析 | `node .workbuddy/fp-syntax.cjs` | 0 失败 | **fails=0 files=14**（25 − 11 = 14，完全对账）✅ |
| 10 | 全库引用体检 | `node .workbuddy/rn-verify.js` | 0 失败 | **795 链接 / 0 失败** ✅ |
| 11 | 生产构建 | `DOCUSAURUS_KEEP_SERVER_BUNDLE=true` + docusaurus build | `[SUCCESS]` 且 `sitemap.xml` 存在 | **助手侧未执行**（沙箱禁写 `node_modules/.cache`）；交人／CI，见 §7 |

> 证据落盘于本目录 `checks-01` 至 `checks-14`。第 1 项是本轮的核心判据：
> 它不依赖「我记得改过什么」，而是由 git 直接判定字节相同。

## 5. 影响面（逐条对照不变量清单）

| 不变量 # | 本次是否触碰 | 说明 |
| --- | --- | --- |
| 1 / 2 | 否 | 目录名、站点身份未动 |
| 3 | 否 | 未新增或删除任何 docs 目录；`fitnessplan/` 的 `_category_.json` 与 `index.md` 未动 |
| 4 / 5 / 6 / 7 | 否 | 未改排序、front matter、随笔键位与内链形态 |
| 8 | 是（复原） | 删除 `custom.css` 的 `--xd-*` 四支，**色令牌回到改动前的 1 处定义**，符合「只在 §1 定义」 |
| 9 / 11 / 12 | 否 | 天空层、内链斜杠、MDX 转义均未动 |
| 10 | 否（自查） | `build/`、`build_old_fp/` 未被手工编辑 |

**结论**：不触碰任何不变量 → 标准道。**唯一需登记的全局面**是 `src/theme/*` 的 swizzle 点（本次删除即撤销该点），
已按 §10 第 22 条「必须单开一行申报」执行。

## 6. 风险与回滚

- 最坏会怎样：摘除时多删了正文（例如连同标签前后的既有段落一起吃掉），造成**静默的内容损失**。
- 怎么退回去：① 本次摘除是「按锚点替换并断言行数」，若某个文件解析异常，脚本会**整个文件不写入**；
  ② 唯一的不可逆点是删除 `ExerciseAnim/`（git 未跟踪）——开工前已整体复制到 `.workbuddy/revert/backup/`
  并逐字节校验（12 文件一致），**该副本现在仍在**；
  ③ 若需完全回到本次变更之前，`git checkout -- <12 个文件路径>` 即可（改动全部是未提交的工作区改动）。
- 回滚会不会丢内容：**不会**——核心理由是本轮改动对既有文件「全部是插入」（150 增 4 删，4 删全在两个断链修复里），
  故摘除插入即等于还原。

## 7. 收尾

- `PROJECT.md`：§4 目录树删除 2 行；§4 依赖方向的 swizzle 警告改指 §10 第 22 条；
  §7 删除「正文动画组件」整行；§10 第 20 条删除；第 14 / 19 / 21 / 22 条改写。
- `DECISIONS.md`：追加 `fitness-animations-revert` 一行；在 `fitness-animations` 备注段加时效标注。
- 原变更归档 `2026-09-24-fitness-animations/`：**保留不删**，头部加失效横幅。

### 未闭环项（交给人与下一轮）

1. **`build/` 仍是含动画的旧产物**：实测 CSS chunk 有 `--xd-body`、JS chunk 有动作 id，
   479 个 html。**必须重新构建一次**才能让预览也干净。
   `build_old_fp/` 是本次动画构建之前的产物（同样 479 html、零动画痕迹），可作对照，但不是替代品。
2. **生产构建未在助手侧执行**：与上一轮同因（沙箱禁写 `node_modules/.cache`）。
   本轮**没有新增任何运行时代码**，构建风险比上一轮更低——回退后 `src/` 只剩 14 个原有文件的改动为零。
3. **一处被推翻的旧结论**：`PROJECT.md` §10 第 21 条原判「本机跑不了生产构建」，
   实际只是**助手侧**受限；人自行构建成功，该条已改写。

## 8. 过闸检查

```text
[x] 验收标准可以被判定真假（第 1 项由 git 判定，不受记忆影响）
[x] 非目标不是空的（四条）
[x] 影响面已逐条对照不变量清单
[x] 待裁决项给了选项与代价（三项，均已由人拍板）
[x] 车道已判定并写明（标准道）
```

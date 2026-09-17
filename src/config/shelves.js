/**
 * ============================================================================
 *  四大知识板块的单一事实来源
 *  ---------------------------------------------------------------------------
 *  首页 Hero 的入口胶囊、知识书架卡片、各区块标题的装饰色都从这里取数据，
 *  改一处即多处同步 —— 之前这份列表只写在 HomepageShelves 里，
 *  Hero 想加入口就得抄一遍，两处迟早会不一致。
 *
 *  【v4：一个板块 = 一支植物色族，而不是一个色值】
 *  v3 每个板块只有一个 accent，用途很窄（顶轨、圆点）。
 *  v4 把植物画成了内容面的颜色之后，一个板块需要「一整支」颜色：
 *  底色、次级块、强调、可承载文字的深档 —— 于是改成存**色族名**：
 *
 *      tint: 'clover'  →  组件自己拼出 var(--sand-tint-clover)
 *                                     var(--sand-tint-clover-soft)
 *                                     var(--sand-tint-clover-line)
 *                                     var(--sand-tint-clover-ink)
 *
 *  为什么存名字而不是四个色值：
 *    1. 四支色值必然浅深两套，抄进这里就有八份，改一处漏七处；
 *       拼成变量名则只有 custom.css §1 一份，两边主题各自解析；
 *    2. 组件代码里写的是「clover」，读起来就知道这个板块是四叶草那一支，
 *       比四个十六进制数更能表达设计意图。
 *  拼名字这件事统一走下面导出的 tintVars()，不要在组件里各写一遍。
 *
 *  【色族与板块的对应，为什么是这样】
 *      clover 四叶草嫩绿 142°  软件大师之路   —— 主调，最中性的一支
 *      pine   松柏翠绿   158°  个人成长       —— 沉一点，配「持续精进」
 *      grass  青草黄绿    74°  阿不成长树     —— 最亮的一支，配童年
 *      lily   睡莲蓝     211°  为乐而生       —— 全局唯一偏蓝的，配「乐」
 *  色相刻意收在 74°–211°（黄绿 → 绿 → 青 → 蓝），主基调仍是绿色系，
 *  但四张卡片彼此可辨 —— 这是解决「各界面元素颜色过于相近」的关键：
 *  不给四张一模一样的绿卡，也不给四张乱配的彩卡。
 *
 *  【v3 的 --sand-shelf-N 去哪了】
 *  它没有消失，只是在 custom.css 里变成了「色族名 → 变量」的语义别名
 *  （--sand-shelf-1-line / -ink 指向 clover 的 line / ink）。
 *  所以：组件要用「能承载文字 / 小面积」的档时写 --sand-shelf-N-ink，
 *  要用「面」（wash / soft）时用 tintVars()，两条路都通向同一支颜色。
 *
 *  【id 不能随便改】
 *  id 必须与 src/config/homepageData.js 里 SHELF_DIRS 的键一致，
 *  否则首页取不到篇数与最近更新时间（会静默降级成不显示）。
 * ============================================================================
 */

const SHELVES = [
  {
    id: 'softwaremaster',
    title: '软件大师之路',
    short: '软件',
    description: '系统性梳理软件工程的价值、需求、开发与运维知识体系。',
    url: '/docs/softwaremaster',
    tint: 'clover',
    books: [
      { label: '价值', url: '/docs/softwaremaster/value' },
      { label: '需求', url: '/docs/softwaremaster/requirement' },
      { label: '开发', url: '/docs/softwaremaster/develop' },
      { label: '运维', url: '/docs/softwaremaster/maintenance' },
    ],
  },
  {
    id: 'selfdevelop',
    title: '个人成长',
    short: '成长',
    description: '健康、认知、能力与观点，记录持续精进的足迹。',
    url: '/docs/selfdevelop',
    tint: 'pine',
    books: [
      { label: '健康', url: '/docs/selfdevelop/health' },
      { label: '认知', url: '/docs/selfdevelop/cognition' },
      { label: '能力', url: '/docs/selfdevelop/ability' },
      { label: '观点', url: '/docs/selfdevelop/outlook' },
    ],
  },
  {
    id: 'growthtree',
    title: '阿不成长树',
    short: '成长树',
    description: '记录孩子成长的时间轴与能力树，陪伴是最好的教育。',
    url: '/docs/growthtree',
    tint: 'grass',
    books: [
      { label: '成长时间轴', url: '/docs/growthtree/timeline' },
      { label: '成长能力树', url: '/docs/growthtree/classification' },
    ],
  },
  {
    id: 'lifeforfun',
    title: '为乐而生',
    short: '为乐',
    description: '音乐、篮球与投资，认真生活的乐趣。',
    url: '/docs/lifeforfun',
    tint: 'lily',
    books: [
      { label: '音乐', url: '/docs/lifeforfun/music' },
      { label: '篮球', url: '/docs/lifeforfun/basketball' },
      { label: '投资', url: '/docs/lifeforfun/invest' },
    ],
  },
];

/**
 * 把一支色族拼成四个 CSS 变量名。
 * 组件用它给内容面下发内联自定义属性，避免每个组件各拼一遍字符串。
 *
 * @param tint 色族名，见上面 SHELVES 里的 tint 字段
 * @returns {{wash: string, soft: string, line: string, ink: string}}
 */
export function tintVars(tint) {
  return {
    wash: `var(--sand-tint-${tint})`,
    soft: `var(--sand-tint-${tint}-soft)`,
    line: `var(--sand-tint-${tint}-line)`,
    ink: `var(--sand-tint-${tint}-ink)`,
  };
}

export default SHELVES;

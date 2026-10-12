import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import CRYSTALS, {CRYSTAL_CATEGORIES} from '@site/src/config/crystals';
import styles from './styles.module.css';

/**
 * ============================================================================
 *  Crystals —— 「岁月结晶」页面的渲染与布局
 *  ---------------------------------------------------------------------------
 *  这一层只做三件事：把数据分组、把它画成三级时间线、让它可交互。
 *  **它不知道任何一条结晶的内容** —— 条目全部来自
 *  src/config/crystals.js，样式全部在 ./styles.module.css。
 *  所以改内容不用碰这个文件；换数据源（这一层唯一的外部依赖就是那一个 import）
 *  也不用动下面的 JSX。
 *
 *  【三级时间线怎么画的】
 *  按 年 → 月 → 条 三层展开，每层都是同一个 .tlRow 网格：
 *  左列是主轴与节点（装饰），右列是内容。网格列宽由 CSS 变量 --axis-x 决定，
 *  定义在 styles.module.css 的 .page 上。
 *
 *  【为什么是静态渲染，而不是像随想页那样运行时取数】
 *  数据在构建期就被 import 进来，SSG 会把它写进产物 HTML ——
 *  因此对搜索引擎可见、无 JS 环境也能读。这是本次刻意与随想页拉开的一处差别。
 *
 *  【日期一律按 UTC 解析】
 *  computeStats 用 `${date}T00:00:00Z`。若按本地时区解析，
 *  构建机（UTC）与读者浏览器（UTC+8）可能算出不同的「时间跨度」，
 *  从而触发 hydration 不一致。加 Z 之后两端结果必然相同。
 * ============================================================================
 */

/** 月份中文名。索引 = Number(month) - 1，month 是 '01'–'12'。 */
const MONTH_CN = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

/**
 * category 键 → 胶囊样式类。
 * 键来自数据文件（CRYSTAL_CATEGORIES），样式在这里 —— 这正是「内容与样式分离」的落点：
 * 改一批条目的类别不用碰样式，换胶囊长相也不用碰数据。
 * 新增第四个类别时，这里和 styles.module.css 要同时加一项。
 */
const CHIP_CLASS = {
  growth: styles.chipGrowth,
  moment: styles.chipMoment,
  insight: styles.chipInsight,
};

/** 按 date 倒序（新的在前）。不改原数组。 */
function sortByDateDesc(items) {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** 按 年 → 月 两层分组，两级都按时间倒序。返回 Map<年, Map<月, 条目[]>>。 */
function groupByYearMonth(items) {
  const years = new Map();
  for (const item of sortByDateDesc(items)) {
    const [year, month] = item.date.split('-');
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(item);
  }
  return years;
}

/**
 * 三个统计数字，全部从数据算出 —— 不是手写的常量。
 * 删条目、补里程碑，数字自己会变。
 */
function computeStats(items) {
  const total = items.length;
  const milestones = items.filter((item) => item.milestone).length;
  const times = items
    .map((item) => Date.parse(`${item.date}T00:00:00Z`))
    .sort((a, b) => a - b);
  const span = times.length
    ? Math.round((times[times.length - 1] - times[0]) / 86400000) + 1
    : 0;
  return {total, milestones, span};
}

export default function Crystals() {
  const groups = useMemo(() => groupByYearMonth(CRYSTALS), []);
  const stats = useMemo(() => computeStats(CRYSTALS), []);
  const years = useMemo(() => [...groups.keys()], [groups]);

  /** 右侧年份导航当前高亮的年份。初值取第一个年份，与滚动后的行为一致。 */
  const [activeYear, setActiveYear] = useState(years[0] ?? null);
  const timelineRef = useRef(null);

  /**
   * 年份导航高亮：观察每个年份区块，取最靠上、且已进入视口的那一个。
   * rootMargin 上边留 88px 是给吸顶导航栏让位（与 .tlYear 的 scroll-margin-top 同口径）。
   * 只在浏览器里跑；SSG 阶段没有 IntersectionObserver，直接跳过。
   */
  useEffect(() => {
    const root = timelineRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return undefined;

    const sections = Array.from(root.querySelectorAll('[data-year]'));
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveYear(visible[0].target.dataset.year);
      },
      {rootMargin: '-88px 0px -60% 0px', threshold: 0},
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [groups]);

  /**
   * 点年份时平滑滚过去。
   * 用 scrollIntoView 而不是依赖全局 `html { scroll-behavior: smooth }` ——
   * 那种写法会改到全站每一页；这里把行为收在本页的点击处理里。
   * 尊重系统的「减弱动态效果」设置。
   */
  const jumpToYear = (event, year) => {
    const target = document.getElementById(`y-${year}`);
    if (!target) return;
    event.preventDefault();

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    target.scrollIntoView({behavior: prefersReduced ? 'auto' : 'smooth', block: 'start'});
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', `#y-${year}`);
    }
  };

  return (
    <div className={clsx('container', styles.page)}>
      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>Crystals</p>
        <h1 className={styles.heroTitle}>岁月结晶</h1>
        <p className={styles.heroSub}>用记忆锚定生命的厚度</p>
        <div className={styles.heroRule} />
      </header>

      <main>
        <section className={styles.stats} aria-label="结晶统计">
          <div className={styles.stat}>
            <span className={styles.statNum}>
              {stats.total}
              <small>条</small>
            </span>
            <p className={styles.statLabel}>已沉淀</p>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>
              {stats.span}
              <small>天</small>
            </span>
            <p className={styles.statLabel}>时间跨度</p>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>
              {stats.milestones}
              <small>条</small>
            </span>
            <p className={styles.statLabel}>里程碑</p>
          </div>
        </section>

        <div className={styles.timeline} ref={timelineRef}>
          {[...groups].map(([year, months]) => {
            const yearCount = [...months.values()].reduce(
              (n, list) => n + list.length,
              0,
            );
            return (
              <Fragment key={year}>
                <section
                  id={`y-${year}`}
                  data-year={year}
                  className={clsx(styles.tlRow, styles.tlYear)}>
                  <div className={styles.tlAxis}>
                    <span className={styles.axisLine} />
                    <span
                      className={clsx(styles.tlNode, styles.tlNodeYear)}
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className={styles.tlYearLabel}>
                    <span className={styles.yearNum}>{year}</span>
                    <span className={styles.yearSuffix}>年</span>
                    <span className={styles.yearRule} />
                    <span className={styles.yearCount}>{yearCount} 条</span>
                  </h2>
                </section>

                {[...months].map(([month, list]) => (
                  <Fragment key={month}>
                    <section className={styles.tlRow}>
                      <div className={styles.tlAxis}>
                        <span className={styles.axisLine} />
                        <span
                          className={clsx(styles.tlNode, styles.tlNodeMonth)}
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className={styles.tlMonthLabel}>
                        {MONTH_CN[Number(month) - 1]}
                      </h3>
                    </section>

                    {list.map((item, index) => (
                      <article
                        key={`${item.date}-${index}`}
                        className={clsx(styles.tlRow, styles.tlItem)}>
                        <div className={styles.tlAxis}>
                          <span className={styles.axisLine} />
                          <span
                            className={clsx(styles.tlNode, styles.tlNodeDay)}
                            aria-hidden="true"
                          />
                          <span className={styles.tlLead} aria-hidden="true" />
                        </div>
                        <div
                          className={clsx(
                            styles.crystal,
                            item.milestone && styles.isMilestone,
                          )}>
                          <div className={styles.crystalHead}>
                            {item.milestone && (
                              <span className={styles.diamond} aria-hidden="true" />
                            )}
                            <span
                              className={clsx(
                                styles.chip,
                                CHIP_CLASS[item.category],
                              )}>
                              {CRYSTAL_CATEGORIES[item.category].label}
                            </span>
                            <time className={styles.crystalDate} dateTime={item.date}>
                              {item.date}
                            </time>
                          </div>
                          <h4 className={styles.crystalTitle}>{item.title}</h4>
                          <p className={styles.crystalBody}>{item.body}</p>
                          {item.link && (
                            <Link className={styles.crystalLink} to={item.link}>
                              相关阅读 →
                            </Link>
                          )}
                        </div>
                      </article>
                    ))}
                  </Fragment>
                ))}
              </Fragment>
            );
          })}
        </div>
      </main>

      <nav className={styles.yearNav} aria-label="按年份跳转">
        {years.map((year) => (
          <a
            key={year}
            href={`#y-${year}`}
            className={clsx(activeYear === year && styles.isActive)}
            onClick={(event) => jumpToYear(event, year)}>
            {year}
          </a>
        ))}
      </nav>
    </div>
  );
}

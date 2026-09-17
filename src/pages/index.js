import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageShelves from '@site/src/components/HomepageShelves';
import HomepageLatestPosts from '@site/src/components/HomepageLatestPosts';
import HomepageThoughtsCarousel from '@site/src/components/HomepageThoughtsCarousel';
import SHELVES, {tintVars} from '@site/src/config/shelves';
import {
  CloudBank,
  StarField,
  Moon,
} from '@site/src/components/SeasonDecor';

/**
 * 首页标题区（Hero）。
 *
 * v1 是一个居中、铺满 container 的浅绿卡片：白 → 浅绿 → 更浅绿的渐变，
 * 40px 标题居中，没有任何装饰元素 —— 和页面底下其他卡片用同一个亮度说话，
 * 既不出挑也记不住。
 * v2 换成一块「深林绿 + 编辑器窗口」的沉浸面板，把标题区变成全页唯一的强对比区。
 * v3 在 v2 的骨架上补了一层「景」：光柱、薄云、底边一排松柏与青草。
 * v4 把那一层「景」从**画出来的植物**换成了**化开的颜色**：
 *
 *   1. 层结构（底色 → 水彩晕染 → 网格 → 光柱 → 暖光 → 云 → 星/月 →
 *      扫光 → 徽记 → 雾化）在浅深两套下完全一致，
 *      只有颜色与显隐不同，所以主题切换时每一层都在原地换装，
 *      是「天色变了」而不是「换了一个 Hero」；
 *   2. 浅色下整块读作「莫奈花园」：一层薄雾似的浅底，四团低饱和的植物色
 *      （四叶草绿 / 睡莲蓝 / 青草黄绿 / 小花暖黄）在四角化开，
 *      彼此相交处自然产生第五、第六种颜色 —— 不画花，只留花的颜色；
 *   3. 深色下同一块读作「月照夜空」：星点亮、月亮从右上角探出，
 *      四团晕染换成月光下的低透明版本，与全局星空接成一片；
 *   4. 面板底部直接放四个板块入口，标题区同时承担导航职责。
 *
 * 所有装饰层都 aria-hidden，不进入无障碍树；
 * 它们一律 pointer-events: none，不会抢走入口胶囊的点击。
 */
function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroPanel}>
          {/* ---- 装饰层（全部 aria-hidden，不进入无障碍树） ---- */}
          {/* 最先铺的一层：四团植物色化开的底。
              位置排在网格/光柱之前，是因为它是「颜色」不是「图形」——
              后面几层都是压在这层颜色上的光与线。 */}
          <span className={styles.heroWash} aria-hidden="true" />
          <span className={styles.heroGrid} aria-hidden="true" />
          <span className={styles.heroRays} aria-hidden="true" />
          <span className={styles.heroGlow} aria-hidden="true" />

          {/* 云：浅色下是被光打亮的薄云，深色下是夜云。
              fill 刻意覆写成 --sand-hero-cloud，
              否则天空层那份白云会把浅色面板里的标题压花。 */}
          <span className={styles.heroSky} aria-hidden="true">
            <CloudBank
              className={styles.heroCloudA}
              fill="var(--sand-hero-cloud)"
              shadow="transparent"
              opacity={0.85}
            />
            <CloudBank
              className={styles.heroCloudB}
              fill="var(--sand-hero-cloud)"
              shadow="transparent"
              opacity={0.6}
            />
          </span>

          {/* 星与月：常驻 DOM、只切 opacity，切换时是「亮起来」而不是「跳出来」 */}
          <StarField className={styles.heroStars} />
          <span className={styles.heroMoon} aria-hidden="true">
            <Moon className={styles.heroMoonArt} />
          </span>

          <span className={styles.heroSheen} aria-hidden="true" />

          {/* 底部雾化：浅色下是一层向上的白色薄雾（顺带把胶囊所在的底提亮，
              深色文字对比因此升到 12.5:1）；深色下是向下压暗，
              给板块色圆点一个确定够深的底。两套主题同一层，方向相反。 */}
          <span className={styles.heroScrim} aria-hidden="true" />

          {/* ---- 内容层 ---- */}
          <div className={styles.heroInner}>
            {/* 编辑器窗口栏：整块面板的「身份声明」 */}
            <div className={styles.heroChrome} aria-hidden="true">
              <span className={styles.chromeDots}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.chromePath}>~/hackerleon</span>
              <span className={styles.chromeStatus}>
                <span className={styles.statusDot} />
                online
              </span>
            </div>

            <p className={styles.heroEyebrow}>
              个人知识库 · Personal Knowledge Base
            </p>

            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleText}>{siteConfig.title}</span>
              <span className={styles.heroCaret} aria-hidden="true" />
            </h1>

            <p className={styles.heroTagline}>{siteConfig.tagline}</p>

            <p className={styles.heroDesc}>
              系统性记录软件技术、个人成长、养育心得与生活随笔。
            </p>

            {/* 四个板块入口：圆点取该板块色族的 ink 档
                （见 shelves.js 的 tintVars），与下方书架卡片的顶轨、
                年轮徽记一一对应，整页的配色规则第一次在这里被说清楚 */}
            <nav className={styles.heroEntries} aria-label="知识板块入口">
              {SHELVES.map((shelf) => (
                <Link key={shelf.id} to={shelf.url} className={styles.heroChip}>
                  <span
                    className={styles.chipDot}
                    style={{background: tintVars(shelf.tint).ink}}
                    aria-hidden="true"
                  />
                  {shelf.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      wrapperClassName="homepage"
      title={`首页`}
      description="倚码千言 —— Hackerleon 的个人网站，系统性记录软件技术、个人成长、养育心得与生活随笔。">
      <HomepageHeader />
      <main>
        <HomepageShelves />
        <HomepageLatestPosts />
        <HomepageThoughtsCarousel />
      </main>
    </Layout>
  );
}

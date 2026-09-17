import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SectionHeader from '@site/src/components/SectionHeader';
import SHELVES, {tintVars} from '@site/src/config/shelves';
import styles from './styles.module.css';

/**
 * 单本书架卡片。
 *
 * 【v3 → v4：卡片右上的那一小簇植物没了，改成整张卡片的颜色】
 * v3 在卡片右上角长了一簇「四叶草 + 青草 + 小花」，理由是「卡片需要一点春天的调性」。
 * 问题在于一屏四张卡片就是四簇草，加上三个区块各自的植物，
 * 「春天」被重复了几十次，反而不构成任何重点。
 *
 * v4 让卡片自己变成那支颜色：底色是该板块植物色的 wash，
 * 顶轨与书架横板用 line，书目胶囊用 soft，篇数与入口链接用 ink。
 * 同一支颜色的四个档位各司其职，卡片因此有了身份，
 * 而且完全不需要为一个 60×26px 的图形算位置。
 *
 * 四支色族与四个板块的对应写在 src/config/shelves.js，
 * 组件只负责把色族名拼成变量名下发（tintVars），不碰任何色值。
 */
function Shelf({title, description, url, books, stats, tint, id}) {
  const stat = stats[id];
  const count = stat?.count;
  const updated = stat?.updated;
  const tone = tintVars(tint);

  return (
    /* 全部颜色通过内联自定义属性下发，卡片自己不写死任何一个色值：
         底色 / 顶轨 / 书目胶囊 / 篇数 / 入口链接 —— 五处共用同一支颜色，
         改 shelves.js 一处即可，四个书架也不会再是四张一模一样的绿卡。 */
    <article
      className={styles.shelfCard}
      style={{
        '--shelf-wash': tone.wash,
        '--shelf-soft': tone.soft,
        '--shelf-line': tone.line,
        '--shelf-ink': tone.ink,
      }}>
      <h3 className={styles.shelfTitle}>
        <Link to={url}>{title}</Link>
      </h3>
      <p className={styles.shelfDesc}>{description}</p>

      <div className={styles.shelfBooks}>
        {books.map((book) => (
          <Link key={book.url} to={book.url} className={styles.bookPill}>
            {book.label}
          </Link>
        ))}
      </div>

      {/* 底部一行：左边是统计信息，右边是入口 */}
      <div className={styles.shelfFoot}>
        <p className={styles.shelfStats}>
          {count != null && (
            <span className={styles.statCount}>
              <b>{count}</b> 篇
            </span>
          )}
          {count != null && updated && (
            <span className={styles.statDot} aria-hidden="true" />
          )}
          {updated && (
            <span className={styles.statUpdated}>
              最近更新 <time>{updated}</time>
            </span>
          )}
        </p>

        <Link to={url} className={styles.shelfMore}>
          进入书架
          <span className={styles.moreArrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

export default function HomepageShelves() {
  // 统计数据在构建时算好，放在 siteConfig.customFields 里（见 src/config/homepageData.js）
  const {siteConfig} = useDocusaurusContext();
  const stats = siteConfig.customFields?.homepageData?.shelfStats ?? {};

  return (
    <section className={styles.section}>
      <div className="container">
        {/* 区块眉标用主调「四叶草绿」：这里列的是四个板块本身，
            所以标题栏取最中性的一支，具体颜色交给下面四张卡片去说。 */}
        <SectionHeader
          eyebrow="KNOWLEDGE SHELF"
          title="知识书架"
          subtitle="持续积累，遇见新知"
          tone="clover"
        />
        <div className={styles.shelvesGrid}>
          {SHELVES.map((shelf) => (
            <Shelf key={shelf.id} {...shelf} stats={stats} />
          ))}
        </div>
      </div>
    </section>
  );
}

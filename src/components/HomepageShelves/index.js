import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SectionHeader from '@site/src/components/SectionHeader';
import styles from './styles.module.css';

// 四个书架，对应 docs 下的四个主题（子分类为书架上的"书"）
// id 必须与 src/config/homepageData.js 里的 SHELF_DIRS 键一致，用于取统计数据
const SHELVES = [
  {
    id: 'softwaremaster',
    title: '软件大师之路',
    description: '系统性梳理软件工程的价值、需求、开发与运维知识体系。',
    url: '/docs/softwaremaster',
    books: [
      {label: '价值', url: '/docs/softwaremaster/value'},
      {label: '需求', url: '/docs/softwaremaster/requirement'},
      {label: '开发', url: '/docs/softwaremaster/develop'},
      {label: '运维', url: '/docs/softwaremaster/maintenance'},
    ],
  },
  {
    id: 'selfdevelop',
    title: '个人成长',
    description: '健康、认知、能力与观点，记录持续精进的足迹。',
    url: '/docs/selfdevelop',
    books: [
      {label: '健康', url: '/docs/selfdevelop/health'},
      {label: '认知', url: '/docs/selfdevelop/cognition'},
      {label: '能力', url: '/docs/selfdevelop/ability'},
      {label: '观点', url: '/docs/selfdevelop/outlook'},
    ],
  },
  {
    id: 'growthtree',
    title: '阿不成长树',
    description: '记录孩子成长的时间轴与能力树，陪伴是最好的教育。',
    url: '/docs/growthtree',
    books: [
      {label: '成长时间轴', url: '/docs/growthtree/timeline'},
      {label: '成长能力树', url: '/docs/growthtree/classification'},
    ],
  },
  {
    id: 'lifeforfun',
    title: '为乐而生',
    description: '音乐、篮球与投资，认真生活的乐趣。',
    url: '/docs/lifeforfun',
    books: [
      {label: '音乐', url: '/docs/lifeforfun/music'},
      {label: '篮球', url: '/docs/lifeforfun/basketball'},
      {label: '投资', url: '/docs/lifeforfun/invest'},
    ],
  },
];

function Shelf({id, title, description, url, books, stats}) {
  const stat = stats[id];
  const count = stat?.count;
  const updated = stat?.updated;

  return (
    <article className={styles.shelfCard}>
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
        <SectionHeader
          title="知识书架"
          subtitle="软件、成长、养育与生活四个方向的知识整理，持续更新中"
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

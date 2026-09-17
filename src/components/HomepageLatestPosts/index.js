import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SectionHeader from '@site/src/components/SectionHeader';
import styles from './styles.module.css';

// 博客插件生成的 JSON（构建时通过 webpack 别名 ~blog 解析，已按日期降序）
import blogSidebarData from '~blog/default/blog-post-list-prop-default.json';

const ALL_POSTS = blogSidebarData.items || [];
const POSTS = ALL_POSTS.slice(0, 3);

/**
 * 取 UTC 日期，不用访问者本地时区。
 *
 * 原因：博客 front matter 写的是 `2026-09-11 17:00:00 +0800`，
 * 插件存成 `2026-09-11T17:00:00.000Z`，博客列表页也是按 UTC 渲染的。
 * 如果这里用本地时区取值，+08 时区的访客会看到 09-12，
 * 同一篇随笔在首页和列表页差一天。按 UTC 取值两边才一致。
 */
function formatDate(isoStr) {
  const d = new Date(isoStr);
  const pad = (n) => (n < 10 ? '0' : '') + n;
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate(),
  )}`;
}

export default function HomepageLatestPosts() {
  // 摘要取不到就不用（见 src/config/homepageData.js）
  const {siteConfig} = useDocusaurusContext();
  const excerpts =
    siteConfig.customFields?.homepageData?.postExcerpts ?? {};

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHeader
          eyebrow="LATEST NOTES"
          title="最新随笔"
          subtitle={`给生命留下回忆，共 ${ALL_POSTS.length} 篇`}
          moreLabel="全部随笔"
          moreUrl="/blog"
          tone="grass"
        />

        <div className={styles.postsGrid}>
          {POSTS.map((post, index) => {
            const excerpt = excerpts[post.permalink];

            return (
              <article key={post.permalink} className={styles.postCard}>
                {/* 第一层：时间与序号，最弱的信息 */}
                <div className={styles.postMeta}>
                  <time className={styles.postDate} dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <span className={styles.postIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* 第二层：标题，卡片的主体 */}
                <h3 className={styles.postTitle}>
                  <Link to={post.permalink}>{post.title}</Link>
                </h3>

                {/* 第三层：摘要，让卡片有内容可读、层次不空 */}
                {excerpt && <p className={styles.postExcerpt}>{excerpt}</p>}

                {/* 第四层：入口，用一条发丝线隔开 */}
                <div className={styles.postFoot}>
                  <Link to={post.permalink} className={styles.postMore}>
                    阅读全文
                    <span className={styles.postArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

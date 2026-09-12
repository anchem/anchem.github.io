import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageShelves from '@site/src/components/HomepageShelves';
import HomepageLatestPosts from '@site/src/components/HomepageLatestPosts';
import HomepageThoughtsCarousel from '@site/src/components/HomepageThoughtsCarousel';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroCard}>
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroTagline}>{siteConfig.tagline}</p>
          <p className={styles.heroDesc}>
            系统性记录软件技术、个人成长、养育心得与生活随笔。
          </p>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
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

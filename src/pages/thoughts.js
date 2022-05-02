import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function MyThoughtsHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/gitalk/1.7.2/gitalk.min.css" rel="stylesheet"/>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gitalk/1.7.2/gitalk.min.js"></script>
    </header>
  );
}

function MyThoughtsContent() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div id="gitalk-container"></div>
  );
}

export default function MyThoughts() {
  const {siteConfig} = useDocusaurusContext();
  var gitalk = new Gitalk({
    clientID: '8f8b00c0f9a02da92827',
    clientSecret: 'e9e5f5370d1497b34960a41d0027faf1ee508cf1',
    repo: 'anchem.github.io',
    owner: 'anchem',
    admin: ['anchem'],
    id: location.pathname,      // Ensure uniqueness and length less than 50
    title: 'thoughts_repo',
    distractionFreeMode: false,  // Facebook-like distraction free mode
    createIssueManually: true,
    labels: ['comment','Gitalk'],
    language: 'zh-CN',
    pagerDirection: 'last',
    isLocked: true
  })
  gitalk.render('gitalk-container')
  return (
    <Layout
      title={`随想`}>
      <MyThoughtsHeader/>
      <main>]
        <MyThoughtsContent/>
      </main>
    </Layout>
  );
}
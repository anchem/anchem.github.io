import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import GitalkComponent from "gitalk/dist/gitalk-component";

export default function Thoughts() {
  return (
    <Layout title="Thoughts" description="my thoughts">
      <BrowserOnly fallback={<div></div>}>{() => <GitalkComponent options={options} />}</BrowserOnly>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p>
          Thoughts
        </p>
      </div>
      <GitalkComponent options={{
        clientID: '8f8b00c0f9a02da92827',
        clientSecret: 'a0cbb95598b1c9132a2f82b2389ce1b93bdd20b1',
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
      }} />
    </Layout>
  );
}

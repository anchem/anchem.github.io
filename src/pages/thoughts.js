import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';

const SentenceList = [
    {
        time: '2022-08-10',
        content: (<>测试数据 1</>)
    },
    {
        time: '2022-08-09',
        content: (<>测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2 测试数据 2</>)
    }
]

function Sentence({time, content}) {
  return (
    <div>
      <h4>{time}</h4>
      <p>{content}</p>
    </div>
  );
}

function SentenceComp() {
  return (
  <div className="container">
    <div className={clsx('col col--8')}>
      {SentenceList.map((props, idx) => (
        <Sentence key={idx} {...props} />
      ))}
    </div>
  </div>
  );
}

export default function Thoughts() {
  return (
    <Layout title="随想" description="灵感稍纵即逝">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <h1>
          随想 | 灵感稍纵即逝
        </h1>
        <SentenceComp />
      </div>
    </Layout>
  );
}

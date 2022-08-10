import React from 'react';
import Layout from '@theme/Layout';

const SentenceList = [
    {
        time: '2022-08-10',
        content: (<>测试数据 1</>)
    },
    {
        time: '2022-08-09',
        content: (<>测试数据 2</>)
    }
]

function Sentence({time, content}) {
  return (
    <div className={clsx('col col--8')}>
      <h4>{time}</h4>
      <p>{content}</p>
    </div>
  );
}

function SentenceComp() {
  return (
  <div className="container">
    <div className="row">
      {SentenceList.map((props, idx) => (
        <Feature key={idx} {...props} />
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
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <p>
          内容：随想 | 灵感稍纵即逝
        </p>
        <SentenceComp>
        </SentenceComp>
      </div>
    </Layout>
  );
}

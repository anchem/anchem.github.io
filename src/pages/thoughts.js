import React from 'react';
import Layout from '@theme/Layout';

export default function Hello() {
  return (
    <Layout title="随想" description="灵感稍纵即逝">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p>
          内容：随想 | 灵感稍纵即逝
        </p>
      </div>
    </Layout>
  );
}

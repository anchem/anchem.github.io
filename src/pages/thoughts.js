import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import SentenceComp from '@site/src/components/Thoughts';

export default function Thoughts() {
  return (
    <Layout title="随想" description="灵感稍纵即逝">
      <div>
        <SentenceComp />
      </div>
    </Layout>
  );
}

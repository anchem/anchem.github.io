import React from 'react';
import Layout from '@theme/Layout';
import Crystals from '@site/src/components/Crystals';

/**
 * /crystals —— 岁月结晶
 *
 * 这一层只负责「把它挂进站点」：套上全站的导航栏、页脚与天空层，
 * 声明标题与描述。页面本身在 src/components/Crystals，
 * 内容在 src/config/crystals.js（与随想页 src/pages/thoughts.js 同构）。
 *
 * description 会进 <meta name="description">，写的是副标题而不是字段说明。
 */
export default function CrystalsPage() {
  return (
    <Layout title="岁月结晶" description="用记忆锚定生命的厚度">
      <Crystals />
    </Layout>
  );
}

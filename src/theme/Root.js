import React from 'react';
import SkyBackdrop from '@site/src/components/SkyBackdrop';

/**
 * ============================================================================
 *  Root —— 全站最外层包装（Docusaurus 官方的 swizzle 点）
 *  ---------------------------------------------------------------------------
 *  官方对这个组件的定义是：位于应用最顶层、不随路由变化的包装层。
 *  换句话说，把东西放在这里，它就会在**每一张页面**上存在，
 *  而且客户端路由切换时不会重新挂载 —— 这正是「天空」需要的语义：
 *  从首页点进文档，天不该重新渲染一次、云不该跳回起点。
 *
 *  【为什么不用 swizzle Layout / Navbar / Footer 去拼】
 *  天空是「环境层」，它需要 position:fixed + z-index:-1 才能沉到所有内容
 *  之下。放在 Layout 里会被布局的层叠上下文关起来，
 *  放在 body 的伪元素上又没法用 React 组件表达（星星的确定性伪随机、
 *  彩云的模糊层都不好写成 CSS）。Root 是唯一「位置正确 + 可控」的点。
 *
 *  【注意】
 *  Root 在 ThemeProvider 之外，所以这里取不到 useColorMode()。
 *  天空的显隐完全交给 CSS（html[data-theme] 切两块层的 opacity），
 *  组件本身对主题无感知 —— 这也让 SSR 输出与客户端首帧完全一致。
 * ============================================================================
 */
export default function Root({children}) {
  return (
    <>
      <SkyBackdrop />
      {children}
    </>
  );
}

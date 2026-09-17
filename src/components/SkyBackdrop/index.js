import React from 'react';
import styles from './styles.module.css';
import {CloudBank, StarField, AuroraClouds} from '@site/src/components/SeasonDecor';

/**
 * ============================================================================
 *  SkyBackdrop —— 全站天空层
 *  ---------------------------------------------------------------------------
 *  这是整个 v3 视觉方案的地基：页面底不再是一块纯色，而是「一块天空」。
 *  浅色时是春日的晴空与云，深色时是夏夜的星空、月亮与彩云。
 *
 *  【为什么两块天空同时留在 DOM 里】
 *  主题切换最忌讳「换一张背景图」—— background-image 无法过渡，
 *  只能是硬切。所以这里把白昼层与夜幕层同时渲染、完全叠合，
 *  用 <html data-theme> 去切两者的 opacity，切换时看到的是一次
 *  700ms 的交叉淡入淡出：云还没化完，星星已经亮起来了。
 *
 *  【为什么挂在 Root 而不是首页】
 *  天空是「环境」而不是「首页的一节」。挂在 src/theme/Root.js 上，
 *  文档、博客、随想、关于页全都自动拥有同一片天 ——
 *  整站只在「时间」这一个维度上换装，风格自然是统一的。
 *
 *  【类名约定】
 *  主题切换那部分（承载层的 fixed/z-index、两层的 opacity、渐变与地平线）
 *  全部写在 custom.css §7，用 [class*='skyLayer'] 这类「按子串匹配」的
 *  属性选择器命中，所以 CSS Modules 的哈希前缀不影响它。
 *  本文件与 styles.module.css 只负责「画什么、摆在哪」。
 *  改类名时务必保住这些子串：skyHost / skyLayer / skyDay / skyNight /
 *  skyGrad / skyHorizon。
 *
 *  【月亮为什么不在这一层】
 *  月亮是个「有明确边界」的形状，放在固定的全屏层里位置就不受控了：
 *  宽屏下它落在右侧留白里很好看，窄屏下会被卡片压掉一半，像坏图。
 *  所以月亮放在首页 Hero 面板（夜色下才出现）的右上角，
 *  位置由版面决定而不是由视口决定。见 src/pages/index.js。
 *
 *  【性能取向】
 *  · 整层 pointer-events: none + z-index: -1，不参与命中测试，不挡内容；
 *  · 星星坐标由固定种子的伪随机数算出（见 SeasonDecor），构建期与运行期
 *    完全一致，不会触发 hydration 不匹配；
 *  · 装饰元素数量刻意压得很少（云 3 朵 / 彩云 3 团 / 星 87 颗），
 *    它们只是「布景」，多了就变成页面噪音。
 * ============================================================================
 */
export default function SkyBackdrop() {
  return (
    <div className={styles.skyHost} aria-hidden="true">
      {/* ================= 白昼：春晓 ================= */}
      <div className={`${styles.skyLayer} ${styles.skyDay}`}>
        <span className={styles.skyGrad} />

        {/* 太阳在右上角之外，只把光晕洒进来 ——
            画一个完整的太阳会变成插图，洒一片光才是「天气」。 */}
        <span className={styles.sunGlow} />

        {/* 云层单独一层容器：三朵云各自绝对定位，容器统一铺满视口 */}
        <span className={styles.cloudLayer}>
          <CloudBank className={`${styles.cloud} ${styles.cloudA} ${styles.cloudFloat}`} />
          <CloudBank className={`${styles.cloud} ${styles.cloudB} ${styles.cloudFloatSlow}`} />
          <CloudBank className={`${styles.cloud} ${styles.cloudC}`} />
        </span>

        {/* 地平线薄雾：把天空渐变的下沿收住，也暗示远处那片草地 */}
        <span className={styles.skyHorizon} />
      </div>

      {/* ================= 夜幕 ================= */}
      <div className={`${styles.skyLayer} ${styles.skyNight}`}>
        <span className={styles.skyGrad} />

        <StarField className={styles.stars} />

        <AuroraClouds className={styles.aurora} />

        <span className={styles.skyHorizon} />
      </div>
    </div>
  );
}

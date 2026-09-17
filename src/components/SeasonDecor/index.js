import React from 'react';
import styles from './styles.module.css';

/**
 * ============================================================================
 *  SeasonDecor —— 「春晓 / 夜幕」两套主题共用的**天体**图形库
 *  ---------------------------------------------------------------------------
 *  【v4 只留下天体，植物全部删掉了】
 *  v3 这里还有 Clover / GrassTuft / Pine / Bloom 四个植物组件，
 *  被压在卡片角上、Hero 底边、区块标题右端。
 *  v4 全部移除，理由不是审美疲劳，而是结构问题：
 *
 *    1. 一屏几十张卡片，每张都长一簇草 —— 「春天」被重复了太多次，
 *       反而没有重点，页面也变吵；
 *    2. 图形是「贴上去的」，换主题要改图形的取色，换版式又要重算每个
 *       图形的位置，两件事互相牵制。
 *
 *  植物的颜色没有丢，只是改变了存在形式：它们成了 --sand-tint-* 一族，
 *  直接做卡片底、色带、胶囊、左边条的颜色（见 src/css/custom.css §1）。
 *  换句话说 —— **植物从「一个元素」变成了「一套配色」**。
 *
 *  留下来的天体会画在视口与 Hero 上，因为「天空」必须是一片连续的环境，
 *  不能靠几块色带暗示。这是图形在这个系统里唯一还站得住的理由。
 *
 *  【设计约定（改这里之前先读）】
 *
 *  1. 一律用内联 SVG，不用图片。
 *     图片没法跟随主题换色，也没法在切换时做渐变；
 *     而这里的每个图形都只引用 --sand-* 令牌，
 *     所以 <html data-theme> 一变，图形自己就换成了夜色下的银白。
 *
 *  2. 一律 aria-hidden + pointer-events: none。
 *     它们是环境，不该进无障碍树，也不该抢走链接的点击。
 *
 *  3. 数量刻意压得很少（云 3 朵 / 彩云 3 团 / 星 87 颗）。
 *     它们是布景，多了就变成页面噪音 —— 这条规矩对 v4 尤其重要。
 * ============================================================================
 */

/* --- 云朵 ---------------------------------------------------------------------
   四个椭圆叠出一条「下缘平、上缘鼓」的云。
   用椭圆组而不是一条精确路径：云本来就是散的，
   椭圆组在不同尺寸下都不会出现路径自交的硬折角。

   fill / shadow 可以覆写：天空层里用 --sand-cloud（白云），
   Hero 面板里必须换成 --sand-hero-cloud（面板里的薄云），
   否则天空层那份白云会把浅色面板里的标题压花。 */
export function CloudBank({
  className,
  style,
  opacity = 1,
  fill = 'var(--sand-cloud)',
  shadow = 'var(--sand-cloud-shadow)',
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 240 96"
      fill="none"
      opacity={opacity}
      aria-hidden="true"
      focusable="false">
      <g fill={fill}>
        <ellipse cx="74" cy="58" rx="52" ry="22" />
        <ellipse cx="134" cy="46" rx="58" ry="30" />
        <ellipse cx="190" cy="60" rx="44" ry="20" />
        <ellipse cx="132" cy="66" rx="84" ry="18" />
      </g>
      {/* 云底的一道浅影：没有它云会像一团白雾浮在半空 */}
      <ellipse cx="132" cy="70" rx="86" ry="12" fill={shadow} opacity="0.5" />
    </svg>
  );
}

/* --- 月亮 ---------------------------------------------------------------------
   满月 + 三处环形山 + 一圈光晕。
   月亮不画成月牙：夜空的「安逸」来自完整与圆满，月牙更像神秘/惊悚。 */
export function Moon({className, style}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false">
      <circle cx="100" cy="100" r="96" fill="var(--sand-sky-glow)" />
      <circle cx="100" cy="100" r="46" fill="var(--sand-moon)" />
      <circle
        cx="82"
        cy="86"
        r="9"
        fill="var(--sand-moon-shade)"
        opacity="0.55"
      />
      <circle
        cx="112"
        cy="112"
        r="6.5"
        fill="var(--sand-moon-shade)"
        opacity="0.45"
      />
      <circle
        cx="104"
        cy="72"
        r="4.5"
        fill="var(--sand-moon-shade)"
        opacity="0.4"
      />
    </svg>
  );
}

/* --- 繁星 ---------------------------------------------------------------------
   星星位置必须「每次构建都一样」，否则服务端渲染出的坐标和浏览器端
   重新生成的不一致，React 会报 hydration 不匹配。
   所以用固定种子的 mulberry32，而不是 Math.random()。
   取 1440×900 的坐标系配合 slice 缩放，圆点不会被拉成椭圆。 */
function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STARS = (() => {
  const rand = mulberry32(20260917);
  const list = [];

  // 78 颗普通星：疏密本身随机，但分三组错开闪烁相位
  for (let i = 0; i < 78; i += 1) {
    list.push({
      x: +(rand() * 1440).toFixed(1),
      y: +(rand() * 900).toFixed(1),
      r: +(0.55 + rand() * 1.15).toFixed(2),
      group: i % 3,
      bright: rand() > 0.82,
    });
  }

  // 9 颗四芒星：给星空一个「有星座」的观感，否则只是一层噪点
  for (let i = 0; i < 9; i += 1) {
    list.push({
      x: +(60 + rand() * 1320).toFixed(1),
      y: +(20 + rand() * 560).toFixed(1),
      r: +(3.4 + rand() * 2.6).toFixed(2),
      group: i % 3,
      sparkle: true,
    });
  }

  return list;
})();

export function StarField({className, style}) {
  const groups = [0, 1, 2].map((g) =>
    STARS.filter((s) => s.group === g && !s.sparkle),
  );
  const sparkles = STARS.filter((s) => s.sparkle);

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      focusable="false">
      {/* 三组错相闪烁：同频闪会看出「整片一起呼吸」，很假 */}
      {groups.map((stars, g) => (
        <g
          key={g}
          className={styles[`twinkle${g + 1}`]}
          fill="var(--sand-star)">
          {stars.map((s) => (
            <circle
              key={`${s.x}-${s.y}`}
              cx={s.x}
              cy={s.y}
              r={s.r * (s.bright ? 1.45 : 1)}
              opacity={s.bright ? 0.95 : 0.62}
            />
          ))}
        </g>
      ))}

      {/* 四芒星：两条细长的十字，中心一个亮点 */}
      <g className={styles.twinkle2} stroke="var(--sand-star)" strokeLinecap="round">
        {sparkles.map((s) => (
          <g key={`sp-${s.x}`} opacity="0.75">
            <path
              d={`M${s.x - s.r * 2.6},${s.y} L${s.x + s.r * 2.6},${s.y}`}
              strokeWidth="1.1"
            />
            <path
              d={`M${s.x},${s.y - s.r * 2.6} L${s.x},${s.y + s.r * 2.6}`}
              strokeWidth="1.1"
            />
            <circle cx={s.x} cy={s.y} r="1.9" fill="var(--sand-star)" stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* --- 彩云（夜幕专用）----------------------------------------------------------
   三团低饱和的紫 / 玫瑰 / 青，用大半径 + 模糊铺成横向飘带。
   彩云是「静谧」里唯一的彩色，所以饱和度压得很低（0.13–0.20），
   再高就会变成极光秀，把夜空抢掉。 */
export function AuroraClouds({className, style}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      focusable="false">
      <g className={styles.auroraDrift}>
        <ellipse cx="330" cy="620" rx="420" ry="86" fill="var(--sand-aurora-1)" />
        <ellipse cx="1090" cy="700" rx="460" ry="72" fill="var(--sand-aurora-2)" />
        <ellipse cx="720" cy="520" rx="380" ry="58" fill="var(--sand-aurora-3)" />
      </g>
    </svg>
  );
}

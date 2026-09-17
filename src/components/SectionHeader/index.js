import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * 首页各内容区块共用的标题栏。
 *
 * 三个模块（知识书架 / 最新随笔 / 随想）都用它，保证标题字号、副标题颜色、
 * 「查看全部」链接的位置完全一致 —— 改一处即三处同步。
 *
 * 【v3 → v4：从「插一簇植物」改成「给整段染上那支颜色」】
 * v3 在等宽标签前插了一个四叶草、在右端插了一簇「草 + 花 + 四叶草」，
 * 理由是「区块标题是页面里重复出现最多的结构，把春天的元素固定在这里最省」。
 * 这个判断的方向是对的，但手段选错了：一簇 60×26px 的图形既占位、又只在
 * 一两个断点上看得到，还不能承载任何信息。
 *
 * v4 换成一个参数化的做法：给标题栏一个 tone，整段就用那一支植物色的四档：
 *   眉标  = 染色胶囊（底 wash / 描边 line / 文字 ink）
 *   标题条 = line → ink 的竖直渐变（配一圈 wash 外环）
 *   底线  = soft（全宽染色发丝线）
 * 「查看全部」= 文字 ink，悬停时填 wash
 * 于是「这一节是什么颜色」由一整行结构来说清楚，不靠任何图形，
 * 而且换主题、换断点都不需要额外照顾。
 *
 * @param title     主标题
 * @param eyebrow   小号等宽英文标签（可选）。与 Hero 里的等宽窗口栏、
 *                  代码注释式标语是同一套语言，给每个区块一个固定的
 *                  「识别标签」，比单纯一个中文标题更有记忆点。
 * @param subtitle  副标题（可选，纯说明文字，不支持 HTML）
 * @param moreLabel 「查看全部」链接文字（可选，与 moreUrl 成对出现）
 * @param moreUrl   链接地址（传了才渲染右侧链接）
 * @param tone      该区块的植物色族：clover / pine / grass / lily / bloom / petal
 *                  （见 src/config/shelves.js 与 custom.css §1 的 --sand-tint-*）
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  moreLabel,
  moreUrl,
  tone = 'clover',
}) {
  /* 不在这里写死色值，只拼出变量名 ——
     浅深两套的取值由 custom.css §1 分别给出，组件永远不用判断当前主题。
     这和 shelves.js 里存色族名而不是色值是同一个做法。 */
  const tint = {
    '--section-wash': `var(--sand-tint-${tone})`,
    '--section-soft': `var(--sand-tint-${tone}-soft)`,
    '--section-line': `var(--sand-tint-${tone}-line)`,
    '--section-ink': `var(--sand-tint-${tone}-ink)`,
  };

  return (
    <header className={styles.header} style={tint}>
      <div className={styles.heading}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {moreUrl && (
        <Link to={moreUrl} className={styles.more}>
          <span>{moreLabel}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Link>
      )}
    </header>
  );
}

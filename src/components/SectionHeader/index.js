import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * 首页各内容区块共用的标题栏。
 *
 * 三个模块（知识书架 / 随笔 / 随想）都用它，保证标题字号、副标题颜色、
 * 「查看全部」链接的位置完全一致 —— 改一处即三处同步。
 *
 * @param title     主标题
 * @param subtitle  副标题（可选，纯说明文字，不支持 HTML）
 * @param moreLabel 「查看全部」链接文字（可选，与 moreUrl 成对出现）
 * @param moreUrl   链接地址（传了才渲染右侧链接）
 */
export default function SectionHeader({title, subtitle, moreLabel, moreUrl}) {
  return (
    <header className={styles.header}>
      <div className={styles.heading}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {moreUrl && (
        <Link to={moreUrl} className={styles.more}>
          {moreLabel}
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Link>
      )}
    </header>
  );
}

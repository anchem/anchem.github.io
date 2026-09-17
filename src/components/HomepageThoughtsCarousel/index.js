import React from 'react';
import parse from 'html-react-parser';
import SectionHeader from '@site/src/components/SectionHeader';
import {useThoughts} from '@site/src/hooks/useThoughts';
import styles from './styles.module.css';

function formatDate(isoStr) {
  const d = new Date(isoStr);
  const pad = (n) => (n < 10 ? '0' : '') + n;
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    ` ${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

/**
 * 随想轮播。
 *
 * 【v4：卡片右下角那丛草删掉了，卡片自己变成松柏翠绿】
 * v3 在卡片右下角（巨型引号水印的左侧）放了一小丛草，占位 2.4rem × ~2rem。
 * 它有 16 张卡片就意味着 32 份同样的图形（列表复制了一遍做无缝滚动），
 * 是整页重复次数最多的一个元素 —— 而它承载的信息是零。
 *
 * v4 把它换成「底色 + 左边条」：卡片底铺松柏的 wash，左边条 4px 用 line，
 * 引号水印用 soft。同一支颜色的三个档位各就各位，
 * 装饰量从 32 个图形降到 0，颜色的存在感反而更强。
 *
 * 【数据获取】fetch / 缓存 / 排序统一走 src/hooks/useThoughts，
 * 与 Thoughts 页面共享同一份数据源，5 分钟 localStorage 缓存避免重复打 API。
 */
export default function HomepageThoughtsCarousel() {
  const {items, error, loading} = useThoughts();

  let content;
  if (error) {
    content = <div className={styles.hintMsg}>随想加载失败：{error.message}</div>;
  } else if (loading) {
    content = <div className={styles.hintMsg}>加载中…</div>;
  } else {
    // 复制一份实现无缝循环；时长随条数增加，保证滚动速度恒定
    const allItems = [...items, ...items];
    const duration = Math.max(items.length * 8, 30);
    content = (
      <div
        className={styles.carouselTrack}
        style={{animationDuration: `${duration}s`}}>
        {allItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className={styles.thoughtCard}>
            {/* 卡片定高，内容超出部分在整行边界截断 */}
            <div className={styles.thoughtContent}>{parse(item.body_html)}</div>

            <div className={styles.thoughtMeta}>
              <time className={styles.thoughtDate} dateTime={item.updated_at}>
                {formatDate(item.updated_at)}
              </time>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className={styles.section}>
      {/* 滚动区收进 container，左右边界与上方两个模块对齐 */}
      <div className="container">
        <SectionHeader
          eyebrow="THOUGHTS"
          title="随想"
          subtitle="灵感稍纵即逝"
          moreLabel="全部随想"
          moreUrl="/thoughts"
          tone="pine"
        />
        <div className={styles.carousel}>{content}</div>
      </div>
    </section>
  );
}

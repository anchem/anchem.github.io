import React, {useState, useEffect} from 'react';
import parse from 'html-react-parser';
import SectionHeader from '@site/src/components/SectionHeader';
import styles from './styles.module.css';

const THOUGHTS_API =
  'https://api.github.com/repos/anchem/anchem.github.io/issues/7/comments';

function formatDate(isoStr) {
  const d = new Date(isoStr);
  const pad = (n) => (n < 10 ? '0' : '') + n;
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    ` ${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

export default function HomepageThoughtsCarousel() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(THOUGHTS_API, {
      headers: {Accept: 'application/vnd.github.full+json'},
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((result) => {
        if (!Array.isArray(result)) throw new Error('数据格式异常');
        const sorted = result.sort((a, b) =>
          b.updated_at > a.updated_at ? 1 : -1,
        );
        setItems(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

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
          title="随想"
          subtitle="灵感稍纵即逝"
          moreLabel="全部随想"
          moreUrl="/thoughts"
        />
        <div className={styles.carousel}>{content}</div>
      </div>
    </section>
  );
}

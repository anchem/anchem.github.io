import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import parse from 'html-react-parser';
import styles from './styles.module.css';

const THOUGHTS_API =
  'https://api.github.com/repos/anchem/anchem.github.io/issues/7/comments';

/**
 * 日期格式与首页轮播（HomepageThoughtsCarousel）保持一致：
 * YYYY-MM-DD HH:mm，本地时区，不带时区后缀。
 * 两处展示同一数据源，格式必须相同，否则同一篇随想在首页和列表页显示不同。
 */
function formatDate(isoStr) {
  const d = new Date(isoStr);
  const pad = (n) => (n < 10 ? '0' : '') + n;
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    ` ${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

export default function Thoughts() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(THOUGHTS_API, {
      headers: {Accept: 'application/vnd.github.full+json'},
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `请求失败（HTTP ${res.status}），可能是 GitHub API 访问频率受限，请稍后再试`,
          );
        }
        return res.json();
      })
      .then((result) => {
        if (!Array.isArray(result)) {
          throw new Error('返回数据格式异常');
        }
        setItems(
          result.sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1)),
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="container">
        <div className={styles.hintMsg}>随想加载失败：{error.message}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className={styles.hintMsg}>加载中…</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.thoughtTitle}>
        <h1>随想 | 灵感稍纵即逝</h1>
      </div>
      <div className="row">
        <div className={clsx('col col--8 col--offset-2')}>
          {items.map((item) => (
            <div key={item.id} className={styles.thoughtItem}>
              {parse(item.body_html)}
              <span>{formatDate(item.updated_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

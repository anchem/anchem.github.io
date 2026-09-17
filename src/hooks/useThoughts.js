import {useState, useEffect} from 'react';

/**
 * ============================================================================
 *  useThoughts —— 随想数据共享 hook
 * ---------------------------------------------------------------------------
 *  Thoughts 页面（src/components/Thoughts）与首页轮播
 *  （src/components/HomepageThoughtsCarousel）共用同一份 GitHub Issues
 *  评论数据。之前两处各写一遍 fetch + sort + 错误处理，逻辑迟早漂移；
 *  而且未认证调用 GitHub API 限速 60 次/小时/IP，热门时段容易 403。
 *
 *  这里把整条链路抽成一个 hook，并加一道 localStorage 缓存：
 *    · TTL 5 分钟 —— 同一访客 5 分钟内多次访问只真正请求一次 API，
 *      60 次/小时的额度可以承载远超原来的并发；
 *    · 缓存命中时立即返回，组件不进 loading 态，首屏无闪烁；
 *    · 缓存损坏 / 隐私模式 / storage 不可用都安全降级到直接请求；
 *    · 仍保留 error / loading 三态，调用方按原方式渲染。
 *
 *  为什么用 localStorage 而不是 sessionStorage：
 *  同一用户在站内多次跳转（首页 → 随想 → 首页）不应每次都打 API，
 *  跨会话的 5 分钟缓存对个人网站更友好。
 * ============================================================================
 */

const THOUGHTS_API =
  'https://api.github.com/repos/anchem/anchem.github.io/issues/7/comments';

const CACHE_KEY = 'thoughts-cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

/** 把最新排序结果写进 localStorage；隐私模式 / quota 报错都吞掉 */
function writeCache(items) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({timestamp: Date.now(), items}),
    );
  } catch {
    // 隐私模式 / 容量超限 / 禁用 storage 时忽略，下次仍走网络
  }
}

/** 读缓存；过期、损坏或不可用都返回 null */
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.timestamp !== 'number') return null;
    if (!Array.isArray(parsed.items)) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.items;
  } catch {
    return null;
  }
}

export function useThoughts() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) 命中缓存就直接用，不打 API
    const cached = readCache();
    if (cached) {
      setItems(cached);
      setLoading(false);
      return;
    }

    // 2) 没缓存才真正请求
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
        // 按 updated_at 倒序：最近的随想排在前
        const sorted = result.sort((a, b) =>
          b.updated_at > a.updated_at ? 1 : -1,
        );
        setItems(sorted);
        writeCache(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return {items, error, loading};
}

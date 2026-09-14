// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// 自定义代码高亮主题：暖砂柔光 / 沙丘暮色
// 默认的 github + dracula 是冷调配色，与站点暖色主题冲突，
// 详见 src/config/prismThemes.js
const { warmSandTheme, duneDuskTheme } = require('./src/config/prismThemes');

// 首页需要的构建期数据（书架统计、随笔摘要）
// 在构建时扫描 docs / blog 目录算出，详见 src/config/homepageData.js
const { buildHomepageData } = require('./src/config/homepageData');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '倚码千言',
  tagline: 'Hackerleon\'s Website',  // 网站标语
  url: 'https://codethousand.cn',
  baseUrl: '/',
  onBrokenLinks: 'warn',  // Docusaurus 在检测到无效链接时的行为
  favicon: 'img/favicon.ico',
  organizationName: 'anchem', // Usually your GitHub org/user name.
  projectName: 'anchem.github.io', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  noIndex: false,  // 设置为true表示告知搜索引擎不要索引您的站点
  // 供前端读取的自定义字段（首页书架统计、随笔摘要等）
  customFields: {
    homepageData: buildHomepageData()
  },
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans']
  },
  scripts: [
    { 
      src: '/js/baiduanalytics.js', 
      async: true
    } 
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js')
        },
        blog: {
          showReadingTime: true,
          postsPerPage: 10,
          blogSidebarCount: 'ALL',
          blogSidebarTitle: '所有文章',
          readingTime: ({content, frontMatter, defaultReadingTime}) =>
            defaultReadingTime({content, options: {wordsPerMinute: 500}}),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-30W692FC25',
          anonymizeIP: true
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.5
        }
      })
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // 主题切换：默认「暖砂柔光」（浅色），用户可手动切到「沙丘暮色」（深色）
      // 具体配色定义在 src/css/custom.css
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        // false = 首次访问固定用浅色，不跟随系统；
        // 想让站点跟随系统深色设置，把这里改成 true 即可。
        respectPrefersColorScheme: false
      },
      navbar: {
        title: '倚码千言',
        logo: {
          alt: '倚码千言 Logo',
          src: 'img/logo.svg'
        },
        hideOnScroll: true,  // 滚动时自动隐藏导航栏
        items: [
          {to: '/docs/softwaremaster',label: '软件大师之路',position: 'right'},
          {to: '/docs/selfdevelop',label: '个人成长',position: 'right'},
          {to: '/docs/growthtree',label: '阿不成长树',position: 'right'},
          {to: '/docs/lifeforfun',label: '为乐而生',position: 'right'},
          {to: '/blog', label: '随笔', position: 'right'},
          {to: '/thoughts', label: '随想', position: 'right'},
          {to: '/about', label: '关于', position: 'right'}
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            label: 'GitHub',
            href: 'https://github.com/anchem'
          },
          {
            label: '关于',
            to: '/about'
          }
        ],
        // <p>本站所有内容遵循 <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> 许可协议</p>
        copyright: `<p>Copyright © ${new Date().getFullYear()} 倚码千言, Inc. 采用 Docusaurus 构建.</p><p><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="/img/by-nc-sa.svg" /></a><br /></p>`,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5
      },
      prism: {
        theme: warmSandTheme,
        darkTheme: duneDuskTheme,
        additionalLanguages: ['java', 'markdown', 'c', 'python', 'bash', 'git', 'sql']
      },
      algolia: {
        // Algolia 提供的应用 ID
        appId: '6NMDS0XZF9',
        //  公开 API 密钥：提交它没有危险
        apiKey: 'd8697d8c70aba064bbc819d6f3fbaf92',
        indexName: 'codethousand',
        // 可选：见下文
        contextualSearch: true,
        // 可选：声明哪些域名需要用 window.location 型的导航而不是 history.push。 适用于 Algolia 配置会爬取多个文档站点，而我们想要用 window.location.href 在它们之间跳转时。
        // 可选：Algolia 搜索参数
        searchParameters: {},
        // 可选：搜索页面的路径，默认启用（可以用 `false` 禁用）
        searchPagePath: 'search'
        // ……其他 Algolia 参数
      }
    }),
};

module.exports = config;

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '倚码千言',
  tagline: 'Hackerleon\'s Website',  // 网站标语
  url: 'https://codethousand.cn',
  baseUrl: '/',
  onBrokenLinks: 'warn',  // Docusaurus 在检测到无效链接时的行为
  onBrokenMarkdownLinks: 'warn',  // Docusaurus 在检测到无效 Markdown 链接时的行为
  favicon: 'img/favicon.ico',
  organizationName: 'anchem', // Usually your GitHub org/user name.
  projectName: 'anchem.github.io', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  noIndex: true,  // 设置为false表示告知搜索引擎不要索引您的站点
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans']
  },
  // stylesheets: [ 'https://cdnjs.cloudflare.com/ajax/libs/gitalk/1.7.2/gitalk.min.css' ],
  scripts: [ 
    { 
      src: '/js/baiduanalytics.js', 
      async: true, 
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
          anonymizeIP: true,
        }
      })
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '倚码千言',
        logo: {
          alt: '倚码千言 Logo',
          src: 'img/logo.svg',
        },
        hideOnScroll: true,  // 滚动时自动隐藏导航栏
        items: [
          // {to: '/thoughts', label: '随想', position: 'left'},
          {
            to: 'docs/softwaremaster',
            label: '软件大师之路',
            position: 'left'
          },
          {
            to: 'docs/selfdevelop',
            label: '个人成长',
            position: 'left'
          },
          {
            to: 'docs/growthtree',
            label: '阿不成长树',
            position: 'left'
          },
          {to: '/blog', label: '随笔', position: 'left'},
          {to: '/thoughts', label: '随想', position: 'right'},
          {to: '/about', label: '关于', position: 'right'}
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '站点主题',
            items: [
              {
                label: '软件大师之路',
                to: 'docs/softwaremaster',
              },
              {
                label: '个人成长',
                to: 'docs/selfdevelop',
              },
              {
                label: '阿不成长树',
                to: 'docs/growthtree',
              }
            ],
          },
          {
            title: '我的项目',
            items: [
              {
                label: '高质量软件工作手册',
                href: 'https://codethousand.cn/workbook/#/',
              }
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '关于',
                to: 'about',
              },
              {
                label: '随想',
                to: 'thoughts',
              },
              {
                label: '随笔',
                to: 'blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/anchem',
              },
            ],
          },
        ],
        copyright: `<p>Copyright © ${new Date().getFullYear()} 倚码千言, Inc. 采用 Docusaurus 构建.</p><p>本站所有内容遵循 <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a></p><p>转载须注明署名和出处，不可用于商业用途，且需要以相同方式共享。</p><p><a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="/img/by-nc-sa.svg" /></a><br /></p>`,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['java', 'markdown', 'c', 'python', 'bash', 'git', 'sql'],
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
        searchPagePath: 'search',
        // ……其他 Algolia 参数
      }
    }),
};

module.exports = config;

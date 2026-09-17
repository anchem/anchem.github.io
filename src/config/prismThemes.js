/**
 * 倚码千言 · 代码高亮主题（Prism / prism-react-renderer）
 *
 * 为什么需要自定义：
 *   Docusaurus 默认浅色用 github 主题、深色用 dracula 主题，
 *   两者的背景与 token 配色都是冷调（纯白 / 紫黑），
 *   会与「春晓 / 夜幕」的调性冲突 —— 尤其浅色下的代码块
 *   是页面里唯一的大面积深色区块，冷暖差异非常显眼。
 *
 * 设计约定（v3）：
 *   1. 浅色主题下代码块用「松柏最深处的墨绿」#0B2B1E：
 *      在淡蓝的晴空页面里，这块深绿既是一次节奏停顿，
 *      也呼应「翠绿松柏」——它和 Hero 面板是同一支绿系。
 *   2. 深色主题下代码块用「比夜空更深一档的墨蓝」#080E1C：
 *      夜空页面上再压一块更深的蓝，代码块就成了「夜里的一口井」，
 *      并且和 custom.css 的 --sand-pre-background 一致。
 *   3. token 配色同源：嫩绿（关键字）、黄绿（字符串）、金绿（数字）、
 *      陶土红（删除）、暖灰绿（注释）。深色版整体 token 略亮，
 *      避免在暗底上发灰。
 *
 * 注意：codeBlockContainer 的背景用的是 --prism-background-color 内联变量，
 *      来自这里 plain.backgroundColor，无法在 custom.css 里覆盖，
 *      所以调整代码块底色要改这个文件（同时改 custom.css 的
 *      --ifm-pre-background，否则代码块圆角内会露出一圈另一种绿）。
 */

/** 浅色主题「春晓」下的代码块：松林墨绿底
    底色必须与 custom.css 浅色下的 --ifm-pre-background 保持一致（#0B2B1E）。 */
const springDawnTheme = {
  plain: {
    color: '#E6F0EA',
    backgroundColor: '#0B2B1E',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#7D9286', fontStyle: 'italic' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: '#A8BDB2' },
    },
    {
      types: ['keyword', 'atrule', 'important'],
      style: { color: '#7BC99A' },
    },
    {
      types: ['string', 'char', 'inserted', 'url'],
      style: { color: '#B5D99C' },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol'],
      style: { color: '#D4C47A' },
    },
    {
      types: ['function', 'selector'],
      style: { color: '#9DDBB8' },
    },
    {
      types: ['class-name', 'builtin', 'tag', 'attr-value'],
      style: { color: '#6FC0D9' },
    },
    {
      types: ['property', 'attr-name', 'variable'],
      style: { color: '#C8D8CF' },
    },
    {
      types: ['deleted'],
      style: { color: '#D98A80' },
    },
    {
      types: ['regex', 'entity'],
      style: { color: '#C7A9D6' },
    },
    {
      types: ['bold'],
      style: { fontWeight: 'bold' },
    },
    {
      types: ['italic'],
      style: { fontStyle: 'italic' },
    },
  ],
};

/** 深色主题「夜幕」下的代码块：比夜空更深一档的墨蓝
    同样与 custom.css 深色下的 --ifm-pre-background（#080E1C）保持一致。
    token 沿用同一支绿系，在墨蓝底上读起来像终端 —— 冷底绿字本来就是
    程序员最熟悉的组合，不需要为了「配夜景」把代码染成蓝色。 */
const nightSkyTheme = {
  plain: {
    color: '#D5E6DC',
    backgroundColor: '#080E1C',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#6B7C72', fontStyle: 'italic' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: '#95AAA0' },
    },
    {
      types: ['keyword', 'atrule', 'important'],
      style: { color: '#8DD4AC' },
    },
    {
      types: ['string', 'char', 'inserted', 'url'],
      style: { color: '#C0DE98' },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol'],
      style: { color: '#E0CC80' },
    },
    {
      types: ['function', 'selector'],
      style: { color: '#A8E4C4' },
    },
    {
      types: ['class-name', 'builtin', 'tag', 'attr-value'],
      style: { color: '#82CEE0' },
    },
    {
      types: ['property', 'attr-name', 'variable'],
      style: { color: '#B8CCBF' },
    },
    {
      types: ['deleted'],
      style: { color: '#E09A90' },
    },
    {
      types: ['regex', 'entity'],
      style: { color: '#CFB2DE' },
    },
    {
      types: ['bold'],
      style: { fontWeight: 'bold' },
    },
    {
      types: ['italic'],
      style: { fontStyle: 'italic' },
    },
  ],
};

module.exports = { springDawnTheme, nightSkyTheme };

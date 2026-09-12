/**
 * 倚码千言 · 代码高亮主题（Prism / prism-react-renderer）
 *
 * 为什么需要自定义：
 *   Docusaurus 默认浅色用 github 主题、深色用 dracula 主题，
 *   两者的背景与 token 配色都是冷调（纯白 / 紫黑），
 *   会与「暖砂柔光 / 沙丘暮色」的暖色调性冲突，尤其是代码块
 *   在浅色下是页面里唯一的大面积深色区块，冷暖差异非常显眼。
 *
 * 设计约定：
 *   1. 两套主题的代码块都是「暖色深底 + 米白文字」——
 *      浅色下形成节奏停顿，深色下与页面融为一体。
 *   2. token 配色同源：琥珀（关键字）、沙金（数字）、
 *      鼠尾草绿（字符串）、陶土（删除）、暖灰（注释）。
 *   3. 深色版整体比浅色版更深一档、token 略亮，避免在暗底上发灰。
 *
 * 注意：codeBlockContainer 的背景用的是 --prism-background-color 内联变量，
 *      来自这里 plain.backgroundColor，无法在 custom.css 里覆盖，
 *      所以调整代码块底色要改这个文件。
 */

/** 浅色主题「暖砂柔光」下的代码块：暖褐深底 */
const warmSandTheme = {
  plain: {
    color: '#F2E7DA',
    backgroundColor: '#33291F',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#8E7E6D', fontStyle: 'italic' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: '#BFAE9A' },
    },
    {
      types: ['keyword', 'atrule', 'important'],
      style: { color: '#E59A5C' },
    },
    {
      types: ['string', 'char', 'inserted', 'url'],
      style: { color: '#A9C58C' },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol'],
      style: { color: '#E5B96F' },
    },
    {
      types: ['function', 'selector'],
      style: { color: '#EFC48E' },
    },
    {
      types: ['class-name', 'builtin', 'tag', 'attr-value'],
      style: { color: '#E9A96A' },
    },
    {
      types: ['property', 'attr-name', 'variable'],
      style: { color: '#D9C3A4' },
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

/** 深色主题「沙丘暮色」下的代码块：暖黑，更深一档 */
const duneDuskTheme = {
  plain: {
    color: '#EFE2D3',
    backgroundColor: '#120E0A',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#7E6F5F', fontStyle: 'italic' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: '#C3B29D' },
    },
    {
      types: ['keyword', 'atrule', 'important'],
      style: { color: '#F0AC6C' },
    },
    {
      types: ['string', 'char', 'inserted', 'url'],
      style: { color: '#B2CE96' },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol'],
      style: { color: '#EDC47C' },
    },
    {
      types: ['function', 'selector'],
      style: { color: '#F5CE9A' },
    },
    {
      types: ['class-name', 'builtin', 'tag', 'attr-value'],
      style: { color: '#F0B478' },
    },
    {
      types: ['property', 'attr-name', 'variable'],
      style: { color: '#DCC7AC' },
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

module.exports = { warmSandTheme, duneDuskTheme };

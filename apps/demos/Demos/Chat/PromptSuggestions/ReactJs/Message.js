import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeStringify from 'rehype-stringify';
import HTMLReactParser from 'html-react-parser';

function convertToHtml(value) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMinifyWhitespace)
    .use(rehypeStringify)
    .processSync(value)
    .toString();
}
const Message = ({ text }) => (
  <div className="chat-messagebubble-text">{HTMLReactParser(convertToHtml(text))}</div>
);
export default Message;

import React from 'react';
import type { FC } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeStringify from 'rehype-stringify';
import HTMLReactParser from 'html-react-parser';

function convertToHtml(value: string): string {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMinifyWhitespace)
    .use(rehypeStringify)
    .processSync(value)
    .toString();
}

interface MessageProps {
  text: string;
}

const Message: FC<MessageProps> = ({ text }: MessageProps) => (
  <div className='chat-messagebubble-text'>
    {HTMLReactParser(convertToHtml(text))}
  </div>
);

export default Message;

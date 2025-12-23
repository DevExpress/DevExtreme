import React, { useCallback, useState } from 'react';
import type { FC } from 'react';
import { Button, type ButtonTypes } from 'devextreme-react/button';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeStringify from 'rehype-stringify';
import HTMLReactParser from 'html-react-parser';

import { REGENERATION_TEXT } from './data.ts';

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
  onRegenerateButtonClick: ButtonTypes.Properties['onClick'];
}

const Message: FC<MessageProps> = ({ text, onRegenerateButtonClick }: MessageProps) => {
  const [icon, setIcon] = useState<string>('copy');

  const onCopyButtonClick = useCallback(() => {
    navigator.clipboard?.writeText(text);
    setIcon('check');

    setTimeout(() => {
      setIcon('copy');
    }, 2500);
  }, [text]);

  if (text === REGENERATION_TEXT) {
    return <span>{REGENERATION_TEXT}</span>;
  }

  return (
    <>
      <div className='chat-messagebubble-text'>
        {HTMLReactParser(convertToHtml(text))}
      </div>
      <div className='bubble-button-container'>
        <Button
          icon={icon}
          stylingMode='text'
          hint='Copy'
          onClick={onCopyButtonClick}
        />
        <Button
          icon='refresh'
          stylingMode='text'
          hint='Regenerate'
          onClick={onRegenerateButtonClick}
        />
      </div>
    </>
  );
};

export default Message;

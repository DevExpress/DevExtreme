import React, { useCallback, useState, FC } from 'react';
import Button from 'devextreme-react/button';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeStringify from 'rehype-stringify';
import HTMLReactParser from 'html-react-parser';

import { Properties as dxButtonProperties } from 'devextreme/ui/button';
import { REGENERATION_TEXT } from './data.ts';

function convertToHtml(value: string): string {
  const result = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMinifyWhitespace)
    .use(rehypeStringify)
    .processSync(value)
    .toString();

  return result;
}

interface MessageProps {
  text: string;
  onRegenerateButtonClick: dxButtonProperties['onClick'];
}

const Message: FC<MessageProps> = ({ text, onRegenerateButtonClick }) => {
  const [icon, setIcon] = useState('copy');

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
    <React.Fragment>
      <div className='dx-chat-messagebubble-text'>
        {HTMLReactParser(convertToHtml(text))}
      </div>
      <div className='dx-bubble-button-container'>
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
    </React.Fragment>
  );
};

export default Message;

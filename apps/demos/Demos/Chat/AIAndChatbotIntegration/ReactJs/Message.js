import React, { useState } from 'react';
import Button from 'devextreme-react/button';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import HTMLReactParser from 'html-react-parser';

import { REGENERATION_TEXT } from './data.js';

function convertToHtml(value) {
    const result = unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .processSync(value)
        .toString();

    return result;
}

function Message({ message }, onRegenerateButtonClick) {
    const [icon, setIcon] = useState('copy');

    if (message.text === REGENERATION_TEXT) {
        return <span>{REGENERATION_TEXT}</span>;
    }
  
    function onCopyButtonClick() {
        navigator.clipboard?.writeText(message.text);
        setIcon('check');
  
        setTimeout(() => {
            setIcon('copy');
        }, 2500);
    }

    return (
      <React.Fragment>
        <div 
          className='dx-chat-messagebubble-text'
        >
            {HTMLReactParser(convertToHtml(message.text))}
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
    )
}

export default Message;

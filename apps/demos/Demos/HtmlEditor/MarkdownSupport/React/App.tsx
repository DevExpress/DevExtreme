import React, { useCallback, useState } from 'react';
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkStringify from "remark-stringify";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import rehypeStringify from "rehype-stringify";
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';
import { markup } from './data.ts';

const headerValues = [false, 1, 2, 3, 4, 5];
const headerOptions = {
  inputAttr: {
    'aria-label': 'Header',
  },
};
const converter = {
  toHtml(value) {
    const result = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(value)
      .toString();

    return result;
  },
  fromHtml(value) {
    const result = unified()
      .use(rehypeParse)
      .use(rehypeRemark)
      .use(remarkStringify)
      .processSync(value)
      .toString();

    return result;
  },
};

export default function App() {
  const [valueContent, setValueContent] = useState(markup);

  const valueChanged = useCallback((e: { value?: string; }) => {
    setValueContent(e.value);
  }, [setValueContent]);

  return (
    <div className="widget-container">
      <HtmlEditor
        converter={converter}
        height={300}
        defaultValue={valueContent}
        onValueChanged={valueChanged}
      >
        <Toolbar>
          <Item name="undo" />
          <Item name="redo" />
          <Item name="separator" />
          <Item name="bold" />
          <Item name="italic" />
          <Item name="separator" />
          <Item name="header" acceptedValues={headerValues} options={headerOptions} />
          <Item name="separator" />
          <Item name="orderedList" />
          <Item name="bulletList" />
        </Toolbar>
      </HtmlEditor>

      <div className="options">
        <div className="value-title">
          Markdown Preview
        </div>
        <div className="value-content" tabIndex={0}>
          {valueContent}
        </div>
      </div>
    </div>
  );
}

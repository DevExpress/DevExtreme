import React, { useCallback, useState } from 'react';
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';
import { markup } from './data.js';

const headerValues = [false, 1, 2, 3, 4, 5];
const headerOptions = {
  inputAttr: {
    'aria-label': 'Header',
  },
};
const converter = {
  toHtml(value) {
    // @ts-expect-error
    const result = unified()
      // @ts-expect-error
      .use(remarkParse)
      // @ts-expect-error
      .use(remarkRehype)
      // @ts-expect-error
      .use(rehypeStringify)
      .processSync(value)
      .toString();
    return result;
  },
  fromHtml(value) {
    // @ts-expect-error
    const result = unified()
      // @ts-expect-error
      .use(rehypeParse)
      // @ts-expect-error
      .use(rehypeRemark)
      // @ts-expect-error
      .use(remarkStringify)
      .processSync(value)
      .toString();
    return result;
  },
};
export default function App() {
  const [valueContent, setValueContent] = useState(markup);
  const valueChanged = useCallback(
    (e) => {
      setValueContent(e.value);
    },
    [setValueContent],
  );
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
          <Item
            name="header"
            acceptedValues={headerValues}
            options={headerOptions}
          />
          <Item name="separator" />
          <Item name="orderedList" />
          <Item name="bulletList" />
        </Toolbar>
      </HtmlEditor>

      <div className="options">
        <div className="value-title">Markdown Preview</div>
        <div
          className="value-content"
          tabIndex={0}
        >
          {valueContent}
        </div>
      </div>
    </div>
  );
}

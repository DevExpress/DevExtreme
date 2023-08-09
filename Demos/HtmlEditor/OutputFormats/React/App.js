import React from 'react';
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';
import ButtonGroup, { Item as ButtonItem } from 'devextreme-react/button-group';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import { markup } from './data.js';
import 'devextreme/ui/html_editor/converters/markdown';

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
const defaultSelectedItemKeys = ['Html'];
const fontSizeOptions = {
  inputAttr: {
    'aria-label': 'Font size',
  },
};
const fontFamilyOptions = {
  inputAttr: {
    'aria-label': 'Font family',
  },
};

export default function App() {
  const [valueContent, setValueContent] = React.useState(markup);
  const [editorValueType, setEditorValueType] = React.useState('html');

  const valueChanged = React.useCallback((e) => {
    setValueContent(e.value);
  }, [setValueContent]);

  const valueTypeChanged = React.useCallback((e) => {
    setEditorValueType(e.addedItems[0].text.toLowerCase());
  }, [setEditorValueType]);

  const prettierFormat = React.useCallback((text) => {
    if (editorValueType === 'html') {
      return prettier.format(text, {
        parser: 'html',
        plugins: [parserHtml],
      });
    }
    return text;
  }, [editorValueType]);

  return (
    <div className="widget-container">
      <HtmlEditor
        height={300}
        defaultValue={valueContent}
        valueType={editorValueType}
        onValueChanged={valueChanged}
      >
        <Toolbar>
          <Item name="undo" />
          <Item name="redo" />
          <Item name="separator" />
          <Item
            name="size"
            acceptedValues={sizeValues}
            options={fontSizeOptions}
          />
          <Item
            name="font"
            acceptedValues={fontValues}
            options={fontFamilyOptions}
          />
          <Item name="separator" />
          <Item name="bold" />
          <Item name="italic" />
          <Item name="strike" />
          <Item name="underline" />
          <Item name="separator" />
          <Item name="alignLeft" />
          <Item name="alignCenter" />
          <Item name="alignRight" />
          <Item name="alignJustify" />
          <Item name="separator" />
          <Item name="color" />
          <Item name="background" />
        </Toolbar>
      </HtmlEditor>

      <div className="options">
        <ButtonGroup
          onSelectionChanged={valueTypeChanged}
          defaultSelectedItemKeys={defaultSelectedItemKeys}
        >
          <ButtonItem text="Html" />
          <ButtonItem text="Markdown" />
        </ButtonGroup>
        <div className="value-content" tabIndex={0}>
          {prettierFormat(valueContent)}
        </div>
      </div>
    </div>
  );
}

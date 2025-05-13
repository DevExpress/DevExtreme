import React from 'react';
import HtmlEditor, {
  Toolbar,
  Item,
} from 'devextreme-react/html-editor';
import {
  markup,
  commands,
  aiIntegration,
} from './data.ts';

export default function App() {
  return (
    <HtmlEditor
      height={530}
      defaultValue={markup}
      aiIntegration={aiIntegration}
    >
      <Toolbar>
        <Item name="ai" commands={commands} />
        <Item name="separator" />
        <Item name="undo" />
        <Item name="redo" />
      </Toolbar>
    </HtmlEditor>
  );
}

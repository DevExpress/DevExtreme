import React from 'react';
import HtmlEditor, {
  Toolbar,
  Item,
} from 'devextreme-react/html-editor';
import {
  markup,
  toolbarItems,
  aiIntegration,
} from './data.ts';

export default function App() {
  return (
    <HtmlEditor
      height={530}
      defaultValue={markup}
      aiIntegration={aiIntegration}
    >
      <Toolbar items={toolbarItems}></Toolbar>
    </HtmlEditor>
  );
}

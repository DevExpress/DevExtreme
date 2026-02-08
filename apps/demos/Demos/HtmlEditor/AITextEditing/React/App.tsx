import React from 'react';
import HtmlEditor, { Toolbar, ToolbarItem, Command } from 'devextreme-react/html-editor';
import { markup, extractKeywordsPrompt, aiIntegration } from './data.ts';

export default function App() {
  return (
    <HtmlEditor
      height={530}
      defaultValue={markup}
      aiIntegration={aiIntegration}
    >
      <Toolbar>
        <ToolbarItem name="ai">
          <Command name="summarize" />
          <Command name="proofread" />
          <Command name="expand" />
          <Command name="shorten" />
          <Command name="changeStyle" />
          <Command name="changeTone" />
          <Command name="translate" />
          <Command name="askAI" />
          <Command
            name="custom"
            text="Extract Keywords"
            prompt={extractKeywordsPrompt}
          />
        </ToolbarItem>
        <ToolbarItem name="separator" />
        <ToolbarItem name="undo" />
        <ToolbarItem name="redo" />
      </Toolbar>
    </HtmlEditor>
  );
}

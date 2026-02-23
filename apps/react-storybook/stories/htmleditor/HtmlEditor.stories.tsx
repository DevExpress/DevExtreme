import React from 'react';
import { HtmlEditor, Toolbar, Item, IHtmlEditorOptions, IItemProps } from 'devextreme-react/html-editor';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { defaultToolbarItems, fullToolbarItems } from './data';
import { AIIntegration } from 'devextreme/artifacts/npm/devextreme/common/ai-integration';

const meta: Meta<typeof HtmlEditor> = {
  title: 'Editors/HtmlEditor',
  component: HtmlEditor,
};

export default meta;

type HtmlEditorRenderArgs = IHtmlEditorOptions & {
  items: IItemProps[],
};

export const Overview: StoryObj<HtmlEditorRenderArgs> = {
  argTypes: {
    items: {
      options: ['default', 'full'],
      mapping: {
        default: defaultToolbarItems,
        full: fullToolbarItems,
      },
      control: {
        type: 'select',
        labels: {
          default: 'Default Toolbar',
          full: 'Full Toolbar',
        },
      },
    },
    rtlEnabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    disabled: { control: 'boolean'},
    height: { control: 'number' },
    width: { control: 'text' },
  },
  args: {
    items: defaultToolbarItems,
    rtlEnabled: false,
    readOnly: false,
    disabled: false,
    height: 500,
    width: '100%',
  },
  render: ({ items, ...editorProps }: HtmlEditorRenderArgs) => (
      <div style={{ width: '100%' }}>
        <HtmlEditor {...editorProps} defaultValue="<p>Hello, world!</p>">
          <Toolbar>
            {items.map((item, index) => (
              <Item key={index} {...item} />
            ))}
          </Toolbar>
        </HtmlEditor>
      </div>
    ),
  }

export const WithAI: StoryObj<HtmlEditorRenderArgs> = {
  args: {
    items: [
      ...defaultToolbarItems,
      { name: 'separator' },
      { name: 'ai' }
    ],
    height: 500,
    width: '100%',
  },
  render: ({ items, ...editorProps }: HtmlEditorRenderArgs) => (
      <div style={{ width: '100%' }}>
        <HtmlEditor
          {...editorProps}
          defaultValue="<p>What is the capital of France?</p>"
          aiIntegration={{} as AIIntegration}
        >
          <Toolbar>
            {items.map((item, index) => (
              <Item key={index} {...item} />
            ))}
          </Toolbar>
        </HtmlEditor>
      </div>
    ),
  }
  
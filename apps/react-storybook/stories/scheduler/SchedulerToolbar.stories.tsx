import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Scheduler, Toolbar, ToolbarItem } from "devextreme-react/cjs/scheduler";

const meta: Meta<typeof Scheduler> = {
  title: 'Components/Scheduler/Toolbar',
  component: Scheduler,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Scheduler>;

const commonStoryProperties: Story = {
  render({
           toolbar,
           useDropDownViewSwitcher
         }) {
    const items = toolbar?.items || [];

    return <Scheduler views={['day', 'week', 'workWeek', 'month']}  currentView={'week'} useDropDownViewSwitcher={useDropDownViewSwitcher}>
      <Toolbar {...toolbar}>
        {items.map((item) => (
          typeof item === 'string' ? <ToolbarItem name={item} />: <ToolbarItem {...item} />
        ))}
      </Toolbar>
    </Scheduler>
  }
}

export const Overview: Story = {
  args: {
    toolbar: {
      multiline: false,
      disabled: false,
      visible: true,
      items: [
        'dateNavigator',
        'viewSwitcher',
      ],
    },
  },
  argTypes: {
    useDropDownViewSwitcher: {
      control: 'boolean',
    },
    toolbar: {
      control: 'text',
    },
  },
  ...commonStoryProperties,
}

export const CustomComponents: Story = {
  args: {
    toolbar: {
      multiline: false,
      items: [
        'dateNavigator',
        { location: 'before', template: '<div>Custom Item</div>' },
        {
          location: 'before',
          widget: 'dxSelectBox',
          options: {
            items: [{ id: 1, text: 'Samantha Bright', color: '#727bd2' }],
            displayExpr: 'text',
            valueExpr: 'id',
            searchEnabled: true,
            showSelectionControls: true,
          },
        },
      ],
    },
  },
}

export const HidedToolbar: Story = {
  args: {
    toolbar: {
      visible: false,
    },
  },
}

export const MultilineToolbar: Story = {
  args: {
    toolbar: {
      multiline: true,
      items: Array.from({ length: 20 }).map((_, index) => ({
        location: 'before',
        locateInMenu: 'auto',
        widget: 'dxButton',
        options: { text: `Button ${index + 1}` },
      })),
    },
  },
}

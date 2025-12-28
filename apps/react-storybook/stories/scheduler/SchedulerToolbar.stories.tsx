import type { Meta, StoryObj } from "@storybook/react-webpack5";
import dxScheduler from "devextreme/ui/scheduler";
import { wrapDxWithReact } from "../utils";
import { assignees } from "./data";

const Scheduler = wrapDxWithReact(dxScheduler);

const meta: Meta<typeof Scheduler> = {
  title: 'Components/Scheduler/Toolbar',
  component: Scheduler,
  parameters: {
    layout: 'padded',
  },
};
const defaultOptions = {
  height: 400,
  views: ['day', 'week', 'workWeek', 'month'],
  currentView: 'workWeek',
};
const defaultArgTypes = {
  height: { control: 'number' },
  views: { control: 'object' },
  currentView: {
    control: 'select',
    options: defaultOptions.views,
  },
}
const toolbarVisibleArg = {
  'toolbar.visible': {
    control: 'radio',
    options: [undefined, true, false],
    defaultValue: undefined,
    value: undefined,
  },
}

const buttons = Array.from({ length: 30 }).map((_, index) => ({
  location: 'before',
  locateInMenu: 'auto',
  widget: 'dxButton',
  options: { text: `Button ${index + 1}` },
}));

export default meta;

type Story = StoryObj<typeof Scheduler>;

export const Overview: Story = {
  args: {
    'toolbar.items': ['dateNavigator', 'viewSwitcher'],
    'toolbar.visible': undefined,
    'toolbar.multiline': undefined,
    'toolbar.disabled': undefined,
    useDropDownViewSwitcher: undefined,
    ...defaultOptions,
  },
  argTypes: {
    useDropDownViewSwitcher: { control: 'boolean' },
    'toolbar.items': {
      control: 'select',
      options: ['Default', 'All built-in', 'Customized navigator', 'A lot of items', 'Demo set'],
      mapping: {
        'Default': ['dateNavigator', 'viewSwitcher'],
        'Customized navigator': [
          {
            location: 'before',
            name: 'dateNavigator',
            options: {
              items: ['prev', 'next'],
            },
          },
          'viewSwitcher'
        ],
        'All built-in': ['today', 'dateNavigator', 'viewSwitcher'],
        'A lot of items': [
          { location: 'before', template: '<div>Buttons:</div>' },
          ...buttons
        ],
        'Demo set': ['today', 'dateNavigator', {
          location: 'before',
          locateInMenu: 'auto',
          widget: 'dxButton',
          options: {
            icon: 'plus',
            text: 'New Event',
          },
        }, {
          location: 'center',
          locateInMenu: 'auto',
          widget: 'dxTagBox',
          options: {
            items: assignees,
            displayExpr: 'text',
            valueExpr: 'id',
            searchEnabled: true,
            showSelectionControls: true,
            maxDisplayedTags: 1,
            inputAttr: {
              'aria-label': 'Assignees',
            },
            width: 200,
          },
        }, 'viewSwitcher'],
      },
      defaultValue: 'Default',
      value: 'Default',
    },
    'toolbar.multiline': { control: 'boolean' },
    'toolbar.disabled': { control: 'boolean' },
    ...toolbarVisibleArg,
    ...defaultArgTypes,
  },
}

export const CustomComponents: Story = {
  args: {
    'toolbar.multiline': false,
    'toolbar.items': [
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
    ...defaultOptions,
  },
  argTypes: {
    'toolbar.multiline': { control: 'boolean' },
    ...defaultArgTypes,
  },
}

export const HidedToolbar: Story = {
  args: {
    'toolbar.visible': undefined,
    'toolbar.items': [],
    ...defaultOptions,
  },
  argTypes: {
    ...toolbarVisibleArg,
    ...defaultArgTypes,
  },
}

export const MultilineToolbar: Story = {
  args: {
    'toolbar.multiline': true,
    'toolbar.items': buttons,
    ...defaultOptions,
  },
  argTypes: {
    'toolbar.multiline': { control: 'boolean' },
    ...defaultArgTypes,
  },
}

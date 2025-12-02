import type { Meta, StoryObj } from "@storybook/react";
import dxScheduler from "devextreme/ui/scheduler";
import { wrapDxWithReact } from "../utils";
import { data, resources, resourcesWithIcons } from "./data";

const Scheduler = wrapDxWithReact(dxScheduler);

const meta: Meta<typeof Scheduler> = {
  title: 'Components/Scheduler/AppointmentForm',
  component: Scheduler,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof Scheduler>;

export const Overview: Story = {
  args: {
    'editing.allowAdding': true,
    'editing.allowUpdating': true,
    'editing.allowDeleting': true,
    'editing.allowDragging': true,
    'editing.allowResizing': true,
    'editing.allowTimeZoneEditing': false,
    'editing.form.iconsShowMode': 'main',
    resources,
    height: 600,
    views: ['day', 'week', 'workWeek', 'month'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 29),
    dataSource: data,
  },
  argTypes: {
    'editing.allowAdding': { 
      control: 'boolean',
    },
    'editing.allowUpdating': { 
      control: 'boolean',
    },
    'editing.allowTimeZoneEditing': { 
      control: 'boolean',
    },
    'editing.form.iconsShowMode': {
      control: 'radio',
      options: ['both', 'main', 'recurrence', 'never'],
    },
    'showResources': {
      control: 'boolean',
    },
    'resources': {
      control: 'radio',
      options: ['enabled', 'enabledWithIcons', 'disabled'],
      additionalProps: {
        default: 'enabled'
      },
      mapping: {
        enabled: resources,
        enabledWithIcons: resourcesWithIcons,
        disabled: [],
      }
    }
  },
}

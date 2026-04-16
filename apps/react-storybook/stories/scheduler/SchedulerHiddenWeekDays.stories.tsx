import type { Meta, StoryObj } from "@storybook/react-webpack5";
import dxScheduler from "devextreme/ui/scheduler";
import { wrapDxWithReact } from "../utils";
import { data, resources } from "./data";

const Scheduler = wrapDxWithReact(dxScheduler);

const viewNames = ['day', 'week', 'workWeek', 'month', 'agenda', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

const meta: Meta<typeof Scheduler> = {
  title: 'Components/Scheduler/HiddenWeekDays',
  component: Scheduler,
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof Scheduler>;

export const Overview: Story = {
  args: {
    height: 600,
    views: viewNames,
    currentView: 'week',
    currentDate: new Date(2021, 3, 26),
    firstDayOfWeek: 0,
    startDayHour: 9,
    endDayHour: 22,
    dataSource: data,
    resources,
    hiddenWeekDays: [],
  },
  argTypes: {
    height: { control: 'number' },
    views: { control: 'object' },
    hiddenWeekDays: { control: 'object' },
    currentView: { control: 'select', options: viewNames },
  },
};

import type { Meta, StoryObj } from "@storybook/react-webpack5";
import dxScheduler from "devextreme/ui/scheduler";
import { wrapDxWithReact } from "../utils";
import { resources } from "./data";

const Scheduler = wrapDxWithReact(dxScheduler);

const data = [
  {
    text: '1 minute',
    roomId: 1,
    assigneeId: [1],
    priorityId: 1,
    startDate: new Date(2026, 2, 15, 10, 0),
    endDate: new Date(2026, 2, 15, 10, 1)
  },
  {
    text: '5 minutes',
    roomId: 1,
    assigneeId: [2],
    priorityId: 1,
    startDate: new Date(2026, 2, 16, 10, 0),
    endDate: new Date(2026, 2, 16, 10, 5)
  },
  {
    text: '15 minutes',
    roomId: 2,
    assigneeId: [3],
    priorityId: 2,
    startDate: new Date(2026, 2, 17, 10, 0),
    endDate: new Date(2026, 2, 17, 10, 15)
  },
  {
    text: '30 minutes',
    roomId: 2,
    assigneeId: [1],
    priorityId: 2,
    startDate: new Date(2026, 2, 18, 10, 0),
    endDate: new Date(2026, 2, 18, 10, 30)
  },
  {
    text: '46 minutes',
    roomId: 3,
    assigneeId: [2],
    priorityId: 1,
    startDate: new Date(2026, 2, 19, 10, 0),
    endDate: new Date(2026, 2, 19, 10, 46)
  },
  {
    text: '1 hour',
    roomId: 2,
    assigneeId: [4],
    priorityId: 1,
    startDate: new Date(2026, 2, 20, 10, 0),
    endDate: new Date(2026, 2, 20, 11, 0)
  },
];

const viewNames = ['day', 'week', 'workWeek', 'month', 'agenda', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

const meta: Meta<typeof Scheduler> = {
  title: 'Components/Scheduler/SnapToCellsMode',
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
    currentDate: new Date(2026, 2, 15),
    startDayHour: 9,
    endDayHour: 22,
    dataSource: data,
    resources,
    snapToCellsMode: 'auto',
  },
  argTypes: {
    height: { control: 'number' },
    views: { control: 'object' },
    snapToCellsMode: { control: 'select', options: ['always', 'auto', 'never'] },
    currentView: { control: 'select', options: viewNames },
  },
};

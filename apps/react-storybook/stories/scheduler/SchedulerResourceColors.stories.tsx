import type { Meta, StoryObj } from "@storybook/react-webpack5";
import dxScheduler from "devextreme/ui/scheduler";
import { wrapDxWithReact } from "../utils";

const Scheduler = wrapDxWithReact(dxScheduler);

const colors = [
  '#337ab7', '#808080', '#679ec5', '#ff6741', '#ee53dc', '#a067bd',
  '#f9e2ae', '#cfe4fa', '#a7e3a5', '#1564c0', '#2d7c31', '#7b1fa2',
];

const colorResources = colors.map((color, index) => ({ id: index, text: color, color }));

const data = colors.map((color, index) => ({
  text: color,
  colorId: index,
  startDate: new Date(2026, 2, 16 + Math.floor(index / 3), 9 + (index % 3) * 2),
  endDate: new Date(2026, 2, 16 + Math.floor(index / 3), 10 + (index % 3) * 2),
}));

const meta: Meta<typeof Scheduler> = {
  title: 'Components/Scheduler/ResourceColors',
  component: Scheduler,
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof Scheduler>;

export const Overview: Story = {
  args: {
    height: 600,
    views: ['week', 'month', 'timelineWeek'],
    currentView: 'week',
    currentDate: new Date(2026, 2, 16),
    startDayHour: 8,
    endDayHour: 16,
    dataSource: data,
    resources: [{ fieldExpr: 'colorId', label: 'Color', dataSource: colorResources }],
  },
  argTypes: {
    height: { control: 'number' },
    currentView: { control: 'select', options: ['week', 'month', 'timelineWeek'] },
  },
};

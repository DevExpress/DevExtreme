import { type SchedulerTypes } from 'devextreme-react/scheduler';
import { DataSource } from 'devextreme-vue/common/data';

type CustomAppointment = SchedulerTypes.Appointment & {
  assigneeId: number[];
};

const addDays = (date: Date, days: number) => new Date(date.setUTCDate(date.getUTCDate() + days));
const now = new Date(new Date().setUTCHours(0, 0, 0, 0));
const startOfTheWeek = addDays(now, -now.getUTCDay());
export const currentDate = new Date(2025, 5, 10);
const currentStartOfTheWeek = addDays(currentDate, -currentDate.getUTCDay());
const data: CustomAppointment[] = [
  {
    text: 'Website Re-Design Plan',
    assigneeId: [4],
    startDate: new Date(addDays(startOfTheWeek, 1).setUTCHours(16, 30)),
    endDate: new Date(addDays(startOfTheWeek, 1).setUTCHours(18, 30)),
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    assigneeId: [2],
    startDate: new Date(addDays(startOfTheWeek, 2).setUTCHours(19)),
    endDate: new Date(addDays(startOfTheWeek, 2).setUTCHours(20)),
    allDay: true,
  }, {
    text: 'Install New Router in Dev Room',
    assigneeId: [1],
    startDate: new Date(addDays(startOfTheWeek, 2).setUTCHours(21, 30)),
    endDate: new Date(addDays(startOfTheWeek, 2).setUTCHours(22, 30)),
  }, {
    text: 'Approve Personal Computer Upgrade Plan',
    assigneeId: [3],
    startDate: new Date(addDays(startOfTheWeek, 3).setUTCHours(17)),
    endDate: new Date(addDays(startOfTheWeek, 3).setUTCHours(18)),
  }, {
    text: 'Final Budget Review',
    assigneeId: [1],
    startDate: new Date(addDays(startOfTheWeek, 3).setUTCHours(19)),
    endDate: new Date(addDays(startOfTheWeek, 3).setUTCHours(20, 35)),
  }, {
    text: 'New Brochures',
    assigneeId: [4],
    startDate: new Date(addDays(startOfTheWeek, 3).setUTCHours(21, 30)),
    endDate: new Date(addDays(startOfTheWeek, 3).setUTCHours(22, 45)),
  }, {
    text: 'Install New Database',
    assigneeId: [2],
    startDate: new Date(addDays(startOfTheWeek, 4).setUTCHours(16, 45)),
    endDate: new Date(addDays(startOfTheWeek, 4).setUTCHours(18, 15)),
  }, {
    text: 'Approve New Online Marketing Strategy',
    assigneeId: [4],
    startDate: new Date(addDays(currentStartOfTheWeek, 1).setUTCHours(19)),
    endDate: new Date(addDays(currentStartOfTheWeek, 1).setUTCHours(21)),
  }, {
    text: 'Upgrade Personal Computers',
    assigneeId: [2],
    startDate: new Date(addDays(currentStartOfTheWeek, 1).setUTCHours(22, 15)),
    endDate: new Date(addDays(currentStartOfTheWeek, 1).setUTCHours(23, 30)),
  }, {
    text: 'Customer Workshop',
    assigneeId: [3],
    startDate: new Date(addDays(startOfTheWeek, 5).setUTCHours(18)),
    endDate: new Date(addDays(startOfTheWeek, 5).setUTCHours(19)),
    recurrenceRule: 'FREQ=WEEKLY;INTERVAL=1',
  }, {
    text: 'Prepare 2021 Marketing Plan',
    assigneeId: [1],
    startDate: new Date(addDays(currentStartOfTheWeek, 2).setUTCHours(18)),
    endDate: new Date(addDays(currentStartOfTheWeek, 2).setUTCHours(20, 30)),
  }, {
    text: 'Brochure Design Review',
    assigneeId: [4],
    startDate: new Date(addDays(startOfTheWeek, 5).setUTCHours(21)),
    endDate: new Date(addDays(startOfTheWeek, 5).setUTCHours(22, 30)),
  }, {
    text: 'Create Icons for Website',
    assigneeId: [3],
    startDate: new Date(addDays(currentStartOfTheWeek, 3).setUTCHours(17)),
    endDate: new Date(addDays(currentStartOfTheWeek, 3).setUTCHours(18, 30)),
  }, {
    text: 'Upgrade Server Hardware',
    assigneeId: [4],
    startDate: new Date(addDays(currentStartOfTheWeek, 2).setUTCHours(16)),
    endDate: new Date(addDays(currentStartOfTheWeek, 2).setUTCHours(17, 30)),
  }, {
    text: 'Submit New Website Design',
    assigneeId: [1],
    startDate: new Date(addDays(currentStartOfTheWeek, 5).setUTCHours(23, 30)),
    endDate: new Date(addDays(currentStartOfTheWeek, 6).setUTCHours(1)),
  }, {
    text: 'Launch New Website',
    assigneeId: [2],
    startDate: new Date(addDays(currentStartOfTheWeek, 4).setUTCHours(19)),
    endDate: new Date(addDays(currentStartOfTheWeek, 4).setUTCHours(21)),
  },
];
export const schedulerDataSource = new DataSource(data);

export const assignees = [
  {
    text: 'Samantha Bright',
    id: 1,
  }, {
    text: 'John Heart',
    id: 2,
  }, {
    text: 'Todd Hoffman',
    id: 3,
  }, {
    text: 'Sandra Johnson',
    id: 4,
  },
];

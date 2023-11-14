import { SchedulerTypes } from 'devextreme-react/scheduler';

type Shift = {
  text: string;
  offset: number;
};

export const shifts: Shift[] = [{
  text: 'First shift',
  offset: 0,
}, {
  text: 'Second shift',
  offset: 480,
}, {
  text: 'Third shift',
  offset: 960,
}];

export const data: SchedulerTypes.Appointment[] = [{
  text: 'Website Re-Design Plan',
  startDate: '2021-03-29T16:00:00.000Z',
  endDate: '2021-03-29T18:00:00.000Z',
}, {
  text: 'Approve Personal Computer Upgrade Plan',
  startDate: '2021-03-31T01:30:00.000Z',
  endDate: '2021-03-31T02:00:00.000Z',
}, {
  text: 'Final Budget Review',
  startDate: '2021-03-30T16:30:00.000Z',
  endDate: '2021-03-30T18:05:00.000Z',
}, {
  text: 'New Brochures',
  startDate: '2021-04-01T23:30:00.000Z',
  endDate: '2021-04-02T02:30:00.000Z',
}, {
  text: 'Approve New Online Marketing Strategy',
  startDate: '2021-03-31T16:30:00.000Z',
  endDate: '2021-03-31T18:30:00.000Z',
}, {
  text: 'Prepare 2021 Marketing Plan',
  startDate: '2021-04-01T16:30:00.000Z',
  endDate: '2021-04-01T17:30:00.000Z',
}, {
  text: 'Brochure Design Review',
  startDate: '2021-04-02T17:30:00.000Z',
  endDate: '2021-04-02T19:00:00.000Z',
}, {
  text: 'Create Icons for Website',
  startDate: '2021-04-01T18:00:00.000Z',
  endDate: '2021-04-01T19:30:00.000Z',
}, {
  text: 'Submit New Website Design',
  startDate: '2021-04-02T09:30:00.000Z',
  endDate: '2021-04-02T11:00:00.000Z',
}, {
  text: 'Launch New Website',
  startDate: '2021-04-01T01:30:00.000Z',
  endDate: '2021-04-01T02:30:00.000Z',
  recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE;INTERVAL=2',
}, {
  text: 'Install New Router in Dev Room',
  startDate: '2021-03-29T08:00:00.000Z',
  endDate: '2021-03-29T09:00:00.000Z',
}, {
  text: 'Upgrade Personal Computers',
  startDate: '2021-03-30T01:00:00.000Z',
  endDate: '2021-03-30T03:00:00.000Z',
}, {
  text: 'Install New Database',
  startDate: '2021-03-31T08:30:00.000Z',
  endDate: '2021-03-31T10:00:00.000Z',
}, {
  text: 'Update Customer Shipping Profiles',
  startDate: '2021-04-01T09:30:00.000Z',
  endDate: '2021-04-01T11:00:00.000Z',
  recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH',
}, {
  text: 'Upgrade Server Hardware',
  startDate: '2021-03-30T08:30:00.000Z',
  endDate: '2021-03-30T11:00:00.000Z',
  recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=30',
}];

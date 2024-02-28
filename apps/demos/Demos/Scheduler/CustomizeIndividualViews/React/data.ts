import { SchedulerTypes } from 'devextreme-react/scheduler';

type Appointment = SchedulerTypes.Appointment & { priorityId: number; typeId: number; };

type Resource = {
  text: string;
  id: number;
  color: string;
};

export const data: Appointment[] = [{
  text: 'Walking a dog',
  priorityId: 1,
  typeId: 1,
  startDate: new Date('2021-04-26T15:00:00.000Z'),
  endDate: new Date('2021-04-26T15:30:00.000Z'),
  recurrenceRule: 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20210502',
},
{
  text: 'Website Re-Design Plan',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-26T16:00:00.000Z'),
  endDate: new Date('2021-04-26T18:30:00.000Z'),
}, {
  text: 'Book Flights to San Fran for Sales Trip',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-26T19:00:00.000Z'),
  endDate: new Date('2021-04-26T20:00:00.000Z'),
}, {
  text: 'Install New Router in Dev Room',
  priorityId: 1,
  typeId: 2,
  startDate: new Date('2021-04-26T21:30:00.000Z'),
  endDate: new Date('2021-04-26T22:30:00.000Z'),
}, {
  text: 'Go Grocery Shopping',
  priorityId: 1,
  typeId: 1,
  startDate: new Date('2021-04-27T01:30:00.000Z'),
  endDate: new Date('2021-04-27T02:30:00.000Z'),
  recurrenceRule: 'FREQ=DAILY;BYDAY=MO,WE,FR;UNTIL=20210502',
}, {
  text: 'Approve Personal Computer Upgrade Plan',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-27T17:00:00.000Z'),
  endDate: new Date('2021-04-27T18:00:00.000Z'),
}, {
  text: 'Final Budget Review',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-27T19:00:00.000Z'),
  endDate: new Date('2021-04-27T20:35:00.000Z'),
}, {
  text: 'New Brochures',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-27T21:30:00.000Z'),
  endDate: new Date('2021-04-27T22:45:00.000Z'),
}, {
  text: 'Install New Database',
  priorityId: 1,
  typeId: 2,
  startDate: new Date('2021-04-28T16:45:00.000Z'),
  endDate: new Date('2021-04-28T18:15:00.000Z'),
}, {
  text: 'Approve New Online Marketing Strategy',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-28T19:00:00.000Z'),
  endDate: new Date('2021-04-28T21:00:00.000Z'),
}, {
  text: 'Upgrade Personal Computers',
  priorityId: 1,
  typeId: 2,
  startDate: new Date('2021-04-28T22:15:00.000Z'),
  endDate: new Date('2021-04-28T23:30:00.000Z'),
}, {
  text: 'Prepare 2021 Marketing Plan',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-29T18:00:00.000Z'),
  endDate: new Date('2021-04-29T20:30:00.000Z'),
}, {
  text: 'Brochure Design Review',
  priorityId: 1,
  typeId: 2,
  startDate: new Date('2021-04-29T21:00:00.000Z'),
  endDate: new Date('2021-04-29T22:30:00.000Z'),
}, {
  text: 'Create Icons for Website',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-30T17:00:00.000Z'),
  endDate: new Date('2021-04-30T18:30:00.000Z'),
}, {
  text: 'Upgrade Server Hardware',
  priorityId: 1,
  typeId: 2,
  startDate: new Date('2021-04-30T21:30:00.000Z'),
  endDate: new Date('2021-04-30T23:00:00.000Z'),
}, {
  text: 'Submit New Website Design',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-30T23:30:00.000Z'),
  endDate: new Date('2021-05-01T01:00:00.000Z'),
}, {
  text: 'Launch New Website',
  priorityId: 2,
  typeId: 2,
  startDate: new Date('2021-04-30T19:20:00.000Z'),
  endDate: new Date('2021-04-30T21:00:00.000Z'),
}, {
  text: 'Visiting a Doctor',
  priorityId: 2,
  typeId: 1,
  startDate: new Date('2021-05-01T17:00:00.000Z'),
  endDate: new Date('2021-05-01T20:30:00.000Z'),
}];

export const priorityData: Resource[] = [{
  text: 'Low Priority',
  id: 1,
  color: '#fcb65e',
}, {
  text: 'High Priority',
  id: 2,
  color: '#e18e92',
}];

export const typeData: Resource[] = [{
  text: 'Home',
  id: 1,
  color: '#b6d623',
}, {
  text: 'Work',
  id: 2,
  color: '#679ec5',
}];

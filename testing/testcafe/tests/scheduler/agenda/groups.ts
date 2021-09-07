// import createWidget from '../../../helpers/createWidget';
// import Scheduler from '../../../model/scheduler';
// import url from '../../../helpers/getPageUrl';

// fixture`Agenda:groups`
//   .page(url(__dirname, '../../container.html'));

// const assignees = [{
//   text: 'Samantha Bright',
//   id: 1,
// }, {
//   text: 'John Heart',
//   id: 2,
// }, {
//   text: 'Todd Hoffman',
//   id: 3,
// }, {
//   text: 'Sandra Johnson',
//   id: 4,
// }];

// const priorities = [{
//   text: 'High',
//   id: 1,
// }, {
//   text: 'Low',
//   id: 2,
// }];

// const data = [{
//   text: 'Review Training Course for any Omissions',
//   startDate: new Date('2021-05-10T21:00:00.000Z'),
//   endDate: new Date('2021-05-11T19:00:00.000Z'),
//   assigneeId: 1,
//   priorityId: 1,
// }, {
//   text: 'Recall Rebate Form',
//   startDate: new Date('2021-05-10T19:45:00.000Z'),
//   endDate: new Date('2021-05-10T20:15:00.000Z'),
//   assigneeId: 3,
//   priorityId: 1,
// }, {
//   text: 'Create Report on Customer Feedback',
//   startDate: new Date('2021-05-11T22:15:00.000Z'),
//   endDate: new Date('2021-05-12T00:30:00.000Z'),
//   assigneeId: 2,
//   priorityId: 2,
// }, {
//   text: 'Review Customer Feedback Report',
//   startDate: new Date('2021-05-11T23:15:00.000Z'),
//   endDate: new Date('2021-05-12T01:30:00.000Z'),
//   assigneeId: 2,
//   priorityId: 1,
// }, {
//   text: 'Customer Feedback Report Analysis',
//   startDate: new Date('2021-05-12T16:30:00.000Z'),
//   endDate: new Date('2021-05-12T17:30:00.000Z'),
//   recurrenceRule: 'FREQ=WEEKLY',
//   assigneeId: 4,
//   priorityId: 2,
// }, {
//   text: 'Prepare Shipping Cost Analysis Report',
//   startDate: new Date('2021-05-12T19:30:00.000Z'),
//   endDate: new Date('2021-05-12T20:30:00.000Z'),
//   assigneeId: 1,
//   priorityId: 1,
// }, {
//   text: 'Provide Feedback on Shippers',
//   startDate: new Date('2021-05-12T21:15:00.000Z'),
//   endDate: new Date('2021-05-12T23:00:00.000Z'),
//   assigneeId: 4,
//   priorityId: 2,
// }, {
//   text: 'Select Preferred Shipper',
//   startDate: new Date('2021-05-13T00:30:00.000Z'),
//   endDate: new Date('2021-05-13T03:00:00.000Z'),
//   assigneeId: 1,
//   priorityId: 2,
// }];

// test('Agenda test appointmentasdasdasd state', async (t) => {
//   const scheduler = new Scheduler('#container');

// }).before(async () => createWidget('dxScheduler', {
//   dataSource: data,
//   views: ['agenda'],
//   currentView: 'agenda',
//   currentDate: new Date('2021-05-10T21:00:00.000Z'),
//   groups: ['assigneeId', 'priorityId'],
//   resources: [{
//     fieldExpr: 'assigneeId',
//     dataSource: assignees,
//     label: 'Assignee',
//     useColorAsDefault: true,
//   }, {
//     fieldExpr: 'priorityId',
//     dataSource: priorities,
//     label: 'Priority',
//   }],
//   height: 600,
// }, true));

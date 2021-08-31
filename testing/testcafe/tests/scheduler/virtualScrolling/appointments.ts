// import { getStyleAttribute, setStyleAttribute } from '../../../helpers/domElement';
// import createWidget from '../../../helpers/createWidget';
// import url from '../../../helpers/getPageUrl';
// import Scheduler from '../../../model/scheduler';
// import { scrollTo } from './utils';

// fixture`Scheduler: Virtual Scrolling`
//   .page(url(__dirname, '../../container.html'));

// test('Appointment should not repaint after scrolling if present on viewport', async (t) => {
//   const scheduler = new Scheduler('#container');
//   const { element } = scheduler.getAppointment('', 0);

//   await setStyleAttribute(element, 'backgroundColor', 'red');
//   await t.expect(getStyleAttribute(element, 'backgroundColor')).eql('red');

//   await scrollTo(new Date(2020, 8, 17, 4));

//   await t.expect(getStyleAttribute(element, 'backgroundColor')).eql('red');
// }).before(async () => {
//   await createWidget('dxScheduler', {
//     height: 600,
//     width: 800,
//     currentDate: new Date(2020, 8, 7),
//     scrolling: {
//       mode: 'virtual',
//       orientation: 'both',
//       outlineCount: 0,
//     },
//     currentView: 'week',
//     views: [{
//       type: 'week',
//       intervalCount: 10,
//     }],
//     dataSource: [{
//       startDate: new Date(2020, 8, 13, 2),
//       endDate: new Date(2020, 8, 13, 3),
//       text: 'test',
//     }],
//   });
// });

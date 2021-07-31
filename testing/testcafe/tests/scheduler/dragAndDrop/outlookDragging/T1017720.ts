// import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
// import createWidget from '../../../../helpers/createWidget';
// import url from '../../../../helpers/getPageUrl';
// import Scheduler from '../../../../model/scheduler';

// fixture`Outlook dragging base tests`
//   .page(url(__dirname, '../../../container.html'));

// test('TTT', async (t) => {
//   const scheduler = new Scheduler('#container');

//   const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
//   const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

//   await t
//     .drag(draggableAppointment.element, 330, 70, { speed: 0.1 })
//     .expect(await takeScreenshot('drag-n-drop-to-orange-group.png', scheduler.workSpace))
//     .ok()

//     .drag(draggableAppointment.element, -330, 70, { speed: 0.1 })
//     .expect(await takeScreenshot('drag-n-drop-blue-group.png', scheduler.workSpace))
//     .ok()

//     .expect(compareResults.isValid())
//     .ok(compareResults.errorMessages());
// }).before(async () => {
//   const t = createWidget('dxChart', {
//     width: '100%',
//     height: '100%',
//     series: {
//       type: 'bar',
//       color: '#ffaa66',
//     },
//   });
// });

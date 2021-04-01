// import { compareScreenshot } from '../../../helpers/screenshot-comparer';
// import createWidget from '../../../helpers/createWidget';
// import url from '../../../helpers/getPageUrl';
// import { createDataSetForScreenShotTests } from './utils';

// fixture`Scheduler: Material theme layout`
//   .page(url(__dirname, './material.html'));

// const createScheduler = async (
//   additionalProps: Record<string, unknown>,
// ): Promise<void> => {
//   await createWidget('dxScheduler', {
//     dataSource: createDataSetForScreenShotTests(),
//     currentDate: new Date(2020, 6, 15),
//     height: 600,
//     rtlEnabled: true,
//     ...additionalProps,
//   }, true);
// };

// const views = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

// const resources = [{
//   fieldExpr: 'priorityId',
//   dataSource: [
//     {
//       text: 'Low Priority',
//       id: 0,
//       color: '#24ff50',
//     }, {
//       text: 'High Priority',
//       id: 1,
//       color: '#ff9747',
//     },
//   ],
//   label: 'Priority',
// }];

// [true, false].forEach((crossScrollingEnabled) => {
//   views.forEach((view) => {
//     test(`Adaptive views layout test in material theme (view='${view})', crossScrollingEnabled=${crossScrollingEnabled} and rtl`, async (t) => {
//       await t.expect(
//         await compareScreenshot(t, `adaptive-material-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}-rtl).png`),
//       ).ok();
//     }).before(async (t) => {
//       await t.resizeWindow(400, 600);

//       await createScheduler({
//         views: [view],
//         currentView: view,
//         crossScrollingEnabled,
//       });
//     }).after(async (t) => {
//       await t.resizeWindow(1200, 800);
//     });
//   });
// });

// [true, false].forEach((crossScrollingEnabled) => {
//   views
//     .map((viewType) => ({
//       type: viewType,
//       groupOrientation: 'horizontal',
//     }))
//     .forEach((view) => {
//       test(`Adaptive views layout test in material theme (view='${view.type})', crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping and rtl are used`, async (t) => {
//         await t.expect(
//           await compareScreenshot(t, `adaptive-material-layout(view=${view.type}-crossScrollingEnabled=${!!crossScrollingEnabled}-horizontal-grouping-rtl).png`),
//         ).ok();
//       }).before(async (t) => {
//         await t.resizeWindow(400, 600);

//         await createScheduler({
//           views: [view],
//           currentView: view,
//           crossScrollingEnabled,
//           groups: ['priorityId'],
//           resources,
//         });
//       }).after(async (t) => {
//         await t.resizeWindow(1200, 800);
//       });
//     });
// });

// [true, false].forEach((crossScrollingEnabled) => {
//   views
//     .map((viewType) => ({
//       type: viewType,
//       groupOrientation: 'vertical',
//     }))
//     .forEach((view) => {
//       test(`Adaptive views layout test in material theme (view='${view.type})', crossScrollingEnabled=${crossScrollingEnabled} when vertical grouping and rtl are used`, async (t) => {
//         await t.expect(
//           await compareScreenshot(t, `adaptive-material-layout(view=${view.type}-crossScrollingEnabled=${!!crossScrollingEnabled}-vertical-grouping-rtl).png`),
//         ).ok();
//       }).before(async (t) => {
//         await t.resizeWindow(400, 600);

//         await createScheduler({
//           views: [view],
//           currentView: view,
//           crossScrollingEnabled,
//           groups: ['priorityId'],
//           resources,
//         });
//       }).after(async (t) => {
//         await t.resizeWindow(1200, 800);
//       });
//     });
// });

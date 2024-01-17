import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { extend } from '../../../../../js/core/utils/extend';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`T1017720`
  .page(url(__dirname, '../../container.html'));

test('Drag-n-drop appointment above SVG element(T1017720)', async (t) => {
  const scheduler = new Scheduler('#scheduler');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const draggableAppointment = scheduler.getAppointment('text');

  await t
    .drag(draggableAppointment.element, 330, 0)
    .expect(await takeScreenshot('drag-n-drop-to-right(T1017720).png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -330, 70)
    .expect(await takeScreenshot('drag-n-drop-to-left(T1017720).png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxChart', extend({
    width: '100%',
    height: 1300,
    series: {
      type: 'bar',
      color: '#ffaa66',
    },
  }));

  await createWidget('dxPopup', extend({
    width: '90%',
    height: '90%',
    visible: true,
    contentTemplate: ClientFunction(() => {
      const scheduler = $('<div id="scheduler" />');

      (scheduler as any).dxScheduler({
        width: '100%',
        height: '100%',
        startDayHour: 11,
        dataSource: [{
          text: 'text',
          startDate: new Date(2021, 6, 27, 11),
          endDate: new Date(2021, 6, 27, 14),
          allDay: false,
        }],
        views: ['week'],
        currentDate: new Date(2021, 6, 27, 12),
        currentView: 'week',
      });

      return scheduler;
    }),
  }));
});

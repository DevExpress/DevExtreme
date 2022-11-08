import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import Scheduler from '../../../model/scheduler';

fixture`T1046067`
  .page(url(__dirname, './pages/T1046067.html'));

safeSizeTest('Drag-n-Drop appointment where disabled property is set as a function (T1046067)', async (t) => {
  const scheduler = new Scheduler('#scheduler');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const disabledAppointment = scheduler.getAppointment('disabled-appt');

  await t
    .drag(disabledAppointment.element, 0, -150, { speed: 0.1 })
    .expect(true)
    .ok()
    .expect(await takeScreenshot('drag-n-drop_ko_T1046067.png', scheduler.workSpace))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

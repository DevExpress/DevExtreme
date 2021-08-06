import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';

fixture`Appointment popup form`
  .page(url(__dirname, '../container.html'));

test('Super test', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('TTTTTTTTT.png', '.dx-scheduler-header'))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  currentDate: new Date(2021, 1, 1),
}));

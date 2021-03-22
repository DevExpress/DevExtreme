import { compareScreenshot } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests } from './utils';

fixture`Scheduler: Contrast theme layout`
  .page(url(__dirname, './contrast.html'));

const createScheduler = async (options: Record<string, unknown>): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    height: 600,
    ...options,
  }, true);
};

['day', 'week'].forEach((view) => {
  test(`Base views layout test in contrat theme(view='${view})`, async (t) => {
    await t.expect(await compareScreenshot(t, `contrast-layout-(view=${view}).png`)).ok();
  }).before(() => createScheduler({
    views: [view],
    currentView: view,
    renovateRender: true,
    showAllDayPanel: false,
  }));
});

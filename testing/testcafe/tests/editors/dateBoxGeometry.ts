import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';

const setConfig = ClientFunction(
  (theme, config) => (window as any).createDateBoxInTheme(theme, config),
);

fixture`DateBox (datetime) geometry (T896846)`
  .page(url(__dirname, './pages/dateBoxGeometry.html'));

const cases: { name: string; config: any }[] = [{
  name: 'calendar',
  config: {},
}, {
  name: 'datetime',
  config: { type: 'datetime' },
}, {
  name: 'without-analog-clock',
  config: { type: 'datetime', showAnalogClock: false },
}, {
  name: 'without-calendar',
  config: { type: 'datetime', displayFormat: 'HH:mm', calendarOptions: { visible: false } },
}];

const themes = ['material.blue.light', 'generic.light'];
themes.forEach((theme) => {
  cases.forEach(({ name, config }) => {
    test(`Geometry is good (${name}, ${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      await setConfig(theme, config);

      await t
        .expect(await takeScreenshot(`datebox-geometry-${theme}-${name}.png`, 'dx-popup-done-visible > .dx-overlay-content'))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    });
  });
});

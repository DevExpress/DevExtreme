import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`ValidationMessagePosition`
  .page(url(__dirname, '../pages/validationMessagePosition.html'));

const setPosition = ClientFunction(
  (position) => (window as any).createEditorsInTheme(position),
);

const positions = ['top', 'right', 'bottom', 'left'];
const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
themes.forEach((theme) => {
  positions.forEach((position) => {
    test(`Editors ValidationMessage position is correct (${position}, ${theme})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      await changeTheme(theme);
      await setPosition(position);

      await t
        .expect(await takeScreenshot(`editor-validation-position-${position}-${theme}.png`, '#container'))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    });
  });
});

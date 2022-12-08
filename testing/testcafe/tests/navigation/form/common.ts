import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { getThemePostfix } from '../../../helpers/themeUtils';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'generic.dark', 'generic.contrast'].forEach((theme) => {
  test('Color of the mark (T882067)', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`Form color of the mark${getThemePostfix(theme)}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxForm', {
      formData: {
        firstName: 'John',
        lastName: 'Heart',
        position: 'CEO',
      },
      items: [
        { dataField: 'firstName', isRequired: true },
        { dataField: 'lastName', isOptional: true },
        'position',
      ],
      requiredMark: '!',
      optionalMark: 'opt',
      showOptionalMark: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});

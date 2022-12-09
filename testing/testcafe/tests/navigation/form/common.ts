import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

test('Color of the mark (T882067)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const screenshotName = 'Form color of the mark.png';

  await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container');

  if (!isMaterial()) {
    await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.dark');
    await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.contrast');
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
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
}));

import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import TextArea from '../../../model/textArea';

fixture.disablePageReloads`Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(() => disposeWidgets());

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];

test('Label scroll input dxTextArea', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const textArea = new TextArea('#container');

  await t.scroll(textArea.getInput(), 0, 20);

  await takeScreenshotInTheme(t, takeScreenshot, 'TextArea label after scroll.png', '#container');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTextArea', {
  height: 50,
  width: 200,
  text: `this content is ${'very '.repeat(10)}long`,
  label: 'label text',
}));

stylingMods.forEach((stylingMode) => {
  labelMods.forEach((labelMode) => {
    test(`Label for dxTextArea labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.click('#otherContainer');

      await takeScreenshotInTheme(t, takeScreenshot, `TextArea with label-labelMode=${labelMode}-stylingMode=${stylingMode}.png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (t) => {
      await t.resizeWindow(300, 400);

      await createWidget('dxTextArea', {
        width: 100,
        label: 'label',
        text: '',
        labelMode,
        stylingMode,
      });

      return createWidget('dxTextArea', {
        label: `this label is ${'very '.repeat(10)}long`,
        text: `this content is ${'very '.repeat(10)}long`,
        items: ['item1', 'item2'],
        labelMode,
        stylingMode,
      }, false, '#otherContainer');
    });
  });
});

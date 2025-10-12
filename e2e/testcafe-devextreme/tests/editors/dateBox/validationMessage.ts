import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DateBox from 'devextreme-testcafe-models/dateBox';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`DateBox ValidationMessagePosition`
  .page(url(__dirname, '../../container.html'));

const positions = ['top', 'right', 'bottom', 'left'];

positions.forEach((position) => {
  safeSizeTest(`DateBox ValidationMessage position is correct (${position})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const dateBox = new DateBox('#container');
    await dateBox.option('value', new Date(2022, 6, 14));

    await testScreenshot(t, takeScreenshot, `Datebox validation message with position=${position}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [300, 200]).before(async () => {
    await createWidget('dxDateBox', {
      elementAttr: { style: 'margin: 50px 0 0 100px;' },
      width: 100,
      height: 40,
      validationMessageMode: 'always',
      validationMessagePosition: position,
    });

    return createWidget('dxValidator', {
      validationRules: [{
        type: 'range',
        max: new Date(1),
        message: 'out of range',
      }],
    });
  });
});

safeSizeTest('DateBox ValidationMessage position is correct', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // eslint-disable-next-line no-restricted-syntax
  for (const id of t.ctx.ids) {
    const dateBox = new DateBox(`#${id}`);
    await dateBox.option('value', new Date(2022, 6, 14));
  }

  await testScreenshot(t, takeScreenshot, 'Datebox validation message.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [600, 400]).before(async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const position of positions) {
    await createWidget('dxDateBox', {
      elementAttr: { style: 'display: inline-block; margin: 50px 100px 0 0;' },
      width: 150,
      height: 40,
      validationMessageMode: 'always',
      validationMessagePosition: position,
    });
  }

  return createWidget('dxValidator', {
    validationRules: [{
      type: 'range',
      max: new Date(1),
      message: 'out of range',
    }],
  });
});

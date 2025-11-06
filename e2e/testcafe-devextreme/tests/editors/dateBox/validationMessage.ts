import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DateBox from 'devextreme-testcafe-models/dateBox';
import Guid from 'devextreme/core/guid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { appendElementTo } from '../../../helpers/domUtils';

fixture.disablePageReloads`DateBox ValidationMessagePosition`
  .page(url(__dirname, '../../container.html'));

const positions = ['top', 'right', 'bottom', 'left'];

test.meta({ browserSize: [600, 400] })('DateBox ValidationMessage position is correct', async (t) => {
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
}).before(async (t) => {
  t.ctx.ids = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const position of positions) {
    const id = `${`dx${new Guid()}`}`;

    await appendElementTo('#container', 'div', id, {});

    t.ctx.ids.push(id);
    await createWidget('dxDateBox', {
      elementAttr: { style: 'display: inline-block; margin: 50px 100px 0 0;' },
      width: 150,
      height: 40,
      validationMessageMode: 'always',
      validationMessagePosition: position,
    }, `#${id}`);

    await createWidget('dxValidator', {
      validationRules: [{
        type: 'range',
        max: new Date(1),
        message: 'out of range',
      }],
    }, `#${id}`);
  }
});

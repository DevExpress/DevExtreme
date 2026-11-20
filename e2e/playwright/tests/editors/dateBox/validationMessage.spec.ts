import { randomUUID } from 'node:crypto';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import DateBox from '../../../models/dateBox';

const positions = ['top', 'right', 'bottom', 'left'];

test.describe('DateBox ValidationMessagePosition', () => {
  test.use({ browserSize: [600, 400] });

  test('DateBox ValidationMessage position is correct', async ({ page }) => {
    const ids: string[] = [];

    for (const position of positions) {
      const id = `dx${randomUUID()}`;

      await appendElementTo(page, '#container', 'div', id);

      ids.push(id);
      await createWidget(page, 'dxDateBox', {
        elementAttr: { style: 'display: inline-block; margin: 50px 100px 0 0;' },
        width: 150,
        height: 40,
        validationMessageMode: 'always',
        validationMessagePosition: position,
      }, `#${id}`);

      await createWidget(page, 'dxValidator', {
        validationRules: [{
          type: 'range',
          max: new Date(1),
          message: 'out of range',
        }],
      }, `#${id}`);
    }

    for (const id of ids) {
      const dateBox = new DateBox(page, `#${id}`);

      await dateBox.option('value', new Date(2022, 6, 14));
    }

    await testScreenshot(page, 'Datebox validation message.png');
  });
});

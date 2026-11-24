import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import ButtonGroup from '../../../models/buttonGroup';

test.describe('ButtonGroup_Selection', () => {
  test('selected class should not be added to the button after hovering (T1222079)', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', {
      items: [
        { text: 'Button_1' },
        { text: 'Button_2' },
      ],
      selectedItemKeys: ['Button_1'],
      disabled: true,
    });

    const buttonGroup = new ButtonGroup(page, '#container');

    await buttonGroup.option('disabled', false);

    await buttonGroup.getItem(1).element.click();

    await buttonGroup.getItem(1).expectSelected();
    await buttonGroup.getItem(1).expectItemSelected();

    await buttonGroup.getItem(0).element.hover();

    await buttonGroup.getItem(0).expectSelected(false);
    await buttonGroup.getItem(0).expectItemSelected(false);
  });

  test('selected class should be set after reenabling (T1308601)', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', {
      items: [
        { text: 'Button_1' },
        { text: 'Button_2' },
      ],
      selectedItemKeys: ['Button_1'],
    });

    const buttonGroup = new ButtonGroup(page, '#container');

    await buttonGroup.option('disabled', true);
    await buttonGroup.option('disabled', false);

    await buttonGroup.getItem(1).element.click();

    await buttonGroup.option('disabled', true);
    await buttonGroup.option('disabled', false);

    await buttonGroup.getItem(0).element.click();

    await buttonGroup.getItem(0).expectSelected();
    await buttonGroup.getItem(0).expectItemSelected();

    await buttonGroup.getItem(1).element.hover();

    await buttonGroup.getItem(0).expectSelected();
    await buttonGroup.getItem(0).expectItemSelected();
  });
});

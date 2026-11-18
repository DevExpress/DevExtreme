import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import RadioGroup from '../../../models/radioGroup';

const RADIO_GROUP_CLASS = 'dx-radiogroup';

test.describe('Radio Group', () => {
  test('Radio buttons placed into the template should not be selected after clicking the parent radio button (T816449)', async ({ page }) => {
    await createWidget(page, 'dxRadioGroup', () => ({
      items: [{}, {}, {}],
      itemTemplate: () => ($('<div>') as any).dxRadioGroup({
        dataSource: [{}, {}, {}],
        layout: 'horizontal',
      }),
    }));

    const parentGroup = new RadioGroup(page, '#container');
    const getChildGroup = (itemIndex: number): RadioGroup => new RadioGroup(
      page,
      parentGroup.getItem(itemIndex).content.locator(`:scope > .${RADIO_GROUP_CLASS}`),
    );
    const firstChildGroup = getChildGroup(0);
    const secondChildGroup = getChildGroup(1);
    const thirdChildGroup = getChildGroup(2);

    const checkGroup = async (
      group: RadioGroup,
      firstChecked = false,
      secondChecked = false,
      thirdChecked = false,
    ): Promise<void> => {
      await group.getItem().radioButton.expectChecked(firstChecked);
      await group.getItem(1).radioButton.expectChecked(secondChecked);
      await group.getItem(2).radioButton.expectChecked(thirdChecked);
    };

    await checkGroup(parentGroup);
    await checkGroup(firstChildGroup);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await parentGroup.getItem().radioButton.element.click();
    await checkGroup(parentGroup, true);
    await checkGroup(firstChildGroup);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await parentGroup.getItem(1).radioButton.element.click();
    await checkGroup(parentGroup, false, true);
    await checkGroup(firstChildGroup);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await parentGroup.getItem(2).radioButton.element.click();
    await checkGroup(parentGroup, false, false, true);
    await checkGroup(firstChildGroup);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await firstChildGroup.getItem().radioButton.element.click();
    await checkGroup(parentGroup, false, false, true);
    await checkGroup(firstChildGroup, true);
    await checkGroup(secondChildGroup);
    await checkGroup(thirdChildGroup);

    await secondChildGroup.getItem(1).radioButton.element.click();
    await checkGroup(parentGroup, false, false, true);
    await checkGroup(firstChildGroup, true);
    await checkGroup(secondChildGroup, false, true);
    await checkGroup(thirdChildGroup);

    await thirdChildGroup.getItem(2).radioButton.element.click();
    await checkGroup(parentGroup, false, false, true);
    await checkGroup(firstChildGroup, true);
    await checkGroup(secondChildGroup, false, true);
    await checkGroup(thirdChildGroup, false, false, true);
  });

  test('Dot of Radio button placed in scaled container should have valid centering(T1165339)', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'width: 600px; height: 100px;');

    await appendElementTo(page, '#container', 'div', 'radioGroup');
    await setStyleAttribute(page, '#radioGroup', 'transform: scale(0.7);');

    await createWidget(page, 'dxRadioGroup', {
      items: ['One', 'Two', 'Three'],
      value: 'Two',
    }, '#radioGroup');

    await testScreenshot(page, 'RadioGroup in scaled container.png', { element: '#container' });
  });
});

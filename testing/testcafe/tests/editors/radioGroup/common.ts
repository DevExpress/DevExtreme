import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import RadioGroup from '../../../model/radioGroup';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

fixture.disablePageReloads`Radio Group`
  .page(url(__dirname, '../../container.html'));

test('Radio buttons placed into the template should not be selected after clicking the parent radio button (T816449)', async (t) => {
  const parentGroup = new RadioGroup('#template');
  const firstChildGroup = new RadioGroup(parentGroup.getItem().content.child().nth(0));
  const secondChildGroup = new RadioGroup(parentGroup.getItem(1).content.child());
  const thirdChildGroup = new RadioGroup(parentGroup.getItem(2).content.child());

  const checkGroup = async (
    group: RadioGroup,
    firstChecked = false,
    secondChecked = false,
    thirdChecked = false,
  ): Promise<void> => {
    await t
      .expect(group.getItem().radioButton.isChecked).eql(firstChecked)
      .expect(group.getItem(1).radioButton.isChecked).eql(secondChecked)
      .expect(group.getItem(2).radioButton.isChecked)
      .eql(thirdChecked);
  };

  await checkGroup(parentGroup);
  await checkGroup(firstChildGroup);
  await checkGroup(secondChildGroup);
  await checkGroup(thirdChildGroup);

  await t.click(parentGroup.getItem().radioButton.element);
  await checkGroup(parentGroup, true);
  await checkGroup(firstChildGroup);
  await checkGroup(secondChildGroup);
  await checkGroup(thirdChildGroup);

  await t.click(parentGroup.getItem(1).radioButton.element);
  await checkGroup(parentGroup, false, true);
  await checkGroup(firstChildGroup);
  await checkGroup(secondChildGroup);
  await checkGroup(thirdChildGroup);

  await t.click(parentGroup.getItem(2).radioButton.element);
  await checkGroup(parentGroup, false, false, true);
  await checkGroup(firstChildGroup);
  await checkGroup(secondChildGroup);
  await checkGroup(thirdChildGroup);

  await t.click(firstChildGroup.getItem().radioButton.element);
  await checkGroup(parentGroup, false, false, true);
  await checkGroup(firstChildGroup, true);
  await checkGroup(secondChildGroup);
  await checkGroup(thirdChildGroup);

  await t.click(secondChildGroup.getItem(1).radioButton.element);
  await checkGroup(parentGroup, false, false, true);
  await checkGroup(firstChildGroup, true);
  await checkGroup(secondChildGroup, false, true);
  await checkGroup(thirdChildGroup);

  await t.click(thirdChildGroup.getItem(2).radioButton.element);
  await checkGroup(parentGroup, false, false, true);
  await checkGroup(firstChildGroup, true);
  await checkGroup(secondChildGroup, false, true);
  await checkGroup(thirdChildGroup, false, false, true);
}).before(async () => {
  await appendElementTo('#container', 'div', 'template');
  await createWidget('dxRadioGroup', {
    items: [{}, {}, {}],
    itemTemplate: () => ($('<div>') as any).dxRadioGroup({
      dataSource: [{}, {}, {}],
      layout: 'horizontal',
    }),
  }, '#template');
});

test('Dot of Radio button placed in scaled container should have valid centering(T1165339)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'RadioGroup in scaled container.png', { element: '#scaled' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'scaled', { transform: 'scale(0.7)' });

  await createWidget('dxRadioGroup', {
    items: ['One', 'Two', 'Three'],
    value: 'Two',
  }, '#scaled');
});

import url from '../../helpers/getPageUrl';
import RadioGroup from '../../model/radioGroup';

fixture`Radio Group`
  .page(url(__dirname, './pages/t816449.html'));

test('Radio buttons placed into the template should not be selected after clicking the parent radio button (T816449)', async (t) => {
  const parentGroup = new RadioGroup('#radio-group');
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
});

fixture`Radio Group dataSource updating`
  .page(url(__dirname, './pages/t901779.html'));

test('There is no error on updating async CustomStore', async (t) => {
  await t.wait(50);
});

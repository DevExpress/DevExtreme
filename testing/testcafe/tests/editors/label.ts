import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget, { WidgetName } from '../../helpers/createWidget';

async function createComponent(componentName: WidgetName,
  componentOptions: unknown): Promise<void> {
  return createWidget(componentName, componentOptions, true);
}

fixture`Label`
  .page(url(__dirname, '../container.html'));

['floating', 'static'].forEach((labelMode) => {
  test(`Label for TextBox labelMode=${labelMode}`, async (t) => {
    const componentOption = {
      label: 'short',
      labelMode,
    };

    await createComponent('dxTextBox', componentOption);

    await t.expect(await compareScreenshot(t, `label-text-box-labelMode=${labelMode}.png`)).ok();
  });
});

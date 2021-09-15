import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget, { WidgetName } from '../../helpers/createWidget';

const width = {
  short: 100,
  long: 300,
};

async function createComponent(componentName: WidgetName,
  componentOptions: any, selector: string): Promise<void> {
  return createWidget(componentName, componentOptions, true, selector);
}

fixture`Label`
  .page(url(__dirname, '../container.html'));

['floating', 'static'].forEach((labelMode) => {
  test(`Label for TextBox labelMode=${labelMode}`, async (t) => {
    const componentOption = {
      label: 'short',
      labelMode,
      width: 0,
    };

    componentOption.width = width.short;
    await createComponent('dxTextBox', componentOption, '#container');

    componentOption.width = width.long;
    await createComponent('dxTextBox', componentOption, '#otherContainer');

    await t.expect(await compareScreenshot(t, `label-text-box-labelMode=${labelMode}.png`)).ok();
  }).before(async () => {
    await ClientFunction(() => {
      $('#otherContainer').css({
        'margin-top': '20px',
      });
    })();
  });
});

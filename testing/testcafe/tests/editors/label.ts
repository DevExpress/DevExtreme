import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget, { WidgetName } from '../../helpers/createWidget';

const shortOption = {
  width: 100,
  label: 'label',
};

const longOption = {
  width: 300,
  label: 'this is a very very very very very very very very very long label',
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
      labelMode,
    };

    await createComponent('dxTextBox', { ...componentOption, ...shortOption }, '#container');
    await createComponent('dxTextBox', { ...componentOption, ...longOption }, '#otherContainer');

    await t.expect(await compareScreenshot(t, `label-text-box-labelMode=${labelMode}.png`)).ok();
  }).before(async () => {
    await ClientFunction(() => {
      $('#otherContainer').css({
        'margin-top': '20px',
      });
    })();
  });
});

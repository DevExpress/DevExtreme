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
  ['outlined', 'underlined', 'filled'].forEach((stylingMode) => {
    [true, false].forEach((isFocused) => {
      test(`Label for TextBox labelMode=${labelMode} stylingMode=${stylingMode} focused=${isFocused}`, async (t) => {
        const componentOption = {
          labelMode,
          stylingMode,
        };

        await createComponent('dxTextBox', { ...componentOption, ...shortOption }, '#container');
        await createComponent('dxTextBox', { ...componentOption, ...longOption }, '#otherContainer');

        if (isFocused) {
          await ClientFunction(() => {
            $('#container').addClass('dx-state-focused');
            $('#otherContainer').addClass('dx-state-focused');
          })();
        }

        await t.expect(await compareScreenshot(t, `label-text-box-labelMode=${labelMode}-stylingMode=${stylingMode}-focused=${isFocused}.png`)).ok();
      }).before(async () => {
        await ClientFunction(() => {
          $('#otherContainer').css({
            'margin-top': '20px',
          });
        })();
      });
    });
  });
});

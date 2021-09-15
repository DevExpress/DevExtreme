import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { changeTheme } from '../../helpers/changeTheme';
import url from '../../helpers/getPageUrl';
import createWidget, { WidgetName } from '../../helpers/createWidget';

const shortOption = {
  width: 100,
  label: 'label',
  text: '',
};

const longOption = {
  width: 300,
  label: `this label is ${'very '.repeat(10)}long`,
  text: `this content is ${'very '.repeat(10)}long`,
  items: ['item1', 'item2'],
  value: 'item1',
};

async function createComponent(componentName: WidgetName,
  componentOptions: any, selector: string): Promise<void> {
  return createWidget(componentName, componentOptions, true, selector);
}

fixture`Label`
  .page(url(__dirname, '../container.html'));

const components: WidgetName[] = ['dxTextBox', 'dxTextArea', 'dxSelectBox'];
components.forEach((component) => {
  ['floating', 'static'].forEach((labelMode) => {
    ['outlined', 'underlined', 'filled'].forEach((stylingMode) => {
      [true, false].forEach((isFocused) => {
        [false, true].forEach((isMaterialTheme) => {
          test(`Label for ${component} labelMode=${labelMode} stylingMode=${stylingMode} focused=${isFocused}`, async (t) => {
            if (isMaterialTheme) {
              await changeTheme('material.blue.light');
            }

            const componentOption = {
              labelMode,
              stylingMode,
            };

            await createComponent(component, { ...componentOption, ...shortOption }, '#container');
            await createComponent(component, { ...componentOption, ...longOption }, '#otherContainer');

            if (isFocused) {
              await ClientFunction(() => {
                $('#container').addClass('dx-state-focused');
                $('#otherContainer').addClass('dx-state-focused');
              })();
            }

            await t.expect(await compareScreenshot(t, `label-${component}-labelMode=${labelMode}-stylingMode=${stylingMode}-focused=${isFocused}-material=${isMaterialTheme}.png`)).ok();
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
  });
});

[false, true].forEach((isMaterialTheme) => {
  test('Label scroll input dxTextArea', async (t) => {
    if (isMaterialTheme) {
      await changeTheme('material.blue.light');
    }

    await createWidget('dxTextArea',
      {
        height: 30,
        width: 200,
        text: `this content is ${'very '.repeat(10)}long`,
        label: 'label text',
      }, true);

    await t.scroll(Selector('.dx-texteditor-input'), 0, 15);

    await t.expect(await compareScreenshot(t, `label-scroll-text-area-material=${isMaterialTheme}.png`)).ok();
  });
});

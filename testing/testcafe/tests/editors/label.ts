import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { changeTheme } from '../../helpers/changeTheme';
import url from '../../helpers/getPageUrl';
import createWidget, { WidgetName } from '../../helpers/createWidget';

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];
const themes = ['generic.light', 'material.blue.light'];

fixture`Label`
  .page(url(__dirname, '../container.html'))
  .beforeEach(async () => {
    await ClientFunction(() => {
      $('#otherContainer').css({
        'margin-top': '20px',
      });
    })();
  }).afterEach(async () => {
    await changeTheme('generic.light');
  });

themes.forEach((theme) => {
  stylingMods.forEach((stylingMode) => {
    test(`Label for dxTagBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await t.click('#otherContainer');

      await t.expect(await compareScreenshot(t, `label-tag-box-styleMode=${stylingMode},theme=${theme.replace(/\./g, '-')}.png`)).ok();
    }).before(async (t) => {
      await t.resizeWindow(300, 400);
      await changeTheme(theme);

      const componentOption = {
        width: 300,
        label: 'label text',
        items: [...Array(10)].map((_, i) => `item${i}`),
        value: [...Array(5)].map((_, i) => `item${i}`),
        stylingMode,
      };

      await createWidget('dxTagBox', {
        ...componentOption,
        multiline: false,
      });

      return createWidget('dxTagBox', {
        ...componentOption,
        multiline: true,
      }, true, '#otherContainer');
    });

    test(`Label for dxNumberBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await t.expect(await compareScreenshot(t, `label-number-box-styleMode=${stylingMode},theme=${theme.replace(/\./g, '-')}.png`)).ok();
    }).before(async (t) => {
      await t.resizeWindow(300, 400);
      await changeTheme(theme);

      const componentOption = {
        width: 300,
        label: 'label text',
        stylingMode,
      };

      await createWidget('dxNumberBox', {
        ...componentOption,
        value: 'text',
      });

      return createWidget('dxNumberBox', {
        ...componentOption,
        value: 123,
      }, true, '#otherContainer');
    });

    test(`Label for dxDateBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await t.expect(await compareScreenshot(t, `label-date-box-styleMode=${stylingMode},theme=${theme.replace(/\./g, '-')}.png`)).ok();
    }).before(async (t) => {
      await t.resizeWindow(300, 400);
      await changeTheme(theme);

      return createWidget('dxDateBox', {
        width: 300,
        label: 'label text',
        stylingMode,
        value: new Date(1900, 0, 1),
      });
    });

    labelMods.forEach((labelMode) => {
      const components: WidgetName[] = ['dxTextBox', 'dxTextArea', 'dxSelectBox'];

      components.forEach((component) => {
        test(`Label for ${component} labelMode=${labelMode} stylingMode=${stylingMode} ${theme}`, async (t) => {
          await t.click('#otherContainer');

          await t.expect(await compareScreenshot(t, `label-${component}-labelMode=${labelMode}-stylingMode=${stylingMode},theme=${theme.replace(/\./g, '-')}.png`)).ok();
        }).before(async (t) => {
          await t.resizeWindow(300, 400);
          await changeTheme(theme);

          await createWidget(component, {
            width: 100,
            label: 'label',
            text: '',
            labelMode,
            stylingMode,
          });

          return createWidget(component, {
            width: 300,
            label: `this label is ${'very '.repeat(10)}long`,
            text: `this content is ${'very '.repeat(10)}long`,
            items: ['item1', 'item2'],
            labelMode,
            stylingMode,
          }, false, '#otherContainer');
        });
      });

      test(`Label for Lookup labelMode=${labelMode} stylingMode=${stylingMode} ${theme}`, async (t) => {
        await t.click('#otherContainer');

        await t.expect(await compareScreenshot(t, `label-lookup-${theme}-labelMode=${labelMode}-styleMode=${stylingMode}.png`)).ok();
      }).before(async (t) => {
        await t.resizeWindow(300, 800);
        await changeTheme(theme);

        const componentOption = {
          width: 300,
          label: 'label text',
          labelMode,
          dropDownCentered: false,
          items: [...Array(10)].map((_, i) => `item${i}`),
          stylingMode,
        };

        await createWidget('dxLookup', { ...componentOption });

        return createWidget('dxLookup', { ...componentOption }, false, '#otherContainer');
      });
    });
  });
});

test('Label scroll input dxTextArea', async (t) => {
  await t.scroll(Selector('.dx-texteditor-input'), 0, 20);

  await t.expect(await compareScreenshot(t, 'label-scroll-text-area.png')).ok();
}).before(async (t) => {
  await t.resizeWindow(300, 400);

  return createWidget('dxTextArea',
    {
      height: 50,
      width: 200,
      text: `this content is ${'very '.repeat(10)}long`,
      label: 'label text',
    }, true);
});

test('Label max-width changed with container size', async (t) => {
  await t
    .expect(Selector('#container .dx-label').getStyleProperty('max-width')).eql('82px');

  await t
    .eval(() => { $('#container').css('width', 400); });

  await t
    .expect(Selector('#container .dx-label').getStyleProperty('max-width')).eql('382px');
}).before(async (t) => {
  await t.resizeWindow(300, 400);

  return createWidget('dxTextBox', {
    width: 100,
    label: 'long label text long label text long label text long label text long label text',
  });
});

import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { changeTheme } from '../../helpers/changeTheme';
import url from '../../helpers/getPageUrl';
import createWidget, { WidgetName } from '../../helpers/createWidget';

async function createComponent(
  componentName: WidgetName,
  componentOptions: any,
  selector: string,
): Promise<void> {
  return createWidget(componentName, componentOptions, true, selector);
}

async function setTheme(theme: string): Promise<void> {
  if (theme === 'material') {
    await changeTheme('material.blue.light');
  } else {
    await changeTheme('generic.light');
  }
}

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];
const themes = ['generic', 'material'];

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
};

fixture`Label`
  .page(url(__dirname, '../container.html'));

const components: WidgetName[] = ['dxTextBox', 'dxTextArea', 'dxSelectBox'];
components.forEach((component) => {
  labelMods.forEach((labelMode) => {
    stylingMods.forEach((stylingMode) => {
      themes.forEach((theme) => {
        test(`Label for ${component} labelMode=${labelMode} stylingMode=${stylingMode} ${theme}`, async (t) => {
          await setTheme(theme);

          const componentOption = {
            labelMode,
            stylingMode,
          };

          await createComponent(component, { ...componentOption, ...shortOption }, '#container');

          await createComponent(component, { ...componentOption, ...longOption }, '#otherContainer');
          await t.click('#otherContainer');

          await t.expect(await compareScreenshot(t, `label-${component}-labelMode=${labelMode}-stylingMode=${stylingMode}-${theme}.png`)).ok();
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

themes.forEach((theme) => {
  test('Label scroll input dxTextArea', async (t) => {
    await setTheme(theme);

    await createWidget('dxTextArea',
      {
        height: 50,
        width: 200,
        text: `this content is ${'very '.repeat(10)}long`,
        label: 'label text',
      }, true);

    await t.scroll(Selector('.dx-texteditor-input'), 0, 20);

    await t.expect(await compareScreenshot(t, `label-scroll-text-area-${theme}.png`)).ok();
  });
});

stylingMods.forEach((stylingMode) => {
  themes.forEach((theme) => {
    test(`Label for dxTagBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await setTheme(theme);

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
      }, true);

      await createWidget('dxTagBox', {
        ...componentOption,
        multiline: true,
      }, true, '#otherContainer');
      await t.click('#otherContainer');

      await t.expect(await compareScreenshot(t, `label-tag-box-${theme}-styleMode=${stylingMode}.png`)).ok();
    }).before(async () => {
      await ClientFunction(() => {
        $('#otherContainer').css({
          'margin-top': '20px',
        });
      })();
    });
  });
});

labelMods.forEach((labelMode) => {
  stylingMods.forEach((stylingMode) => {
    themes.forEach((theme) => {
      test(`Label for Lookup labelMode=${labelMode} stylingMode=${stylingMode} ${theme}`, async (t) => {
        await setTheme(theme);

        const componentOption = {
          width: 300,
          label: 'label text',
          labelMode,
          dropDownCentered: false,
          items: [...Array(10)].map((_, i) => `item${i}`),
          stylingMode,
        };

        await createComponent('dxLookup', { ...componentOption }, '#container');

        await createComponent('dxLookup', { ...componentOption }, '#otherContainer');

        await t.click('#otherContainer');

        await t.expect(await compareScreenshot(t, `label-lookup-${theme}-labelMode=${labelMode}-styleMode=${stylingMode}.png`)).ok();
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

stylingMods.forEach((stylingMode) => {
  themes.forEach((theme) => {
    test(`Label for dxNumberBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await setTheme(theme);

      const componentOption = {
        width: 300,
        label: 'label text',
        stylingMode,
      };

      await createWidget('dxNumberBox', {
        ...componentOption,
        value: 'text',
      }, true);

      await createWidget('dxNumberBox', {
        ...componentOption,
        value: 123,
      }, true, '#otherContainer');

      await t.expect(await compareScreenshot(t, `label-number-box-${theme}-styleMode=${stylingMode}.png`)).ok();
    }).before(async () => {
      await ClientFunction(() => {
        $('#otherContainer').css({
          'margin-top': '20px',
        });
      })();
    });
  });
});

stylingMods.forEach((stylingMode) => {
  themes.forEach((theme) => {
    test(`Label for dxDateBox ${theme} stylingMode=${stylingMode}`, async (t) => {
      await setTheme(theme);

      const componentOption = {
        width: 300,
        label: 'label text',
        stylingMode,
      };

      await createWidget('dxDateBox', {
        ...componentOption,
        value: new Date(1900, 0, 1),
      }, true);

      await t.expect(await compareScreenshot(t, `label-date-box-${theme}-styleMode=${stylingMode}.png`)).ok();
    });
  });
});

test('Label max-width changed with container size', async (t) => {
  const componentOption = {
    width: 100,
    label: 'long label text long label text long label text long label text long label text',
  };

  await createWidget('dxTextBox', {
    ...componentOption,
  }, true);

  await t
    .expect(Selector('#container .dx-label').getStyleProperty('max-width')).eql('82px');

  await t.eval(() => { $('#container').css('width', 400); });

  await t
    .expect(Selector('#container .dx-label').getStyleProperty('max-width')).eql('382px');
});

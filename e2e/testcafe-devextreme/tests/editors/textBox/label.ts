import type { Properties } from 'devextreme/ui/text_box.d';
import type { LabelMode, EditorStyle, TextEditorButton } from 'devextreme/common';
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import TextBox from 'devextreme-testcafe-models/textBox';
import Guid from 'devextreme/core/guid';
import {
  removeStylesheetRulesFromPage, insertStylesheetRulesToPage, setStyleAttribute,
  appendElementTo, setClassAttribute,
} from '../../../helpers/domUtils';
import { isMaterial, testScreenshot, getThemeName } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`TextBox_Label`
  .page(url(__dirname, '../../container.html'));

// const labelModes: LabelMode[] = ['floating', 'static', 'hidden', 'outside'];
const visibleLabelModes: LabelMode[] = ['floating', 'static', 'outside'];
const stylingModes: EditorStyle[] = ['outlined', 'underlined', 'filled'];
const buttonsList: (string | TextEditorButton)[][] = [
  ['clear'],
  ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }],
  [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear'],
];

const TEXTBOX_CLASS = 'dx-textbox';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const INVALID_STATE_CLASS = 'dx-invalid';

const createTextBox = async (options?: Properties, state?: string): Promise<string> => {
  const id = `${`dx${new Guid()}`}`;

  await appendElementTo('#container', 'div', id, {});
  await createWidget('dxTextBox', {
    labelMode: 'floating',
    stylingMode: 'outlined',
    text: 'Text',
    label: 'Label Text',
    ...options,
  }, `#${id}`);

  if (state) {
    await setClassAttribute(Selector(`#${id}`), state);
  }

  return id;
};

[
  { labelMode: 'static', expectedWidths: { generic: 82, material: 68, fluent: 74 } },
  { labelMode: 'floating', expectedWidths: { generic: 82, material: 68, fluent: 74 } },
  { labelMode: 'outside', expectedWidths: { generic: 'none', material: 'none', fluent: 'none' } },
].forEach(({ labelMode, expectedWidths }) => {
  test(`Label max-width should be changed after container width was changed, labelMode is ${labelMode}`, async (t) => {
    const textBox = new TextBox('#container');

    const expectedWidth = expectedWidths[getThemeName()];

    await t
      .expect(textBox.getLabel().getStyleProperty('max-width'))
      .eql(expectedWidth === 'none' ? 'none' : `${expectedWidth}px`);

    await setStyleAttribute(Selector(`#${await textBox.element.getAttribute('id')}`), `width: ${t.ctx.initialWidth + t.ctx.deltaWidth}px;`);

    await t
      .expect(textBox.getLabel().getStyleProperty('max-width'))
      .eql(expectedWidth === 'none' ? 'none' : `${expectedWidth + t.ctx.deltaWidth}px`);
  }).before(async (t) => {
    t.ctx.initialWidth = 100;
    t.ctx.deltaWidth = 300;

    return createWidget('dxTextBox', {
      width: t.ctx.initialWidth,
      label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      labelMode,
    });
  });
});

test('Textbox render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage(`.${TEXTBOX_CLASS} { display: inline-block; vertical-align: middle; width: 60px; margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Textbox render with limited width.png', { element: '#container' });

  await removeStylesheetRulesFromPage();

  await insertStylesheetRulesToPage(`.${TEXTBOX_CLASS} { display: inline-block; vertical-align: middle; width: 260px; margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Textbox render.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const stylingMode of stylingModes) {
    // eslint-disable-next-line no-restricted-syntax
    for (const labelMode of visibleLabelModes) {
      // eslint-disable-next-line no-restricted-syntax
      for (const placeholder of ['Placeholder', '']) {
        await createTextBox({
          text: undefined,
          placeholder,
          stylingMode,
          labelMode,
        });
      }

      await createTextBox({ text: 'Text value' });
      await createTextBox({ rtlEnabled: true });
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const placeholder of ['Placeholder', '']) {
      await createTextBox({
        text: undefined,
        placeholder,
        stylingMode,
        label: undefined,
      });
    }
    await createTextBox({ label: undefined, text: 'Text value' });
    await createTextBox({ label: undefined, rtlEnabled: true });
  }
});

test('Textbox states', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage(`.${TEXTBOX_CLASS} { display: inline-block; vertical-align: middle; width: 260px; margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Textbox states.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const states = [
    HOVER_STATE_CLASS,
    FOCUSED_STATE_CLASS,
    READONLY_STATE_CLASS,
    INVALID_STATE_CLASS,
    `${INVALID_STATE_CLASS} ${FOCUSED_STATE_CLASS}`,
  ];
  // eslint-disable-next-line no-restricted-syntax
  for (const state of states) {
    // eslint-disable-next-line no-restricted-syntax
    for (const placeholder of ['Placeholder', '']) {
      await createTextBox({
        text: undefined,
        placeholder,
      }, state);
    }

    await createTextBox({ text: 'Text value' }, state);
    await createTextBox({ rtlEnabled: true }, state);
  }
});

test('Textbox with buttons container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage('#container { display: flex; flex-wrap: wrap; gap: 4px; }');

  await testScreenshot(t, takeScreenshot, 'Textbox with buttons container.png', { shouldTestInCompact: true });

  await removeStylesheetRulesFromPage();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  if (isMaterial()) {
    await insertStylesheetRulesToPage('#container .dx-widget { font-family: sans-serif }');
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const stylingMode of stylingModes) {
    // eslint-disable-next-line no-restricted-syntax
    for (const buttons of buttonsList) {
      await createTextBox({ stylingMode, buttons });
    }
  }
});

stylingModes.forEach((stylingMode) => {
  test(`TextBox should not be hovered after hover of outside label, stylingMode=${stylingMode}`, async (t) => {
    const textBox = new TextBox('#container');

    await t
      .hover(textBox.getLabelSpan())
      .expect(textBox.isHovered)
      .notOk();
  }).before(async () => createWidget('dxTextBox', {
    value: 'text',
    label: 'Label text',
    labelMode: 'outside',
    stylingMode,
    width: 500,
  }));

  test(`TextBox should be focused after click on outside label, stylingMode=${stylingMode}`, async (t) => {
    const textBox = new TextBox('#container');

    await t
      .click(textBox.getLabelSpan())
      .expect(textBox.isFocused)
      .ok();
  }).before(async () => createWidget('dxTextBox', {
    value: 'text',
    label: 'Label text',
    labelMode: 'outside',
    stylingMode,
    width: 500,
  }));
});

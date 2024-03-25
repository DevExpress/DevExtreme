import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DateBox from 'devextreme-testcafe-models/dateBox';
import { clearTestPage } from '../../../helpers/clearPage';
import { appendElementTo } from '../../../helpers/domUtils';

fixture.disablePageReloads`DateBox keyboard navigation`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

test('DateBox should be closed by press esc key when navigator element in popup is focused, applyValueMode is useButtons', async (t) => {
  const dateBox = new DateBox('#container');

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true);

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateBox.option('opened'))
    .eql(false);

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true);

  await t
    .pressKey('tab')
    .pressKey('tab');

  await t
    .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateBox.option('opened'))
    .eql(false);

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true);

  await t
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab');

  await t
    .expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateBox.option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateBox', {
  openOnFieldClick: true,
  applyValueMode: 'useButtons',
}));

test('DateBox should be closed by press esc key when views wrapper in popup is focused, applyValueMode is useButtons', async (t) => {
  const dateBox = new DateBox('#container');

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true);

  await t
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab');

  await t
    .expect(dateBox.getPopup().getViewsWrapper().focused)
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateBox.option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateBox', {
  openOnFieldClick: true,
  applyValueMode: 'useButtons',
}));

test('DateBox should be closed by press esc key when today/cancel/apply button in popup is focused, applyValueMode is useButtons', async (t) => {
  const dateBox = new DateBox('#container');

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true);

  await t
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab');

  await t
    .expect(dateBox.getPopup().getTodayButton().isFocused)
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateBox.option('opened'))
    .eql(false);

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true);

  await t
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab');

  await t
    .expect(dateBox.getPopup().getApplyButton().isFocused)
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateBox.option('opened'))
    .eql(false);

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true);

  await t
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab')
    .pressKey('tab');

  await t
    .expect(dateBox.getPopup().getCancelButton().isFocused)
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateBox.option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateBox', {
  openOnFieldClick: true,
  applyValueMode: 'useButtons',
}));

test('dateBox keyboard navigation via `tab` key if applyValueMode is useButtons, input -> prev -> caption -> next -> views -> today -> apply -> cancel -> input', async (t) => {
  const dateBox = new DateBox('#dateBox');

  await t
    .click(Selector('#firstFocusableElement'))
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input().focused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getViewsWrapper().focused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getTodayButton().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getApplyButton().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getCancelButton().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.input.focused)
    .ok();
}).before(async () => {
  await appendElementTo('#container', 'div', 'firstFocusableElement');
  await appendElementTo('#container', 'div', 'dateBox');
  await appendElementTo('#container', 'div', 'lastFocusableElement');

  await createWidget('dxButton', {
    text: 'First Focusable Element',
  }, '#firstFocusableElement');

  await createWidget('dxButton', {
    text: 'Last Focusable Element',
  }, '#lastFocusableElement');

  return createWidget('dxDateBox', {
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
    opened: true,
    dropDownOptions: {
      hideOnOutsideClick: false,
    },
  }, '#dateBox');
});

test('dateBox keyboard navigation via `shift+tab` key if applyValueMode is useButtons, input -> cancel -> apply -> today -> views -> next -> caption -> prev -> input', async (t) => {
  const dateBox = new DateBox('#dateBox');

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input.focused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getCancelButton().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getApplyButton().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getTodayButton().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getViewsWrapper().focused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input().focused)
    .ok();
}).before(async () => {
  await appendElementTo('#container', 'div', 'firstFocusableElement');
  await appendElementTo('#container', 'div', 'dateBox');
  await appendElementTo('#container', 'div', 'lastFocusableElement');

  await createWidget('dxButton', {
    text: 'First Focused Element',
  }, '#firstFocusableElement');

  await createWidget('dxButton', {
    text: 'Last Focused Element',
  }, '#lastFocusableElement');

  return createWidget('dxDateBox', {
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
    opened: false,
  }, '#dateBox');
});

test('dateBox keyboard navigation via `tab` key if applyValueMode is instantly, input -> prev -> caption -> next -> views -> input', async (t) => {
  const dateBox = new DateBox('#dateBox');

  await t
    .click(Selector('#firstFocusableElement'))
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input().focused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getViewsWrapper().focused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.input.focused)
    .ok();
}).before(async () => {
  await appendElementTo('#container', 'div', 'firstFocusableElement');
  await appendElementTo('#container', 'div', 'dateBox');
  await appendElementTo('#container', 'div', 'lastFocusableElement');

  await createWidget('dxButton', {
    text: 'First Focusable Element',
  }, '#firstFocusableElement');

  await createWidget('dxButton', {
    text: 'Last Focusable Element',
  }, '#lastFocusableElement');

  return createWidget('dxDateBox', {
    openOnFieldClick: true,
    applyValueMode: 'instantly',
    opened: true,
    dropDownOptions: {
      hideOnOutsideClick: false,
    },
  }, '#dateBox');
});

test('dateBox keyboard navigation via `shift+tab` key if applyValueMode is instantly, input -> views -> next -> caption -> prev -> input', async (t) => {
  const dateBox = new DateBox('#dateBox');

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input.focused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getViewsWrapper().focused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorNextButton().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorPrevButton().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input().focused)
    .ok();
}).before(async () => {
  await appendElementTo('#container', 'div', 'firstFocusableElement');
  await appendElementTo('#container', 'div', 'dateBox');
  await appendElementTo('#container', 'div', 'lastFocusableElement');

  await createWidget('dxButton', {
    text: 'First Focused Element',
  }, '#firstFocusableElement');

  await createWidget('dxButton', {
    text: 'Last Focused Element',
  }, '#lastFocusableElement');

  return createWidget('dxDateBox', {
    openOnFieldClick: true,
    applyValueMode: 'instantly',
    opened: false,
  }, '#dateBox');
});

test('dateBox keyboard navigation via `tab` and `shift+tab` when calendar is not focusable', async (t) => {
  const dateBox = new DateBox('#dateBox');

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input.focused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getTodayButton().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input().focused)
    .ok();
}).before(async () => {
  await appendElementTo('#container', 'div', 'firstFocusableElement');
  await appendElementTo('#container', 'div', 'dateBox');
  await appendElementTo('#container', 'div', 'lastFocusableElement');

  await createWidget('dxButton', {
    text: 'First Focused Element',
  }, '#firstFocusableElement');

  await createWidget('dxButton', {
    text: 'Last Focused Element',
  }, '#lastFocusableElement');

  return createWidget('dxDateBox', {
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
    calendarOptions: {
      focusStateEnabled: false,
    },
  }, '#dateBox');
});

test('dateBox keyboard navigation via `tab` and `shift+tab` when navigator prev button is not focusable', async (t) => {
  const dateBox = new DateBox('#dateBox');

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input.focused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.getPopup().getNavigatorCaption().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input().focused)
    .ok();
}).before(async () => {
  await appendElementTo('#container', 'div', 'firstFocusableElement');
  await appendElementTo('#container', 'div', 'dateBox');
  await appendElementTo('#container', 'div', 'lastFocusableElement');

  await createWidget('dxButton', {
    text: 'First Focused Element',
  }, '#firstFocusableElement');

  await createWidget('dxButton', {
    text: 'Last Focused Element',
  }, '#lastFocusableElement');

  return createWidget('dxDateBox', {
    openOnFieldClick: true,
    min: new Date(),
  }, '#dateBox');
});

test('dateBox keyboard navigation via `tab` should close popup when there is no focusable elements', async (t) => {
  const dateBox = new DateBox('#container');

  await t
    .click(dateBox.input);

  await t
    .expect(dateBox.option('opened'))
    .eql(true)
    .expect(dateBox.isFocused)
    .ok()
    .expect(dateBox.input.focused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateBox.option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateBox', {
  openOnFieldClick: true,
  applyValueMode: 'instantly',
  calendarOptions: {
    focusStateEnabled: false,
  },
}, '#container'));

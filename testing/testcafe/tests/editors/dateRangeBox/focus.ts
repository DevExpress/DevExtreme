import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DateRangeBox from '../../../model/dateRangeBox';
import { clearTestPage } from '../../../helpers/clearPage';

fixture`DateRangeBox focus state`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

test('DateRangeBox & DateBoxes should have focus class if inputs are focused by tab', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(Selector('body'), { offsetX: -50 })
    .pressKey('tab')
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .pressKey('tab')
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .pressKey('tab')
    .expect(dateRangeBox.isFocused)
    .notOk()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
  width: 500,
}));

test('DateRangeBox & DateBoxes should have focus class if inputs are focused by click', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .click(dateRangeBox.getEndDateBox().input)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(Selector('body'), { offsetX: -50 })
    .expect(dateRangeBox.isFocused)
    .notOk()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
  width: 500,
}));

test('DateRangeBox & Start DateBox should have focus class after click on drop down button', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.dropDownButton)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('DateRangeBox & StartDateBox should be focused if dateRangeBox open by click on drop down button and endDateBox was focused', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().element);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.dropDownButton);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('onFocusIn should be called only after first click on drop down button', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.element, { offsetX: -20, offsetY: -20 });

  await t
    .expect(dateRangeBox.option('opened'))
    .ok();

  await t
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .click(dateRangeBox.dropDownButton);

  await t
    .expect(dateRangeBox.option('opened'))
    .notOk()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .click(dateRangeBox.element, { offsetX: -20, offsetY: -20 });

  await t
    .expect(dateRangeBox.option('opened'))
    .ok()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onFocusInCounter = 0;
    (window as any).onFocusOutCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
    onFocusIn() {
      ((window as any).onFocusInCounter as number) += 1;
    },
    onFocusOut() {
      ((window as any).onFocusOutCounter as number) += 1;
    },
  });
}).after(async () => {
  await ClientFunction(() => {
    delete (window as any).onFocusInCounter;
    delete (window as any).onFocusOutCounter;
  })();
});

test('onFocusIn should be called only on focus of startDate input', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(Selector('body'), { offsetX: -50 })
    .pressKey('tab');

  await t
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .pressKey('tab');

  await t
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .ok()
    .click(dateRangeBox.getCalendarCell(10))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 8, 8), new Date(2021, 9, 24)])
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .expect(dateRangeBox.option('opened'))
    .ok()
    .click(dateRangeBox.getCalendarCell(20))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 8, 8), new Date(2021, 8, 18)])
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .pressKey('shift+tab')
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .pressKey('shift+tab')
    .expect(dateRangeBox.isFocused)
    .notOk()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(1);
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onFocusInCounter = 0;
    (window as any).onFocusOutCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
    width: 500,
    onFocusIn() {
      ((window as any).onFocusInCounter as number) += 1;
    },
    onFocusOut() {
      ((window as any).onFocusOutCounter as number) += 1;
    },
  });
}).after(async () => {
  await ClientFunction(() => {
    delete (window as any).onFocusInCounter;
    delete (window as any).onFocusOutCounter;
  })();
});

test('Click by separator element should focus DateRangeBox or leave active input focused without call onFocusIn event handler', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.separator);

  await t
    .expect(dateRangeBox.option('opened'))
    .notOk()
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .click(dateRangeBox.separator);

  await t
    .expect(dateRangeBox.option('opened'))
    .notOk()
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .ok()
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .click(dateRangeBox.separator);

  await t
    .expect(dateRangeBox.option('opened'))
    .ok()
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .click(Selector('body'), { offsetX: -50 })
    .expect(dateRangeBox.option('opened'))
    .notOk()
    .expect(dateRangeBox.isFocused)
    .notOk()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(1);
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onFocusInCounter = 0;
    (window as any).onFocusOutCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
    width: 500,
    onFocusIn() {
      ((window as any).onFocusInCounter as number) += 1;
    },
    onFocusOut() {
      ((window as any).onFocusOutCounter as number) += 1;
    },
  });
}).after(async () => {
  await ClientFunction(() => {
    delete (window as any).onFocusInCounter;
    delete (window as any).onFocusOutCounter;
  })();
});

test('EndDateBox should be stay focused after close popup by click on drop down button', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.element, { offsetX: -20, offsetY: -20 });

  await t
    .expect(dateRangeBox.option('opened'))
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(10))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 8, 8), new Date(2021, 9, 24)])
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.dropDownButton);

  await t
    .expect(dateRangeBox.option('opened'))
    .notOk()
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('DateRangeBox & StartDateBox should be focused after click on clear button', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().element);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.clearButton);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  showClearButton: true,
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('DateRangeBox & StartDateBox should be focused and stay opened after click on clear button when popup is opened', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().element);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .click(dateRangeBox.clearButton);

  await t.wait(500);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  showClearButton: true,
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: true,
}, '#container', {
  disableFxAnimation: false,
}));

test('DateRangeBox & StartDateBox should be focused after click on clear button', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input)
    .click(dateRangeBox.dropDownButton);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.clearButton);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  showClearButton: true,
  value: [null, '2021/10/24'],
  openOnFieldClick: false,
  opened: true,
}));

test('DateRangeBox & StartDateBox should be focused if startDateBox open by keyboard, alt+down, alt+up', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('DateRangeBox & StartDateBox should be focused if endDateBox open and close by keyboard, alt+down, alt+up', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('Opened dateRangeBox should not be closed after click on inputs, openOnFieldClick: true', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: true,
  opened: true,
}));

test('Opened dateRangeBox should be closed after outside click, openOnFieldClick: true', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(Selector('body'), { offsetX: -50 });

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .notOk()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .click(dateRangeBox.dropDownButton);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  width: 500,
  openOnFieldClick: true,
  opened: true,
}));

// TODO: find way to reproduce focus using accessKey accessKey
test.skip('DateRangeBox and StartDateBox should have focus class after focus via accessKey', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .pressKey('alt+x');

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  accessKey: 'x',
  openOnFieldClick: false,
}));

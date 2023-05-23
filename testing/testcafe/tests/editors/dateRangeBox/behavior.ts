import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DateRangeBox from '../../../model/dateRangeBox';
import { clearTestPage } from '../../../helpers/clearPage';

fixture.disablePageReloads`DateRangeBox behavior`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

test('Open by click on startDate input and select date in calendar, value: [null, null]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(10))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 6), null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(21))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 6), new Date(2021, 9, 17)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(2)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [null, null],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on startDate input and reselect start date in calendar, value: ["2021/09/17", null]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(10))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 6), null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(21))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 17), null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(2)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(25))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 17), new Date(2021, 9, 21)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(3)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [null, null],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on endDate input and select date in calendar, value: [null, null]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(21))
    .expect(dateRangeBox.option('value'))
    .eql([null, new Date(2021, 9, 17)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(10))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 6), new Date(2021, 9, 17)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(2);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(27))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 6), new Date(2021, 9, 23)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(3);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [null, null],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on startDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(10))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 6), new Date(2021, 9, 24)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on startDate input and select date in calendar > startDate, value: ["2021/09/17", "2021/09/28"]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(25))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 21), new Date(2021, 9, 28)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 28)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on startDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/21"]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(30))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 26), null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .click(dateRangeBox.getCalendarCell(31))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 27), null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(2);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .click(dateRangeBox.getCalendarCell(32))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 28), null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(3);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 21)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on endDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/24"]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(30))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 17), new Date(2021, 9, 26)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on endDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(25))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 17), new Date(2021, 9, 21)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on endDate input and select date in calendar < startDate, value: ["2021/09/17", "2021/09/24"]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(10))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 6), null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(9))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 5), null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(2);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(8))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 4), null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(3);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(10))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 4), new Date(2021, 9, 6)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(4);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on endDate input and select date in calendar = endDate, value: ["2021/09/17", "2021/09/24"]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(28))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(0);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
}).after(async () => {
  await ClientFunction(() => {
    delete (window as any).onValueChangedCounter;
  })();
});

test('Open by click on endDate input and select date in calendar = startDate, value: ["2021/09/17", "2021/09/24"]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(21))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 17), new Date(2021, 9, 17)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Open by click on startDate input and select date in calendar = startDate -> endDate, value: ["2021/09/17", "2021/09/24"]', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getCalendarCell(21))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(0);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.getCalendarCell(28))
    .expect(dateRangeBox.option('value'))
    .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(0);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
    openOnFieldClick: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

test('Value in calendar should be updated by click on clear button if popup is open', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .click(dateRangeBox.clearButton)
    .expect(dateRangeBox.option('value'))
    .eql([null, null])
    .expect(dateRangeBox.getCalendar().option('values'))
    .eql([null, null])
    .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
    .eql(1);
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onValueChangedCounter = 0;
  })();

  return createWidget('dxDateRangeBox', {
    value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
    opened: true,
    width: 500,
    calendarOptions: {
      currentDate: new Date(2021, 9, 19),
    },
    showClearButton: true,
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  });
});

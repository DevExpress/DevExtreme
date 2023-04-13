import { ClientFunction } from 'testcafe';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Scheduler - DataSource loading`
  .page(url(__dirname, '../../container.html'));

declare global {
  interface Window {
    testOptions: {
      startDate?: Date;
      endDate?: Date;
      loadCount?: number;
    };
  }
}

const getWindow = ClientFunction(() => window.testOptions);
const repaint = ClientFunction(() => {
  (window as any).widget.repaint();
});

const pushDataToStore = async (key, data): Promise<void> => ClientFunction(() => {
  const store = (window as any).widget.getDataSource().store();
  store.push([{ type: 'update', key, data }]);
}, { dependencies: { key, data } })();

test('it should correctly load items with post processing', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment0 = scheduler.getAppointment('appt-0');

  await t
    .expect(scheduler.getAppointmentCount())
    .eql(1)
    .expect(appointment0.element.exists)
    .ok();
}).before(async () => createWidget(
  'dxScheduler',
  {
    dataSource: {
      store: [
        {
          text: 'appt-0',
          startDate: new Date(2021, 3, 26, 9, 30),
          endDate: new Date(2021, 3, 26, 11, 30),
        }, {
          text: 'appt-1',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 11, 30),
        }, {
          text: 'appt-2',
          startDate: new Date(2021, 3, 28, 9, 30),
          endDate: new Date(2021, 3, 28, 11, 30),
        },
      ],
      postProcess: (items) => [items[0]],
    },
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 9,
    endDayHour: 19,
    height: 600,
    width: 800,
  },
));

[true, false].forEach((groupByDate) => {
  test(`it should have start and end date in load options groupByDate=${groupByDate}`, async (t) => {
    const win = await getWindow();
    await t
      .expect(win.startDate)
      .eql(new Date(2021, 4, 9))
      .expect(win.endDate)
      .eql(new Date(2021, 4, 15, 2, 59));
  }).before(async () => createWidget(
    'dxScheduler',
    {
      dataSource: {
        load: (loadOptions) => {
          const { startDate, endDate } = loadOptions;

          // added dates to global scope because there isn't another acceptable way to test them
          window.testOptions = {
            startDate,
            endDate,
          };
        },
      },
      currentDate: new Date(2021, 4, 11),
      width: 700,
      height: 500,
      startDayHour: 0,
      endDayHour: 3,
      groupByDate,
      views: ['week'],
      currentView: 'week',
    },
  ));

  test(`it should have dates in load options when view dates changing. groupByDate=${groupByDate}`, async (t) => {
    const { toolbar } = new Scheduler('#container');

    await t
      .click(toolbar.navigator.nextButton);
    const win = await getWindow();
    await t
      .expect(win.startDate)
      .eql(new Date(2021, 4, 16))
      .expect(win.endDate)
      .eql(new Date(2021, 4, 22, 2, 59));
  }).before(async () => createWidget(
    'dxScheduler',
    {
      dataSource: {
        load: (loadOptions) => {
          const { startDate, endDate } = loadOptions;

          // added dates to global scope because there isn't another acceptable way to test them
          window.testOptions = {
            startDate,
            endDate,
          };
        },
      },
      currentDate: new Date(2021, 4, 11),
      width: 700,
      height: 500,
      startDayHour: 0,
      endDayHour: 3,
      groupByDate,
      views: ['week'],
      currentView: 'week',
    },
  ));
});

test('it should not call additional DataSource loads after repaint', async (t) => {
  await repaint();
  await repaint();
  await repaint();

  await pushDataToStore(0, {});

  const testClientData = await getWindow();
  await t.expect(testClientData?.loadCount).eql(2);
}).before(async () => ClientFunction(() => {
  window.testOptions = {
    loadCount: 0,
  };
  (window as any).widget = ($('#container') as any)
    .dxScheduler({
      dataSource: {
        store: new (window as any).DevExpress.data.ArrayStore({
          data: [],
          onLoaded: () => { window.testOptions.loadCount! += 1; },
        }),
      },
    }).dxScheduler('instance');
})());

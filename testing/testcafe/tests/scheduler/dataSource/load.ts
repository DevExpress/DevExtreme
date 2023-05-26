import { ClientFunction } from 'testcafe';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler - DataSource loading`
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

test('it should not call additional DataSource loads after repaint', async (t) => {
  await repaint();
  await repaint();
  await repaint();

  await pushDataToStore(0, {});
  await t.wait(200);

  const testClientData = await getWindow();
  await t.expect(testClientData.loadCount).eql(2);
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

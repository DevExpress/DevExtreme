import Scheduler from 'devextreme-testcafe-models/scheduler';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { generateAppointmentsWithResources, resources } from '../../helpers/generateAppointmentsWithResources';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';

fixture.disablePageReloads`KeyboardNavigation.appointments`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';

const resourceCount = 30;

const dataSource = generateAppointmentsWithResources({
  startDay: new Date(2021, 1, 1),
  endDay: new Date(2021, 1, 6),
  startDayHour: 8,
  endDayHour: 20,
  resourceCount,
});

const appointmentCount = dataSource.length;

const getConfig = () => ({
  views: [
    {
      type: 'timelineWorkWeek',
      name: 'Timeline',
      groupOrientation: 'vertical',
    },
    'week'
  ],
  dataSource,
  resources: [
    { fieldExpr: 'resourceId', label: 'Resource', dataSource: resources },
  ],
  groups: ['resourceId'],
  scrolling: {
    mode: 'virtual',
  },
  height: 600,
  cellDuration: 60,
  startDayHour: 8,
  endDayHour: 20,
  showAllDayPanel: false,
  currentView: 'Timeline',
  currentDate: new Date(2021, 1, 2),
});

const cellStyles = '#container .dx-scheduler-cell-sizes-vertical { height: 100px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px; }';

['virtual', 'standard'].forEach((scrollingMode) => {
  test(`focus next appointment on single tab (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t
      .click(scheduler.getAppointment('[Appointment 1]').element)
      .pressKey('tab');

    await t
      .expect(scheduler.getAppointment('[Appointment 2]').isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', getConfig());
  });

  test(`focus next appointment on 5 tab (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t
      .click(scheduler.getAppointment('[Appointment 1]').element)
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab');

    await t
      .expect(scheduler.getAppointment('[Appointment 6]').isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });

  test(`focus prev appointment on single shift+tab (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    const lastAppointmentText = `[Appointment ${appointmentCount}]`;
    const prevAppointmentText = `[Appointment ${appointmentCount - 1}]`;

    await scheduler.scrollTo(new Date(2021, 1, 5), { resourceId: resourceCount - 1 });

    await t
      .click(scheduler.getAppointment(lastAppointmentText).element)
      .pressKey('shift+tab');

    await t
      .expect(scheduler.getAppointment(prevAppointmentText).isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });

  test(`focus prev appointment on 5 shift+tab (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    const lastAppointmentText = `[Appointment ${appointmentCount}]`;
    const prevAppointmentText = `[Appointment ${appointmentCount - 5}]`;

    await scheduler.scrollTo(new Date(2021, 1, 5), { resourceId: resourceCount - 1 });

    await t
      .click(scheduler.getAppointment(lastAppointmentText).element)
      .pressKey('shift+tab')
      .pressKey('shift+tab')
      .pressKey('shift+tab')
      .pressKey('shift+tab')
      .pressKey('shift+tab');

    await t
      .expect(scheduler.getAppointment(prevAppointmentText).isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });

  test(`focus last appointment on End (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t
      .click(scheduler.getAppointment('[Appointment 1]').element)
      .pressKey('end');

    await t
      .expect(scheduler.getAppointment(`[Appointment ${appointmentCount}]`).isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });

  test(`focus first appointment on Home (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await scheduler.scrollTo(new Date(2021, 1, 5), { resourceId: resourceCount - 1 });

    await t
      .click(scheduler.getAppointment(`[Appointment ${appointmentCount}]`).element)
      .pressKey('home');

    await t
      .expect(scheduler.getAppointment('[Appointment 1]').isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });

  test(`focus first appointment in the next group by tab (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await scheduler.scrollTo(new Date(2021, 1, 5), { resourceId: 0 });

    await t
      .click(scheduler.getAppointment('[Appointment 14]').element)
      .pressKey('tab');

    await t
      .expect(scheduler.getAppointment('[Appointment 15]').isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });

  test(`focus last appointment in the prev group by shift+tab (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t
      .click(scheduler.getAppointment('[Appointment 15]').element)
      .pressKey('shift+tab');
    await t
      .expect(scheduler.getAppointment('[Appointment 14]').isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });

  test(`should focus appointment after close edit popup (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t
      .click(scheduler.getAppointment('[Appointment 1]').element)
      .pressKey('tab')
      .pressKey('enter')
      .pressKey('esc');

    await t
      .expect(scheduler.getAppointment('[Appointment 2]').isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });

  test(`first appointment should be focusable when navigating by tab second time (${scrollingMode} scrolling)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t
      .click(scheduler.getAppointment('[Appointment 1]').element)
      .pressKey('tab')
      .click(scheduler.toolbar.viewSwitcher.element)
      .pressKey('tab')
      .pressKey('tab');

    await t
      .expect(scheduler.getAppointment('[Appointment 1]').isFocused).ok();
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });

  test('should not reset scroll after appointment focus and scrolling down', async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    await t
      .click(scheduler.getAppointment('[Appointment 1]').element)
      .pressKey('tab')
      .scroll(scheduler.workspaceScrollable, 0, 1000);

    await t.expect(scheduler.workspaceScrollable.scrollTop).eql(1000);
  }).before(async () => {
    await insertStylesheetRulesToPage(cellStyles);
    await createWidget('dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
  });
});

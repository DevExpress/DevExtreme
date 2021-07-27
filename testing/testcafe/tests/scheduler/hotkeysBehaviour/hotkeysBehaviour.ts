import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Hotkeys for appointments update and navigation`
  .page(url(__dirname, '../../container.html'));

['week', 'month'].forEach((view) => {
  test(`Navigate between appointments in the "${view}" view (Tab/Shift+Tab)`, async (t) => {
    const scheduler = new Scheduler('#container');
    const firstAppointment = scheduler.getAppointment('Website Re-Design Plan');
    const secondAppointment = scheduler.getAppointment('Book Flights to San Fran for Sales Trip');

    await t
      .click(firstAppointment.element)
      .expect(firstAppointment.isFocused).ok()
      .pressKey('tab')
      .expect(firstAppointment.isFocused)
      .notOk()
      .expect(secondAppointment.isFocused)
      .ok()
      .pressKey('shift+tab')
      .expect(secondAppointment.isFocused)
      .notOk()
      .expect(firstAppointment.isFocused)
      .ok();
  }).before(async () => createScheduler({
    views: [view],
    currentView: view,
    dataSource,
  }));

  test(`Remove appointment in the "${view}" view (Del)`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Website Re-Design Plan');

    await t
      .click(appointment.element)
      .expect(appointment.isFocused).ok()
      .pressKey('delete')
      .expect(appointment.element.exists)
      .notOk();
  }).before(async () => createScheduler({
    views: [view],
    currentView: view,
    dataSource,
  }));

  test(`Show appointment popup in the "${view}" view (Enter)`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Website Re-Design Plan');
    const { appointmentPopup } = scheduler;

    await t
      .click(appointment.element)
      .expect(appointment.isFocused).ok()
      .pressKey('enter')
      .expect(appointmentPopup.isVisible())
      .ok();
  }).before(async () => createScheduler({
    views: [view],
    currentView: view,
    dataSource,
  }));

  test(`Navigate between tooltip appointments in the "${view}" view (Up/Down)`, async (t) => {
    const scheduler = new Scheduler('#container');
    const collector = scheduler.getAppointmentCollector('3');
    const { appointmentPopup } = scheduler;
    const { appointmentTooltip } = scheduler;

    await t
      .click(collector.element)
      .expect(appointmentTooltip.isVisible()).ok()
      .pressKey('down')
      .expect(appointmentTooltip.getListItem('New Brochures').isFocused)
      .ok()
      .pressKey('up')
      .expect(appointmentTooltip.getListItem('Approve New Online Marketing Strategy').isFocused)
      .ok()
      .pressKey('enter')
      .expect(appointmentTooltip.isVisible())
      .notOk()
      .expect(appointmentPopup.isVisible())
      .ok();
  }).before(async () => createScheduler({
    views: [view],
    currentView: view,
    dataSource,
  }));
});

const isFocused = (selector: Selector) => selector.hasClass('dx-state-focused');

test('Navigate between toolbar items', async (t) => {
  const scheduler = new Scheduler('#container');
  const { toolbar } = scheduler;
  const { viewSwitcher, dateNavigator } = toolbar;
  const { prevDuration, caption, nextDuration } = dateNavigator;

  await t
    .click(toolbar.element)
    .pressKey('tab')
    .expect(isFocused(prevDuration))
    .ok()

    .pressKey('right')
    .expect(isFocused(caption))
    .ok()

    .pressKey('right')
    .expect(isFocused(nextDuration))
    .ok()

    .pressKey('tab')
    .expect(isFocused(viewSwitcher.getButton('Day')))
    .ok()

    .pressKey('right')
    .expect(isFocused(viewSwitcher.getButton('Week')))
    .ok();
}).before(async () => createScheduler({
  views: ['day', 'week'],
  currentView: 'day',
}));

test('Navigate between custom toolbar items', async (t) => {
  const scheduler = new Scheduler('#container');
  const { toolbar } = scheduler;
  const { viewSwitcher, dateNavigator } = toolbar;
  const { prevDuration, caption, nextDuration } = dateNavigator;
  const todayButton = toolbar.element.find('.dx-button').withText('Today');

  await t
    .click(toolbar.element)
    .pressKey('tab')
    .expect(isFocused(viewSwitcher.getButton('Day')))
    .ok()

    .pressKey('right')
    .expect(isFocused(viewSwitcher.getButton('Week')))
    .ok()

    .pressKey('tab')
    .expect(isFocused(todayButton))
    .ok()

    .pressKey('tab')
    .expect(isFocused(prevDuration))
    .ok()

    .pressKey('right')
    .expect(isFocused(caption))
    .ok()

    .pressKey('right')
    .expect(isFocused(nextDuration))
    .ok();
}).before(async () => createScheduler({
  views: ['day', 'week'],
  currentView: 'day',
  toolbar: [
    {
      location: 'before',
      defaultElement: 'viewSwitcher',
    },
    {
      location: 'before',
      widget: 'dxButton',
      options: {
        text: 'Today',
      },
    },
    {
      location: 'after',
      defaultElement: 'dateNavigator',
    },
  ],
}));

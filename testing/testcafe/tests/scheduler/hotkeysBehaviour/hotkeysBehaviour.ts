import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import FocusableElement from '../../../model/internal/focusable';

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
    const collector = scheduler.collectors.find('3');
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

test('Navigate between toolbar items', async (t) => {
  const { toolbar } = new Scheduler('#container');
  const { navigator, viewSwitcher } = toolbar;

  const prevDuration = new FocusableElement(navigator.prevButton);
  const caption = new FocusableElement(navigator.caption);
  const nextDuration = new FocusableElement(navigator.nextButton);

  await t
    .click(toolbar.element)
    .pressKey('tab')
    .expect(prevDuration.hasFocusedState)
    .ok()

    .pressKey('right')
    .expect(caption.hasFocusedState)
    .ok()

    .pressKey('right')
    .expect(nextDuration.hasFocusedState)
    .ok()

    .pressKey('tab')
    .expect(viewSwitcher.getButton('Day').hasFocusedState)
    .ok()

    .pressKey('right')
    .expect(viewSwitcher.getButton('Week').hasFocusedState)
    .ok();
}).before(async () => createScheduler({
  views: ['day', 'week'],
  currentView: 'day',
}));

test('Navigate between custom toolbar items', async (t) => {
  const { toolbar } = new Scheduler('#container');
  const { navigator, viewSwitcher } = toolbar;

  const prevDuration = new FocusableElement(navigator.prevButton);
  const caption = new FocusableElement(navigator.caption);
  const nextDuration = new FocusableElement(navigator.nextButton);
  const todayButton = new FocusableElement(
    toolbar.element.find('.dx-button').withText('Today'),
  );

  await t
    .click(toolbar.element)
    .pressKey('tab')
    .expect(viewSwitcher.getButton('Day').hasFocusedState)
    .ok()

    .pressKey('right')
    .expect(viewSwitcher.getButton('Week').hasFocusedState)
    .ok()

    .pressKey('tab')
    .expect(todayButton.hasFocusedState)
    .ok()

    .pressKey('tab')
    .expect(prevDuration.hasFocusedState)
    .ok()

    .pressKey('right')
    .expect(caption.hasFocusedState)
    .ok()

    .pressKey('right')
    .expect(nextDuration.hasFocusedState)
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

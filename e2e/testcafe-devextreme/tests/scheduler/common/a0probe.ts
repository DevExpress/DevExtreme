/* eslint-disable no-underscore-dangle, spellcheck/spell-checker, @stylistic/max-len */
import { ClientFunction } from 'testcafe';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import createScheduler from './dragAndDrop/init/widget.setup';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Probe a0: T832887 collector click right after creation`
  .page(url(__dirname, '../../container.html'));

const readProbe = ClientFunction(() => {
  const probe = (window as any).__probe;
  if (!probe) {
    return { noProbe: true, error: (window as any).__probeError };
  }
  return {
    created: probe.created,
    tooltipCalls: probe.tooltipCalls,
    error: (window as any).__probeError,
    now: probe.now(),
    scrollY: window.scrollY,
    inner: `${window.innerWidth}x${window.innerHeight}`,
    events: probe.events,
    perf: probe.perf,
    muts: probe.muts.slice(-40),
  };
});

const PROBE_COPIES = 36;

for (let copy = 0; copy < PROBE_COPIES; copy += 1) {
  test(`Drag recurrent appointment occurrence from collector (T832887) [a0 #${copy}]`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Recurrence two');
    const collector = scheduler.collectors.find('2');
    const { appointmentTooltip } = scheduler;
    const appointmentTooltipItem = appointmentTooltip.getListItem('Recurrence two');
    const popup = Scheduler.getDeleteRecurrenceDialog();

    try {
      await t
        .click(collector.element)
        .expect(appointmentTooltip.isVisible()).ok();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`PROBE FAIL a0 #${copy} ${JSON.stringify(await readProbe())}`);
      throw error;
    }

    if (copy === 0) {
      // eslint-disable-next-line no-console
      console.log(`PROBE PASS a0 #${copy} ${JSON.stringify(await readProbe())}`);
    }

    await t
      .dragToElement(appointmentTooltipItem.element, scheduler.getDateTableCell(2, 2))
      .expect(appointmentTooltipItem.element.exists)
      .notOk()
      .click(popup.appointment)
      .expect(appointment.element.exists)
      .ok()
      .expect(appointment.date.time)
      .eql('4:00 AM - 6:00 AM')
      .expect(collector.element.exists)
      .notOk();
  }).before(async () => createScheduler({
    views: ['week'],
    currentView: 'week',
    firstDayOfWeek: 2,
    startDayHour: 4,
    maxAppointmentsPerCell: 1,
    dataSource: [{
      text: 'Recurrence one',
      startDate: new Date(2019, 2, 26, 8, 0),
      endDate: new Date(2019, 2, 26, 10, 0),
      recurrenceException: '',
      recurrenceRule: 'FREQ=DAILY',
    }, {
      text: 'Non-recurrent appointment',
      startDate: new Date(2019, 2, 26, 7, 0),
      endDate: new Date(2019, 2, 26, 11, 0),
    }, {
      text: 'Recurrence two',
      startDate: new Date(2019, 2, 26, 8, 0),
      endDate: new Date(2019, 2, 26, 10, 0),
      recurrenceException: '',
      recurrenceRule: 'FREQ=DAILY',
    }],
    currentDate: new Date(2019, 2, 26),
  }));
}

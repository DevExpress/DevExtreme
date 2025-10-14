import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`a11y - popup`
  .page(url(__dirname, '../../container.html'));

const checkOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
};

test('Scheduler edit appointment is accessible', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element());
  await t.expect(scheduler.legacyAppointmentPopup.isVisible()).ok();

  await a11yCheck(t, checkOptions, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [{
      text: 'Install New Router in Dev Room',
      startDate: new Date('2021-03-29T21:30:00.000Z'),
      endDate: new Date('2021-03-29T22:30:00.000Z'),
      recurrenceRule: 'FREQ=DAILY',
    }],
    editing: { legacyForm: true },
    recurrenceEditMode: 'series',
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
  });
});

test('Scheduler recurrence editor repeat end accessible', async (t) => {
  const scheduler = new Scheduler('#container');
  const getItem = (index: number) => scheduler
    .legacyAppointmentPopup
    .getEndRepeatRadioButton(index);
  const getAriaLabel = (index: number) => getItem(index)
    .getAttribute('aria-label');

  await t.doubleClick(scheduler.getAppointmentByIndex(0).element());
  await t.expect(scheduler.legacyAppointmentPopup.isVisible()).ok();

  await t
    .expect(getAriaLabel(1))
    .eql('On 22 May 2025')
    .expect(getAriaLabel(2))
    .eql('After')
    .typeText(scheduler.legacyAppointmentPopup.repeatUntilElement, '2026')
    .click(getItem(1)) // unfocus input
    .expect(getAriaLabel(1))
    .eql('On 22 May 2026')
    .expect(getAriaLabel(2))
    .eql('After');
  await t
    .click(getItem(0))
    .expect(getAriaLabel(1))
    .eql('On')
    .expect(getAriaLabel(2))
    .eql('After');
  await t
    .click(getItem(2))
    .expect(getAriaLabel(1))
    .eql('On')
    .expect(getAriaLabel(2))
    .eql('After 1 occurrence(s)')
    .typeText(scheduler.legacyAppointmentPopup.repeatCountElement, '3')
    .click(getItem(2)) // unfocus input
    .expect(getAriaLabel(1))
    .eql('On')
    .expect(getAriaLabel(2))
    .eql('After 13 occurrence(s)');
}).before(async () => {
  await createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    editing: { legacyForm: true },
    dataSource: [{
      text: 'Install New Router in Dev Room',
      startDate: new Date('2021-03-29T21:30:00.000Z'),
      endDate: new Date('2021-03-29T22:30:00.000Z'),
      recurrenceRule: 'FREQ=DAILY;UNTIL=20250522T215959Z',
    }],
    recurrenceEditMode: 'series',
    currentView: 'week',
    currentDate: new Date('2021-03-29T21:30:00.000Z'),
  });
});

import Scheduler from 'devextreme-testcafe-models/scheduler';
import { ClientFunction, Selector } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { appendElementTo } from '../../../../helpers/domUtils';

fixture.disablePageReloads`KeyboardNavigation.DateTable`
  .page(url(__dirname, '../../../container.html'));

const PARENT_SELECTOR = '#parentContainer';
const SCHEDULER_SELECTOR = '#container';
const BOTTOM_BTN_ID = 'bottom-btn';
const BOTTOM_BTN_SELECTOR = `#${BOTTOM_BTN_ID}`;

const setMacOsScrollableOptions = ClientFunction(() => {
  ($(SCHEDULER_SELECTOR) as any)
    .dxScheduler('instance')
    .getWorkSpaceScrollable()
    .option('useNative', true);
}, { dependencies: { SCHEDULER_SELECTOR } });

[
  'day',
  'week',
].forEach((currentView) => {
  test(`Should pass focus to the next elements after date table on Mac devices (view: ${currentView})`, async (t) => {
    const bottomBtn = Selector(BOTTOM_BTN_SELECTOR);
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const usualAppointment = scheduler.getAppointment('All-day');

    await t
      .click(usualAppointment.element)
      .pressKey('tab tab');

    await t.expect(bottomBtn.focused).ok();
  }).before(async () => {
    await appendElementTo(PARENT_SELECTOR, 'button', BOTTOM_BTN_ID);
    await createWidget('dxScheduler', {
      dataSource: [
        {
          startDate: '2024-01-01T01:00:00',
          endDate: '2024-01-01T02:00:00',
          text: 'Usual',
        },
        // NOTE: This case is reproduced only if view has allDay appointment
        {
          startDate: '2024-01-01T01:00:00',
          endDate: '2024-01-01T02:00:00',
          text: 'All-day',
          allDay: true,
        },
      ],
      // NOTE: Scheduler should have a height limit for enabling native scroll container
      height: 300,
      currentDate: '2024-01-01',
      currentView,
    });
    await setMacOsScrollableOptions();
  });
});

import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Scheduler', 'IndividualViewsCustomization', { width: 900, height: 600 }, () => {
  test('AppointmentPopup', async ({ page }) => {
    // Whether the appointment under the popup keeps its focus style is a race between the
    // appointment and the popup, and it ends differently in the frameworks.
    const appointment = page.locator('.dx-scheduler-appointment').nth(0);

    await appointment.dblclick();

    await testScreenshot(page, 'scheduler_IndividualViewCustomization_appointment_popup-1.png', undefined, { mask: [appointment] });

    await page
      .locator('.dx-scheduler-appointment-popup .dx-popup-content-scrollable')
      .first()
      .evaluate((element, [dx, dy]) => element.scrollBy(dx, dy), [0, 1000]);

    await testScreenshot(page, 'scheduler_IndividualViewCustomization_appointment_popup-2.png', undefined, { mask: [appointment] });
  });
});

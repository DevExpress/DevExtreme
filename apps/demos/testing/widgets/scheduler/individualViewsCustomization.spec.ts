import { expect, test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Scheduler', 'IndividualViewsCustomization', { width: 900, height: 600 }, () => {
  test('AppointmentPopup', async ({ page }) => {
    const appointment = page.locator('.dx-scheduler-appointment').nth(0);

    await appointment.dblclick();
    // The appointment shows its focus style until the popup takes the focus.
    await expect(appointment).not.toContainClass('dx-state-focused');

    await testScreenshot(page, 'scheduler_IndividualViewCustomization_appointment_popup-1.png');

    await page
      .locator('.dx-scheduler-appointment-popup .dx-popup-content-scrollable')
      .first()
      .evaluate((element, [dx, dy]) => element.scrollBy(dx, dy), [0, 1000]);

    await testScreenshot(page, 'scheduler_IndividualViewCustomization_appointment_popup-2.png');
  });
});

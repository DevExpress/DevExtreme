import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Scheduler', 'Resources', { width: 900, height: 600 }, () => {
  test('Resource fields shouldn\'t empty', async ({ page }) => {
    const appointment = page.locator('.dx-scheduler-appointment').first();

    await appointment.dblclick();

    // Whether the appointment under the popup keeps its focus style is a race between the
    // appointment and the popup; the test is about the fields of the popup.
    await testScreenshot(page, 'scheduler_resources_appointment_popup.png', undefined, { mask: [appointment] });
  });
});

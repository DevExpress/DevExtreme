import { expect, test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Scheduler', 'Resources', { width: 900, height: 600 }, () => {
  test('Resource fields shouldn\'t empty', async ({ page }) => {
    const appointment = page.locator('.dx-scheduler-appointment').first();

    await appointment.dblclick();
    // The appointment shows its focus style until the popup takes the focus.
    await expect(appointment).not.toContainClass('dx-state-focused');

    await testScreenshot(page, 'scheduler_resources_appointment_popup.png');
  });
});

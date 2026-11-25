import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { describeManualTest, mockDate, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

// The form takes the switch value a moment after the click; a Save before that keeps the
// appointment timed, and nothing conflicts. TestCafe clicked slowly enough not to hit this.
const waitForAllDay = (page: Page): Promise<void> => expect(page.locator('.dx-scheduler-form-start-time-editor')).toBeHidden();

describeManualTest('Scheduler', 'ResolveTimeConflicts', { width: 900, height: 600 }, () => {
  test('AppointmentPopup in main group with conflict informer', async ({ page }) => {
    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Approve Personal' }).first().dblclick();
    await page.locator('.dx-scheduler-form-all-day-switch .dx-switch-container').first().click();
    await waitForAllDay(page);
    // The focused switch makes Chrome scroll the form, whose overflow hides the recurrence group,
    // by about 290px, so half of that group comes into view. TestCafe emulated the focus and did not
    // scroll. Reported as a finding; the test looks at the conflict informer.
    await page.locator('.dx-scheduler-appointment-popup .dx-form').first().evaluate((form) => { form.scrollLeft = 0; });
    await page.locator('.dx-popup-title .dx-button[aria-label="Save"]').first().click();
    await expect(page.locator('.conflict-informer')).toBeVisible();

    await testScreenshot(page, 'scheduler_ResolveTimeConflicts_appointment-popup_main-group_conflict-informer.png');
  });

  test('AppointmentPopup in recurrence group with conflict informer', async ({ page }) => {
    // The recurrence editor defaults its end date to today; the TestCafe etalon masked it.
    await mockDate(page, new Date(2026, 1, 10));
    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Approve Personal' }).first().dblclick();
    await page.locator('.dx-scheduler-form-all-day-switch .dx-switch-container').first().click();
    await waitForAllDay(page);
    await page.locator('.dx-scheduler-form-repeat-editor .dx-selectbox').first().click();
    await page.locator('.dx-selectbox-popup-wrapper .dx-list-item').filter({ hasText: 'Daily' }).first().click();
    await page.locator('.dx-popup-title .dx-button[aria-label="Save"]').first().click();

    await testScreenshot(page, 'scheduler_ResolveTimeConflicts_appointment-popup_recurrence-group_conflict-informer.png');
  });
});

import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const TEST_TITLE = 'Test';
const TEST_DESCRIPTION = 'Test description...';

const baseOptions = {
  currentDate: '2023-12-10',
  cellDuration: 240,
  editing: { legacyForm: true },
};

test.describe.skip('Appointment form: expressions', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('text: expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        textCustom: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
      }],
      textExpr: 'textCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await expect(appointment.first()).toBeVisible();
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').first().inputValue();
    expect(value).toBe(TEST_TITLE);
  });

  test('text: expression should work should not mutate DataSource data directly', async ({ page }) => {
    const dataSource = [{
      textCustom: TEST_TITLE,
      startDate: '2023-12-10T10:00:00',
      endDate: '2023-12-10T14:00:00',
    }];
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource,
      textExpr: 'textCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const subjectInput = popup.locator('.dx-texteditor-input').first();
    await subjectInput.fill('???');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].textCustom).toBe(TEST_TITLE);
  });

  test('text: nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        nested: { textCustom: TEST_TITLE },
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
      }],
      textExpr: 'nested.textCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').first().inputValue();
    expect(value).toBe(TEST_TITLE);
  });

  test('text: nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        nested: { textCustom: TEST_TITLE },
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
      }],
      textExpr: 'nested.textCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').first().fill('???');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nested.textCustom).toBe(TEST_TITLE);
  });

  test('text: deep nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        nestedA: { nestedB: { nestedC: { textCustom: TEST_TITLE } } },
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
      }],
      textExpr: 'nestedA.nestedB.nestedC.textCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').first().inputValue();
    expect(value).toBe(TEST_TITLE);
  });

  test('text: deep nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        nestedA: { nestedB: { nestedC: { textCustom: TEST_TITLE } } },
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
      }],
      textExpr: 'nestedA.nestedB.nestedC.textCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').first().fill('???');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nestedA.nestedB.nestedC.textCustom).toBe(TEST_TITLE);
  });

  test('description: expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        descriptionCustom: TEST_DESCRIPTION,
      }],
      descriptionExpr: 'descriptionCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').nth(1).inputValue();
    expect(value).toBe(TEST_DESCRIPTION);
  });

  test('description: expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        descriptionCustom: TEST_DESCRIPTION,
      }],
      descriptionExpr: 'descriptionCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').nth(1).fill('???');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].descriptionCustom).toBe(TEST_DESCRIPTION);
  });

  test('description: nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nested: { descriptionCustom: TEST_DESCRIPTION },
      }],
      descriptionExpr: 'nested.descriptionCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').nth(1).inputValue();
    expect(value).toBe(TEST_DESCRIPTION);
  });

  test('description: nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nested: { descriptionCustom: TEST_DESCRIPTION },
      }],
      descriptionExpr: 'nested.descriptionCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').nth(1).fill('???');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nested.descriptionCustom).toBe(TEST_DESCRIPTION);
  });

  test('description: deep nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nestedA: { nestedB: { nestedC: { descriptionCustom: TEST_DESCRIPTION } } },
      }],
      descriptionExpr: 'nestedA.nestedB.nestedC.descriptionCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').nth(1).inputValue();
    expect(value).toBe(TEST_DESCRIPTION);
  });

  test('description: deep nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nestedA: { nestedB: { nestedC: { descriptionCustom: TEST_DESCRIPTION } } },
      }],
      descriptionExpr: 'nestedA.nestedB.nestedC.descriptionCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').nth(1).fill('???');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nestedA.nestedB.nestedC.descriptionCustom).toBe(TEST_DESCRIPTION);
  });

  test('startDate: expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDateCustom: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
      }],
      startDateExpr: 'startDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').nth(2).inputValue();
    expect(value).toContain('12/10/2023');
  });

  test('startDate: expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDateCustom: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
      }],
      startDateExpr: 'startDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').nth(2).fill('10/10/2020, 01:00 AM');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].startDateCustom).toBe('2023-12-10T10:00:00');
  });

  test('startDate: nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        endDate: '2023-12-10T14:00:00',
        nested: { startDateCustom: '2023-12-10T10:00:00' },
      }],
      startDateExpr: 'nested.startDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').nth(2).inputValue();
    expect(value).toContain('12/10/2023');
  });

  test('startDate: nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        endDate: '2023-12-10T14:00:00',
        nested: { startDateCustom: '2023-12-10T10:00:00' },
      }],
      startDateExpr: 'nested.startDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').nth(2).fill('10/10/2020, 01:00 AM');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nested.startDateCustom).toBe('2023-12-10T10:00:00');
  });

  test('startDate: deep nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        endDate: '2023-12-10T14:00:00',
        nestedA: { nestedB: { nestedC: { startDateCustom: '2023-12-10T10:00:00' } } },
      }],
      startDateExpr: 'nestedA.nestedB.nestedC.startDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').nth(2).inputValue();
    expect(value).toContain('12/10/2023');
  });

  test('startDate: deep nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        endDate: '2023-12-10T14:00:00',
        nestedA: { nestedB: { nestedC: { startDateCustom: '2023-12-10T10:00:00' } } },
      }],
      startDateExpr: 'nestedA.nestedB.nestedC.startDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').nth(2).fill('10/10/2020, 01:00 AM');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nestedA.nestedB.nestedC.startDateCustom).toBe('2023-12-10T10:00:00');
  });

  test('endDate: expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDateCustom: '2023-12-10T14:00:00',
      }],
      endDateExpr: 'endDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').nth(3).inputValue();
    expect(value).toContain('2:00 PM');
  });

  test('endDate: expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDateCustom: '2023-12-10T14:00:00',
      }],
      endDateExpr: 'endDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').nth(3).fill('10/10/2020, 01:00 AM');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].endDateCustom).toBe('2023-12-10T14:00:00');
  });

  test('endDate: nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        nested: { endDateCustom: '2023-12-10T14:00:00' },
      }],
      endDateExpr: 'nested.endDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').nth(3).inputValue();
    expect(value).toContain('2:00 PM');
  });

  test('endDate: nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        nested: { endDateCustom: '2023-12-10T14:00:00' },
      }],
      endDateExpr: 'nested.endDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').nth(3).fill('10/10/2020, 01:00 AM');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nested.endDateCustom).toBe('2023-12-10T14:00:00');
  });

  test('endDate: deep nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        nestedA: { nestedB: { nestedC: { endDateCustom: '2023-12-10T14:00:00' } } },
      }],
      endDateExpr: 'nestedA.nestedB.nestedC.endDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const value = await popup.locator('.dx-texteditor-input').nth(3).inputValue();
    expect(value).toContain('2:00 PM');
  });

  test('endDate: deep nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        nestedA: { nestedB: { nestedC: { endDateCustom: '2023-12-10T14:00:00' } } },
      }],
      endDateExpr: 'nestedA.nestedB.nestedC.endDateCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-texteditor-input').nth(3).fill('10/10/2020, 01:00 AM');
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nestedA.nestedB.nestedC.endDateCustom).toBe('2023-12-10T14:00:00');
  });

  test('allDay: expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        allDayCustom: true,
      }],
      allDayExpr: 'allDayCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const allDaySwitch = popup.locator('.dx-switch');
    const isChecked = await allDaySwitch.getAttribute('aria-checked');
    expect(isChecked).toBe('true');
  });

  test('allDay: expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        allDayCustom: true,
      }],
      allDayExpr: 'allDayCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-switch').click();
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].allDayCustom).toBe(true);
  });

  test('allDay: nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nested: { allDayCustom: true },
      }],
      allDayExpr: 'nested.allDayCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const isChecked = await popup.locator('.dx-switch').getAttribute('aria-checked');
    expect(isChecked).toBe('true');
  });

  test('allDay: nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nested: { allDayCustom: true },
      }],
      allDayExpr: 'nested.allDayCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-switch').click();
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nested.allDayCustom).toBe(true);
  });

  test('allDay: deep nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nestedA: { nestedB: { nestedC: { allDayCustom: true } } },
      }],
      allDayExpr: 'nestedA.nestedB.nestedC.allDayCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const isChecked = await popup.locator('.dx-switch').getAttribute('aria-checked');
    expect(isChecked).toBe('true');
  });

  test('allDay: deep nested expression should work should not mutate DataSource data directly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nestedA: { nestedB: { nestedC: { allDayCustom: true } } },
      }],
      allDayExpr: 'nestedA.nestedB.nestedC.allDayCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await popup.locator('.dx-switch').click();
    await popup.locator('.dx-scheduler-appointment-popup-cancel').click();

    const ds = await page.evaluate(() => ($('#container') as any).dxScheduler('instance').option('dataSource'));
    expect(ds[0].nestedA.nestedB.nestedC.allDayCustom).toBe(true);
  });

  test('startDateTimeZone: expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        startDateTimeZoneCustom: 'Etc/GMT+1',
      }],
      editing: { legacyForm: true, allowTimeZoneEditing: true },
      startDateTimeZoneExpr: 'startDateTimeZoneCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await expect(popup).toBeVisible();
  });

  test('startDateTimeZone: nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nested: { startDateTimeZoneCustom: 'Etc/GMT+1' },
      }],
      editing: { legacyForm: true, allowTimeZoneEditing: true },
      startDateTimeZoneExpr: 'nested.startDateTimeZoneCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await expect(popup).toBeVisible();
  });

  test('startDateTimeZone: deep nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nestedA: { nestedB: { nestedC: { startDateTimeZoneCustom: 'Etc/GMT+1' } } },
      }],
      editing: { legacyForm: true, allowTimeZoneEditing: true },
      startDateTimeZoneExpr: 'nestedA.nestedB.nestedC.startDateTimeZoneCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await expect(popup).toBeVisible();
  });

  test('endDateTimeZone: expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        endDateTimeZoneCustom: 'Etc/GMT+2',
      }],
      editing: { legacyForm: true, allowTimeZoneEditing: true },
      endDateTimeZoneExpr: 'endDateTimeZoneCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await expect(popup).toBeVisible();
  });

  test('endDateTimeZone: nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nested: { endDateTimeZoneCustom: 'Etc/GMT+2' },
      }],
      editing: { legacyForm: true, allowTimeZoneEditing: true },
      endDateTimeZoneExpr: 'nested.endDateTimeZoneCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await expect(popup).toBeVisible();
  });

  test('endDateTimeZone: deep nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nestedA: { nestedB: { nestedC: { endDateTimeZoneCustom: 'Etc/GMT+2' } } },
      }],
      editing: { legacyForm: true, allowTimeZoneEditing: true },
      endDateTimeZoneExpr: 'nestedA.nestedB.nestedC.endDateTimeZoneCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await expect(popup).toBeVisible();
  });

  test('recurrenceRule: expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        recurrenceRuleCustom: 'FREQ=DAILY',
      }],
      recurrenceEditMode: 'series',
      recurrenceRuleExpr: 'recurrenceRuleCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const repeatSwitch = popup.locator('.dx-switch');
    const isChecked = await repeatSwitch.getAttribute('aria-checked');
    expect(isChecked).toBe('true');
  });

  test('recurrenceRule: nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nested: { recurrenceRuleCustom: 'FREQ=DAILY' },
      }],
      recurrenceEditMode: 'series',
      recurrenceRuleExpr: 'nested.recurrenceRuleCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const repeatSwitch = popup.locator('.dx-switch');
    const isChecked = await repeatSwitch.getAttribute('aria-checked');
    expect(isChecked).toBe('true');
  });

  test('recurrenceRule: deep nested expression should work', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...baseOptions,
      dataSource: [{
        text: TEST_TITLE,
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        nestedA: { nestedB: { nestedC: { recurrenceRuleCustom: 'FREQ=DAILY' } } },
      }],
      recurrenceEditMode: 'series',
      recurrenceRuleExpr: 'nestedA.nestedB.nestedC.recurrenceRuleCustom',
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const repeatSwitch = popup.locator('.dx-switch');
    const isChecked = await repeatSwitch.getAttribute('aria-checked');
    expect(isChecked).toBe('true');
  });

  test('Appointment popup should has correct width when the nested "recurrenceRuleExpr" option is set', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        startDate: '2023-12-10T10:00:00',
        endDate: '2023-12-10T14:00:00',
        text: TEST_TITLE,
        nestedA: { nestedB: { nestedC: { recurrenceRuleCustom: 'FREQ=DAILY' } } },
      }],
      currentDate: '2023-12-10',
      cellDuration: 240,
      recurrenceEditMode: 'series',
      recurrenceRuleExpr: 'nestedA.nestedB.nestedC.recurrenceRuleCustom',
      editing: { legacyForm: true },
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: TEST_TITLE });
    await appointment.first().dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const form = popup.locator('.dx-scheduler-form');
    await expect(form).toBeVisible();

    const content = popup.locator('.dx-popup-content');
    await testScreenshot(page, 'form_recurrence-editor-first-opening_nested-expr.png', { element: content });
  });
});

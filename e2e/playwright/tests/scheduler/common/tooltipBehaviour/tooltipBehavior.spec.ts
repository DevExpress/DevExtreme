import { expect, test } from '../../../../fixtures';
import { DEFAULT_BROWSER_SIZE } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import { createScheduler, scroll } from './init/widget.setup';

test.describe(() => {
  test.use({ browserSize: [600, 450] });

  test('The tooltip of collector should not scroll page and immediately hide', async ({ page }) => {
    await createScheduler(page, {
      views: [{
        type: 'week',
        name: 'week',
        maxAppointmentsPerCell: '0',
      }],
      currentDate: new Date(2017, 4, 25),
      startDayHour: 9,
      currentView: 'week',
      dataSource: ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((text) => ({
        text,
        startDate: new Date(2017, 4, 22, 9, 30),
        endDate: new Date(2017, 4, 22, 11, 30),
      })),
    });

    const scheduler = new Scheduler(page, '#container');

    await scheduler.collectors.find('7').element.click();

    await expect(scheduler.appointmentTooltip.wrapper).toBeVisible();
  });
});

test.describe(() => {
  test.use({ browserSize: [600, 400] });

  test('The tooltip should not hide after automatic scrolling during an appointment click', async ({ page }) => {
    await createScheduler(page, { views: ['week'], currentView: 'week', dataSource });

    const scheduler = new Scheduler(page, '#container');

    await scheduler.getAppointment('Brochure Design Review').element.click();

    await expect(scheduler.appointmentTooltip.wrapper).toBeVisible();
  });

  test('The tooltip should hide after manually scrolling in the browser', async ({ page }) => {
    await createScheduler(page, { views: ['week'], currentView: 'week', dataSource });

    const scheduler = new Scheduler(page, '#container');

    await scheduler.getAppointment('Brochure Design Review').element.click();

    await expect(scheduler.appointmentTooltip.wrapper).toBeVisible();

    await scroll(page, 0, 100);

    await expect(scheduler.appointmentTooltip.wrapper).toBeHidden();
  });
});

[
  false,
  true,
].forEach((adaptivityEnabled) => {
  const tooltipNamePrefix = adaptivityEnabled ? 'mobile' : 'desktop';

  test.describe(() => {
    test.use({ browserSize: adaptivityEnabled ? [600, 400] : DEFAULT_BROWSER_SIZE });

    test(`The tooltip screenshot (${tooltipNamePrefix})`, async ({ page }) => {
      await createScheduler(page, {
        views: ['week'],
        currentView: 'week',
        dataSource,
        adaptivityEnabled,
      });

      const scheduler = new Scheduler(page, '#container');
      const expectedTooltip = adaptivityEnabled
        ? scheduler.appointmentTooltip.mobileElement
        : scheduler.appointmentTooltip.element;

      await scheduler.getAppointment('Brochure Design Review').element.click();

      await testScreenshot(
        page,
        `appointment-${tooltipNamePrefix}-tooltip-screenshot.png`,
        { element: scheduler.element },
      );

      await expect(expectedTooltip).toBeAttached();
    });
  });
});

test.describe(() => {
  test.use({ browserSize: DEFAULT_BROWSER_SIZE });

  test('Collector tooltip focused list item screenshot', {
    tag: ['@generic.light', '@material.blue.light'],
  }, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: ['Text', 'Text2', 'Text3'].map((text) => ({
        text,
        startDate: new Date(2017, 4, 22, 9, 30, 0, 0),
        endDate: new Date(2017, 4, 22, 10, 30, 0, 0),
      })),
      views: [{
        type: 'month',
        maxAppointmentsPerCell: 1,
      }],
      currentView: 'month',
      currentDate: new Date(2017, 4, 22),
    });

    const scheduler = new Scheduler(page, '#container');
    const collector = scheduler.collectors.find('2 more');

    await expect(collector.element).toBeAttached();

    await collector.element.click();

    await expect(scheduler.appointmentTooltip.wrapper).toBeVisible();

    await page.keyboard.press('Tab');

    await testScreenshot(
      page,
      'collector-tooltip-focused-list-item.png',
      { element: scheduler.element },
    );
  });
});

test.describe(() => {
  test.use({ browserSize: [600, 1000] });

  test('Tooltip on mobile devices should have enough hight if there are async templates (React)', async ({ page }) => {
    await page.evaluate(() => { (window as any).deferreds = []; });

    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2017, 4, 25),
      currentView: 'month',
      adaptivityEnabled: true,
      templatesRenderAsynchronously: true,
      integrationOptions: {
        templates: {
          appointmentTooltip: {
            render(args) {
              const deferred = $.Deferred();

              (window as any).deferreds.push(deferred);
              deferred.done(() => {
                args.container.append(
                  $('<div>')
                    .height(50)
                    .text(args.model.appointmentData.text),
                );
                args.onRendered();
              });
            },
          },
        },
      },
      dataSource: ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((text) => ({
        text,
        startDate: new Date(2017, 4, 22, 0, 30),
        endDate: new Date(2017, 4, 22, 0, 30),
      })),
    });

    const scheduler = new Scheduler(page, '#container');

    const resolveAllRenderDeferreds = async (): Promise<void> => page.evaluate(() => {
      (window as any).deferreds
        .filter((deferred) => deferred.state() === 'pending')
        .map((deferred) => deferred.resolve());
    });

    // The same steps twice: the second pass is what caught the height regression.
    for (let pass = 0; pass < 2; pass += 1) {
      await scheduler.headerPanel.element.click(); // just click away
      await scheduler.collectors.find('7').element.click();
      await resolveAllRenderDeferreds();

      await testScreenshot(page, 'tooltip-rendering-with-react.png');
    }
  });
});

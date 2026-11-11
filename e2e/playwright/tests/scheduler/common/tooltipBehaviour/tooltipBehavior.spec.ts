import { expect, test } from '../../../../fixtures';
import { DEFAULT_BROWSER_SIZE } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import { createScheduler, scroll } from './init/widget.setup';

test.describe('Appointment tooltip behavior during scrolling in the Scheduler (T755449)', () => {
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
        dataSource: [{
          text: 'A',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }, {
          text: 'B',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }, {
          text: 'C',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }, {
          text: 'D',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }, {
          text: 'E',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }, {
          text: 'F',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }, {
          text: 'G',
          startDate: new Date(2017, 4, 22, 9, 30),
          endDate: new Date(2017, 4, 22, 11, 30),
        }],
      });

      const scheduler = new Scheduler(page, '#container');

      await scheduler.collectors.find('7').click();

      await scheduler.appointmentTooltip.expectVisible(true);
    });
  });

  test.describe(() => {
    test.use({ browserSize: [600, 400] });

    test('The tooltip should not hide after automatic scrolling during an appointment click', async ({ page }) => {
      await createScheduler(page, {
        views: ['week'],
        currentView: 'week',
        dataSource,
      });

      const scheduler = new Scheduler(page, '#container');
      const appointment = scheduler.getAppointment('Brochure Design Review');

      await appointment.element.click();
      await scheduler.appointmentTooltip.expectVisible(true);
    });

    test('The tooltip should hide after manually scrolling in the browser', async ({ page }) => {
      await createScheduler(page, {
        views: ['week'],
        currentView: 'week',
        dataSource,
      });

      const scheduler = new Scheduler(page, '#container');
      const appointment = scheduler.getAppointment('Brochure Design Review');

      await appointment.element.click();
      await scheduler.appointmentTooltip.expectVisible(true);
      await scroll(page, 0, 100);
      await scheduler.appointmentTooltip.expectVisible(false);
    });
  });

  [
    false,
    true,
  ].forEach((adaptivityEnabled) => {
    test.describe(() => {
      test.use({ browserSize: adaptivityEnabled ? [600, 400] : DEFAULT_BROWSER_SIZE });

      test(`The tooltip screenshot (adaptivityEnabled: ${adaptivityEnabled})`, async ({ page }) => {
        await createScheduler(page, {
          views: ['week'],
          currentView: 'week',
          dataSource,
          adaptivityEnabled,
        });

        const scheduler = new Scheduler(page, '#container');
        const appointment = scheduler.getAppointment('Brochure Design Review');
        const expectedSelector = adaptivityEnabled
          ? scheduler.appointmentTooltip.mobileElement
          : scheduler.appointmentTooltip.element;
        const tooltipNamePrefix = adaptivityEnabled ? 'mobile' : 'desktop';

        await appointment.element.click();

        await expect(expectedSelector).toBeAttached();

        await testScreenshot(
          page,
          `appointment-${tooltipNamePrefix}-tooltip-screenshot.png`,
          { element: scheduler.element },
        );
      });
    });
  });

  test.describe(() => {
    test.use({ browserSize: DEFAULT_BROWSER_SIZE });

    test('Collector tooltip focused list item screenshot', {
      tag: ['@fluent.blue.light', '@generic.light', '@material.blue.light'],
    }, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [{
          text: 'Text',
          startDate: new Date(2017, 4, 22, 9, 30, 0, 0),
          endDate: new Date(2017, 4, 22, 10, 30, 0, 0),
        }, {
          text: 'Text2',
          startDate: new Date(2017, 4, 22, 9, 30, 0, 0),
          endDate: new Date(2017, 4, 22, 10, 30, 0, 0),
        }, {
          text: 'Text3',
          startDate: new Date(2017, 4, 22, 9, 30, 0, 0),
          endDate: new Date(2017, 4, 22, 10, 30, 0, 0),
        }],
        views: [{
          type: 'month',
          maxAppointmentsPerCell: 1,
        }],
        currentView: 'month',
        currentDate: new Date(2017, 4, 22),
      });

      const scheduler = new Scheduler(page, '#container');
      const collector = scheduler.collectors.find('2 more');
      const { appointmentTooltip } = scheduler;

      await expect(collector.element).toBeAttached();
      await collector.element.click();
      await appointmentTooltip.expectVisible(true);
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
      await page.evaluate(() => {
        (window as any).deferreds = [];
      });

      await createWidget(page, 'dxScheduler', () => ({
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
        dataSource: [{
          text: 'A',
          startDate: new Date(2017, 4, 22, 0, 30),
          endDate: new Date(2017, 4, 22, 0, 30),
        }, {
          text: 'B',
          startDate: new Date(2017, 4, 22, 0, 30),
          endDate: new Date(2017, 4, 22, 0, 30),
        }, {
          text: 'C',
          startDate: new Date(2017, 4, 22, 0, 30),
          endDate: new Date(2017, 4, 22, 0, 30),
        }, {
          text: 'D',
          startDate: new Date(2017, 4, 22, 0, 30),
          endDate: new Date(2017, 4, 22, 0, 30),
        }, {
          text: 'E',
          startDate: new Date(2017, 4, 22, 0, 30),
          endDate: new Date(2017, 4, 22, 0, 30),
        }, {
          text: 'F',
          startDate: new Date(2017, 4, 22, 0, 30),
          endDate: new Date(2017, 4, 22, 0, 30),
        }, {
          text: 'G',
          startDate: new Date(2017, 4, 22, 0, 30),
          endDate: new Date(2017, 4, 22, 0, 30),
        }],
      }));

      const scheduler = new Scheduler(page, '#container');

      const resolveAllRenderDeferreds = () => page.evaluate(() => {
        (window as any).deferreds
          .filter((d) => d.state() === 'pending')
          .map((d) => d.resolve());
      });

      await scheduler.headerPanel.element.click(); // just click away
      await scheduler.collectors.find('7').element.click();
      await resolveAllRenderDeferreds();

      await testScreenshot(page, 'tooltip-rendering-with-react.png');

      // check again after re-doing steps

      await scheduler.headerPanel.element.click(); // just click away
      await scheduler.collectors.find('7').element.click();
      await resolveAllRenderDeferreds();

      await testScreenshot(page, 'tooltip-rendering-with-react.png');
    });
  });
});

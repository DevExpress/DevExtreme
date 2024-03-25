import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import dataSource from './init/widget.data';
import { createScheduler, scroll } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from 'devextreme-testcafe-models/scheduler';

fixture.disablePageReloads`Appointment tooltip behavior during scrolling in the Scheduler (T755449)`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('The tooltip of collector should not scroll page and immediately hide', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .click(scheduler.collectors.find('7').element)
    .expect(scheduler.appointmentTooltip.isVisible())
    .ok();
}, [600, 450]).before(async () => createScheduler({
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
}));

safeSizeTest('The tooltip should not hide after automatic scrolling during an appointment click', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Brochure Design Review');

  await t
    .click(appointment.element)
    .expect(scheduler.appointmentTooltip.isVisible())
    .ok();
}, [600, 400]).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource,
}));

safeSizeTest('The tooltip should hide after manually scrolling in the browser', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Brochure Design Review');

  await t
    .click(appointment.element)
    .expect(scheduler.appointmentTooltip.isVisible())
    .ok();
  await scroll(0, 100);
  await t
    .wait(500)
    .expect(scheduler.appointmentTooltip.isVisible()).notOk();
}, [600, 400]).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource,
}));

[
  false,
  true,
].forEach((adaptivityEnabled) => {
  /* safeSizeTest */test.skip('The tooltip screenshot', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Brochure Design Review');
    const expectedSelector = adaptivityEnabled
      ? scheduler.appointmentTooltip.mobileElement
      : scheduler.appointmentTooltip.element;
    const tooltipNamePrefix = adaptivityEnabled ? 'mobile' : 'desktop';

    await t
      .click(appointment.element)
      // act
      .expect(await takeScreenshot(`appointment-${tooltipNamePrefix}-tooltip-screenshot.png`, scheduler.element))
      .ok()
      // assert
      .expect(expectedSelector.exists)
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }/* , [600, 400] */).before(async () => createScheduler({
    views: ['week'],
    currentView: 'week',
    dataSource,
    adaptivityEnabled,
  }));
});

safeSizeTest('Tooltip on mobile devices should have enough hight if there are async templates (React)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  const resolveAllRenderDeferreds = ClientFunction(() => {
    (window as any).deferreds
      .filter((d) => d.state() === 'pending')
      .map((d) => d.resolve());
  });

  await t.click(scheduler.headerPanel.element); // just click away
  await t.click(scheduler.collectors.find('7').element);
  await resolveAllRenderDeferreds();

  await takeScreenshot('tooltip-rendering-with-react.png');

  // check again after re-doing steps

  await t.click(scheduler.headerPanel.element); // just click away
  await t.click(scheduler.collectors.find('7').element);
  await resolveAllRenderDeferreds();

  await takeScreenshot('tooltip-rendering-with-react.png');

  await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
}, [600, 1000]).before(async () => {
  const prepareRenderDeferreds = ClientFunction(() => {
    (window as any).deferreds = [];
  });
  await prepareRenderDeferreds();

  await createWidget('dxScheduler', {
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
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
  });
}).after(async () => {
  await ClientFunction(() => {
    delete (window as any).deferreds;
  })();
});

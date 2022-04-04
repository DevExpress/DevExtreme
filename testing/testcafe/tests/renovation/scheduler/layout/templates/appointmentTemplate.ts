import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'/* angular */],
});

fixture('Layout:Templates:appointmentTemplate');

['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek'/* , 'agenda' */].forEach((currentView) => {
  test(
    `appointmentTemplate layout should be rendered correctly in '${currentView}'`,
    async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler('#container');
      const {
        takeScreenshot,
        compareResults,
      } = createScreenshotsComparer(t);

      await t
        .expect(await takeScreenshot(`appointment-template-currentView=${currentView}.png`, scheduler.workSpace, screenshotComparerOptions))
        .ok()

        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    },
  ).before(async (_, { platform }) => {
    // WA for Inferno generator.
    const appointmentTemplate = platform === 'jquery'
      ? ClientFunction((appointment) => {
        const { startDate, endDate } = appointment.appointmentData;
        const startDateValue = new Date(startDate).toISOString().substring(0, 16);
        const endDateValue = new Date(endDate).toISOString().substring(0, 16);

        return `
          <div style="display: flex; flex-wrap: wrap;">
            <input type="datetime-local" value=${startDateValue} />
            <input type="datetime-local" value=${endDateValue} />
          </div>
        `;
      })
      : 'ModularTemplate';

    await createWidget(platform, 'dxScheduler', {
      dataSource: [{
        startDate: new Date(2017, 4, 21, 0, 30),
        endDate: new Date(2017, 4, 21, 2, 30),
      }, {
        startDate: new Date(2017, 4, 22, 0, 30),
        endDate: new Date(2017, 4, 22, 2, 30),
      }, {
        startDate: new Date(2017, 4, 23, 0, 30),
        endDate: new Date(2017, 4, 23, 2, 30),
      }, {
        startDate: new Date(2017, 4, 24, 0, 30),
        endDate: new Date(2017, 4, 24, 2, 30),
      }, {
        startDate: new Date(2017, 4, 25, 0, 30),
        endDate: new Date(2017, 4, 25, 2, 30),
      }, {
        startDate: new Date(2017, 4, 26, 0, 30),
        endDate: new Date(2017, 4, 26, 2, 30),
      }, {
        startDate: new Date(2017, 4, 27, 0, 30),
        endDate: new Date(2017, 4, 27, 2, 30),
      }],
      views: [currentView],
      currentView,
      currentDate: new Date(2017, 4, 25),
      appointmentTemplate,
      height: 600,
    });
  });
});

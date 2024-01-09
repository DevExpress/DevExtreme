import { getStyleAttribute, setStyleAttribute } from '../../../helpers/domUtils';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { scrollTo } from './utils';
import type { Appointment } from '../../../../../js/ui/scheduler';

fixture.disablePageReloads`Scheduler: Virtual Scrolling`
  .page(url(__dirname, '../../container.html'));

test('Appointment should not repaint after scrolling if present on viewport', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('', 0);

  await setStyleAttribute(element, 'background-color: red;');
  await t.expect(await getStyleAttribute(element)).eql('transform: translate(525px, 200px); width: 49px; height: 100px; background-color: red;');

  await scrollTo(new Date(2020, 8, 17, 4));

  await t.expect(await getStyleAttribute(element)).eql('transform: translate(525px, 200px); width: 49px; height: 100px; background-color: red;');
}).before(async () => {
  await createWidget('dxScheduler', {
    height: 600,
    width: 800,
    currentDate: new Date(2020, 8, 7),
    scrolling: {
      mode: 'virtual',
      orientation: 'both',
      outlineCount: 0,
    },
    currentView: 'week',
    views: [{
      type: 'week',
      intervalCount: 10,
    }],
    dataSource: [{
      startDate: new Date(2020, 8, 13, 2),
      endDate: new Date(2020, 8, 13, 3),
      text: 'test',
    }],
  });
});

test('Targeted appointment data should match original appointment data (T1205120)', async (t) => {
  const appointmentTextRegex = /^tid\[(\d+)\] hid\[\1\]/;

  const scheduler = new Scheduler('#container');

  const expectAllElementsMatchRegex = async (
    tc: TestController,
    elements: Selector,
    regex: RegExp,
  ) => {
    const count = await elements.count;

    for (let i = 0; i < count; i += 1) {
      await tc
        .expect(elements.nth(i).innerText)
        .match(regex);
    }
  };

  await expectAllElementsMatchRegex(t, scheduler.element.find('.dx-scheduler-appointment'), appointmentTextRegex);

  await scrollTo(new Date(2024, 0, 2, 8));

  await expectAllElementsMatchRegex(t, scheduler.element.find('.dx-scheduler-appointment'), appointmentTextRegex);

  await scrollTo(new Date(2024, 0, 3, 8));

  await expectAllElementsMatchRegex(t, scheduler.element.find('.dx-scheduler-appointment'), appointmentTextRegex);

  await scrollTo(new Date(2024, 0, 2, 8));

  await expectAllElementsMatchRegex(t, scheduler.element.find('.dx-scheduler-appointment'), appointmentTextRegex);

  await scrollTo(new Date(2024, 0, 1, 8));

  await expectAllElementsMatchRegex(t, scheduler.element.find('.dx-scheduler-appointment'), appointmentTextRegex);
}).before(async () => {
  const startDate = new Date(2024, 0, 1, 8);
  const endDate = new Date(2024, 0, 3, 10);
  const startDayHour = 8;
  const endDayHour = 20;
  const resourceCount = 30;

  const resourceDataSource = Array.from({ length: resourceCount }, (_, index) => ({
    id: index,
    text: `Resource ${index}`,
  }));

  const resourceAppointmentCount = Math.floor(
    (endDate.getTime() - startDate.getTime())
    / ((1000 * 60 * 60 * 24) / 2),
  );

  const startDates = Array
    .from({ length: resourceAppointmentCount })
    .map<Date>((_, index) => new Date(2024, 0, 1 + index, 8));

  const endDates = startDates.map((date) => {
    const result = new Date(date);
    result.setHours(result.getHours() + 2);
    return result;
  });

  const appointments = resourceDataSource.reduce<Appointment[]>((acc, resource) => acc.concat(
    Array
      .from({ length: resourceAppointmentCount })
      .map<Appointment>((_, index) => ({
      text: resource.text,
      startDate: startDates[index],
      endDate: endDates[index],
      humanId: resource.id,
    })),
  ), []);

  await createWidget('dxScheduler', {
    height: 600,
    width: 800,
    currentDate: new Date(2024, 0, 2),
    startDayHour,
    endDayHour,
    scrolling: {
      mode: 'virtual',
      // orientation: 'both',
    },
    groups: ['humanId'],
    views: ['week', 'month', 'timelineWorkWeek'],
    currentView: 'timelineWorkWeek',
    dataSource: appointments,
    resources: [
      {
        fieldExpr: 'humanId',
        allowMultiple: true,
        dataSource: resourceDataSource,
        label: 'Employees',
        displayExpr: 'id',
      },
    ],
    appointmentTemplate({ targetedAppointmentData, appointmentData }) {
      const { text, humanId: targetedId } = targetedAppointmentData;
      const { humanId } = appointmentData;

      const $element = $(`<div>tid[${targetedId}] hid[${humanId}] ${text}</div>`);

      if (humanId !== targetedId) {
        $element.css('background-color', 'red');
      }

      return $element;
    },
  });
});

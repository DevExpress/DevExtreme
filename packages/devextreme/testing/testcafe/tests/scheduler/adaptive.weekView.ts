import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import { safeSizeTest } from '../../helpers/safeSizeTest';
import Scheduler from '../../model/scheduler';

fixture.disablePageReloads`Week view in adaptive mode`
  .page(url(__dirname, '../container.html'));

const createScheduler = async (data, width = '100%'): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: data,
    views: ['week'],
    currentView: 'week',
    adaptivityEnabled: true,
    currentDate: new Date(2017, 4, 25),
    startDayHour: 9,
    height: 600,
    width,
  });
};

const sampleData = [
  {
    text: 'Website Re-Design Plan',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'Website Re-Design Plan',
    startDate: new Date(2017, 4, 22, 9, 40),
    endDate: new Date(2017, 4, 22, 11, 40),
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2017, 4, 22, 12, 0),
    endDate: new Date(2017, 4, 22, 13, 0),
    allDay: true,
  },
];

const sampleDataNotRoundedMinutes = [
  {
    text: 'Website Re-Design Plan',
    startDate: new Date(2017, 4, 22, 9, 10),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'Website Re-Design Plan',
    startDate: new Date(2017, 4, 23, 9, 5),
    endDate: new Date(2017, 4, 23, 11, 40),
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2017, 4, 24, 12, 12),
    endDate: new Date(2017, 4, 24, 13, 30),
  },
];

const roughEqual = (actual: number, expected: number): boolean => {
  const epsilon = 1.5;
  const delta = Math.abs(expected - actual);

  return delta <= epsilon;
};

[{
  top: 623,
  bottom: 700,
  left: 0,
  width: 350,
  windowWidth: 350,
  name: 'snap to bottom in phone',
}, {
  top: 312,
  bottom: 389,
  left: 80,
  width: 640,
  windowWidth: 800,
  name: 'align by center in tablet',
}].forEach((testCase) => {
  safeSizeTest(`Mobile tooltip should be ${testCase.name} screen`, async (t) => {
    const scheduler = new Scheduler('#container');

    await t
      .click(scheduler.collectors.get(0).element);

    const leftPosition = await scheduler.appointmentTooltip.mobileElement.getBoundingClientRectProperty('left');
    const bottomPosition = await scheduler.appointmentTooltip.mobileElement.getBoundingClientRectProperty('bottom');
    const topPosition = await scheduler.appointmentTooltip.mobileElement.getBoundingClientRectProperty('top');
    const width = await scheduler.appointmentTooltip.mobileElement.getBoundingClientRectProperty('width');

    await t
      .expect(roughEqual(leftPosition, testCase.left))
      .ok()
      .expect(roughEqual(bottomPosition, testCase.bottom))
      .ok()
      .expect(roughEqual(topPosition, testCase.top))
      .ok()
      .expect(roughEqual(width, testCase.width))
      .ok();
  }, [testCase.windowWidth, 700])
    .before(async () => createScheduler(sampleData, '80%'));
});

safeSizeTest('Compact appointment should be center by vertical alignment', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentCount()).eql(0)
    .expect(scheduler.collectors.count).eql(3);

  const firstAppointmentTop = await scheduler.collectors.get(0).element.getBoundingClientRectProperty('top');
  const firstAppointmentLeft = await scheduler.collectors.get(0).element.getBoundingClientRectProperty('left');

  const secondAppointmentTop = await scheduler.collectors.get(1).element.getBoundingClientRectProperty('top');
  const secondAppointmentLeft = await scheduler.collectors.get(1).element.getBoundingClientRectProperty('left');

  const thirdAppointmentTop = await scheduler.collectors.get(2).element.getBoundingClientRectProperty('top');
  const thirdAppointmentLeft = await scheduler.collectors.get(2).element.getBoundingClientRectProperty('left');

  await t
    .expect(roughEqual(firstAppointmentTop, 150))
    .ok()
    .expect(roughEqual(firstAppointmentLeft, 101))
    .ok()
    .expect(roughEqual(secondAppointmentTop, 150))
    .ok()
    .expect(roughEqual(secondAppointmentLeft, 139))
    .ok()
    .expect(roughEqual(thirdAppointmentTop, 450))
    .ok()
    .expect(roughEqual(thirdAppointmentLeft, 177))
    .ok();
}, [350, 600])
  .before(async () => createScheduler(sampleDataNotRoundedMinutes));

safeSizeTest('With a large browser width, should be visible common appointment instead of a compact', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentCount()).eql(0)
    .expect(scheduler.collectors.count).eql(2);

  const firstAppointmentTop = await scheduler.collectors.find('1').element.getBoundingClientRectProperty('top');
  const firstAppointmentLeft = await scheduler.collectors.find('1').element.getBoundingClientRectProperty('left');
  const secondAppointmentTop = await scheduler.collectors.find('2').element.getBoundingClientRectProperty('top');
  const secondAppointmentLeft = await scheduler.collectors.find('2').element.getBoundingClientRectProperty('left');

  await t
    .expect(roughEqual(firstAppointmentTop, 138))
    .ok()
    .expect(roughEqual(firstAppointmentLeft, 101))
    .ok()

    .expect(roughEqual(secondAppointmentTop, 250))
    .ok()
    .expect(roughEqual(secondAppointmentLeft, 101))
    .ok();

  await t.resizeWindow(700, 600);

  await t
    .expect(scheduler.getAppointmentCount()).eql(1)
    .expect(scheduler.collectors.count).eql(2);

  const firstAppointmentTopAfterResize = await scheduler.collectors.get(0).element.getBoundingClientRectProperty('top');
  const firstAppointmentLeftAfterResize = await scheduler.collectors.get(0).element.getBoundingClientRectProperty('left');
  const secondAppointmentTopAfterResize = await scheduler.collectors.get(1).element.getBoundingClientRectProperty('top');
  const secondAppointmentLeftAfterResize = await scheduler.collectors.get(1).element.getBoundingClientRectProperty('left');

  await t
    .expect(roughEqual(firstAppointmentTopAfterResize, 137.5))
    .ok()
    .expect(roughEqual(firstAppointmentLeftAfterResize, 215))
    .ok()

    .expect(roughEqual(secondAppointmentTopAfterResize, 256))
    .ok()
    .expect(roughEqual(secondAppointmentLeftAfterResize, 236.5))
    .ok();
}, [350, 600])
  .before(async () => createScheduler(sampleData));

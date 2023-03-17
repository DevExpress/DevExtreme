import { getStyleAttribute, setStyleAttribute } from '../../helpers/domUtils';
import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';
import { safeSizeTest } from '../../helpers/safeSizeTest';

fixture`Re-render on resize`
  .page(url(__dirname, '../container.html'));

const createScheduler = async (container, options?): Promise<void> => createWidget('dxScheduler', {
  ...options,
  currentDate: new Date(2020, 8, 7),
  startDayHour: 8,
  endDayHour: 20,
  cellDuration: 60,
  scrolling: {
    mode: 'virtual',
  },
  currentView: 'Timeline',
  views: [{
    type: 'timelineWorkWeek',
    name: 'Timeline',
    groupOrientation: 'vertical',
  }],
  dataSource: [{
    startDate: new Date(2020, 8, 7, 8),
    endDate: new Date(2020, 8, 7, 9),
    text: 'test',
  }],
}, container);

safeSizeTest('Appointment should re-rendered on window resize when width and height not set (T1139566)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('test');

  await setStyleAttribute(element, 'background-color: red;');
  await t.resizeWindow(300, 300);
  await t.expect(await getStyleAttribute(element)).eql('transform: translate(0px, 26px); width: 200px; height: 74px;');
}).before(async () => createScheduler('#container'));

safeSizeTest('Appointment should re-rendered on window resize when width and height have percent value (T1139566)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('test');

  await setStyleAttribute(element, 'background-color: red;');
  await t.resizeWindow(300, 400);
  await t.expect(await getStyleAttribute(element)).eql('transform: translate(0px, 26px); width: 200px; height: 74px;');
}).before(async () => createScheduler('#container', { width: '100%', height: '100%' }));

safeSizeTest('Appointment should not re-rendered on window resize when width and height have static value (T1139566)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('test');

  await setStyleAttribute(element, 'background-color: red;');
  await t.resizeWindow(300, 300);
  await t.expect(await getStyleAttribute(element)).eql('transform: translate(0px, 26px); width: 200px; height: 74px; background-color: red;');
}).before(async () => createScheduler('#container', { width: 600, height: 400 }));

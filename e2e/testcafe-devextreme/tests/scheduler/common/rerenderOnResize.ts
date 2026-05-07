import Scheduler from 'devextreme-testcafe-models/scheduler';
import { getStyleAttribute, setStyleAttribute } from '../../../helpers/domUtils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Re-render on resize`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (container, options?): Promise<void> => createWidget('dxScheduler', {
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
  ...options,
}, container);

test.meta({ browserSize: [800, 400] })('Appointment should re-rendered on window resize-up (T1139566)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('test');

  await setStyleAttribute(element, 'background-color: red;');
  await t.expect(await getStyleAttribute(element)).match(/transform: translate\(0px, 0px\); width: \d+\.\d+px; height: \d+px; background-color: red;/);
}).before(async () => createScheduler('#container', { currentView: 'workWeek' }));

test.meta({ browserSize: [300, 300] })('Appointment should not re-rendered on window resize when width and height not set (T1139566)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('test');

  await setStyleAttribute(element, 'background-color: red;');

  await t.expect(await getStyleAttribute(element)).eql('transform: translate(0px, 30px); width: 200px; height: 70px; background-color: red;');
}).before(async () => createScheduler('#container'));

test.meta({ browserSize: [300, 400] })('Appointment should not re-rendered on window resize when width and height have percent value (T1139566)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('test');

  await setStyleAttribute(element, 'background-color: red;');

  await t.expect(await getStyleAttribute(element)).eql('transform: translate(0px, 30px); width: 200px; height: 70px; background-color: red;');
}).before(async () => createScheduler('#container', { width: '100%', height: '100%' }));

test.meta({ browserSize: [300, 300] })('Appointment should not re-rendered on window resize when width and height have static value (T1139566)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('test');

  await setStyleAttribute(element, 'background-color: red;');

  await t.expect(await getStyleAttribute(element)).eql('transform: translate(0px, 30px); width: 200px; height: 61.7539px; background-color: red;');
}).before(async () => createScheduler('#container', { width: 600, height: 400 }));

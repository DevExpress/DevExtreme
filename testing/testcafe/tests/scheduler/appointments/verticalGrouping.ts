import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Appointments - Vertical grouping`
  .page(url(__dirname, '../../container.html'));

[
  {
    showAllDayPanel: false,
    position01: {
      left: 635,
      top: 117,
    },
    position02: {
      left: 635,
      top: 417,
    },
  },
  {
    showAllDayPanel: true,
    position01: {
      left: 635,
      top: 165,
    },
    position02: {
      left: 635,
      top: 515,
    },
  },
].forEach(({ showAllDayPanel, position01, position02 }) => {
  test(`Appointments should be rendered correctly in vertical grouped workspace Week, showAllDayPanel=${showAllDayPanel}`,
    async (t) => {
      const scheduler = new Scheduler('#container');
      const appt01 = scheduler.getAppointment('a');
      const appt02 = scheduler.getAppointment('b');

      await t
        .expect(appt01.element.exists)
        .ok()
        .expect(appt01.element.getBoundingClientRectProperty('top'))
        .eql(position01.top)
        .expect(appt01.element.getBoundingClientRectProperty('left'))
        .within(position01.left, position01.left + 1);

      await t
        .expect(appt02.element.exists)
        .ok()
        .expect(appt02.element.getBoundingClientRectProperty('top'))
        .eql(position02.top)
        .expect(appt02.element.getBoundingClientRectProperty('left'))
        .within(position02.left, position02.left + 1);
    }).before(async () => createWidget('dxScheduler',
    {
      width: 800,
      startDayHour: 9,
      endDayHour: 12,
      showAllDayPanel,
      dataSource: [{
        text: 'a',
        startDate: new Date(2018, 2, 16, 9),
        endDate: new Date(2018, 2, 16, 10, 30),
        id: 1,
      }, {
        text: 'b',
        startDate: new Date(2018, 2, 16, 9),
        endDate: new Date(2018, 2, 16, 10, 30),
        id: 2,
      }],
      currentDate: new Date(2018, 2, 16),
      views: [{
        type: 'week',
        groupOrientation: 'vertical',
      }],
      currentView: 'week',
      groups: ['id'],
      resources: [
        {
          field: 'id',
          dataSource: [
            { id: 1, text: 'one' },
            { id: 2, text: 'two' },
          ],
        },
      ],
    }));
});

[
  {
    showAllDayPanel: false,
    position01: {
      left: 209,
      top: 77,
    },
    position02: {
      left: 209,
      top: 377,
    },
  },
  {
    showAllDayPanel: true,
    position01: {
      left: 209,
      top: 125,
    },
    position02: {
      left: 209,
      top: 475,
    },
  },
].forEach(({ showAllDayPanel, position01, position02 }) => {
  test(`Appointments should be rendered correctly in vertical grouped workspace Day, showAllDayPanel=${showAllDayPanel}`,
    async (t) => {
      const scheduler = new Scheduler('#container');
      const appt01 = scheduler.getAppointment('a');
      const appt02 = scheduler.getAppointment('b');

      await t
        .expect(appt01.element.getBoundingClientRectProperty('top'))
        .eql(position01.top)
        .expect(appt01.element.getBoundingClientRectProperty('left'))
        .within(position01.left, position01.left + 1);

      await t
        .expect(appt02.element.getBoundingClientRectProperty('top'))
        .eql(position02.top)
        .expect(appt02.element.getBoundingClientRectProperty('left'))
        .within(position02.left, position02.left + 1);
    }).before(async () => createWidget('dxScheduler',
    {
      width: 800,
      startDayHour: 9,
      endDayHour: 12,
      showAllDayPanel,
      dataSource: [{
        text: 'a',
        startDate: new Date(2018, 2, 16, 9),
        endDate: new Date(2018, 2, 16, 10, 30),
        id: 1,
      }, {
        text: 'b',
        startDate: new Date(2018, 2, 16, 9),
        endDate: new Date(2018, 2, 16, 10, 30),
        id: 2,
      }],
      currentDate: new Date(2018, 2, 16),
      views: [{
        type: 'day',
        groupOrientation: 'vertical',
      }],
      currentView: 'day',
      groups: ['id'],
      resources: [
        {
          field: 'id',
          dataSource: [
            { id: 1, text: 'one' },
            { id: 2, text: 'two' },
          ],
        },
      ],
    }));
});

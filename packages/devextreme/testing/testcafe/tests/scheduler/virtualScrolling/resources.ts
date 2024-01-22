import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../container.html'));

test('Should correctly render view if virtual scrolling and groupByDate', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointmentByIndex(0);

  await t
    .expect(appointment.element.exists)
    .ok();
}).before(async () => {
  await createWidget(
    'dxScheduler',
    {
      height: 600,
      width: 200,
      dataSource: [{
        userId: 1,
        startDate: new Date(2022, 0, 16, 14, 30),
        endDate: new Date(2022, 0, 16, 15),
      }],
      currentDate: new Date(2022, 0, 15),
      views: ['month'],
      currentView: 'month',
      groupByDate: true,
      groups: [
        'userId',
      ],
      resources: [
        {
          fieldExpr: 'userId',
          allowMultiple: false,
          dataSource: [
            { id: 1, text: 'User 1' },
            { id: 2, text: 'User 2' },
            { id: 3, text: 'User 3' },
            { id: 4, text: 'User 4' },
            { id: 5, text: 'User 5' },
          ],
          label: 'User',
        },
      ],
      scrolling: {
        mode: 'virtual',
      },
    },
  );
});

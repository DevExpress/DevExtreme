import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Date navigator`
  .page(url(__dirname, '../../container.html'));

[{
  agendaDuration: 20,
  result: '11-30 May 2021',
}, {
  agendaDuration: 40,
  result: '11 May-19 Jun 2021',
}].forEach(({ agendaDuration, result }) => {
  test(`Caption of date navigator should be valid after change view to Agenda with agendaDuration=${agendaDuration}`, async (t) => {
    const { toolbar } = new Scheduler('#container');

    await t
      .click(toolbar.viewSwitcher.getButton('Agenda').element);

    await t
      .expect(toolbar.navigator.caption.innerText)
      .eql(result);
  }).before(async () => createWidget('dxScheduler', {
    dataSource: [],
    views: [{
      type: 'agenda',
      agendaDuration,
    }, 'month'],
    currentView: 'month',
    currentDate: new Date(2021, 4, 11),
    height: 600,
  }));
});

import { createWidget } from '../../../helpers/testHelper';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { Selector } from 'testcafe';

const createScheduler = () => createWidget("dxScheduler", {
    views: ['month'],
    currentView: "month",
    currentDate: new Date(2017, 4, 22),
    height: 600,
    width: 600,
    dataSource: [
        {
            show1: false,
            text: "Website Re-Design Plan",
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }
    ]
}, true);

fixture `Scheduler: several opening form`
    .page(url(__dirname, '../../container.html'));

    test("temp-temp", async t => {
        const scheduler = new Scheduler("#container");

        await t.setTestSpeed(0.1);

        await t.doubleClick(scheduler.getAppointment("Website Re-Design Plan").element);

    }).before(() => createScheduler());

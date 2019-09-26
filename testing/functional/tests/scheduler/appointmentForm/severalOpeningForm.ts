import { createWidget } from '../../../helpers/testHelper';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

const createScheduler = () => createWidget("dxScheduler", {
    views: ['month'],
    currentView: "month",
    currentDate: new Date(2017, 4, 22),
    height: 600,
    width: 600,
    dataSource: [
        {
            text: "Website Re-Design Plan",
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }
    ]
}, true);

fixture `Scheduler: several opening form`
    .page(url(__dirname, '../../container.html'));

    test("Subject and description fields should be empty after showing popup on empty cell", async t => {
        const APPOINTMENT_TEXT = "Website Re-Design Plan";

        const scheduler = new Scheduler("#container");
        const { appointmentPopup } = scheduler;

        await t.doubleClick(scheduler.getAppointment(APPOINTMENT_TEXT).element)
            .expect(appointmentPopup.subjectElement.value)
            .eql(APPOINTMENT_TEXT)

            .typeText(appointmentPopup.descriptionElement, "temp")

            .click(appointmentPopup.doneButton)
            .doubleClick(scheduler.getDateTableCell(0, 5))

            .expect(appointmentPopup.subjectElement.value)
            .eql("")

            .expect(appointmentPopup.descriptionElement.value)
            .eql("");

    }).before(() => createScheduler());

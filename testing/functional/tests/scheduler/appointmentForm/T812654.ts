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
    onAppointmentFormOpening: e => {
        const items = [{
            name: "show1",
            dataField: "show1",
            editorType: "dxCheckBox",
            editorOptions: {
                type: "boolean",
                onValueChanged: args => e.form.itemOption("text1", "visible", args.value)
            }
        }, {
            name: "text1",
            dataField: "text",
            editorType: "dxTextArea",
            colSpan: 6,
            visible: false
        }];
        e.form.option("items", items);
    },
    dataSource: [
        {
            show1: false,
            text: "Website Re-Design Plan",
            startDate: new Date(2017, 4, 22, 9, 30),
            endDate: new Date(2017, 4, 22, 11, 30)
        }
    ]
}, true);

fixture `Scheduler: T812654`
    .page(url(__dirname, '../../container.html'));

    test("Custom form shouldn't throw exception, after second show appointment form(T812654)", async t => {
        const scheduler = new Scheduler("#container");

        await t.setTestSpeed(0.1);

        await t.click(scheduler.getAppointment("Website Re-Design Plan").element) // DB click
            .click(scheduler.tooltip);

        await t.click(".dx-checkbox.dx-widget");

        const textarea = Selector(".dx-texteditor-input");

        await t.expect(textarea.value).eql("Website Re-Design Plan");

        await t.click(".dx-popup-cancel.dx-button");

        await t.click(scheduler.getAppointment("Website Re-Design Plan").element)
            .click(scheduler.tooltip);

    }).before(() => createScheduler());

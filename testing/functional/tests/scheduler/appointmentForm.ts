import { createWidget } from '../../helpers/testHelper';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';
import { Selector } from 'testcafe';

fixture `Appointment popup form`
    .page(url(__dirname, '../container.html'));

    test("Custom form shouldn't throw exception, after second show appointment form (T812654)", async t => {
        const APPOINTMENT_TEXT = "Website Re-Design Plan";
        const TEXT_EDITOR_CLASS = ".dx-texteditor-input";
        const CHECKBOX_CLASS = ".dx-checkbox.dx-widget";
        const CANCEL_BUTTON_CLASS = ".dx-popup-cancel.dx-button";

        const scheduler = new Scheduler("#container");

        await t.doubleClick(scheduler.getAppointment(APPOINTMENT_TEXT).element)
            .click(CHECKBOX_CLASS)

            .expect(Selector(TEXT_EDITOR_CLASS).value)
            .eql(APPOINTMENT_TEXT)

            .click(CANCEL_BUTTON_CLASS)

            .click(scheduler.getAppointment(APPOINTMENT_TEXT).element)
            .click(scheduler.tooltip)

            .expect(Selector(TEXT_EDITOR_CLASS).exists)
            .eql(false);
    }).before(() => createWidget("dxScheduler", {
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
    }, true));


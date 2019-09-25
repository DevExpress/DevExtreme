import { createWidget } from '../../helpers/testHelper';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

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
    .page(url(__dirname, '../container.html'));

    test("Custom form shouldn't throw exception, after second show appointment form(T812654)", async t => {
        const scheduler = new Scheduler("#container");

        await t.setTestSpeed(0.1).debug();

        await t.click(scheduler.getAppointment("Website Re-Design Plan").element)
            .click(scheduler.tooltip);


        // const views = [{
        //     name: "timelineDay",
        //     initValue: 0,
        //     expectedValue: 1700
        // }, {
        //     name: "timelineWeek",
        //     initValue: 0,
        //     expectedValue: 25700
        // }];

        // for(let view of views) {
        //     const { name, initValue, expectedValue } = view;

        //     await scheduler.option("currentView", name);
        //     await scheduler.option("useNative", true);

        //     await t
        //         .expect(scheduler.workSpaceScroll.left).eql(initValue, `Work space has init scroll position in ${name} view`)
        //         .expect(scheduler.headerSpaceScroll.left).eql(initValue, `Header space has init scroll position in ${name} view`);


        //     await t
        //         .expect(scheduler.workSpaceScroll.left).eql(expectedValue, `Work space is scrolled in ${name} view`)
        //         .expect(scheduler.headerSpaceScroll.left).eql(expectedValue, `Header space is scrolled in ${name} view`);
        // }
    }).before(() => createScheduler());

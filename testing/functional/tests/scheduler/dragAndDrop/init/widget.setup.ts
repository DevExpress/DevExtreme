import { createWidget } from "../../../../helpers/testHelper";

const widgetHeight: number = 833;
const widgetWidth: number = 1666;
const maxAppointmentsPerCell: number = 5;
const startDayHour: number = 9;
const currentDate: Date = new Date(2019, 3, 1);

const resources = [
    { id: 0, color: "#e01e38" },
    { id: 1, color: "#f98322" },
    { id: 2, color: "#1e65e8" }
];

export const createScheduler = (currentView, dataSource, firstDayOfWeek = 1) =>
    createWidget("dxScheduler", {
        dataSource: dataSource,
        resources: [
            {
                fieldExpr: "resourceId",
                dataSource: resources,
                label: "Color"
            }
        ],
        width: widgetWidth,
        height: widgetHeight,
        startDayHour: startDayHour,
        firstDayOfWeek: firstDayOfWeek,
        maxAppointmentsPerCell: maxAppointmentsPerCell,
        currentView: currentView,
        currentDate: currentDate
    });

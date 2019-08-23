import { createWidget } from "../../../../helpers/testHelper";

export const widgetHeight = 833;
export const widgetWidth = 1666;
export const maxAppointmentsPerCell = 5;
export const startDayHour = 9;
export const currentDate = new Date(2019, 3, 1);

export const resources = [
	{ id: "0", color: "#e01e38" },
	{ id: "1", color: "#f98322" },
	{ id: "2", color: "#1e65e8" }
];

export const createScheduler = async (mode, dataSource, firstDayOfWeek = 1) => {
	await createWidget("dxScheduler", {
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
		views: [mode],
		currentView: mode,
		currentDate: currentDate
	});
};

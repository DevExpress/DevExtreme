import { createWidget } from "../../../../helpers/testHelper";

const resources = [
	{ id: 0, color: "#e01e38" },
	{ id: 1, color: "#f98322" },
	{ id: 2, color: "#1e65e8" }
];

export const createScheduler = (currentView: string, dataSource: Array<any>, firstDayOfWeek: number = 1) =>
	createWidget("dxScheduler", {
		dataSource: dataSource,
		resources: [
			{
				fieldExpr: "resourceId",
				dataSource: resources,
				label: "Color"
			}
		],
		width: 1666,
		height: 833,
		startDayHour: 9,
		firstDayOfWeek: firstDayOfWeek,
		maxAppointmentsPerCell: 5,
		currentView: currentView,
		currentDate: new Date(2019, 3, 1)
	});

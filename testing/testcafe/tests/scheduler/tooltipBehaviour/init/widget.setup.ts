import { ClientFunction } from 'testcafe';
import { extend } from '../../../../../../js/core/utils/extend';
import { createWidget } from "../../../../helpers/testHelper";

export const createScheduler = (options = {}) =>
	createWidget("dxScheduler", extend({
		views: ["day"],
		dataSource: [],
		width: 600,
		height: 600,
		startDayHour: 9,
		firstDayOfWeek: 1,
		maxAppointmentsPerCell: 5,
		currentView: "day",
		currentDate: new Date(2019, 3, 1)
	}, options));

export const scroll = (horizontal: number, vertical: number) => {
    return ClientFunction(
        () => { window.scroll(horizontal, vertical) } ,
        { dependencies: { horizontal, vertical }}
    )();
}

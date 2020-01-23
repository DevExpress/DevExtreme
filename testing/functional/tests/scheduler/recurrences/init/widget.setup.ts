import { extend } from '../../../../../../js/core/utils/extend';
import { createWidget } from '../../../../helpers/testHelper';

const priorityData = [
    {
        text: "Low Priority",
        id: 1,
        color: "#1e90ff"
    }, {
        text: "High Priority",
        id: 2,
        color: "#ff9747"
    }
];

export const createScheduler = (options = {}) =>
	createWidget("dxScheduler", extend({
		currentDate: new Date(2020, 1, 9),
        views: ['week'],
        currentView: 'week',
        groupByDate: true,
        dataSource: [],
        width: 900
	}, options));

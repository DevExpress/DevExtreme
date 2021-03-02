import 'generic_light.css!';

import {
    createWrapper,
    initTestMarkup,
} from '../../helpers/scheduler/helpers.js';

const {
    testStart,
    module,
    test,
} = QUnit;

testStart(() => initTestMarkup());

module('Renovated Views', () => {
    ['week', 'timelineWeek'].forEach((currentView) => {
        test(`Group panel should not disappear on current date option change in ${currentView}`, function(assert) {
            const scheduler = createWrapper({
                currentView,
                views: [currentView],
                groups: ['resourceId'],
                resources: [{
                    fieldExpr: 'resourceId',
                    dataSource: [{ id: 1, text: '1' }, { id: 2, text: '2' }],
                }],
                currentDate: new Date(2021, 1, 20),
                renovateRender: true,
            });

            assert.equal(scheduler.workSpace.groups.getGroupHeaders().length, 2, 'Correct number of group headers');

            scheduler.instance.option('currentDate', new Date(2022, 1, 20));

            assert.equal(scheduler.workSpace.groups.getGroupHeaders().length, 2, 'Correct number of group headers');
        });
    });
});

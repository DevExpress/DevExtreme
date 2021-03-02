import { createWrapper, initTestMarkup, isDesktopEnvironment } from '../../helpers/scheduler/helpers.js';

import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

const { testStart, module, test } = QUnit;

testStart(() => initTestMarkup());

if(isDesktopEnvironment()) {
    module('Scrolling', () => {
        const resourcesData = [{
            text: 'A',
            id: 1
        }, {
            text: 'B',
            id: 2
        }, {
            text: 'C',
            id: 3
        }, {
            text: 'D',
            id: 4
        }];

        const priorityData = [{
            text: 'A',
            id: 1,
        }, {
            text: 'B',
            id: 2,
        }, {
            text: 'C',
            id: 3,
        }];

        const createScheduler = () => {
            return createWrapper({
                dataSource: [],
                views: ['timelineMonth'],
                currentView: 'timelineMonth',
                crossScrollingEnabled: true,
                groups: ['priority', 'resource'],
                resources: [{
                    fieldExpr: 'priority',
                    dataSource: priorityData,
                    label: 'Priority'
                }, {
                    fieldExpr: 'resource',
                    dataSource: resourcesData,
                    label: 'Resource'
                }],
                height: 580
            });
        };

        const testCases = [
            {
                name: 'header',
                scrollPosition: { x: 10 },
                text: 'header'
            }, {
                name: 'dataTable',
                scrollPosition: { x: 10 },
                text: 'dataTable(horizontal scrolling)'
            }, {
                name: 'dataTable',
                scrollPosition: { y: 10 },
                text: 'dataTable(vertical scrolling)'
            }, {
                name: 'sideBar',
                scrollPosition: { y: 10 },
                text: 'sideBar'
            }
        ];

        testCases.forEach(testCase => {
            test(`When ${testCase.text} was scrolling, semaphore should prevent scroll myself`, function(assert) {
                const scheduler = createScheduler();

                const { getHeaderScrollable, getDateTableScrollable, getSideBarScrollable } = scheduler.workSpace;

                const map = {
                    'header': getHeaderScrollable().dxScrollable('instance'),
                    'dataTable': getDateTableScrollable().dxScrollable('instance'),
                    'sideBar': getSideBarScrollable().dxScrollable('instance')
                };

                const headerScrollToSpy = sinon.spy(map.header, 'scrollTo');
                const dateTableScrollToSpy = sinon.spy(map.dataTable, 'scrollTo');
                const sideBarScrollToSpy = sinon.spy(map.sideBar, 'scrollTo');

                map[testCase.name].scrollTo(testCase.scrollPosition);

                assert.equal(headerScrollToSpy.callCount, 1, 'header should scroll once');
                assert.equal(dateTableScrollToSpy.callCount, 1, 'dataTable should scroll once');
                assert.equal(sideBarScrollToSpy.callCount, 1, 'side bar should scroll once');
            });
        });
    });
}


module('Views:startDate property', () => {
    module('Month', () => {
        test('if set startDate shouldn\'t throw exception(T828646)', function(assert) {
            const data = [{
                text: 'Google AdWords Strategy',
                startDate: new Date(2019, 10, 1, 9, 0, 0),
                endDate: new Date(2019, 10, 1, 10, 30, 0)
            }, {
                text: 'New Brochures',
                startDate: new Date(2019, 11, 1, 11, 30, 0),
                endDate: new Date(2019, 11, 1, 14, 15, 0)
            }];

            const scheduler = createWrapper({
                dataSource: data,
                views: [{
                    type: 'month',
                    startDate: new Date(2019, 9, 30)
                }],
                currentView: 'month',
                currentDate: new Date(2019, 10, 1),
                height: 580
            });

            const { navigator } = scheduler.header;

            assert.equal(scheduler.appointments.find(data[0].text).length, 1, `appointment '${data[0].text}' should render`);
            assert.equal(scheduler.appointments.find(data[1].text).length, 1, `appointment '${data[1].text}' should render`);

            assert.equal(scheduler.workSpace.getCell(1, 3).children().text(), '06', 'cell date should be equal 6');

            navigator.nextButton.click();

            assert.equal(scheduler.appointments.find(data[0].text).length, 0, `appointment '${data[0].text}' shouldn't render after change navigator on next month`);
            assert.equal(scheduler.appointments.find(data[1].text).length, 1, `appointment '${data[1].text}' should render after change navigator on next month`);

            assert.equal(scheduler.workSpace.getCell(1, 3).children().text(), '11', 'cell date should be equal 11 after change navigator on next month');

            navigator.prevButton.click();
            navigator.prevButton.click();

            assert.equal(scheduler.appointments.find(data[0].text).length, 1, `appointment '${data[0].text}' should render after change navigator on two months ago`);
            assert.equal(scheduler.appointments.find(data[1].text).length, 0, `appointment '${data[1].text}' shouldn't render after change navigator two months ago`);
        });
    });
});

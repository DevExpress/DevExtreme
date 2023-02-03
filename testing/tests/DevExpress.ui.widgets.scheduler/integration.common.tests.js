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

        const getScrollableArray = (scheduler) => {
            const { getHeaderScrollable, getDateTableScrollable, getSideBarScrollable } = scheduler.workSpace;

            return [
                getHeaderScrollable().dxScrollable('instance'),
                getDateTableScrollable().dxScrollable('instance'),
                getSideBarScrollable().dxScrollable('instance'),
            ];
        };

        test('Header scroll should do dateTable scroll', function(assert) {
            const done = assert.async();
            const scheduler = createScheduler();

            const [header, dateTable, sideBar] = getScrollableArray(scheduler);

            header.scrollTo({ left: 100 });

            setTimeout(() => {
                assert.equal(header.scrollLeft(), 100, 'header was scrolled');
                assert.equal(dateTable.scrollTop(), 0, 'date table wasn\'t scrolled vertically');
                assert.equal(dateTable.scrollLeft(), 100, 'date table was scrolled horizontally');
                assert.equal(sideBar.scrollTop(), 0, 'sidebar wasn\'t scrolled');

                done();
            });
        });

        test('DateTable vertical scroll should do sidebar scroll', function(assert) {
            const done = assert.async();
            const scheduler = createScheduler();

            const [header, dateTable, sideBar] = getScrollableArray(scheduler);

            dateTable.scrollTo({ top: 100 });

            setTimeout(() => {
                assert.equal(header.scrollLeft(), 0, 'header wasn\'t scrolled');
                assert.equal(dateTable.scrollTop(), 100, 'date table was scrolled vertically');
                assert.equal(dateTable.scrollLeft(), 0, 'date table wasn\'t scrolled horizontally');
                assert.equal(sideBar.scrollTop(), 100, 'sidebar was scrolled');

                done();
            });
        });

        test('DateTable horizontal scroll should do header scroll', function(assert) {
            const done = assert.async();
            const scheduler = createScheduler();

            const [header, dateTable, sideBar] = getScrollableArray(scheduler);

            dateTable.scrollTo({ left: 100 });

            setTimeout(() => {
                assert.equal(header.scrollLeft(), 100, 'header was scrolled');
                assert.equal(dateTable.scrollTop(), 0, 'date table wasn\'t scrolled vertically');
                assert.equal(dateTable.scrollLeft(), 100, 'date table was scrolled horizontally');
                assert.equal(sideBar.scrollTop(), 0, 'sidebar wasn\'t scrolled');

                done();
            });
        });

        test('DateTable vertical & horizontal scroll should do sidebar & header scroll', function(assert) {
            const done = assert.async();
            const scheduler = createScheduler();

            const [header, dateTable, sideBar] = getScrollableArray(scheduler);

            dateTable.scrollTo({ left: 100, top: 100 });

            setTimeout(() => {
                assert.equal(header.scrollLeft(), 100, 'header was scrolled');
                assert.equal(dateTable.scrollTop(), 100, 'date table was scrolled vertically');
                assert.equal(dateTable.scrollLeft(), 100, 'date table was scrolled horizontally');
                assert.equal(sideBar.scrollTop(), 100, 'sidebar was scrolled');

                done();
            });
        });

        test('Sidebar scroll should call dateTable scroll', function(assert) {
            const done = assert.async();
            const scheduler = createScheduler();

            const [header, dateTable, sideBar] = getScrollableArray(scheduler);

            sideBar.scrollTo({ top: 100 });

            setTimeout(() => {
                assert.equal(header.scrollLeft(), 0, 'header wasn\'t scrolled');
                assert.equal(dateTable.scrollTop(), 100, 'date table was scrolled vertically');
                assert.equal(dateTable.scrollLeft(), 0, 'date table wasn\'t scrolled horizontally');
                assert.equal(sideBar.scrollTop(), 100, 'sidebar was scrolled');

                done();
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

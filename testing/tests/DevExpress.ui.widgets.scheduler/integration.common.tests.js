import { createWrapper, initTestMarkup } from './helpers.js';

import 'common.css!';
import 'generic_light.css!';
import 'ui/scheduler/ui.scheduler';

const { testStart, module, test } = QUnit;

testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
    },

    afterEach() {
    }
};

module('Views:startDate property', moduleConfig, () => {
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


            assert.equal(scheduler.appointments.find(data[0].text).length, 1, `appointment '${data[0].text}' should render`);
            assert.equal(scheduler.appointments.find(data[1].text).length, 1, `appointment '${data[1].text}' should render`);

            assert.equal(scheduler.workSpace.getCell(1, 3).children().text(), '06', 'cell date should be equal 6');

            scheduler.navigator.clickOnNextButton();

            assert.equal(scheduler.appointments.find(data[0].text).length, 0, `appointment '${data[0].text}' shouldn't render after change navigator on next month`);
            assert.equal(scheduler.appointments.find(data[1].text).length, 1, `appointment '${data[1].text}' should render after change navigator on next month`);

            assert.equal(scheduler.workSpace.getCell(1, 3).children().text(), '11', 'cell date should be equal 11 after change navigator on next month');

            scheduler.navigator.clickOnPrevButton();
            scheduler.navigator.clickOnPrevButton();

            assert.equal(scheduler.appointments.find(data[0].text).length, 1, `appointment '${data[0].text}' should render after change navigator on two months ago`);
            assert.equal(scheduler.appointments.find(data[1].text).length, 0, `appointment '${data[1].text}' shouldn't render after change navigator two months ago`);
        });
    });
});

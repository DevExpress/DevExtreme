import {
    createWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

const views = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

const { testStart, test, module } = QUnit;

testStart(() => initTestMarkup());

module('Initialization', {
    beforeEach: function() {
    }
}, () => {
    views.forEach(view => {
        [true, false].forEach(virtualScrollingEnabled => {
            test(`Virtual scrolling if view: ${view}, virtualScrolling.enabled: ${virtualScrollingEnabled}`, function(assert) {
                const instance = createWrapper({
                    views: views,
                    currentView: view,
                    virtualScrolling: {
                        enabled: virtualScrollingEnabled
                    }
                }).instance;

                assert.equal(!!instance.getWorkSpace()._virtualScrolling, virtualScrollingEnabled, 'Virtual scrolling initialization');
            });
        });

        test(`Virtual scrolling optional if view: ${view}`, function(assert) {
            const instance = createWrapper({
                views: views,
                currentView: view
            }).instance;

            instance.option('virtualScrolling.enabled', true);
            assert.ok(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling Initialized');

            instance.option('virtualScrolling.enabled', false);
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
        });
    });
});

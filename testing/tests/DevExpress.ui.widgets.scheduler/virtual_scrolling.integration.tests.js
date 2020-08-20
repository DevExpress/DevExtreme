import {
    createWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

const supportedViews = ['day', 'week', 'workWeek'];
const unsupportedViews = ['month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

const { testStart, test, module } = QUnit;

testStart(() => initTestMarkup());

module('Initialization', {
    beforeEach: function() {
    }
}, () => {
    supportedViews.forEach(view => {
        [true, false].forEach(virtualScrollingEnabled => {
            test(`Virtual scrolling if view: ${view}, virtualScrolling.enabled: ${virtualScrollingEnabled}`, function(assert) {
                const instance = createWrapper({
                    views: supportedViews,
                    currentView: view,
                    virtualScrolling: {
                        enabled: virtualScrollingEnabled
                    },
                    renovateRender: true
                }).instance;

                assert.equal(!!instance.getWorkSpace()._virtualScrolling, virtualScrollingEnabled, 'Virtual scrolling initialization');
            });
        });

        test(`Virtual scrolling optional if view: ${view}`, function(assert) {
            const instance = createWrapper({
                views: supportedViews,
                currentView: view
            }).instance;

            instance.option('virtualScrolling.enabled', true);
            assert.ok(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling Initialized');

            instance.option('virtualScrolling.enabled', false);
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
        });
    });

    unsupportedViews.forEach(view => {
        [true, false].forEach(virtualScrollingEnabled => {
            test(`Virtual scrolling if view: ${view}, virtualScrolling.enabled: ${virtualScrollingEnabled}`, function(assert) {
                const instance = createWrapper({
                    views: unsupportedViews,
                    currentView: view,
                    virtualScrolling: {
                        enabled: virtualScrollingEnabled
                    },
                    renovateRender: true
                }).instance;

                assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
            });
        });

        test(`Virtual scrolling optional if view: ${view}`, function(assert) {
            const instance = createWrapper({
                views: unsupportedViews,
                currentView: view
            }).instance;

            instance.option('virtualScrolling.enabled', true);
            assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');

            instance.option('virtualScrolling.enabled', false);
            assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
        });
    });
});

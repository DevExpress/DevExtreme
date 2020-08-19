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
        [{
            mode: 'standard', result: false,
        }, {
            mode: 'virtual', result: true,
        }].forEach(scrolling => {
            test(`Virtual Scrolling as the ${view} view option, scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: supportedViews,
                    currentView: view,
                    scrolling: {
                        mode: scrolling.mode,
                    },
                }).instance;

                assert.equal(
                    !!instance.getWorkSpace()._virtualScrolling, scrolling.result, 'Virtual scrolling initialization',
                );
                assert.equal(instance.getWorkSpace().isRenovatedRender(), scrolling.result, 'Correct render is used');
            });

            test(`Virtual Scrolling as the ${view} view option, view.scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: [{
                        type: view,
                        scrolling: {
                            mode: scrolling.mode,
                        },
                    }],
                    currentView: view
                }).instance;

                assert.equal(
                    !!instance.getWorkSpace()._virtualScrolling, scrolling.result, 'Virtual scrolling initialization',
                );
                assert.equal(instance.getWorkSpace().isRenovatedRender(), scrolling.result, 'Correct render is used');
            });
        });

        test(`Virtual scrolling optional if view: ${view}`, function(assert) {
            const instance = createWrapper({
                views: supportedViews,
                currentView: view
            }).instance;

            instance.option('scrolling.mode', 'virtual');
            assert.ok(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling Initialized');
            assert.ok(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is used');

            instance.option('scrolling.mode', 'standard');
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
        });

        test(`Optional Virtual Scrolling as the ${view} view option`, function(assert) {
            const instance = createWrapper({
                views: [{
                    type: view,
                }],
                currentView: view
            }).instance;

            instance.option('views[0].scrolling.mode', 'virtual');
            assert.ok(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling is initialized');
            assert.ok(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is used');

            instance.option('views[0].scrolling.mode', 'standard');
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling is not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
        });
    });

    unsupportedViews.forEach(view => {
        [{
            mode: 'standard', result: false,
        }, {
            mode: 'virtual', result: true,
        }].forEach(scrolling => {
            test(`Virtual Scrolling as the ${view} view option, scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: unsupportedViews,
                    currentView: view,
                    scrolling: {
                        mode: scrolling.mode,
                    },
                }).instance;

                assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
                assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
            });

            test(`Virtual Scrolling as the ${view} view option, view.scrolling.mode: ${scrolling.mode}`, function(assert) {
                const instance = createWrapper({
                    views: [{
                        type: view,
                        scrolling: {
                            mode: scrolling.mode,
                        },
                    }],
                    currentView: view
                }).instance;

                assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
                assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
            });
        });

        test(`Virtual scrolling optional if view: ${view}`, function(assert) {
            const instance = createWrapper({
                views: unsupportedViews,
                currentView: view
            }).instance;

            instance.option('scrolling.mode', 'virtual');
            assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');

            instance.option('scrolling.mode', 'standard');
            assert.notOk(instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
        });

        test(`Optional Virtual Scrolling as the ${view} view option`, function(assert) {
            const instance = createWrapper({
                views: [{
                    type: view,
                }],
                currentView: view
            }).instance;

            instance.option('views[0].scrolling.mode', 'virtual');
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling is not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');

            instance.option('views[0].scrolling.mode', 'standard');
            assert.notOk(!!instance.getWorkSpace()._virtualScrolling, 'Virtual scrolling is not initialized');
            assert.notOk(instance.getWorkSpace().isRenovatedRender(), 'Renovated render is not used');
        });
    });
});

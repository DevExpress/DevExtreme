import 'generic_light.css!';
import 'ui/scroll_view/ui.scrollable';

import $ from 'jquery';
import memoryLeaksHelper from '../../helpers/memoryLeaksHelper.js';
import virtualScrollingCore, { VirtualScrollController, getPixelRatio } from 'ui/grid_core/ui.grid_core.virtual_scrolling_core';
import browser from 'core/utils/browser';
import devices from 'core/devices';
import renderer from 'core/renderer';

const mockComponent = {
    option: sinon.stub()
};

const mockDataSource = {
    pageSize: sinon.stub(),
    totalItemsCount: sinon.stub(),
    hasKnownLastPage: sinon.stub(),
    pageIndex: function(pageIndex) {
        if(pageIndex !== undefined) {
            this._pageIndex = pageIndex;
        }
        return this._pageIndex || 0;
    },
    isLoading: sinon.stub(),
    pageCount: function() {
        return this.totalItemsCount() / this.pageSize();
    },
    load: function() {

    },
    updateLoading: sinon.stub(),
    itemsCount: sinon.stub(),
    items: sinon.stub(),
    viewportItems: sinon.stub(),

    changingDuration: sinon.stub(),
    onChanged: sinon.stub()
};

const DEFAULT_TOTAL_ITEMS_COUNT = 20000;

const DEFAULT_PAGE_SIZE = 20;
const CONTENT_HEIGHT_LIMIT = virtualScrollingCore.getContentHeightLimit(browser);

function resetMock(mock) {
    $.each(mock, function(_, method) {
        method.reset && method.reset();
        method.resetBehavior && method.resetBehavior();
    });
}

function getContentSizes(size, count) {
    const items = [];

    for(let i = 0; i < count; i++) {
        items.push(size);
    }

    return items;
}

const moduleConfig = {
    beforeEach: function() {
        mockComponent.option.withArgs('scrolling.mode').returns('virtual');

        mockDataSource.pageSize.returns(DEFAULT_PAGE_SIZE);
        mockDataSource.items.returns([]);
        mockDataSource.viewportItems.returns([]);
        mockDataSource.totalItemsCount.returns(DEFAULT_TOTAL_ITEMS_COUNT);
        mockDataSource.hasKnownLastPage.returns(true);

        mockDataSource.isLoading.returns(false);

        mockDataSource.itemsCount.returns(DEFAULT_PAGE_SIZE);

        this.scrollController = new VirtualScrollController(mockComponent, mockDataSource);

        this.externalDataChangedHandler = sinon.stub();

        const that = this;
        mockDataSource.load = sinon.spy(function() {
            that.scrollController.handleDataChanged(that.externalDataChangedHandler);
        });
    },

    afterEach: function() {
        resetMock(mockComponent);
        resetMock(mockDataSource);
        mockDataSource.pageIndex(0);
    }
};


QUnit.module('VirtualScrollingController. Virtual scrolling mode', moduleConfig, () => {

    QUnit.test('viewportItemsize get/set', function(assert) {

        assert.ok(this.scrollController);

        assert.strictEqual(this.scrollController.viewportItemSize(), 20, 'Default item size');
        assert.strictEqual(this.scrollController.viewportItemSize(30), 30, 'set item size');
        assert.strictEqual(this.scrollController.viewportItemSize(), 30, 'get item size after setting');
    });

    QUnit.test('viewportSize get/set', function(assert) {

        assert.strictEqual(this.scrollController.viewportSize(), 0, 'Default viewport size');
        assert.strictEqual(this.scrollController.viewportSize(30), 30, 'set viewport size');
        assert.strictEqual(this.scrollController.viewportSize(), 30, 'get viewport size after setting');
    });

    QUnit.test('Load', function(assert) {
        this.scrollController.viewportSize(12);
        this.scrollController.load();


        assert.strictEqual(mockDataSource.load.callCount, 1);
        assert.equal(this.externalDataChangedHandler.callCount, 1);

        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 0);

        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [undefined]);
    });

    QUnit.test('Load after scroll to top', function(assert) {
        this.scrollController.viewportSize(12);
        this.scrollController.load();

        this.scrollController.setViewportPosition(0);

        assert.strictEqual(mockDataSource.load.callCount, 1);
        assert.equal(this.externalDataChangedHandler.callCount, 1);

        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 0);

        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [undefined]);
    });

    QUnit.test('Load if loadTwoPagesOnStart is true', function(assert) {
        mockComponent.option.withArgs('scrolling.loadTwoPagesOnStart').returns(true);
        this.scrollController.viewportSize(12);
        this.scrollController.load();


        assert.strictEqual(mockDataSource.load.callCount, 2);
        assert.equal(this.externalDataChangedHandler.callCount, 2);

        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 1);

        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);
    });

    QUnit.test('Load with removeInvisiblePages is true', function(assert) {
        mockComponent.option.withArgs('scrolling.removeInvisiblePages').returns(true);

        this.scrollController.viewportSize(12);
        this.scrollController.load();


        assert.strictEqual(mockDataSource.load.callCount, 1);
        assert.equal(this.externalDataChangedHandler.callCount, 1);

        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 0);

        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [undefined]);
    });

    // TODO Check it
    QUnit.skip('Load when dataSource pageIndex > 0', function(assert) {
        this.scrollController.viewportSize(12);
        mockDataSource.pageIndex(5);
        this.scrollController.load();


        assert.strictEqual(mockDataSource.load.callCount, 2);
        assert.equal(this.externalDataChangedHandler.callCount, 2); // TODO 1
        // assert.ok(this.externalDataChangedHandler.calledAfter(mockDataSource.load.lastCall));

        assert.strictEqual(this.scrollController.beginPageIndex(), 5);
        assert.strictEqual(this.scrollController.endPageIndex(), 6);

        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);
    });

    QUnit.test('setContentItemSizes. No items', function(assert) {
        this.scrollController.viewportSize(12);
        this.scrollController.setContentItemSizes([]);
        const virtualContentSize = this.scrollController.getVirtualContentSize();

        assert.ok(virtualContentSize);
        assert.strictEqual(virtualContentSize, DEFAULT_TOTAL_ITEMS_COUNT * this.scrollController.viewportItemSize());
    });

    QUnit.test('setContentItemSizes. When items', function(assert) {
        this.scrollController.viewportSize(12);
        this.scrollController.load();

        const contentSize = 200;

        const contentSizes = getContentSizes(20, 10);

        this.scrollController.setContentItemSizes(contentSizes);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + contentSize);
        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 0);

        assert.strictEqual(this.scrollController.getContentOffset(), 0);
    });
});

QUnit.module('Virtual scrolling', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);

        mockComponent.option.withArgs('scrolling.renderingThreshold').returns(70);

        this.scrollController.viewportSize(12);
        this.scrollController.load();
        this.contentSize = 400;

        const contentSizes = getContentSizes(20, 20);

        this.scrollController.setContentItemSizes(contentSizes);
        mockDataSource.load.reset();
        this.externalDataChangedHandler.reset();
    },

    afterEach: function() {
        moduleConfig.afterEach.call(this);
    }
}, () => {

    QUnit.test('set/get viewportPosition', function(assert) {

        const defaultViewportPosition = this.scrollController.getViewportPosition();

        this.scrollController.setViewportPosition(50);

        const viewportPosition = this.scrollController.getViewportPosition();

        assert.strictEqual(defaultViewportPosition, 0, 'default viewportPosition');

        assert.strictEqual(viewportPosition, 50, 'viewport position after set');
    });

    QUnit.test('setViewport position. Scroll in the viewport area', function(assert) {
        this.scrollController.setViewportPosition(1);
        mockDataSource.load.reset();

        this.scrollController.setViewportPosition(230);
        this.scrollController.setViewportPosition(1);
        this.scrollController.setViewportPosition(this.contentSize - 1);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 2 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + 400);
        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 1);

        assert.strictEqual(this.scrollController.getContentOffset(), 0);
        assert.ok(!mockDataSource.load.called);
    });


    QUnit.test('setViewport position. Scroll to second loaded page', function(assert) {
        this.scrollController.setViewportPosition(this.contentSize);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 3 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + 400);
        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 2);

        assert.strictEqual(this.scrollController.getContentOffset(), 0);
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 2);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);
    });

    QUnit.test('setViewport position. Scroll to third page after scroll to second page', function(assert) {
        this.scrollController.setViewportPosition(this.contentSize);
        this.scrollController.setViewportPosition(this.contentSize * 2);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 4 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + 400);
        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 3);

        assert.strictEqual(this.scrollController.getContentOffset(), 0);
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 3);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);
    });

    QUnit.test('Scroll with timeout', function(assert) {
        const clock = sinon.useFakeTimers();
        mockComponent.option.withArgs('scrolling.timeout').returns(100);
        mockDataSource.changingDuration.returns(200);
        this.scrollController.setViewportPosition(this.contentSize);
        this.scrollController.setViewportPosition(this.contentSize * 3);
        this.scrollController.setViewportPosition(this.contentSize * 4);
        this.scrollController.setViewportPosition(this.contentSize * 2);

        clock.tick(100);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 2 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + this.contentSize);
        assert.strictEqual(this.scrollController.beginPageIndex(), 2);
        assert.strictEqual(this.scrollController.endPageIndex(), 3);

        assert.strictEqual(this.scrollController.getContentOffset(), this.contentSize * 2);
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 2);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);

        clock.restore();
    });

    QUnit.test('Scroll with fast rendering', function(assert) {
        const clock = sinon.useFakeTimers();
        mockComponent.option.withArgs('scrolling.timeout').returns(200);

        mockDataSource.changingDuration.returns(150);

        this.scrollController.setViewportPosition(this.contentSize);
        this.scrollController.setViewportPosition(this.contentSize * 3);
        this.scrollController.setViewportPosition(this.contentSize * 4);
        this.scrollController.setViewportPosition(this.contentSize * 2);

        clock.tick(143);
        clock.tick(150);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 2 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + this.contentSize);
        assert.strictEqual(this.scrollController.beginPageIndex(), 2);
        assert.strictEqual(this.scrollController.endPageIndex(), 3);

        assert.strictEqual(this.scrollController.getContentOffset(), this.contentSize * 2);
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 2);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);

        clock.restore();
    });

    QUnit.test('Scroll with rendering faster then rendering thresholdTime. Far scrolling', function(assert) {
        const clock = sinon.useFakeTimers();
        mockComponent.option.withArgs('scrolling.timeout').returns(200);
        mockComponent.option.withArgs('scrolling.renderingThreshold').returns(70);

        mockDataSource.changingDuration.returns(69);


        this.scrollController.setViewportPosition(this.contentSize * 4);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 2);
        clock.tick(10);
        this.scrollController.setViewportPosition(this.contentSize * 2);

        clock.tick(69);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 4);

        clock.restore();
    });


    QUnit.test('Scroll with rendering faster then rendering thresholdTime. Near scrolling', function(assert) {
        const clock = sinon.useFakeTimers();
        mockComponent.option.withArgs('scrolling.timeout').returns(200);
        mockComponent.option.withArgs('scrolling.renderingThreshold').returns(70);

        mockDataSource.changingDuration.returns(69);

        this.scrollController.setViewportPosition(this.contentSize);

        clock.tick(10);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 2 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize());
        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 2);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 2);

        clock.restore();
    });

    QUnit.test('Scroll with rendering slower then rendering thresholdTime. Near scrolling', function(assert) {
        const clock = sinon.useFakeTimers();
        mockComponent.option.withArgs('scrolling.timeout').returns(200);
        mockComponent.option.withArgs('scrolling.renderingThreshold').returns(70);

        mockDataSource.changingDuration.returns(71);

        this.scrollController.setViewportPosition(this.contentSize);

        clock.tick(10);
        assert.strictEqual(this.externalDataChangedHandler.callCount, 0);
        clock.tick(71);
        assert.strictEqual(this.externalDataChangedHandler.callCount, 2);

        clock.restore();
    });

    QUnit.test('setViewport position. Scroll to second loaded page. cache disabled', function(assert) {
        mockComponent.option.withArgs('scrolling.removeInvisiblePages').returns(true);

        this.scrollController.setViewportPosition(this.contentSize);


        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 3 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + 400);
        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 2);

        assert.strictEqual(this.scrollController.getContentOffset(), 0);
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 2);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);
    });

    // T818578
    QUnit.test('setViewport position. Scroll to third page visible. cache disabled. Preload page count is 3', function(assert) {
        mockComponent.option.withArgs('scrolling.removeInvisiblePages').returns(true);

        this.scrollController.viewportSize(40);

        this.scrollController.setViewportPosition(1);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 4 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + 400);
        assert.strictEqual(this.scrollController.beginPageIndex(), 0);
        assert.strictEqual(this.scrollController.endPageIndex(), 3);

        assert.strictEqual(this.scrollController.getContentOffset(), 0);
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 3);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);
    });

    QUnit.test('setViewport position. Scroll to third page after scroll to second page. cache disabled', function(assert) {
        mockComponent.option.withArgs('scrolling.removeInvisiblePages').returns(true);

        this.scrollController.setViewportPosition(this.contentSize);

        this.scrollController.setViewportPosition(this.contentSize * 2);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 3 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + 400);
        assert.strictEqual(this.scrollController.beginPageIndex(), 1);
        assert.strictEqual(this.scrollController.endPageIndex(), 3);

        assert.strictEqual(this.scrollController.getContentOffset(), 400);
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 3);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{ changeType: 'append', items: [], removeCount: 20 }]);
    });

    QUnit.test('setViewport position. Scroll to far page', function(assert) {
        this.scrollController.setViewportPosition(this.contentSize * 8 + 220);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 2 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + 400);
        assert.strictEqual(this.scrollController.beginPageIndex(), 8);
        assert.strictEqual(this.scrollController.endPageIndex(), 9);

        assert.strictEqual(this.scrollController.getContentOffset(), this.contentSize * 8);
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 2);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);
    });

    QUnit.test('getVirtualContentSize after far scroll if itemSizes are not equal to virtual item size', function(assert) {
        const realItemSize = 10;
        const realItemSizes = Array.apply(null, Array(20)).map(() => realItemSize);

        this.scrollController.setContentItemSizes(realItemSizes);
        this.scrollController.setViewportPosition(1000);
        this.scrollController.setContentItemSizes(realItemSizes);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 2 * mockDataSource.pageSize() - realItemSizes.length) * this.scrollController.viewportItemSize() + 2 * realItemSizes.length * realItemSize);
    });

    QUnit.test('setViewport position. Scroll up', function(assert) {
        this.scrollController.setViewportPosition(this.contentSize * 8 + 220);
        mockDataSource.load.reset();
        this.externalDataChangedHandler.reset();

        this.scrollController.setViewportPosition(this.contentSize * 7 + 220);

        assert.strictEqual(this.scrollController.getVirtualContentSize(), (DEFAULT_TOTAL_ITEMS_COUNT - 3 * mockDataSource.pageSize()) * this.scrollController.viewportItemSize() + 400);
        assert.strictEqual(this.scrollController.beginPageIndex(), 7);
        assert.strictEqual(this.scrollController.endPageIndex(), 9);

        assert.strictEqual(this.scrollController.getContentOffset(), this.contentSize * 7);
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 1);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'prepend',
            items: []
        }]);
    });

    QUnit.test('setViewport position. DataSource with too many items', function(assert) {
        mockDataSource.totalItemsCount.returns(100000000000);

        const contentSizes = getContentSizes(20, 20);
        this.scrollController.setContentItemSizes(contentSizes);
        this.scrollController.reset();
        this.scrollController.setViewportPosition(CONTENT_HEIGHT_LIMIT / 2);


        assert.roughEqual(this.scrollController.getVirtualContentSize(), CONTENT_HEIGHT_LIMIT + this.contentSize, 1.1);

        assert.strictEqual(this.scrollController.beginPageIndex(), mockDataSource.pageCount() / 2);
        assert.strictEqual(this.scrollController.endPageIndex(), mockDataSource.pageCount() / 2 + 1);

        assert.strictEqual(this.scrollController.getContentOffset() * getPixelRatio(window), browser.msie ? 2000000 : (browser.mozilla ? 4000000 : 7500000));
        assert.ok(mockDataSource.load.called);

        assert.strictEqual(this.externalDataChangedHandler.callCount, 2);
        assert.deepEqual(this.externalDataChangedHandler.lastCall.args, [{
            changeType: 'append',
            items: []
        }]);
    });

    QUnit.test('Scroll with timeout. Disposing', function(assert) {
        mockComponent.option.withArgs('scrolling.timeout').returns(100);

        this.scrollController.setViewportPosition(this.contentSize * 2);

        this.scrollController.dispose();

        assert.ok(this.scrollController);
    });
});

QUnit.module('Subscribe to external scrollable events', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        this.scrollController.viewportSize(12);
        this.scrollController.load();
        this.contentSize = 400;
        const contentSizes = getContentSizes(20, 20);
        this.scrollController.setContentItemSizes(contentSizes);
        mockDataSource.load.reset();
        this.externalDataChangedHandler.reset();
        this.clock = sinon.useFakeTimers();

        const $container = $('<div />').appendTo('body');
        this.$fixtureElement = $('<div />').appendTo($container);
    },

    afterEach: function() {
        moduleConfig.afterEach.call(this);
        this.clock.restore();
        this.$fixtureElement.parent().remove();
    }
}, () => {


    QUnit.test('Window scroll event', function(assert) {
        if(devices.real().ios || ('callPhantom' in window)) {
        // TODO reanimate for ios
            assert.ok(true);
            return;
        }

        const done = assert.async();
        const scrollController = this.scrollController;

        $('<div>').height(300).appendTo(this.$fixtureElement);

        const $element = this.$fixtureElement.height(30000);

        this.scrollController.subscribeToWindowScrollEvents(this.$fixtureElement);

        $(window).on('scroll', assertFunction);

        $(window).scrollTop(24000);

        function assertFunction() {
            assert.strictEqual(scrollController.getViewportPosition(), 24000 - $element.offset().top, 'viewport position should be correct');

            $(window).off('scroll', assertFunction);
            done();
        }
    });

    QUnit.test('Native scroll event', function(assert) {
        const done = assert.async();
        const scrollController = this.scrollController;
        const $fixtureElement = this.$fixtureElement;

        $('<div>').height(300).appendTo(this.$fixtureElement);

        const $element = $('<div>').height(40000).appendTo(this.$fixtureElement);

        this.$fixtureElement.height(10000).css('overflow', 'auto');

        this.scrollController.subscribeToWindowScrollEvents($element);

        $(this.$fixtureElement).on('scroll', assertFunction);
        // act
        this.$fixtureElement.scrollTop(24000);

        function assertFunction() {
            assert.roughEqual(scrollController.getViewportPosition(), 24000 - 300, 1);

            $($fixtureElement).off('scroll', assertFunction);
            done();
        }
    });

    QUnit.test('Native scroll event. Scrolling before the subscribed element', function(assert) {
        const done = assert.async();
        const scrollController = this.scrollController;
        const $fixtureElement = this.$fixtureElement;


        $('<div>').height(300).appendTo(this.$fixtureElement);

        const $element = $('<div>').height(40000).appendTo(this.$fixtureElement);

        this.$fixtureElement.height(10000).css('overflow', 'auto');

        this.scrollController.subscribeToWindowScrollEvents($element);

        this.$fixtureElement.on('scroll', assertFunction);


        this.$fixtureElement.scrollTop(150);


        function assertFunction() {
            assert.strictEqual(scrollController.getViewportPosition(), 0);

            $fixtureElement.off('scroll', assertFunction);
            done();
        }
    });

    QUnit.test('dxScrollable scroll event', function(assert) {
        const done = assert.async();
        const scrollController = this.scrollController;

        $('<div>').height(300).appendTo(this.$fixtureElement);

        const $element = renderer('<div>').height(40000).appendTo(this.$fixtureElement);
        const scrollable = this.$fixtureElement.height(10000).dxScrollable({}).dxScrollable('instance');

        this.scrollController.subscribeToWindowScrollEvents($element);

        scrollable.on('scroll', assertFunction);

        scrollable.scrollTo(24000);

        this.clock.tick(900);

        function assertFunction() {
            assert.roughEqual(scrollController.getViewportPosition(), 24000 - 300, 1);

            scrollable.off('scroll', assertFunction);
            done();
        }
    });


    QUnit.test('ScrollTo when window scroll subscription', function(assert) {
        if(devices.real().ios || ('callPhantom' in window)) {
        // TODO reanimate for ios
            assert.ok(true);
            return;
        }

        const done = assert.async();
        const scrollController = this.scrollController;

        $('<div>').height(300).appendTo(this.$fixtureElement);

        const $element = this.$fixtureElement.height(30000);

        this.scrollController.subscribeToWindowScrollEvents(this.$fixtureElement);

        $(window).on('scroll', assertFunction);

        const elementOffset = $element.offset().top;

        scrollController.scrollTo(24000);

        function assertFunction() {
            const windowScrollTop = $(window).scrollTop();
            assert.roughEqual(scrollController.getViewportPosition(), 24000, 1);
            assert.roughEqual(windowScrollTop, 24000 + elementOffset, 1);

            $(window).off('scroll', assertFunction);
            done();
        }
    });

    QUnit.test('ScrollTo when window scroll subscription. before the subscribed element', function(assert) {
        const scrollController = this.scrollController;

        $('<div>').height(300).appendTo(this.$fixtureElement);

        this.$fixtureElement.height(30000);

        this.scrollController.subscribeToWindowScrollEvents(this.$fixtureElement);

        scrollController.scrollTo(100);

        assert.strictEqual(scrollController.getViewportPosition(), 0);
    });

    QUnit.test('Scroll to when native scroll', function(assert) {
        const done = assert.async();
        const scrollController = this.scrollController;
        const $fixtureElement = this.$fixtureElement;

        $('<div>').height(300).appendTo(this.$fixtureElement);

        const $element = $('<div>').height(40000).appendTo(this.$fixtureElement);

        this.$fixtureElement.height(10000).css('overflow', 'auto');

        this.scrollController.subscribeToWindowScrollEvents($element);

        $(this.$fixtureElement).on('scroll', assertFunction);

        scrollController.scrollTo(24000);

        function assertFunction() {
            assert.roughEqual(scrollController.getViewportPosition(), 24000, 1.01);

            $($fixtureElement).off('scroll', assertFunction);
            done();
        }
    });

    QUnit.test('ScrollTo when dxScrollable scroll', function(assert) {
        const done = assert.async();
        const scrollController = this.scrollController;

        $('<div>').height(300).appendTo(this.$fixtureElement);

        const $element = renderer('<div>').height(40000).appendTo(this.$fixtureElement);
        const scrollable = this.$fixtureElement.height(10000).dxScrollable({}).dxScrollable('instance');

        this.scrollController.subscribeToWindowScrollEvents($element);

        scrollable.on('scroll', assertFunction);

        scrollController.scrollTo(24000);

        this.clock.tick(900);

        function assertFunction() {
            assert.roughEqual(scrollController.getViewportPosition(), 24000, 1);

            scrollable.off('scroll', assertFunction);
            done();
        }
    });

    QUnit.test('Scroll To after disposing', function(assert) {
        const scrollController = this.scrollController;

        $('<div>').height(300).appendTo(this.$fixtureElement);

        const $element = $('<div>').height(40000).appendTo(this.$fixtureElement);

        this.$fixtureElement.height(10000).css('overflow', 'auto');

        this.scrollController.subscribeToWindowScrollEvents($element);

        $(this.$fixtureElement).on('scroll', assertFunction);
        // act
        scrollController.dispose();

        scrollController.scrollTo(24000);
        // assert
        assert.strictEqual(scrollController.getViewportPosition(), 0);

        function assertFunction() {
            assert.ok(false, 'unexpected scrolling');
        }
    });

    QUnit.test('Remove subscription on disposing', function(assert) {
        const scrollController = this.scrollController;

        $('<div>').height(300).appendTo(this.$fixtureElement);

        const $element = $('<div>').height(40000).appendTo(this.$fixtureElement);

        this.$fixtureElement.height(10000).css('overflow', 'auto');

        const originalEventSubscriptions = memoryLeaksHelper.getAllEventSubscriptions();
        this.scrollController.subscribeToWindowScrollEvents($element);
        // act
        scrollController.dispose();
        // assert
        assert.deepEqual(memoryLeaksHelper.getAllEventSubscriptions(), originalEventSubscriptions);
    });

    // T470971
    QUnit.test('Content height limit for different browsers', function(assert) {
    // act, assert
        assert.equal(virtualScrollingCore.getContentHeightLimit({ msie: true }), 4000000, 'content height limit for ie');
        assert.equal(virtualScrollingCore.getContentHeightLimit({ mozilla: true }), 8000000, 'content height limit for firefox');
        virtualScrollingCore._setPixelRatioFn(function() { return 1; });
        assert.equal(virtualScrollingCore.getContentHeightLimit({}), 15000000, 'content height limit for other browsers');
        virtualScrollingCore._setPixelRatioFn(function() { return 2; });
        assert.equal(virtualScrollingCore.getContentHeightLimit({}), 7500000, 'content height limit depends on devicePixelRatio for other browsers'); // T692460
    });
});


QUnit.module('VirtualScrollingController. New mode', {
    beforeEach: function() {
        moduleConfig.beforeEach.call(this);
        mockComponent.option.withArgs('scrolling.rowRenderingMode').returns('virtual');
        mockComponent.option.withArgs('scrolling.newMode').returns(true);
        mockComponent.option.withArgs('scrolling.minGap').returns(1);
        mockDataSource.pageSize.returns(5);
    },
    afterEach: function() {
        mockDataSource.pageSize.returns(20);
        moduleConfig.afterEach.call(this);
    }
}, () => {
    QUnit.test('virtualItemsCount does not call data source pageIndex method', function(assert) {
        // arrange
        const pageIndex = sinon.stub(mockDataSource, 'pageIndex');

        // act
        this.scrollController.virtualItemsCount();

        // assert
        assert.notOk(pageIndex.called, 'pageIndex not called');

        pageIndex.restore();
    });

    QUnit.test('setViewportItemIndex does not call data source and virtual scrolling controller methods', function(assert) {
        // arrange
        const pageCount = sinon.stub(mockDataSource, 'pageCount');
        const load = sinon.stub(this.scrollController, 'load');

        // act
        this.scrollController.setViewportItemIndex(1);

        // assert
        assert.notOk(pageCount.called, 'pageCount not called');
        assert.notOk(mockDataSource.pageSize.called, 'pageSize not called');
        assert.notOk(load.called, 'load is not called');

        pageCount.restore();
        load.restore();
    });

    QUnit.test('pageIndex calls pageIndex of the data source', function(assert) {
        // arrange
        const pageIndex = sinon.stub(mockDataSource, 'pageIndex');

        // act
        this.scrollController.pageIndex(1);

        // assert
        assert.ok(pageIndex.called, 'pageIndex is called');

        pageIndex.restore();
    });

    QUnit.test('Viewport params at the top', function(assert) {
        const viewportSize = 25;
        this.scrollController.viewportSize(viewportSize);

        const viewportParams = this.scrollController.getViewportParams();
        const virtualItemsCount = this.scrollController.virtualItemsCount();

        // assert
        assert.deepEqual(virtualItemsCount, { begin: 0, end: DEFAULT_TOTAL_ITEMS_COUNT - 30 }, 'virtual items');
        assert.deepEqual(viewportParams, { skip: 0, take: 30 }, 'viewport params');
    });

    QUnit.test('Viewport params at the middle', function(assert) {
        const viewportSize = 25;
        this.scrollController.viewportSize(viewportSize);
        const viewportItemIndex = DEFAULT_TOTAL_ITEMS_COUNT / 2;
        this.scrollController.setViewportItemIndex(viewportItemIndex);
        const viewportParams = this.scrollController.getViewportParams();
        const virtualItemsCount = this.scrollController.virtualItemsCount();

        // assert
        assert.deepEqual(virtualItemsCount, { begin: Math.floor(viewportItemIndex) - 5, end: 9970 }, 'virtual items');
        assert.deepEqual(viewportParams, { skip: Math.floor(viewportItemIndex) - 5, take: viewportSize + 10 }, 'viewport params');
    });

    QUnit.test('Viewport params at the bottom', function(assert) {
        const viewportSize = 25;
        this.scrollController.viewportSize(viewportSize);
        const viewportItemIndex = 19985;
        this.scrollController.setViewportItemIndex(19985);
        const viewportParams = this.scrollController.getViewportParams();
        const virtualItemsCount = this.scrollController.virtualItemsCount();

        // assert
        assert.deepEqual(virtualItemsCount, { begin: viewportItemIndex - 5, end: 0 }, 'virtual items');
        assert.deepEqual(viewportParams, { skip: viewportItemIndex - 5, take: DEFAULT_TOTAL_ITEMS_COUNT - viewportItemIndex + 5 }, 'viewport params');
    });
});

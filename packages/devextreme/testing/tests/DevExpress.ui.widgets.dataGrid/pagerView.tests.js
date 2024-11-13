import 'generic_light.css!';

import 'ui/data_grid';

import $ from 'jquery';
import { setupDataGridModules, MockDataController } from '../../helpers/dataGridMocks.js';
import dataUtils from 'core/element_data';
import { createEvent } from 'common/core/events/utils/index';
import { addShadowDomStyles } from 'core/utils/shadow_dom';

import Pager from 'ui/pagination';

QUnit.testStart(function() {
    const markup =
        `<div>
            <div class="dx-datagrid">
                <div id="container"></div>
            </div>
        </div>`;

    $('#qunit-fixture').html(markup);
    addShadowDomStyles($('#qunit-fixture'));
});

QUnit.module('Pager', {
    beforeEach: function() {
        this.options = {
            pager: {
                enabled: true,
                visible: true,
                allowedPageSizes: [2, 7, 9],
                showPageSizeSelector: true
            },
            keyboardNavigation: {
                enabled: true
            }
        };
        this.dataControllerOptions = {
            pageSize: 7,
            pageCount: 21,
            pageIndex: 1,
            totalCount: 143,
        };
        this.dataController = new MockDataController(this.dataControllerOptions);
        setupDataGridModules(this, ['data', 'pager'], {
            initViews: true,
            controllers: {
                data: this.dataController,
                keyboardNavigation: {
                    isKeyboardEnabled: () => true,
                    executeAction: () => { }
                }
            }
        });
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {

    const isRenovation = !!Pager.IS_RENOVATED_WIDGET;
    QUnit.test('Not initialize pager when pager is not visible', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        this.options.pager.visible = false;

        this.dataControllerOptions.hasKnownLastPage = false;

        // act
        pagerView.render(testElement);
        const pager = pagerView.getPager();

        // assert
        assert.ok(!pager);
        assert.equal(testElement.find('.dx-pager').length, 0, 'pager element');
    });

    QUnit.test('initialize pager when pager is visible', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        this.dataControllerOptions.hasKnownLastPage = false;

        // act
        pagerView.render(testElement);
        const pager = pagerView.getPager();

        // assert
        assert.equal(testElement.find('.dx-pager').length, 1, 'pager element');
        assert.equal(pager.option('maxPagesCount'), 10, 'maxPagesCount');
        assert.equal(pager.option('pageIndex'), 2, 'pageIndex');
        assert.equal(pager.option('pageCount'), 21, 'pageCount');
        assert.equal(pager.option('pageSize'), 7, 'pageSize');
        assert.ok(pager.option('showPageSizeSelector'), 'showPageSizeSelector');
        assert.deepEqual(pager.option('allowedPageSizes'), [2, 7, 9], 'allowedPageSizes');
        assert.ok(!pager.option('hasKnownLastPage'), 'hasKnownLastPage');
        assert.ok(pager.option('visible'), 'visible');
    });

    QUnit.test('PagerView create dxPager via createComponent', function(assert) {
        const testElement = $('#container');
        const pagerView = this.pagerView;
        let isRenderViaCreateComponent = false;

        this._createComponent = function(element, name, config) {
            if(name === Pager) {
                isRenderViaCreateComponent = true;
            }
        };

        this.options.rtlEnabled = true;

        pagerView.render(testElement);

        assert.ok(isRenderViaCreateComponent, 'dxPager was rendered via createComponent');
    });

    QUnit.test('Page index of dataController is changed from dxPager', function(assert) {
    // arrange
        const that = this;
        const testElement = $('#container');
        const pagerView = this.pagerView;

        // act
        // act(() => {
        pagerView.render(testElement);
        // });
        $(testElement.find('.dx-page')[5]).trigger('dxclick');

        this.clock.tick(10);
        // assert
        assert.equal(that.dataControllerOptions.pageIndex, '20', 'page index');
    });

    QUnit.test('Page index is changed from dataController', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        // act
        pagerView.render(testElement);
        this.dataController.pageIndex(13);

        // assert
        assert.equal(pagerView.getPager().option('pageIndex'), 14, 'page index');
    });

    // T211403
    QUnit.test('Page index is changed from dataController several times', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        // act
        pagerView.render(testElement);
        this.dataController.pageIndex(13);
        this.dataController.pageIndex(14);
        this.clock.tick(10);

        // assert
        assert.equal(pagerView.getPager().option('pageIndex'), 15, 'page index');
    });

    // T220755
    QUnit.test('Page index correctly changed using string value', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        // act
        pagerView.render(testElement);
        this.dataController.pageIndex('14');
        this.clock.tick(10);

        // assert
        assert.equal(pagerView.getPager().option('pageIndex'), 15, 'page index changed');
    });

    QUnit.test('Page size is changed from dataController', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        // act
        pagerView.render(testElement, {});
        this.dataController.pageSize(9);

        // assert
        assert.equal(pagerView.getPager().option('pageSize'), 9, 'pageSize');
    });

    QUnit.test('HasKnownLastPage is changed from dataController', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        // act
        pagerView.render(testElement, {});
        this.dataControllerOptions.hasKnownLastPage = false;
        this.dataController.updatePagesCount(1);

        // assert
        if(isRenovation) {
            assert.strictEqual(testElement.find('.dx-next-button').length, 1, 'pager has next page button');
            assert.strictEqual(testElement.find('.dx-prev-button').length, 0, 'pager doesnt have prev page button');
        } else {
            assert.ok(pagerView.getPager()._testShowMoreButton, 'showMoreButton in pager');
        }
    });

    QUnit.test('Visible is changed from dataController', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        this.dataControllerOptions.pageCount = 1;
        this.options.pager.visible = 'auto';
        pagerView.render(testElement, {});

        assert.ok(!testElement.find('.dx-pager').length, 'pager not visible');

        // act
        // this.options.pager.visible = true;
        this.dataController.updatePagesCount(20);

        // assert
        assert.notStrictEqual(testElement.find('.dx-pager').css('display'), 'none', 'pager visible');
    });

    QUnit.test('Label option works', function(assert) {
        // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        this.dataControllerOptions.pageCount = 1;
        this.options.pager.label = 'my_label';
        pagerView.render(testElement, {});

        // assert
        assert.strictEqual(testElement.find('.dx-pager').attr('aria-label'), 'my_label');
    });

    QUnit.test('Pager is not rendered on partial update', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        sinon.spy(pagerView, '_createComponent');

        pagerView.render(testElement);

        assert.equal(pagerView._createComponent.callCount, 1, '_createComponent call count before partial update');

        // act
        this.dataController.changed.fire({ changeType: 'update' });

        // assert
        assert.equal(pagerView._createComponent.callCount, 1, '_createComponent call count after partial update');
    });

    QUnit.test('pageCount, pageIndex, pageSize are updated on partial update with repaintChangesOnly', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        sinon.spy(pagerView, '_createComponent');

        pagerView.render(testElement);

        sinon.spy(pagerView.getPager(), 'option');

        assert.equal(pagerView._createComponent.callCount, 1, '_createComponent call count before partial update');

        // act
        this.dataController.changed.fire({ changeType: 'update', repaintChangesOnly: true });

        // assert
        assert.equal(pagerView._createComponent.callCount, 1, '_createComponent call count after partial update');

        // call count increased because the component should check if it need to perform the validation
        assert.equal(pagerView.getPager().option.callCount, 2, 'pager option call count after partial update');
        assert.deepEqual(pagerView.getPager().option.getCall(0).args, [{
            hasKnownLastPage: true, // T697587
            itemCount: 143, // #7259
            pageCount: 21,
            pageIndex: 2, // T886628
            pageSize: 7 // T886628
        }], 'pager option args');
    });

    QUnit.test('get page sizes when pageSizes option is auto and pageSize = 5', function(assert) {
        const pagerView = this.pagerView;

        this.options.pager = {
            allowedPageSizes: 'auto'
        };

        this.dataControllerOptions.pageSize = 5;

        // act
        const pageSizes = pagerView.getPageSizes();

        // assert
        assert.deepEqual(pageSizes, [2, 5, 10]);
    });

    QUnit.test('get page sizes when pageSizes option is auto and pageSize changed from 5 to 20', function(assert) {
        const pagerView = this.pagerView;

        this.options.pager = {
            allowedPageSizes: 'auto'
        };

        this.dataControllerOptions.pageSize = 5;

        assert.deepEqual(pagerView.getPageSizes(), [2, 5, 10]);

        // act
        this.dataControllerOptions.pageSize = 20;
        const pageSizes = pagerView.getPageSizes();

        // assert
        assert.deepEqual(pageSizes, [10, 20, 40]);
    });

    QUnit.test('get page sizes when pageSizes option is auto and pageSize changed from 5 to 10', function(assert) {
        const pagerView = this.pagerView;

        this.options.pager = {
            allowedPageSizes: 'auto'
        };

        this.dataControllerOptions.pageSize = 5;

        assert.deepEqual(pagerView.getPageSizes(), [2, 5, 10]);

        // act
        this.dataControllerOptions.pageSize = 10;
        const pageSizes = pagerView.getPageSizes();

        // assert
        assert.deepEqual(pageSizes, [2, 5, 10]);
    });

    QUnit.test('get page sizes when pageSizes option is auto and pageSize = 20', function(assert) {
        const pagerView = this.pagerView;
        this.options.pager = {
            allowedPageSizes: 'auto'
        };
        this.dataControllerOptions.pageSize = 20;

        // act
        const pageSizes = pagerView.getPageSizes();

        // assert
        assert.deepEqual(pageSizes, [10, 20, 40]);
    });

    QUnit.test('get page sizes when pageSizes option is array', function(assert) {
        const pagerView = this.pagerView;
        this.options.pager = {
            allowedPageSizes: [10, 20, 50, 100]
        };

        this.dataControllerOptions.pageSize = 20;

        // act
        const pageSizes = pagerView.getPageSizes();

        // assert
        assert.deepEqual(pageSizes, [10, 20, 50, 100]);
    });

    QUnit.test('get page sizes when pageSize is 0 (pageable is false)', function(assert) {
        const pagerView = this.pagerView;
        this.options.pager = {
            pageSizes: true
        };

        this.dataControllerOptions.pageSize = 0;

        // act
        const pageSizes = pagerView.getPageSizes();

        // assert
        assert.deepEqual(pageSizes, []);
    });

    QUnit.test('get page sizes when pageSizes option is false', function(assert) {
        const pagerView = this.pagerView;
        this.options.pager = {
            pageSizes: false
        };

        this.dataControllerOptions.pageSize = 20;

        // act
        const pageSizes = pagerView.getPageSizes();

        // assert
        assert.deepEqual(pageSizes, []);
    });

    QUnit.test('isVisible when pageCount > 1 and visible is auto', function(assert) {
        const pagerView = this.pagerView;

        this.options.pager = { visible: 'auto' };
        this.dataControllerOptions.pageCount = 2;

        // act
        pagerView.render($('#container'));
        const isVisible = pagerView.isVisible();

        // assert
        assert.equal(this.dataController.pageCount(), 2);
        assert.ok(isVisible);
        assert.equal(pagerView.element().dxPagination('instance').option('pagesNavigatorVisible'), 'auto', 'pagesNavigatorVisible');
    });

    QUnit.test('isVisible when pageCount == 1 and visible is auto', function(assert) {
        const pagerView = this.pagerView;

        this.options.pager = { visible: 'auto' };
        this.dataControllerOptions.pageCount = 1;

        // act
        const isVisible = pagerView.isVisible();

        // assert
        assert.equal(this.dataController.pageCount(), 1);
        assert.ok(!isVisible);
    });

    QUnit.test('isVisible when pageCount == 1, hasKnownLastPage is false and visible is auto', function(assert) {
        const pagerView = this.pagerView;

        this.options.pager = { visible: 'auto' };
        this.dataControllerOptions.pageCount = 1;
        this.dataControllerOptions.hasKnownLastPage = false;
        this.dataControllerOptions.isLoaded = true;


        // act
        const isVisible = pagerView.isVisible();

        // assert
        assert.ok(!this.dataController.hasKnownLastPage());
        assert.equal(this.dataController.pageCount(), 1);
        assert.ok(isVisible);
    });

    QUnit.test('isVisible when pageCount == 1 and visible is true', function(assert) {
        const pagerView = this.pagerView;

        this.options.pager = { visible: true };
        this.dataControllerOptions.pageCount = 1;

        // act
        pagerView.render($('#container'));
        const isVisible = pagerView.isVisible();

        // assert
        assert.equal(this.dataController.pageCount(), 1);
        assert.ok(isVisible);
        assert.equal(pagerView.element().dxPagination('instance').option('pagesNavigatorVisible'), true, 'pagesNavigatorVisible');
    });

    QUnit.test('isVisible when pageCount > 1 and visible is false', function(assert) {
        const pagerView = this.pagerView;

        this.options.pager = { visible: false };
        this.dataControllerOptions.pageCount = 2;


        // act
        pagerView.render($('#container'));
        const isVisible = pagerView.isVisible();

        // assert
        assert.equal(this.dataController.pageCount(), 2);
        assert.ok(!isVisible);
        assert.equal(dataUtils.data(pagerView.element().get(0), 'dxPager'), undefined, 'pager instance');
    });

    QUnit.test('isVisible when pageCount == 1 and pageSizes has more 1 items and visible is auto', function(assert) {
        const pagerView = this.pagerView;
        this.options.pager = {
            visible: 'auto',
            pageSizes: [2, 5, 10]
        };

        this.dataControllerOptions.pageCount = 1;

        // act
        const isVisible = pagerView.isVisible();

        // assert
        assert.equal(this.dataController.pageCount(), 1);
        assert.ok(!isVisible);
    });

    QUnit.test('isVisible when pageCount == 1 and pageSizes disabled and visible is auto', function(assert) {
        const pagerView = this.pagerView;
        this.options.pager = {
            visible: 'auto',
            pageSizes: false
        };

        this.dataControllerOptions.pageCount = 1;

        // act
        const isVisible = pagerView.isVisible();

        // assert
        assert.equal(this.dataController.pageCount(), 1);
        assert.deepEqual(this.dataController.getPageSizes(), []);
        assert.ok(!isVisible);
    });

    QUnit.test('isVisible for virtual scrolling', function(assert) {
        const pagerView = this.pagerView;
        this.options.scrolling = {
            mode: 'virtual'
        };
        this.options.pager.visible = 'auto';

        // act
        assert.strictEqual(pagerView.isVisible(), false);
    });

    QUnit.test('isVisible for appendMode', function(assert) {
        const pagerView = this.pagerView;
        this.options.scrolling = {
            mode: 'infinite'
        };
        this.options.pager.visible = 'auto';

        // act
        assert.strictEqual(pagerView.isVisible(), false);
    });

    QUnit.test('isVisible is not reset when data source option is changed in data grid', function(assert) {
        const pagerView = this.pagerView;
        let isResizeCalled;
        let isInvalidateCalled;

        this.options.pager = { visible: 'auto' };
        this.dataControllerOptions.pageCount = 2;

        // assert
        assert.equal(pagerView.isVisible(), true, 'isVisible');

        // act
        pagerView.component.resize = function() {
            isResizeCalled = true;
        };
        pagerView._invalidate = function() {
            isInvalidateCalled = true;
        };
        pagerView.option('dataSource', [{}]);

        // assert
        assert.equal(pagerView.isVisible(), true, 'isVisible');
        assert.equal(isInvalidateCalled, undefined, 'invalidate');
        assert.equal(isResizeCalled, undefined, 'resize');
    });

    QUnit.test('Not visible pager when changing option scrolling to virtual', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        this.dataControllerOptions.hasKnownLastPage = false;
        this.options.pager.visible = 'auto';

        // act
        pagerView.render(testElement);

        // assert
        assert.ok(pagerView.isVisible());
        assert.ok(pagerView.element().is(':visible'));

        // arrange
        this.options.scrolling = {
            mode: 'virtual'
        };

        // act
        pagerView.component.isReady = function() {
            return true;
        };
        pagerView.beginUpdate();
        pagerView.optionChanged({ name: 'scrolling' });
        pagerView.endUpdate();

        // assert
        assert.ok(!pagerView.isVisible(), 'pagerView is not visible');
        assert.ok(!pagerView.element().is(':visible'), 'pagerView element is not visible');
    });

    QUnit.test('Show navigation buttons', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        this.options.pager.showNavigationButtons = true;

        // act
        pagerView.render(testElement);
        assert.equal($('.dx-navigate-button').length, 2);
    });

    QUnit.test('Default show info', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        this.options.pager.showInfo = true;

        // act
        pagerView.render(testElement);
        assert.equal($('.dx-info').text(), 'Page 2 of 21 (143 items)');
    });

    QUnit.test('Custom show info', function(assert) {
    // arrange
        const testElement = $('#container');
        const pagerView = this.pagerView;

        this.options.pager.showInfo = true;
        this.options.pager.infoText = 'Page {0} sur {1}';

        // act
        pagerView.render(testElement);
        assert.equal($('.dx-info').text(), 'Page 2 sur 21');
    });

    QUnit.test('Invalidate instead of render for options', function(assert) {
    // arrange
        let renderCounter = 0;
        this.pagerView.render($('#container'));
        this.pagerView.renderCompleted.add(function() {
            renderCounter++;
        });

        // act
        this.pagerView.component.isReady = function() {
            return true;
        };
        this.pagerView.beginUpdate();
        this.pagerView.optionChanged({ name: 'pager' });
        this.pagerView.optionChanged({ name: 'paging' });
        this.pagerView.optionChanged({ name: 'scrolling' });
        this.pagerView.endUpdate();

        // assert
        assert.equal(renderCounter, 1, 'count of rendering');
    });

    QUnit.test('Pager should be visible when set the pageSize equal to itemCount', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.pager.allowedPageSizes = [2, 4, 6];
        this.dataControllerOptions = {
            pageSize: 4,
            pageCount: 2,
            pageIndex: 0,
            itemCount: 6
        };
        this.pagerView.render($testElement);
        sinon.spy(this.pagerView, '_invalidate');

        // act
        this.dataController.skipProcessingPagingChange = function() { return true; };
        this.option('paging.pageSize', 6);

        // assert
        assert.ok(this.pagerView.isVisible(), 'pager visible');
        assert.strictEqual(this.pagerView._invalidate.callCount, 0, 'render not execute');
        this.pagerView._invalidate.restore();
    });

    QUnit.test('Key down Enter, Space key by page index element', function(assert) {
    // arrange
        const $testElement = $('#container');
        let $pageElement;

        this.options.pager.allowedPageSizes = [2, 4, 6];
        this.dataControllerOptions = {
            pageSize: 4,
            pageCount: 2,
            pageIndex: 0,
            itemCount: 6
        };
        this.pagerView.render($testElement);
        // act
        $pageElement = $(this.pagerView.element().find('.dx-pages .dx-page').eq(2)).focus();
        $pageElement.trigger(createEvent('keydown', { target: $pageElement.get(0), key: 'Enter' }));

        // assert
        assert.equal(this.pagerView.element().find('.dx-pages .dx-page.dx-selection').text(), '3', 'Selected 2 page index');

        // act
        $pageElement = $(this.pagerView.element().find('.dx-pages .dx-page').eq(3)).focus();
        $pageElement.trigger(createEvent('keydown', { target: $pageElement.get(0), key: ' ' }));

        // assert
        assert.equal(this.pagerView.element().find('.dx-pages .dx-page.dx-selection').text(), '4', 'Selected 3 page index');
    });

    QUnit.test('Key down Enter, Space key by page size element', function(assert) {
    // arrange
        const $testElement = $('#container');

        this.options.pager.allowedPageSizes = [2, 4, 6];
        this.dataControllerOptions = {
            pageSize: 4,
            pageCount: 2,
            pageIndex: 0,
            itemCount: 6
        };
        this.pagerView.render($testElement);

        // act
        assert.equal(this.pagerView.element().find('.dx-page-sizes .dx-page-size.dx-selection').text(), '', 'Page size not selected');
        const $pageElement = $(this.pagerView.element().find('.dx-page-sizes .dx-page-size').eq(1)).focus();
        $pageElement.trigger(createEvent('keydown', { target: $pageElement.get(0), key: 'Enter' }));
        // assert
        assert.equal(this.pagerView.element().find('.dx-page-sizes .dx-page-size.dx-selection').text(), '4', 'Page size 4 is selected');
    });

    QUnit.test('dxPager - infoText has rtl direction with rtlEnabled true (T753000)', function(assert) {
    // arrange
        const container = $('#container').addClass('dx-rtl');

        // act
        this.options.pager.showInfo = true;
        this.pagerView.render(container);

        // assert
        assert.equal(this.pagerView.element().find('.dx-info').css('direction'), 'rtl', 'infoText has rtl direction');
    });

    // T1011042
    QUnit.test('Pager container is hidden after refresh if its content is not visible', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.dataControllerOptions = {};
        this.options.pager = {
            visible: 'auto'
        };
        this.pagerView.render($testElement);

        // assert
        assert.strictEqual($('.dx-datagrid-pager').length, 1, 'pager container exists');
        assert.notOk($('.dx-datagrid-pager').hasClass('dx-hidden'), 'pager container is visible');

        // act
        this.dataController.updatePagesCount(1);

        // assert
        assert.ok($('.dx-datagrid-pager').hasClass('dx-hidden'), 'pager is not visible');
    });
});


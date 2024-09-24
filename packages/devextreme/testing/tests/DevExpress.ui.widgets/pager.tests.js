import { setWidth, getWidth, getOuterWidth } from 'core/utils/size';
import $ from 'jquery';
import commonUtils from 'core/utils/common';
import typeUtils from 'core/utils/type';
import resizeCallbacks from 'core/utils/resize_callbacks';

import 'generic_light.css!';
import Pager from 'ui/pager';
import localization from 'localization';

const PAGER_LIGHT_MODE_WIDTH = 200;

QUnit.testStart(function() {
    const markup = '<div id="container"></div>';
    $('#qunit-fixture').html(markup);
});

function getText(element) {
    if($(element).is('.dx-next-button')) {
        return '>';
    }
    if($(element).is('.dx-previous-button')) {
        return '<';
    }
    return $(element).text();
}

function isLightMode(pager) {
    return pager.$element().hasClass('dx-light-mode');
}

let resizingInProcess = false;
function _dimensionChanged(pager) {
    if(!resizingInProcess) {
        resizingInProcess = true;
        resizeCallbacks.fire();
        pager._refresh();
    }
    resizingInProcess = false;
}

QUnit.module('Pager', {
    beforeEach: function() {
        this.checkPages = function($pager, values, selectedValue) {
            let i;
            let value;
            let element;

            const pages = $pager.find('.dx-page, .dx-navigate-button');

            if(pages.length !== values.length) {
                return false;
            }

            for(i = 0; i < pages.length; i++) {
                element = pages.get(i);
                value = getText(element);
                if(value !== String(values[i])) {
                    return false;
                }
                if(element.className.indexOf('dx-selection') > -1 && value !== selectedValue) {
                    return false;
                }
            }
            return true;
        };
    }
},
function() {
    const getPagesElement = function(rootElement) {
        return rootElement.find('.dx-page, .dx-separator');
    };
    QUnit.test('Default options init', function(assert) {
        const $pager = $('#container').dxPager();
        const instance = $pager.dxPager('instance');

        assert.ok(instance.option('visible'), 'visible');
        assert.equal(instance.option('pageIndex'), 1, 'pageIndex');
        assert.equal(instance.option('maxPagesCount'), 10, 'maxPagesCount');
        assert.equal(instance.option('pageCount'), 1, 'pageCount');
        assert.deepEqual(instance.option('allowedPageSizes'), [5, 10], 'allowedPageSizes');
        assert.ok(instance.option('hasKnownLastPage'), 'hasKnownLastPage');
        assert.equal(instance.option('pageSize'), 5, 'pageSize');
        // assert.deepEqual(instance.option('pageIndexChanged'), commonUtils.noop, 'pageIndexChanged');
        // assert.deepEqual(instance.option('pageSizeChanged'), commonUtils.noop, 'pageSizeChanged');
    });
    QUnit.test('Markup init', function(assert) {
        const $pager = $('#container').dxPager({ itemCount: 50 });

        const $pageSizeButton = $pager.find('.dx-page-size').first();
        const $pageNumberButton = $pager.find('.dx-page').eq(2);

        assert.ok($pager.hasClass('dx-pager'), 'pager class');
        assert.notStrictEqual($pager.css('display'), 'none', 'element is visible');

        assert.strictEqual($pager.find('.dx-pages').length, 1, 'pages chooser element');
        assert.equal($pager.find('.dx-page').length, 10, 'page elements count');

        assert.equal($pager.find('.dx-page-sizes').length, 1, 'page sizes element');
        assert.equal($pager.find('.dx-page-size').length, 2, 'page size elements');

        assert.equal($pager.find('.dx-pages' + ' .' + 'dx-selection').length, 1, 'page selection');
        assert.equal($pager.find('.dx-pages' + ' .' + 'dx-selection').attr('tabindex'), 0, 'page selection tabindex');
        assert.equal($pager.find('.dx-page-sizes' + ' .' + 'dx-selection').length, 1, 'page size selection');

        assert.notOk($pager.find('.dx-page[role=button]:not([tabindex])').hasClass('dx-selection'), 'Not selected buttons has no tabindex');

        assert.equal($pageSizeButton.attr('role'), 'button', 'Page size element has correct role');
        assert.equal($pageNumberButton.attr('role'), 'button', 'Page number element has correct role');

        assert.equal($pageSizeButton.attr('aria-label'), 'Items per page: 5', 'Page size element has correct aria-label');
        assert.equal($pageNumberButton.attr('aria-label'), 'Page 3', 'Page number element has correct aria-label');
    });

    QUnit.test('Events are called', function(assert) {
        const $pager = $('#container').dxPager({
            itemCount: 50,
            pageIndexChanged: function(pageIndex) {
                testPageIndex = pageIndex;
            },
            pageSizeChanged: function(pageSize) {
                testPageSize = pageSize;
            }
        });
        let testPageIndex = null;
        let testPageSize = null;

        $($pager.find('.dx-page')[1]).trigger('dxclick');
        assert.equal(testPageIndex, 2, 'pageIndex is changed');

        $($pager.find('.dx-page-size')[1]).trigger('dxclick');
        assert.equal(testPageSize, 10, 'pageSize is changed');
    });

    QUnit.test('Markup when a pages count less max pages count', function(assert) {
        const $pager = $('#container').dxPager({ itemCount: 75, pageCount: 15 });

        assert.equal($pager.find('.dx-page').length, 6, 'page elements count');
        assert.strictEqual($pager.find('.dx-separator').length, 1, 'page separator element');

        assert.equal($pager.find('.dx-page-sizes').length, 1, 'page sizes element');
        assert.equal($pager.find('.dx-page-size').length, 2, 'page size elements');

        assert.equal($pager.find('.dx-pages' + ' .' + 'dx-selection').length, 1, 'page selection');
        assert.equal($pager.find('.dx-page-sizes' + ' .' + 'dx-selection').length, 1, 'page size selection');
    });

    // TODO: Contradict with a grid behavior. When there is no records it shows a pager with one page
    QUnit.test.skip('Pager is not rendered if pages count equal zero', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 7, pageCount: 0, itemCount: 0 });

        assert.strictEqual($pager.find('.dx-pages').length, 0, 'pager is not rendered');
    });

    QUnit.test('Pager is rendered if pages count equals one and more page exists', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 7, pageCount: 1, hasKnownLastPage: false });

        assert.strictEqual($pager.find('.dx-pages').length, 1, 'pager is rendered');
        assert.ok(this.checkPages($pager, [1, '>'], '1'), 'pages');
    });

    QUnit.test('Pager second render', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 7, pageCount: 5 }); const instance = $pager.dxPager('instance');

        instance._render();

        assert.equal($('.' + 'dx-pager').length, 1, 'drawn one pager only');
    });


    QUnit.test('Get pages when pages count more maxPagesCount', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 10, pageCount: 13, itemCount: 65 });

        const instance = $pager.dxPager('instance');
        instance._render();

        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 13], '1'), 'pages');
    });

    QUnit.test('Get pages when pages count more maxPagesCount and more page exists', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 10, pageCount: 13, itemCount: 65, hasKnownLastPage: false });

        const instance = $pager.dxPager('instance');
        instance._render();

        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 13, '>'], '1'), 'pages');
    });

    // B232538
    QUnit.test('Get pages when pages count more maxPagesCount after pages count is changed', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 10, pageCount: 1, itemCount: 5 });
        const instance = $pager.dxPager('instance');

        instance.option('itemCount', 65);

        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 13], '1'), 'pages');
    });

    QUnit.test('Get pages when more page does not exist after changed', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 10, pageCount: 13, itemCount: 65, hasKnownLastPage: false });
        const instance = $pager.dxPager('instance');

        instance.option({ pageCount: 14, itemCount: 70, hasKnownLastPage: true });

        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 14], '1'), 'pages');
    });

    QUnit.test('Get pages when pages count less maxPagesCount', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 10, pageCount: 7, itemCount: 35, });
        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 6, 7], '1'), 'pages');
    });

    QUnit.test('SelectPageByValue', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 10, pageCount: 13, itemCount: 65 });
        const instance = $pager.dxPager('instance');

        // assert
        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 13], '1'), 'page value = 1');
        instance.option('pageIndex', 2);

        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 13], '2'), 'page value = 2');
        instance.option('pageIndex', 3);

        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 13], '3'), 'page value = 3');
        instance.option('pageIndex', 4);

        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 13], '4'), 'page value = 4');
        instance.option('pageIndex', 5);

        assert.ok(this.checkPages($pager, [1, 3, 4, 5, 6, 13], '5'), 'page value = 5');
        instance.option('pageIndex', 6);

        assert.ok(this.checkPages($pager, [1, 4, 5, 6, 7, 13], '6'), 'page value = 6');
        instance.option('pageIndex', 7);

        assert.ok(this.checkPages($pager, [1, 5, 6, 7, 8, 13], '7'), 'page value = 7');
        instance.option('pageIndex', 8);

        assert.ok(this.checkPages($pager, [1, 6, 7, 8, 9, 13], '8'), 'page value = 8');
        instance.option('pageIndex', 9);

        assert.ok(this.checkPages($pager, [1, 7, 8, 9, 10, 13], '9'), 'page value = 9');
        instance.option('pageIndex', 10);

        assert.ok(this.checkPages($pager, [1, 8, 9, 10, 11, 13], '10'), 'page value = 10');
        instance.option('pageIndex', 11);

        assert.ok(this.checkPages($pager, [1, 9, 10, 11, 12, 13], '11'), 'page value = 11');
        instance.option('pageIndex', 1);

        assert.ok(this.checkPages($pager, [1, 2, 3, 4, 5, 13], '1'), 'page value = 1');
        instance.option('pageIndex', 13);

        assert.ok(this.checkPages($pager, [1, 9, 10, 11, 12, 13], '13'), 'page value = 13');
    });

    QUnit.test('Render pages without separator', function(assert) {
        const testElement = $('#container');
        testElement.dxPager({ maxPagesCount: 7, pageCount: 5, itemCount: 25 });
        const pagesElement = getPagesElement(testElement);

        assert.equal(pagesElement.length, 5, 'pages elements count');
        assert.equal(getText(pagesElement[0]), '1', 'page 1');
        assert.equal(getText(pagesElement[1]), '2', 'page 2');
        assert.equal(getText(pagesElement[2]), '3', 'page 3');
        assert.equal(getText(pagesElement[3]), '4', 'page 4');
        assert.equal(getText(pagesElement[4]), '5', 'page 5');
    });

    QUnit.test('Render pages with separator', function(assert) {
        const testElement = $('#container');
        testElement.dxPager({ maxPagesCount: 7, pageCount: 8, itemCount: 40 });
        const pagesElement = getPagesElement(testElement);

        assert.equal(pagesElement.length, 7, 'pages elements count');
        assert.equal(getText(pagesElement[0]), '1', 'page 1');
        assert.equal(getText(pagesElement[1]), '2', 'page 2');
        assert.equal(getText(pagesElement[2]), '3', 'page 3');
        assert.equal(getText(pagesElement[3]), '4', 'page 4');
        assert.equal(getText(pagesElement[4]), '5', 'page 5');
        assert.equal(getText(pagesElement[5]), '. . .', 'separator');
        assert.equal(getText(pagesElement[6]), '8', 'last page');
    });

    QUnit.test('Select page after click', function(assert) {
        const testElement = $('#container');
        const $pager = testElement.dxPager({ maxPagesCount: 7, pageCount: 8, itemCount: 40 });

        $(getPagesElement(testElement)[4]).trigger('dxclick');
        const pagesElement = getPagesElement(testElement);
        assert.equal(pagesElement.length, 8, 'pages elements count');
        assert.equal(getText(pagesElement[0]), '1', 'page 1');
        assert.equal(getText(pagesElement[1]), '. . .', 'separator');
        assert.equal(getText(pagesElement[2]), '3', 'page 2');
        assert.equal(getText(pagesElement[3]), '4', 'page 3');
        assert.equal(getText(pagesElement[4]), '5', 'page 4');
        assert.equal(getText(pagesElement[5]), '6', 'page 5');
        assert.equal(getText(pagesElement[6]), '. . .', 'separator');
        assert.equal(getText(pagesElement[7]), '8', 'last page');
    });

    QUnit.test('Select page after pointer up', function(assert) {
        const testElement = $('#container');
        const $pager = testElement.dxPager({ maxPagesCount: 7, pageCount: 8, itemCount: 40 });

        let pagesElement = getPagesElement(testElement);

        $(pagesElement[4]).trigger('dxpointerup');
        $(pagesElement[4]).trigger('dxclick');

        pagesElement = getPagesElement(testElement);
        assert.equal(pagesElement.length, 8, 'pages elements count');
        assert.equal(getText(pagesElement[0]), '1', 'page 1');
        assert.equal(getText(pagesElement[1]), '. . .', 'separator');
        assert.equal(getText(pagesElement[2]), '3', 'page 2');
        assert.equal(getText(pagesElement[3]), '4', 'page 3');
        assert.equal(getText(pagesElement[4]), '5', 'page 4');
        assert.equal(getText(pagesElement[5]), '6', 'page 4');
        assert.equal(getText(pagesElement[6]), '. . .', 'separator');
        assert.equal(getText(pagesElement[7]), '8', 'last page');
    });

    QUnit.test('PagesChooser is not visible if pages count equal one', function(assert) {
        const testElement = $('#container');

        testElement.dxPager({ maxPagesCount: 7, pageCount: 1 });
        const $pages = testElement.find('.dx-page');

        assert.equal($pages.length, 1, '$pages count');
        assert.equal($pages.css('visibility'), 'hidden');
    });

    QUnit.test('PagesChooser is visible always if pageNavigatorVisible is true', function(assert) {
        const testElement = $('#container');

        testElement.dxPager({ maxPagesCount: 7, pageCount: 1, pagesNavigatorVisible: true });
        const $pages = testElement.find('.dx-page');

        assert.equal($pages.length, 1, '$pages count');
        assert.notStrictEqual($pages.css('visibility'), 'hidden');
    });

    QUnit.test('PagesChooser is not visible  if pageNavigatorVisible is false', function(assert) {
        const testElement = $('#container');

        testElement.dxPager({ maxPagesCount: 7, pageCount: 1, pagesNavigatorVisible: false });
        const $pages = testElement.find('.dx-page');

        assert.equal($pages.length, 0, '$pages count');
    });

    QUnit.test('PagesChooser is not visible when pageNavigatorVisible is false', function(assert) {
        const testElement = $('#container');

        const pager = testElement.dxPager({ maxPagesCount: 7, pageCount: 1, pagesNavigatorVisible: true }).dxPager('instance');
        pager.option('pagesNavigatorVisible', false);
        const $pages = testElement.find('.dx-page');

        assert.equal($pages.length, 0, '$pages count');
    });

    QUnit.test('Change pages count', function(assert) {
        const testElement = $('#container');
        const $pager = testElement.dxPager({ maxPagesCount: 7, pageCount: 8, itemCount: 40 });
        const instance = $pager.dxPager('instance');
        let pagesElement;

        pagesElement = getPagesElement(testElement);
        $(pagesElement[4]).trigger('dxclick');
        pagesElement = getPagesElement(testElement);

        assert.equal(instance.option('pageIndex'), '5', 'selected page');
        assert.equal(pagesElement.length, 8, 'pages elements count');
        assert.equal(getText(pagesElement[0]), '1', 'page 1');
        assert.equal(getText(pagesElement[1]), '. . .', 'separator');
        assert.equal(getText(pagesElement[2]), '3', 'page 2');
        assert.equal(getText(pagesElement[3]), '4', 'page 3');
        assert.equal(getText(pagesElement[4]), '5', 'page 4');
        assert.equal(getText(pagesElement[5]), '6', 'page 4');
        assert.equal(getText(pagesElement[6]), '. . .', 'separator');
        assert.equal(getText(pagesElement[7]), '8', 'last page');

        instance.option('itemCount', 45);
        pagesElement = getPagesElement(testElement);

        assert.equal(instance.option('pageIndex'), '5', 'selected page');
        assert.equal(pagesElement.length, 8, 'pages elements count');
        assert.equal(getText(pagesElement[0]), '1', 'page 1');
        assert.equal(getText(pagesElement[1]), '. . .', 'separator');
        assert.equal(getText(pagesElement[2]), '3', 'page 2');
        assert.equal(getText(pagesElement[3]), '4', 'page 3');
        assert.equal(getText(pagesElement[4]), '5', 'page 4');
        assert.equal(getText(pagesElement[5]), '6', 'page 4');
        assert.equal(getText(pagesElement[6]), '. . .', 'separator');
        assert.equal(getText(pagesElement[7]), '9', 'last page');
    });

    // TODO: Contradict with a grid behavior. When there is no records it shows a pager with one page
    QUnit.test.skip('render pager on changed event', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 0, itemCount: 0 });
        const instance = $pager.dxPager('instance');

        assert.strictEqual($('.dx-pages').length, 0);

        instance.option('itemCount', 50);

        assert.strictEqual($('.dx-pages').length, 1);
    });

    QUnit.test('Pager is not displayed when visible is false', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, allowedPageSizes: [5, 10, 20], visible: false });

        assert.strictEqual($('.' + 'dx-pager').length, 1, 'pager is rendered');
        assert.equal($pager.css('display'), 'none', 'pager is hidden');
    });

    QUnit.test('Page sizes render', function(assert) {
        $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, pageIndex: 1, allowedPageSizes: [5, 10, 20] });
        const pageSizesElements = $('.dx-page-size');

        assert.equal(pageSizesElements.length, 3, 'page size elements count');
        assert.equal(getText(pageSizesElements[0]), 5, 'page size = 5');
        assert.equal(getText(pageSizesElements[1]), 10, 'page size = 10');
        assert.equal(getText(pageSizesElements[2]), 20, 'page size = 20');
    });
    // if(!isRenovation) {
    QUnit.test('Page sizes render when pageSizes is empty', function(assert) {
        $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, pageIndex: 1, allowedPageSizes: [] });

        const pageSizesElements = $('.dx-page-size');

        assert.equal(pageSizesElements.length, 0, 'page size elements count');
    });
    QUnit.test('Page sizes render when showPageSizes is false', function(assert) {
        $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, pageIndex: 1, showPageSizes: false, allowedPageSizes: [5, 10, 20] });

        const pageSizesElements = $('.dx-page-size');
        const pageSizesContainer = $('.dx-page-sizes');

        assert.equal(pageSizesContainer.length, 0, 'page sizes container elements count');
        assert.equal(pageSizesElements.length, 0, 'page size elements count');
    });

    QUnit.test('Page size selection by click', function(assert) {
        $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, pageIndex: 1, allowedPageSizes: [5, 10, 20] });

        let pageSizesElements = $('.dx-page-size');
        let selectionPageSizesElements;
        const cssSelectionClassName = '.dx-page-size' + '.' + 'dx-selection';

        pageSizesElements.eq(0).trigger('dxclick');
        selectionPageSizesElements = $(cssSelectionClassName);

        assert.equal(selectionPageSizesElements.length, 1, 'page size elements count');
        assert.equal(getText(selectionPageSizesElements[0]), '5', 'page size = 5');

        pageSizesElements = $('.dx-page-size');
        pageSizesElements.eq(2).trigger('dxclick');
        selectionPageSizesElements = $(cssSelectionClassName);

        assert.equal(selectionPageSizesElements.length, 1, 'page size elements count');
        assert.equal(getText(selectionPageSizesElements[0]), '20', 'page size = 20');

        pageSizesElements = $('.dx-page-size');
        pageSizesElements.eq(1).trigger('dxclick');
        selectionPageSizesElements = $(cssSelectionClassName);

        assert.equal(selectionPageSizesElements.length, 1, 'page size elements count');
        assert.equal(getText(selectionPageSizesElements[0]), '10', 'page size = 10');
    });

    QUnit.test('Page size is changed when selected page is clicked', function(assert) {
        let pageSizeChanged;

        $('#container').dxPager({
            maxPagesCount: 8,
            pagesCount: 10,
            pageIndex: 1,
            allowedPageSizes: [5, 10, 20],
            pageSizeChanged: function() {
                pageSizeChanged = true;
            }
        });

        const pageSizesElements = $('.dx-page-size');

        pageSizesElements.eq(1).trigger('dxclick');
        assert.ok(pageSizeChanged);

        pageSizeChanged = false;

        pageSizesElements.eq(1).trigger('dxclick');
        assert.ok(!pageSizeChanged);
    });

    QUnit.test('PageSizeChanged is occurred when page size option is changed', function(assert) {
        let pageSizeChanged;

        const $pager = $('#container').dxPager({
            maxPagesCount: 8,
            pagesCount: 10,
            pageIndex: 1,
            allowedPageSizes: [5, 10, 20],
            pageSizeChanged: function() {
                pageSizeChanged = true;
            }
        });

        const pager = $pager.dxPager('instance');

        assert.ok(!pageSizeChanged);

        pager.option('pageSize', 20);

        assert.ok(pageSizeChanged);
    });

    QUnit.test('Correct selected page when page index is not contains in the pages', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 25, itemCount: 125, pageIndex: 1, allowedPageSizes: [5, 10, 20] });
        const instance = $pager.dxPager('instance');
        instance.option('pageIndex', 16);

        let pagesElement = getPagesElement($('#container'));

        assert.equal(getText(pagesElement[0]), '1', '1 page value');
        assert.equal(getText(pagesElement[1]), '. . .', 'separator');
        assert.equal(getText(pagesElement[2]), '15', '2 page value');
        assert.equal(getText(pagesElement[3]), '16', '3 page value');
        assert.ok($(pagesElement[3]).is('.dx-selection'), '16 selected page');
        assert.equal(getText(pagesElement[4]), '17', '4 page value');
        assert.equal(getText(pagesElement[5]), '18', '5 page value');

        instance.option('pageIndex', 22);

        pagesElement = getPagesElement($('#container'));
        assert.equal(getText(pagesElement[0]), '1', '1 page value');
        assert.equal(getText(pagesElement[1]), '. . .', 'separator');
        assert.equal(getText(pagesElement[2]), '21', '2 page value');
        assert.equal(getText(pagesElement[3]), '22', '2 page value');
        assert.ok($(pagesElement[3]).is('.dx-selection'), '22 selected page');
        assert.equal(getText(pagesElement[4]), '23', '2 page value');
        assert.equal(getText(pagesElement[5]), '24', '2 page value');
    });

    QUnit.test('Refresh pages after page size is changed_B233925', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 15, itemCount: 75, pageIndex: 1, allowedPageSizes: [5, 10, 20] });
        const instance = $pager.dxPager('instance');

        instance.option('itemCount', 65);
        instance.option('pageIndex', 13);

        const pagesElement = getPagesElement($('#container'));
        assert.equal(getText(pagesElement[0]), '1', '1 page value');
        assert.equal(getText(pagesElement[1]), '. . .', 'separator');
        assert.equal(getText(pagesElement[2]), '9', '2 page value');
        assert.equal(getText(pagesElement[3]), '10', '3 page value');
        assert.equal(getText(pagesElement[4]), '11', '4 page value');
        assert.equal(getText(pagesElement[5]), '12', '5 page value');
        assert.equal(getText(pagesElement[6]), '13', '6 page value');
    });

    // B239491
    QUnit.test('Pager has negative pages when pages count is changed', function(assert) {
        const $pager = $('#container').dxPager({
            maxPagesCount: 8,
            itemCount: 5,
            pageIndex: 1,
            visible: false,
            hasKnownLastPage: false
        });
        const instance = $pager.dxPager('instance');

        instance.option({
            hasKnownLastPage: true,
            itemCount: 5
        });

        instance.option({
            visible: true,
            itemCount: 125
        });

        const pagesElement = getPagesElement($('#container'));
        assert.ok($(pagesElement[0]).is('.dx-selection'), '0 index selected page');
        assert.equal(pagesElement.length, 7, 'length 6');
        assert.equal(getText(pagesElement[0]), '1', 'first page value');
        assert.equal(getText(pagesElement[1]), '2', 'second page value');
    });

    // T966318
    QUnit.test('Pager does not display duplicated page numbers', function(assert) {
        const $pager = $('#container').dxPager({
            allowedPageSizes: [10, 20, 50],
            pageSize: 50,
            itemCount: 100000,
            pageCount: 2000,
        });
        const instance = $pager.dxPager('instance');
        instance.option('pageIndex', 1999);

        instance.option('pageSize', 10);

        instance.option('pageSize', 50);

        const pagesElement = getPagesElement($('#container'));

        assert.equal(pagesElement.length, 7, 'length 7');
        assert.ok($(pagesElement[5]).is('.dx-selection'), '1999 selected page');
        assert.equal(getText(pagesElement[5]), '1999', 'index selected page');
        assert.equal(getText(pagesElement[6]), '2000', 'lastpage page value');
    });

    QUnit.test('Selected page is not reset_B237051', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 15, itemCount: 75, pageIndex: 1 });
        const instance = $pager.dxPager('instance');

        instance.option('pageCount', 1);
        instance.option('pageCount', 15);

        const pagesElement = getPagesElement($('#container'));

        assert.equal(getText(pagesElement[0]), 1, '1 page value');
        assert.equal(getText(pagesElement[1]), 2, '2 page value');
        assert.equal(getText(pagesElement[2]), 3, '3 page value');
        assert.equal(getText(pagesElement[3]), 4, '4 page value');
        assert.equal(getText(pagesElement[4]), 5, '5 page value');
        assert.equal(getText(pagesElement[5]), '. . .', 'separator');
        assert.equal(getText(pagesElement[6]), 15, '6 page value');
    });

    // B239176;
    QUnit.test('Click separator page_B239176', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 7, pageCount: 8 });
        const instance = $pager.dxPager('instance');

        $('.dx-separator').first().trigger('dxclick');

        assert.equal(instance.option('pageIndex'), 1);
        assert.ok(!typeUtils.isDefined(instance._testPageIndex));
    });

    // B239176
    QUnit.test('Click  page parent container_B239176', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 7, pageCount: 8 }); const instance = $pager.dxPager('instance');

        $('.dx-pages').first().trigger('dxclick');

        assert.equal(instance.option('pageIndex'), 1);
        assert.ok(!typeUtils.isDefined(instance._testPageIndex));
    });

    // B239176
    QUnit.test('Click page size parent container_B239176', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, allowedPageSizes: [5, 10, 20], pageSize: 10 }); const instance = $pager.dxPager('instance');

        $('.dx-page-sizes').first().trigger('dxclick');

        assert.equal(instance.option('pageSize'), 10);
        assert.ok(!typeUtils.isDefined(instance._testPageSizeIndex));
    });

    QUnit.test('Show navigate buttons', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, allowedPageSizes: [5, 10, 20], showNavigationButtons: true });

        assert.equal($pager.find('.dx-navigate-button').length, 2, 'navigate buttons count');
        assert.equal($pager.find('.dx-prev-button').length, 1, 'prev button');
        assert.equal($pager.find('.dx-next-button').length, 1, 'next button');
    });

    QUnit.test('Next page index via navigate button', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, itemCount: 50, allowedPageSizes: [5, 10, 20], showNavigationButtons: true });
        const instance = $pager.dxPager('instance');

        let $button = $('.dx-next-button');
        $($button).trigger('dxclick');
        $button = $('.dx-next-button');
        $($button).trigger('dxclick');
        $button = $('.dx-next-button');
        $($button).trigger('dxclick');

        assert.equal(instance.option('pageIndex'), '4', 'selected page index 4');

        instance.option('pageIndex', 10);

        $($button).trigger('dxclick');
        assert.equal(instance.option('pageIndex'), '10', 'selected page index 10');
    });

    QUnit.test('Focus selected page', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, allowedPageSizes: [5, 10, 20], showNavigationButtons: true });
        const $pages = $pager.find('.dx-pages .dx-page');

        for(let i = 0; i < $pages.length; ++i) {
            assert.equal($($pages[i]).attr('tabindex'), 0, 'page tabindex');
        }
    });

    QUnit.test('Back page index via navigate button', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, itemCount: 50, allowedPageSizes: [5, 10, 20], showNavigationButtons: true });
        const instance = $pager.dxPager('instance');

        instance.option('pageIndex', 8);

        let $prevButton = $('.dx-prev-button');
        $($prevButton).trigger('dxclick');
        $prevButton = $('.dx-prev-button');
        $($prevButton).trigger('dxclick');


        assert.equal(instance.option('pageIndex'), 6, 'selected page index 6');

        instance.option('pageIndex', 1);

        $prevButton = $('.dx-prev-button');
        $($prevButton).trigger('dxclick');
        $prevButton = $('.dx-prev-button');
        $($prevButton).trigger('dxclick');


        assert.equal(instance.option('pageIndex'), 1, 'selected page index 1');
    });

    QUnit.test('Click on navigate buttons', function(assert) {
        const $pager = $('#container').dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            itemCount: 50,
            allowedPageSizes: [5, 10, 20],
            showNavigationButtons: true,
        });

        const instance = $pager.dxPager('instance');
        let $button;

        instance.option('pageIndex', 8);
        assert.equal(instance.option('pageIndex'), 8);

        $button = $('.dx-next-button');
        $($button).trigger('dxclick');

        assert.equal(instance.option('pageIndex'), 9);

        $button = $('.dx-prev-button');
        $($button).trigger('dxclick');
        assert.equal(instance.option('pageIndex'), 8);
    });

    // T804551
    QUnit.test('Pointer up and click on page button', function(assert) {
        const $pager = $('#container').dxPager({ pageCount: 20, itemCount: 100 });
        const instance = $pager.dxPager('instance');


        $pager.find('.dx-page').eq(4).trigger('dxpointerup');
        $pager.find('.dx-page').eq(4).trigger('dxclick');

        assert.equal(instance.option('pageIndex'), 5, 'pageIndex is correct');
    });

    QUnit.test('Prev button is disabled when first page is chosen ', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, allowedPageSizes: [5, 10, 20], showNavigationButtons: true });
        let isPageChanged;
        const $button = $('.dx-prev-button');
        const instance = $pager.dxPager('instance');

        instance.pageIndexChanged = function() {
            isPageChanged = true;
        };

        $button.click();

        assert.ok($button.hasClass('dx-button-disable'));
        assert.ok(!isPageChanged);
    });

    QUnit.test('Next button is disabled when first page is chosen ', function(assert) {
        const $pager = $('#container').dxPager({ maxPagesCount: 8, pageCount: 10, allowedPageSizes: [5, 10, 20], showNavigationButtons: true });
        let isPageChanged;
        const instance = $pager.dxPager('instance');

        instance.option('pageIndex', 10);
        instance.pageIndexChanged = function() {
            isPageChanged = true;
        };

        const $button = $('.dx-next-button');
        $button.click();

        assert.ok($button.hasClass('dx-button-disable'));
        assert.ok(!isPageChanged);
    });

    QUnit.test('Next button is disabled when first page is chosen (Rtl mode)', function(assert) {
        $('#container').dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showNavigationButtons: true,
            rtlEnabled: true
        });

        const $button = $('.dx-next-button');

        $button.click();

        assert.ok($button.hasClass('dx-button-disable'));
    });

    QUnit.test('Prev button is disabled when first page is chosen (Rtl mode)', function(assert) {
        const $pager = $('#container').dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showNavigationButtons: true,
            rtlEnabled: true
        });

        const instance = $pager.dxPager('instance');

        instance.option('pageIndex', 10);

        const $button = $('.dx-prev-button');
        $button.click();

        assert.ok($button.hasClass('dx-button-disable'));
    });

    QUnit.test('Pages chooser visibility when page size is changed', function(assert) {
        const $pager = $('#container').dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            itemCount: 50,
            pageIndex: 1,
            pageSize: 5,
            allowedPageSizes: [5, 10, 20]
        });

        const pager = $pager.dxPager('instance');
        let $pages = $('.dx-pages');

        assert.equal($pages[0].style.visibility, '', 'default visibility');

        pager.option('itemCount', 5);

        $pages = $('.dx-pages');
        assert.equal($pages[0].style.visibility, 'hidden', 'visibility when pages count equal one');

        pager.option('itemCount', 40);

        $pages = $('.dx-pages');
        assert.equal($pages[0].style.visibility, '', 'visibility when pages count equal 8');
    });

    QUnit.test('Pager Info', function(assert) {
        $('#container').dxPager({
            maxPagesCount: 8, pageCount: 10, allowedPageSizes: [5, 10, 20], showInfo: true, itemCount: 46,
            infoText: 'Page {0} of {1} ({2} items)'
        });

        const $info = $('.dx-info');

        assert.equal($info.length, 1, 'info');
        assert.equal($info.text(), 'Page 1 of 10 (46 items)', 'info text');
    });

    QUnit.test('Page info text is changed when itemCount is changed', function(assert) {
        const $pager = $('#container').dxPager({
            maxPagesCount: 8, pageCount: 10, allowedPageSizes: [5, 10, 20], showInfo: true, itemCount: 46,
            infoText: 'Page {0} of {1} ({2} items)'
        });
        const instance = $pager.dxPager('instance');

        instance.option('itemCount', 89);
        assert.equal($('.dx-info').text(), 'Page 1 of 18 (89 items)');
    });

    QUnit.test('Light mode', function(assert) {
        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 46,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of'
        });
        const $pageSizeChooser = $pager.find('.dx-page-sizes').children().first();
        const $pageIndex = $('.dx-page-index');
        const $pageInfoText = $('.dx-info-text');
        const $pagesCount = $('.dx-pages-count');

        assert.ok($pageSizeChooser.dxSelectBox('instance'), 'use selectBox for choose page sizes');
        assert.ok($pageIndex.dxNumberBox('instance'), 'use numberBox for page index');
        assert.equal($pageInfoText.text(), 'of', 'info text');
        assert.equal($pagesCount.text(), '10', 'pages count');
        assert.equal($pager.find('.dx-navigate-button').length, 2, 'navigate buttons count');
        assert.equal($pager.find('.dx-prev-button').length, 1, 'prev button');
        assert.equal($pager.find('.dx-next-button').length, 1, 'next button');
    });

    QUnit.test('Light mode without the page sizes and info', function(assert) {
        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: false,
            showPageSizes: false,
            itemCount: 46,
            pagesCountText: 'of'
        });
        const $pageSizeChooser = $pager.find('.dx-page-sizes').children().first();
        const $pageIndex = $('.dx-page-index');
        const $pageInfoText = $('.dx-info-text');
        const $pagesCount = $('.dx-pages-count');

        assert.ok(!$pageSizeChooser.dxSelectBox('instance'), 'use selectBox for choose page sizes');
        assert.ok($pageIndex.dxNumberBox('instance'), 'use numberBox for page index');
        assert.equal($pageInfoText.text(), 'of', 'info text');
        assert.equal($pagesCount.text(), '10', 'pages count');
        assert.equal($pager.find('.dx-navigate-button').length, 2, 'navigate buttons count');
        assert.equal($pager.find('.dx-prev-button').length, 1, 'prev button');
        assert.equal($pager.find('.dx-next-button').length, 1, 'next button');
    });

    QUnit.test('Light mode. Change page index after clicked on the pages count element', function(assert) {
        $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 110,
            itemCount: 550,
            allowedPageSizes: [5, 10, 20],
            showPageSizes: false,
            pagesCountText: 'of'
        });
        const editor = $('.dx-page-index').dxNumberBox('instance');
        const $pagesCount = $('.dx-pages-count');

        $($pagesCount).trigger('dxclick');

        assert.equal($pagesCount.text(), '110', 'pages count');
        assert.equal(editor.option('value'), 110, 'value of editor in page index element');
    });

    QUnit.test('Light mode when re-render', function(assert) {
        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            pageSize: 10,
            showInfo: true,
            itemCount: 96,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of',
            showNavigationButtons: true
        });

        $pager.dxPager('instance')._render();

        const $pageSizeChooser = $pager.find('.dx-page-sizes .dx-selectbox');
        const $pageIndex = $('.dx-page-index');
        const $pagesCount = $('.dx-pages-count');
        const $pageInfoText = $('.dx-info-text');

        assert.strictEqual($pageSizeChooser.dxSelectBox('instance').option('value'), 10, 'page size');
        assert.strictEqual($pageIndex.dxNumberBox('instance').option('value'), 1, 'page index');
        assert.equal($pageInfoText.text(), 'of', 'pages info text');
        assert.equal($pagesCount.text(), '10', 'pages count');
    });

    QUnit.test('Light mode. Check page sizes', function(assert) {
        const $pager = $('#container')
            .width(PAGER_LIGHT_MODE_WIDTH)
            .dxPager({
                maxPagesCount: 8,
                pageCount: 10,
                allowedPageSizes: [5, 10, 20],
                pageSize: 10,
                itemCount: 86,
                pagesCountText: 'of'
            });
        const $pageSizeChooser = $pager.find('.dx-page-sizes').children().first();
        const selectBox = $pageSizeChooser.dxSelectBox('instance');

        selectBox.open();

        assert.deepEqual(selectBox.option('items').map(x => x.value || x), [5, 10, 20], 'page sizes');
        assert.equal(selectBox.option('value'), 10, 'current page size');

        selectBox.close();
    });

    QUnit.test('Light mode. Check page sizes width', function(assert) {
        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            pageSize: 10,
            itemCount: 86,
            pagesCountText: 'of'
        });
        const pager = $pager.dxPager('instance');
        const $pageSizeChooser = $pager.find('.dx-page-sizes').children().first();
        const selectBox = $pageSizeChooser.dxSelectBox('instance');

        assert.equal(selectBox.option('width'), Number($('.dx-page-sizes').css('min-width').replace('px', '')) + 20);

        pager.option('allowedPageSizes', [5, 10, 1010]);

        assert.equal(selectBox.option('width'), Number($('.dx-page-sizes').css('min-width').replace('px', '')) + 40);
    });

    QUnit.test('Light mode. Change page size', function(assert) {
        let testValue;

        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            pageSize: 5,
            itemCount: 86,
            pagesCountText: 'of',
            pageSizeChanged: function(value) {
                testValue = value;
            }
        });

        const $pageSizeChooser = $pager.find('.dx-page-sizes').children().first();
        const selectBox = $pageSizeChooser.dxSelectBox('instance');

        selectBox.option('value', 20);

        assert.equal(testValue, 20);
    });

    QUnit.test('Light mode. Change page size via option method', function(assert) {
        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [7, 10, 13, 25],
            pageSize: 10,
            itemCount: 86,
            pagesCountText: 'of'
        });

        $pager.dxPager('instance').option('pageSize', 13);

        const $pageSizeChooser = $pager.find('.dx-page-sizes').children().first();
        const selectBox = $pageSizeChooser.dxSelectBox('instance');

        assert.equal(selectBox.option('value'), 13);
    });

    QUnit.test('Light mode. Change page sizes via option method', function(assert) {
        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [7, 10, 13, 25],
            pageSize: 10,
            itemCount: 86,
            pagesCountText: 'of'
        });

        $pager.dxPager('instance').option('allowedPageSizes', [13, 45, 67]);

        const $pageSizeChooser = $pager.find('.dx-page-sizes').children().first();
        const selectBox = $pageSizeChooser.dxSelectBox('instance');
        selectBox.open();

        assert.deepEqual(selectBox.option('items').map(x => x.value || x), [13, 45, 67]);

        selectBox.close();
    });

    QUnit.test('Light mode. Check page index', function(assert) {
        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            itemCount: 46,
            pageIndex: 73,
            pagesCountText: 'of'
        });
        const $pageIndex = $pager.find('.dx-page-index');
        const numberBox = $pageIndex.dxNumberBox('instance');

        assert.equal(numberBox.option('value'), 10);
    });

    QUnit.test('Light mode. Check page index width', function(assert) {
        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            itemCount: 46,
            pageIndex: 73,
            pagesCountText: 'of'
        });
        const pager = $pager.dxPager('instance');
        const $pageIndex = $pager.find('.dx-page-index');
        const numberBox = $pageIndex.dxNumberBox('instance');

        assert.equal(numberBox.option('width'), Number($('.dx-page-index').css('min-width').replace('px', '')) + 20);

        pager.option('itemCount', 10350);

        assert.equal(numberBox.option('width'), Number($('.dx-page-index').css('min-width').replace('px', '')) + 40);
    });

    QUnit.test('Light mode. Change page index', function(assert) {
        let pageIndex;

        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            pageSize: 5,
            itemCount: 86,
            pagesCountText: 'of',
            pageIndexChanged: function(value) {
                pageIndex = value;
            }
        });
        const $pageIndex = $pager.find('.dx-page-index');
        const numberBox = $pageIndex.dxNumberBox('instance');

        numberBox.option('value', 5);

        assert.equal(pageIndex, 5);
    });

    QUnit.test('Light mode. Change page index via option', function(assert) {
        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            pageSize: 5,
            itemCount: 46,
            pagesCountText: 'of'
        });
        const $pageIndex = $pager.find('.dx-page-index');
        const numberBox = $pageIndex.dxNumberBox('instance');

        $pager.dxPager('instance').option('pageIndex', 79);

        assert.equal(numberBox.option('value'), 10);
    });

    QUnit.test('Light mode. Change page index via the navigation buttons', function(assert) {
        let pageIndex;
        $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            pageSize: 5,
            itemCount: 86,
            pagesCountText: 'of',
            showNavigationButtons: true,
            pageIndexChanged: function(value) {
                pageIndex = value;
            }
        });
        const $nextButton = $('.dx-next-button');
        const $prevButton = $('.dx-prev-button');

        $($nextButton).trigger('dxclick');
        assert.equal(pageIndex, 2, 'next page index');

        $($prevButton).trigger('dxclick');
        assert.equal(pageIndex, 1, 'prev page index');
    });

    QUnit.test('Light mode. Min and max for the pageIndex editor', function(assert) {
        let pageIndex;

        const $pager = $('#container').width(PAGER_LIGHT_MODE_WIDTH).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            pageIndex: 2,
            pageSize: 5,
            itemCount: 46,
            pagesCountText: 'of',
            pageIndexChanged: function(value) {
                pageIndex = value;
            }
        });
        const $input = $pager.find('.dx-page-index .dx-texteditor-input').first();

        $input.val(-12);
        $input.change();

        assert.equal(pageIndex, 1, '-12 value');

        $input.val(0);
        $input.change();

        assert.equal(pageIndex, 1, '0 value');

        $input.val(23);
        $input.change();

        assert.equal(pageIndex, 10, '23 value');
    });

    QUnit.test('Apply light mode when width of pager is less of min width', function(assert) {
        const $pager = $('#container').width(1000).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 86,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of',
            showNavigationButtons: true
        });
        const pager = $pager.dxPager('instance');

        assert.equal(isLightMode(pager), false, 'lightModeEnabled by default');

        $pager.width(100);
        _dimensionChanged(pager);

        assert.equal(isLightMode(pager), true, 'lightModeEnabled is enabled');
    });

    QUnit.test('Apply light mode when width equal optimal pager\'s width', function(assert) {
        const $pager = $('#container').width(1000).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 86,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of',
            showNavigationButtons: true
        });

        const pager = $pager.dxPager('instance');
        const pagesElement = getPagesElement($('#container'));

        const optimalPagerWidth = getWidth(
            $pager.find('.dx-page-sizes')) +
            getWidth($pager.find('.dx-pages')) -
            getWidth(pagesElement[pagesElement.length - 1]);

        $pager.width(optimalPagerWidth - getOuterWidth($pager.find('.dx-info'), true) - 1);

        _dimensionChanged(pager);
        assert.equal(isLightMode(pager), true, 'lightModeEnabled is enabled');
    });

    // T962160
    QUnit.test('Show info after pagesizes change', function(assert) {
        const $pager = $('#container').width(1000).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 200,
            infoText: 'Page {0} of {1} ({2} items)',
        });

        const pager = $pager.dxPager('instance');

        const optimalPagerWidth = getWidth($pager.find('.dx-page-sizes')) + getWidth($pager.find('.dx-pages')) + 20;
        $pager.width(optimalPagerWidth);
        _dimensionChanged(pager);

        const pagesElement = getPagesElement($('#container'));
        assert.ok($pager.find('.dx-info').length === 1 && $pager.find('.dx-info').css('display') !== 'none', 'info element is visible');

        $(pagesElement[4]).trigger('dxclick');
        _dimensionChanged(pager);
        assert.ok($pager.find('.dx-info').length === 0 || $pager.find('.dx-info').css('display') === 'none', 'info element is hidden');

        $(pagesElement[0]).trigger('dxclick');
        _dimensionChanged(pager);
        assert.ok($pager.find('.dx-info').length === 1 && $pager.find('.dx-info').css('display') !== 'none', 'info element is visible');
    });

    QUnit.test('Apply light mode when pager is first rendered', function(assert) {
        const $pager = $('#container').width(100).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 86,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of',
            showNavigationButtons: true
        });
        const pager = $pager.dxPager('instance');

        assert.equal(isLightMode(pager), true, 'lightModeEnabled is enabled');
    });

    QUnit.test('Pager is rendered in a normal view after light mode when pageCount is changed', function(assert) {
        const $pager = $('#container').width(360).dxPager({
            maxPagesCount: 10,
            pageCount: 5,
            pageSize: 8,
            allowedPageSizes: [5, 8, 15, 30],
            showInfo: true,
            itemCount: 40,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of',
            showNavigationButtons: true
        });
        const pager = $pager.dxPager('instance');

        pager.option({ itemCount: 400, pageIndexChanged: commonUtils.noop });
        pager.option({ itemCount: 40, pageIndexChanged: commonUtils.noop });

        assert.strictEqual(isLightMode(pager), true, 'pager is displayed in the light mode for pager');
    });

    QUnit.test('Light mode is applied only one', function(assert) {
        const $pager = $('#container').width(1000).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 86,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of',
            showNavigationButtons: true
        });

        const pager = $pager.dxPager('instance');
        const pageSizeEl = $pager.find('.dx-page-sizes')[0].children[0];

        $pager.width(995);
        _dimensionChanged(pager);

        assert.ok(!isLightMode(pager), 'pager is not displayed in the light mode width:995');
        assert.equal(pageSizeEl, $pager.find('.dx-page-sizes')[0].children[0], 'pages not re-render:995');

        $pager.width(800);
        _dimensionChanged(pager);

        assert.ok(!isLightMode(pager), 'pager is not displayed in the light mode width:800');
        assert.equal(pageSizeEl, $pager.find('.dx-page-sizes')[0].children[0], 'pages not re-render width:880');

        $pager.width(100);
        _dimensionChanged(pager);

        assert.ok(isLightMode(pager), 'pager is displayed in the light mode width:100');
        assert.notStrictEqual(pageSizeEl, $pager.find('.dx-page-sizes')[0].children[0], 'pages re-render width:100');
        const pageSizeElLight = $pager.find('.dx-page-sizes')[0].children[0];

        $pager.width(80);
        _dimensionChanged(pager);

        assert.ok(isLightMode(pager), 'pager is displayed in the light mode width:80');
        assert.equal(pageSizeElLight, $pager.find('.dx-page-sizes')[0].children[0], 'pages not re-render width:80');
    });

    QUnit.test('Cancel light mode when width of pager is more of min width', function(assert) {
        const $pager = $('#container').width(100).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 86,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of',
            showNavigationButtons: true
        });
        const pager = $pager.dxPager('instance');

        assert.equal(isLightMode(pager), true, 'lightModeEnabled is enabled');

        $pager.width(1000);
        _dimensionChanged(pager);

        assert.equal(isLightMode(pager), false, 'lightModeEnabled is disabled');
    });

    QUnit.test('Cancel light mode is only one', function(assert) {
        const $pager = $('#container').width(100).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 86,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of',
            showNavigationButtons: true
        });

        const pager = $pager.dxPager('instance');
        const pageSizeEl = $pager.find('.dx-page-sizes')[0].children[0];

        assert.ok(isLightMode(pager), 'pager is displayed in the light mode width:100');

        $pager.width(1000);
        _dimensionChanged(pager);

        assert.ok(!isLightMode(pager), 'pager is not displayed in the light mode width:1000');
        assert.notStrictEqual(pageSizeEl, $pager.find('.dx-page-sizes')[0].children[0], 'pages not re-render:1000');
        const pageSizeLargeEl = $pager.find('.dx-page-sizes')[0].children[0];

        $pager.width(1005);
        _dimensionChanged(pager);

        assert.ok(!isLightMode(pager), 'pager is not displayed in the light mode width:1005');
        assert.equal(pageSizeLargeEl, $pager.find('.dx-page-sizes')[0].children[0], 'pages not re-render:1005');

        $pager.width(1010);
        _dimensionChanged(pager);

        assert.ok(!isLightMode(pager), 'pager is not displayed in the light mode width:1010');
        assert.equal(pageSizeLargeEl, $pager.find('.dx-page-sizes')[0].children[0], 'pages not re-render:1010');

        $pager.width(1200);
        _dimensionChanged(pager);

        assert.ok(!isLightMode(pager), 'pager is not displayed in the light mode width:1010');
        assert.equal(pageSizeLargeEl, $pager.find('.dx-page-sizes')[0].children[0], 'pages not re-render:1010');
    });

    QUnit.test('Hide the info element when it does not fit in a container', function(assert) {
        const $pager = $('#container').width(1000).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 86,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of'
        });
        const pager = $pager.dxPager('instance');

        $pager.width(getWidth($pager.find('.dx-page-sizes')) + getWidth($pager.find('.dx-pages')) - 50);
        _dimensionChanged(pager);

        assert.ok(!isLightMode(pager), 'lightModeEnabled');
        assert.ok($pager.find('.dx-info').length === 0 || $pager.find('.dx-info').css('display') === 'none', 'info element is hidden');
    });

    QUnit.test('Show the info element when it is fit in a container', function(assert) {
        const $pager = $('#container').width(1000).dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showInfo: true,
            itemCount: 86,
            infoText: 'Page {0} of {1} ({2} items)',
            pagesCountText: 'of'
        });
        const pager = $pager.dxPager('instance');
        const infoWidth = getWidth(pager._$info);

        setWidth(
            $pager,
            getWidth($pager.find('.dx-page-sizes')) + getWidth($pager.find('.dx-pages')) - 50
        );
        _dimensionChanged(pager);

        setWidth(
            $pager,
            getWidth($pager.find('.dx-page-sizes')) + getWidth($pager.find('.dx-pages')) + infoWidth + 50
        );
        _dimensionChanged(pager);

        assert.ok(!isLightMode(pager), 'lightModeEnabled');
        assert.ok($pager.find('.dx-info').length === 1 || $pager.find('.dx-info').css('display') !== 'none', 'info element is hidden');
    });

    QUnit.test('LightMode.Prev button is disabled when first page is chosen ', function(assert) {
        const $pager = $('#container').dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showNavigationButtons: true,
            pagesCountText: 'of',
            lightModeEnabled: true
        });

        let isPageChanged;
        const $button = $('.dx-prev-button');
        const instance = $pager.dxPager('instance');

        instance.pageIndexChanged = function() {
            isPageChanged = true;
        };

        $button.click();

        assert.ok($button.hasClass('dx-button-disable'));
        assert.ok(!isPageChanged);
    });

    QUnit.test('LightMode.Next button is disabled when first page is chosen ', function(assert) {
        const $pager = $('#container').dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showNavigationButtons: true,
            pageIndex: 10,
            pagesCountText: 'of',
            lightModeEnabled: true
        });

        let isPageChanged;
        const instance = $pager.dxPager('instance');

        instance.pageIndexChanged = function() {
            isPageChanged = true;
        };

        const $button = $('.dx-next-button');
        $button.click();

        assert.ok($button.hasClass('dx-button-disable'));
        assert.ok(!isPageChanged);
    });

    QUnit.test('Navigate buttons with rtl', function(assert) {
        const $pager = $('#container').dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            itemCount: 50,
            allowedPageSizes: [5, 10, 20],
            showNavigationButtons: true,
            rtlEnabled: true,
        });

        const instance = $pager.dxPager('instance');
        let $button;

        instance.option('pageIndex', 8);

        assert.equal(instance.option('pageIndex'), 8);

        $button = $('.dx-next-button');
        $($button).trigger('dxclick');
        assert.equal(instance.option('pageIndex'), 7);

        $button = $('.dx-prev-button');
        $($button).trigger('dxclick');
        assert.equal(instance.option('pageIndex'), 8);
    });

    QUnit.test('dxPager render with RTL', function(assert) {
        const pagerElement = $('#container').dxPager({
            maxPagesCount: 8,
            pageCount: 10,
            allowedPageSizes: [5, 10, 20],
            showNavigationButtons: true,
            rtlEnabled: true
        });

        const pagerInstance = pagerElement.dxPager('instance');
        let rtlTestSample = {};
        let ltrTestSample = {};

        rtlTestSample = {
            allowedPageSizes: pagerElement.find('.dx-page-size').text(),
            pages: [...getPagesElement(pagerElement).map((i, j) => $(j).text())],
        };

        pagerInstance.option('rtlEnabled', false);

        ltrTestSample = {
            allowedPageSizes: pagerElement.find('.dx-page-size').text(),
            pages: [...getPagesElement(pagerElement).map((i, j) => $(j).text())],
        };

        assert.equal(rtlTestSample.allowedPageSizes, ltrTestSample.allowedPageSizes, 'check that page sizes in LTR are equal to page sizes in RTL');
        assert.deepEqual(rtlTestSample.pages, ltrTestSample.pages.reverse(), 'check that pages in LTR are equal to reversed pages in RTL');
    });

    QUnit.test('dxPager has locale appropriate aria-labels (T1102800)(T1104028)', function(assert) {
        const locale = localization.locale();
        const dictionary = {
            'en': {
                'dxPager-pageSize': 'test Items per page: {0}',
                'dxPager-pageSizesAllText': 'test All',
                'dxPager-page': 'test Page {0}',
                'dxPager-prevPage': 'test Previous Page',
                'dxPager-nextPage': 'test Next Page',
            },
            'fr': {
                'dxPager-pageSize': 'test Nombre d\'éléments par page: {0}',
                'dxPager-pageSizesAllText': 'test Tous',
                'dxPager-page': 'test Page {0}',
                'dxPager-prevPage': 'test Page précédente',
                'dxPager-nextPage': 'test Page suivante',
            }
        };
        localization.loadMessages(dictionary);
        localization.locale('en');

        const pagerElement = $('#container').dxPager({
            allowedPageSizes: ['all'],
            showNavigationButtons: true,
            showInfo: true
        });

        let pageSize = pagerElement.find('.dx-page-size');
        let buttonNext = pagerElement.find('.dx-next-button');
        let buttonPrev = pagerElement.find('.dx-prev-button');
        let page = pagerElement.find('.dx-page');

        assert.equal(pageSize.attr('aria-label'), dictionary['en']['dxPager-pageSize'].replace('{0}', dictionary['en']['dxPager-pageSizesAllText']), 'correct aria-label for page size on initial render');
        assert.equal(page.attr('aria-label'), dictionary['en']['dxPager-page'].replace('{0}', '1'), 'correct aria-label for page on initial render');
        assert.equal(buttonNext.attr('aria-label'), dictionary['en']['dxPager-nextPage'], 'correct aria-label for next page on initial render');
        assert.equal(buttonPrev.attr('aria-label'), dictionary['en']['dxPager-prevPage'], 'correct aria-label for prev page on initial render');

        localization.locale('fr');
        pagerElement.dxPager('instance').repaint();

        pageSize = pagerElement.find('.dx-page-size');
        buttonNext = pagerElement.find('.dx-next-button');
        buttonPrev = pagerElement.find('.dx-prev-button');
        page = pagerElement.find('.dx-page');

        assert.equal(pageSize.attr('aria-label'), dictionary['fr']['dxPager-pageSize'].replace('{0}', dictionary['fr']['dxPager-pageSizesAllText']), 'correct aria-label for page size on locale change');
        assert.equal(page.attr('aria-label'), dictionary['fr']['dxPager-page'].replace('{0}', '1'), 'correct aria-label for page on locale change');
        assert.equal(buttonNext.attr('aria-label'), dictionary['fr']['dxPager-nextPage'], 'correct aria-label for next page on locale change');
        assert.equal(buttonPrev.attr('aria-label'), dictionary['fr']['dxPager-prevPage'], 'correct aria-label for prev page on locale change');

        localization.locale(locale);
    });
});

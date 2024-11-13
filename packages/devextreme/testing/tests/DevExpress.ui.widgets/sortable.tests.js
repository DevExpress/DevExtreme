import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import 'ui/sortable';
import 'ui/scroll_view';
import fx from 'common/core/animation/fx';
import animationFrame from 'common/core/animation/frame';
import browser from 'core/utils/browser';
import translator from 'common/core/animation/translator';
import viewPort from 'core/utils/view_port';
import devices from '__internal/core/m_devices';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        `<style nonce="qunit-test">
            .draggable {
                height: 30px;
            }
            .default {
                cursor: default;
            }
            div.qunit-fixture-absolute {
                position: absolute !important;
            }
            .colored-item:nth-child(3n + 1) {
                background: yellow;
            }
            .colored-item:nth-child(3n + 2) {
                background: red;
            }
            .colored-item:nth-child(3n) {
                background: blue;
            }
            #items {
                display: inline-block;
                vertical-align: top;
                width: 300px;
                height: 250px;
                position: relative;
                background: grey;
            }
            #items3 {
                vertical-align: top;
                width: 300px;
                height: 250px;
                position: relative;
                background: grey;
            }
            #itemsHorizontal {
                width: 250px;
                height: 300px;
            }
            #itemsWithContentTemplate {
                width: 300px;
                height: 250px;
                position: relative;
                background: grey;
            }
            #scroll {
                height: 250px;
                width: 300px;
                overflow: auto;
                background: grey;
                position: absolute;
                left: 0;
                top: 0;
            }
            #bothScrolls {
                height: 600px;
                width: 300px;
                overflow: auto;
                background: grey;
                position: absolute;
                left: 0;
                top: 0;
            }
            #itemsWithBothScrolls {
                overflow: visible;
                width: 600px;
            }
            #bothScrolls2 {
                height: 300px;
                width: 300px;
                overflow: auto;
                background: grey;
                position: absolute;
                left: 500px;
                top: 500px;
            }
            #itemsWithBothScrolls2 {
                overflow: visible;
                width: 600px;
            }
            #parentSortable {
                display: inline-block;
                vertical-align: top;
                width: 300px;
                height: 250px;
                position: absolute;
                top: 0;
                left: 0;
                background: grey;
            }
            #nestedSortable {
                display: inline-block;
                vertical-align: top;
                width: 300px;
                height: 250px;
                position: relative;
                background: grey;
            }
            #itemsHorizontal .item {
                width: 30px;
                height: 300px;
                display: inline-block;
            }
            #itemsWithScroll .draggable {
                height: 50px;
            }
            #bothScrolls .draggable,
            #bothScrolls2 .draggable {
                height: 50px;
                width: 600px;
            }
        </style>
        <div id="container">
            <div id="items">
                <div id="item1" class="draggable colored-item">item1</div>
                <div id="item2" class="draggable colored-item">item2</div>
                <div id="item3" class="draggable colored-item">item3</div>
            </div>
            <div id="items2">
                <div id="item4" class="draggable colored-item">item4</div>
                <div id="item5" class="draggable colored-item">item5</div>
                <div id="item6" class="draggable colored-item">item6</div>
            </div>
        </div>
        <div id="items3"></div>
        <div id="itemsHorizontal">
            <div class="item">item1</div><div class="item">item2</div><div class="item">item3</div>
        </div>
        <div id="itemsWithContentTemplate">
            <div data-options="dxTemplate:{ name:'content' }">
                <div id="item11" class="draggable colored-item">item1</div>
                <div id="item12" class="draggable colored-item">item2</div>
                <div id="item13" class="draggable colored-item">item3</div>
            </div>
        </div>
        <div id="scroll">
            <div id="itemsWithScroll">
                <div id="item21" class="draggable colored-item">item1
                </div><div id="item22" class="draggable colored-item">item2
                </div><div id="item23" class="draggable colored-item">item3
                </div><div id="item24" class="draggable colored-item">item4
                </div><div id="item25" class="draggable colored-item">item5
                </div><div id="item26" class="draggable colored-item">item6
                </div><div id="item27" class="draggable colored-item">item7
                </div><div id="item28" class="draggable colored-item">item8
                </div><div id="item31" class="draggable colored-item">item9
                </div><div id="item32" class="draggable colored-item">item10</div>
            </div>
        </div>
        <div id="bothScrolls">
            <div id="itemsWithBothScrolls">
                <div id="item40" class="draggable colored-item">item0</div>
                <div id="item41" class="draggable colored-item">item1</div>
                <div id="item42" class="draggable colored-item">item2</div>
                <div id="item43" class="draggable colored-item">item3</div>
                <div id="item44" class="draggable colored-item">item4</div>
                <div id="item45" class="draggable colored-item">item5</div>
                <div id="item46" class="draggable colored-item">item6</div>
                <div id="item47" class="draggable colored-item">item7</div>
                <div id="item48" class="draggable colored-item">item8</div>
                <div id="item49" class="draggable colored-item">item9</div>
            </div>
        </div>
        <div id="bothScrolls2">
            <div id="itemsWithBothScrolls2">
                <div id="item50" class="draggable colored-item">item0</div>
                <div id="item51" class="draggable colored-item">item1</div>
                <div id="item52" class="draggable colored-item">item2</div>
                <div id="item53" class="draggable colored-item">item3</div>
                <div id="item54" class="draggable colored-item">item4</div>
                <div id="item55" class="draggable colored-item">item5</div>
                <div id="item56" class="draggable colored-item">item6</div>
                <div id="item57" class="draggable colored-item">item7</div>
                <div id="item58" class="draggable colored-item">item8</div>
                <div id="item59" class="draggable colored-item">item9</div>
            </div>
        </div>
        <div id="parentSortable">
            <div id="item1" class="draggable colored-item">item1</div>
            <div id="item2" class="draggable colored-item">item2</div>

            <div id="nestedSortable" class="subgroup">
                <div id="item3" class="draggable colored-item">item3</div>
                <div id="item4" class="draggable colored-item">item4</div>
            </div>
        </div>
        `;

    $('#qunit-fixture').html(markup);
    $('#items2').css({
        display: 'inline-block',
        verticalAlign: 'top',
        width: '300px',
        height: '250px',
        position: 'relative',
        background: 'grey'
    });
    fx.off = true;
});

const SORTABLE_CLASS = 'dx-sortable';
const PLACEHOLDER_CLASS = 'dx-sortable-placeholder';
const PLACEHOLDER_SELECTOR = `.${PLACEHOLDER_CLASS}`;
const MAX_INTEGER = 2147483647;

const moduleConfig = {
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-visible');
        this.$element = $('#items');

        this.createSortable = (options) => {
            return this.sortableInstance = this.$element.dxSortable(options).dxSortable('instance');
        };
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-visible');
        this.sortableInstance && this.sortableInstance.dispose();
    }
};

const crossComponentModuleConfig = {
    createComponent: function(componentName, options, $element) {
        const instance = ($element || this.$element)[componentName](options)[componentName]('instance');
        this.instances.push(instance);
        return instance;
    },
    beforeEach: function() {
        $('#qunit-fixture').addClass('qunit-fixture-visible');

        this.instances = [];
        this.$element = $('#items');
        this.createSortable = this.createComponent.bind(this, 'dxSortable');
        this.createDraggable = this.createComponent.bind(this, 'dxDraggable');
    },
    afterEach: function() {
        $('#qunit-fixture').removeClass('qunit-fixture-visible');
        this.instances.forEach((instance) => {
            instance.dispose();
        });
    }
};

QUnit.module('rendering', moduleConfig, () => {

    QUnit.test('Element has class', function(assert) {
        assert.ok(this.createSortable().$element().hasClass(SORTABLE_CLASS));
    });

    QUnit.test('Drag template - check args', function(assert) {
        // arrange
        const dragTemplate = sinon.spy(() => {
            return $('<div>');
        });

        this.createSortable({
            filter: '.draggable',
            dragTemplate: dragTemplate
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down().move(10, 0);

        // assert
        assert.strictEqual(dragTemplate.callCount, 1, 'drag template is called');
        assert.strictEqual($(dragTemplate.getCall(0).args[0].itemElement).get(0), items.get(0), 'itemElement arg');
        assert.strictEqual(dragTemplate.getCall(0).args[0].fromIndex, 0, 'fromIndex arg');
        assert.strictEqual($(dragTemplate.getCall(0).args[1]).get(0), $('body').children('.dx-sortable-dragging').get(0), 'second arg');
    });

    // T826089
    QUnit.test('Asynchronous drag template (React)', function(assert) {
        // arrange
        let $dragContainer;

        this.createSortable({
            dragTemplate: function(options, $container) {
                $dragContainer = $container;
            }
        });

        const $items = this.$element.children();

        // act
        pointerMock($items.eq(0)).start().down().move(10, 0);
        $('<div>').addClass('my-drag-item').appendTo($dragContainer);

        // assert
        const $sortableDragging = $('body').children('.dx-sortable-dragging');
        assert.strictEqual($sortableDragging.length, 1, 'body contains dx-sortable-dragging');
        assert.strictEqual($sortableDragging.hasClass('dx-sortable-clone'), true, 'dx-sortable-dragging has dx-sortable-clone class');
        assert.strictEqual($sortableDragging.children('.my-drag-item').length, 1, 'dx-sortable-dragging contains my-drag-item');
    });

    QUnit.test('Default drag template', function(assert) {
        // arrange
        this.createSortable({
        });

        const $items = this.$element.children();

        // act
        pointerMock($items.eq(0)).start().down().move(10, 0);

        // assert
        const $draggingElement = $('.dx-sortable-dragging');
        assert.ok($draggingElement.hasClass('dx-sortable-clone'), 'clone class');
        assert.equal($draggingElement.css('z-index'), MAX_INTEGER, 'z-index');
        assert.strictEqual($draggingElement.text(), 'item1', 'text is correct');
        assert.strictEqual($draggingElement.outerWidth(), $items.eq(0).outerWidth(), 'width is correct');
        assert.strictEqual($draggingElement.outerHeight(), $items.eq(0).outerHeight(), 'height is correct');
        assert.strictEqual($items.get(0).style.width, '', 'width style does not exist in item');
        assert.strictEqual($draggingElement.children().get(0).style.width, '300px', 'width style exists in dragging item');
        assert.strictEqual($items.get(0).style.height, '', 'height style does not exist in item');
        assert.strictEqual($draggingElement.children().get(0).style.height, '30px', 'height style exists in dragging item');
    });

    QUnit.test('While dragging cursor should be \'grabbing\'', function(assert) {
        // arrange
        this.createSortable({});

        // act
        pointerMock(this.$element.children().eq(0)).start().down().move(10, 0);

        // assert
        assert.equal($('.dx-sortable-dragging').children().first().css('cursor'), 'grabbing', 'cursor is grabbing');
    });

    QUnit.test('The selector is specific enough to override the style applied to handle element', function(assert) {
        // arrange
        $('<div>Drag</div>').addClass('default').appendTo(this.$element);

        this.createSortable({
            handle: '.default'
        });

        // act
        pointerMock(this.$element.find('.default').eq(0)).start().down().move(10, 0);

        // assert
        assert.equal($('.dx-sortable-dragging').find('.default').eq(0).css('cursor'), 'grabbing', 'cursor is grabbing');
    });

    QUnit.test('Elements should have \'user-select: auto\' style (T862255)', function(assert) {
        // arrange
        this.createSortable();

        // assert
        assert.equal(this.$element.find('.draggable').eq(0).css('user-select'), 'auto', 'user-select is auto');
    });
});

QUnit.module('allowReordering', moduleConfig, () => {

    QUnit.test('allowReordering = false when dropFeedbackMode is \'push\'', function(assert) {
        // arrange
        const onDragChangeSpy = sinon.spy();
        const onReorderSpy = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            allowReordering: false,
            dropFeedbackMode: 'push',
            moveItemOnDrop: true,
            onDragChange: onDragChangeSpy,
            onReorder: onReorderSpy
        });

        // act
        const pointer = pointerMock(this.$element.children().first()).start().down().move(0, 65);

        // assert
        assert.strictEqual(onDragChangeSpy.callCount, 0, 'onDragChange event is not called');
        assert.strictEqual(this.$element.children().get(1).style.transform, '', 'item position is not changed');

        // act
        pointer.up();

        // assert
        assert.strictEqual(onReorderSpy.callCount, 0, 'onReorder event is not called');
        assert.strictEqual(this.$element.children().first().text(), 'item1', 'first item is not changed');
    });

    QUnit.test('allowReordering = false when dropFeedbackMode is \'indicate\'', function(assert) {
        // arrange
        const onDragChangeSpy = sinon.spy();
        const onReorderSpy = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            allowReordering: false,
            dropFeedbackMode: 'indicate',
            moveItemOnDrop: true,
            onDragChange: onDragChangeSpy,
            onReorder: onReorderSpy
        });

        // act
        const pointer = pointerMock(this.$element.children().first()).start().down().move(0, 65);

        // assert
        assert.strictEqual(onDragChangeSpy.callCount, 0, 'onDragChange event is not called');
        assert.strictEqual($('.dx-sortable-placeholder').length, 0, 'placeholder does not exist');

        // act
        pointer.up();

        // assert
        assert.strictEqual(onReorderSpy.callCount, 0, 'onReorder event is not called');
        assert.strictEqual(this.$element.children().first().text(), 'item1', 'first item is not changed');
    });

    QUnit.test('allowReordering = false when allowDropInsideItem is true', function(assert) {
        // arrange
        const onDragChangeSpy = sinon.spy();

        this.createSortable({
            allowReordering: false,
            allowDropInsideItem: true,
            onDragChange: onDragChangeSpy
        });

        // act
        const pointer = pointerMock(this.$element.children().first()).start().down(15, 15).move(0, 50);

        // assert
        // assert
        assert.strictEqual(onDragChangeSpy.callCount, 0, 'onDragChange event is not called');
        assert.strictEqual($('.dx-sortable-placeholder').length, 0, 'placeholder does not exist');

        // act
        pointer.move(0, 10);

        // assert
        assert.strictEqual(onDragChangeSpy.callCount, 1, 'onDragChange event is called');
        assert.strictEqual($('.dx-sortable-placeholder.dx-sortable-placeholder-inside').length, 1, 'placeholder exists');
    });

    QUnit.test('Move to root if allowReordering is false and allowDropInsideItem is true', function(assert) {
        // arrange
        const onDragChangeSpy = sinon.spy();

        this.createSortable({
            allowReordering: false,
            allowDropInsideItem: true,
            onDragChange: onDragChangeSpy
        });

        // act
        const pointer = pointerMock(this.$element.children().eq(1)).start().down(15, 45).move(0, -30);

        // assert
        assert.strictEqual(onDragChangeSpy.callCount, 1, 'onDragChange event is not called');
        assert.strictEqual(onDragChangeSpy.getCall(0).args[0].dropInsideItem, true, 'onDragChange dropInsideItem arg is true');
        assert.strictEqual(onDragChangeSpy.getCall(0).args[0].fromIndex, 1, 'onDragChange from arg');
        assert.strictEqual(onDragChangeSpy.getCall(0).args[0].toIndex, 0, 'onDragChange toIndex arg');
        assert.strictEqual($('.dx-sortable-placeholder').length, 1, 'inside placeholder exists');

        // act
        pointer.move(0, -10);

        // assert
        assert.strictEqual(onDragChangeSpy.callCount, 2, 'onDragChange event is called');
        assert.strictEqual(onDragChangeSpy.getCall(1).args[0].dropInsideItem, false, 'onDragChange dropInsideItem arg is false');
        assert.strictEqual(onDragChangeSpy.getCall(1).args[0].fromIndex, 1, 'onDragChange from arg');
        assert.strictEqual(onDragChangeSpy.getCall(1).args[0].toIndex, 0, 'onDragChange toIndex arg');
        assert.strictEqual($('.dx-sortable-placeholder:not(.dx-sortable-placeholder-inside)').length, 1, 'placeholder exists');
    });

    QUnit.test('option changing', function(assert) {
        // arrange
        const sortable = this.createSortable({
            filter: '.draggable',
            moveItemOnDrop: true
        });

        // act
        sortable.option('allowReordering', false);
        const pointer = pointerMock(this.$element.children().first()).start().down().move(0, 65);

        // assert
        assert.strictEqual(this.$element.children().get(1).style.transform, '', 'item position is not changed');

        // act
        pointer.up();

        // assert
        assert.strictEqual(this.$element.children().first().text(), 'item1', 'first item is not changed');
    });

    QUnit.test('Move to top if allowReordering is false', function(assert) {
        // arrange
        const onDragChangeSpy = sinon.spy();

        this.createSortable({
            allowReordering: false,
            dropFeedbackMode: 'indicate',
            onDragChange: onDragChangeSpy
        });

        // act
        pointerMock(this.$element.children().eq(1)).start().down(15, 45).move(0, -45);

        // assert
        assert.strictEqual(onDragChangeSpy.callCount, 0, 'onDragChange event is not called');
        assert.strictEqual($('.dx-sortable-placeholder').length, 0, 'placeholder does not exist');
    });

    // T969161
    QUnit.test('The gesture cover cursor should be correct when viewport container is specified and it is before the sortable.', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test is not actual for mobile devices');
            return;
        }

        // arrange;
        const origViewPort = viewPort.value();

        try {
            viewPort.value($('<div>').addClass('dx-viewport').prependTo($('body')));
            this.createSortable();

            // act
            pointerMock(this.$element.children().first()).start().down().move(0, 65);

            // assert
            const $gestureCover = $('.dx-gesture-cover');
            const $cloneElement = $('.dx-viewport').find('.dx-sortable-dragging');

            assert.strictEqual($cloneElement.length, 1, 'has dragging element');
            assert.strictEqual($gestureCover.length, 1, 'has gesture cover');
            assert.strictEqual($gestureCover.css('cursor'), 'grabbing', 'gesture cover cursor');
        } finally {
            viewPort.value(origViewPort);
        }
    });
});

QUnit.module('placeholder and source', moduleConfig, () => {

    QUnit.test('Source item if filter is not defined', function(assert) {
        // arrange
        this.createSortable({
            dropFeedbackMode: 'push'
        });

        let $items = this.$element.children();
        const $dragItemElement = $items.eq(0);

        // assert
        assert.strictEqual($items.length, 3, 'item count');

        // act
        pointerMock($dragItemElement).start().down().move(10, 0);

        // assert
        $items = this.$element.children();
        const $source = $items.eq(0);
        assert.strictEqual($items.length, 3, 'item count');
        assert.ok($source.hasClass('dx-sortable-source-hidden'), 'source item is hidden');
    });

    QUnit.test('Source item if content template is defined', function(assert) {
        // arrange
        this.$element = $('#itemsWithContentTemplate');

        this.createSortable({
            dropFeedbackMode: 'push'
        });

        let $items = this.$element.children().children();
        const $dragItemElement = $items.eq(0);

        // assert
        assert.strictEqual($items.length, 3, 'item count');

        // act
        pointerMock($dragItemElement).start().down().move(10, 0);

        // assert
        $items = this.$element.children().children();
        const $source = $items.eq(0);
        assert.strictEqual($items.length, 3, 'item count');
        assert.ok($source.hasClass('dx-sortable-source-hidden'), 'source item is hidden');
    });

    QUnit.test('Source item', function(assert) {
        // arrange
        this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable'
        });

        let $items = this.$element.children();
        const $dragItemElement = $items.eq(0);

        // assert
        assert.strictEqual($items.length, 3, 'item count');

        // act
        pointerMock($dragItemElement).start().down().move(10, 0);

        // assert
        $items = this.$element.children();
        const $source = $items.eq(0);
        assert.strictEqual($items.length, 3, 'item count');
        assert.ok($source.hasClass('dx-sortable-source-hidden'), 'source item is hidden');
    });

    ['push', 'indicate'].forEach(dropFeedBackMode => {
        [[null, 1], [1, null], [1, 0], [null, -1]].forEach(fromIndexes => {
            QUnit.test(`Source item if fromIndex is assigned from ${fromIndexes[0]} to ${fromIndexes[1]} and if dropFeedbackMode is ${dropFeedBackMode}`, function(assert) {
                // arrange
                const sortable = this.createSortable({
                    dropFeedbackMode: dropFeedBackMode,
                    filter: '.draggable'
                });

                // act
                sortable.option('fromIndex', fromIndexes[0]);
                sortable.option('fromIndex', fromIndexes[1]);

                // assert
                const $items = this.$element.children();
                assert.strictEqual($items.length, 3, 'item count');
                for(let i = 0; i < 3; i++) {
                    const isSourceItem = (i === fromIndexes[1]);
                    const isSourceHidden = isSourceItem && dropFeedBackMode === 'push';
                    assert.strictEqual($items.eq(i).hasClass('dx-sortable-source-hidden'), isSourceHidden, `item ${i} hidden class`);
                    assert.strictEqual($items.eq(i).hasClass('dx-sortable-source'), isSourceItem, `item ${i} source class`);
                }
            });
        });
    });

    QUnit.test('Initial placeholder if dropFeedbackMode is indicate', function(assert) {
        // arrange

        this.createSortable({
            dropFeedbackMode: 'indicate'
        });

        let items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(0, 25);

        // assert
        items = this.$element.children();
        assert.strictEqual(items.length, 3, 'item count');
        assert.strictEqual($('.dx-sortable-placeholder').length, 0, 'there isn\'t a placeholder');

        pointerMock($dragItemElement).up();

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

        // assert
        items = this.$element.children();
        const $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count is not changed');
        assert.equal($placeholder.length, 1, 'placeholder exists');
        assert.equal($placeholder.css('z-index'), MAX_INTEGER, 'z-index');
        assert.ok($placeholder.next().hasClass('dx-sortable-dragging'), 'palceholder is before dragging');
        assert.equal($placeholder.get(0).style.height, '', 'placeholder height');
        assert.equal($placeholder.get(0).style.width, '300px', 'placeholder width');
        assert.equal($placeholder.get(0).style.transform, 'translate(0px, 60px)', 'placeholder position');
    });

    QUnit.test('Initial placeholder if allowDropInsideItem is true', function(assert) {
        // arrange
        let $placeholder;

        this.createSortable({
            allowDropInsideItem: true
        });

        let items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        const pointer = pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

        // assert
        items = this.$element.children();
        $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count');
        assert.ok($placeholder.hasClass('dx-sortable-placeholder'), 'element has placeholder class');
        assert.ok($placeholder.hasClass('dx-sortable-placeholder-inside'), 'element has placeholder-inside class');
        assert.equal($placeholder.get(0).style.height, '30px', 'placeholder height');
        assert.equal($placeholder.get(0).style.width, '300px', 'placeholder width');
        assert.equal($placeholder.get(0).style.transform, 'translate(0px, 30px)', 'placeholder position');

        // act
        pointer.move(0, 15);

        // assert
        items = this.$element.children();
        $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count');
        assert.equal($placeholder.length, 1, 'placeholder exists');
        assert.notOk($placeholder.hasClass('dx-sortable-placeholder-inside'), 'element has not placeholder-inside class');
        assert.equal($placeholder.get(0).style.height, '', 'placeholder height');
        assert.equal($placeholder.get(0).style.width, '300px', 'placeholder width');
        assert.equal($placeholder.get(0).style.transform, 'translate(0px, 60px)', 'placeholder position');
    });

    QUnit.test('Initial placeholder if dropFeedbackMode is indicate and itemOrientation is horizontal', function(assert) {
        // arrange
        this.$element = $('#itemsHorizontal');

        this.createSortable({
            dropFeedbackMode: 'indicate',
            itemOrientation: 'horizontal'
        });

        let items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(30, 0);

        // assert
        items = this.$element.children();
        const $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count');
        assert.equal($placeholder.length, 1, 'element has placeholder class');
        assert.equal($placeholder.get(0).style.height, '300px', 'placeholder height style');
        assert.equal($placeholder.get(0).style.width, '', 'placeholder width style');
        assert.equal($placeholder.get(0).style.transform, 'translate(60px, 500px)', 'placeholder position');
    });

    QUnit.test('Placeholder should be displayed correctly when dragging item to last position (dropFeedbackMode is indicate and itemOrientation is horiontal)', function(assert) {
        // arrange
        let items;

        this.$element = $('#itemsHorizontal');

        this.createSortable({
            dropFeedbackMode: 'indicate',
            itemOrientation: 'horizontal'
        });

        items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        pointerMock($dragItemElement).start().down(0, 0).move(100, 0);

        // assert
        items = this.$element.children();
        const $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count');
        assert.equal($placeholder.length, 1, 'element has placeholder class');
        assert.equal($placeholder.get(0).style.height, '300px', 'placeholder height style');
        assert.equal($placeholder.get(0).style.width, '', 'placeholder width style');
        assert.deepEqual(translator.locate($placeholder), { left: 90, top: 500 }, 'placeholder position');
    });

    QUnit.test('Source classes toggling', function(assert) {
        // arrange
        this.createSortable({
            dropFeedbackMode: 'push'
        });

        let items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        pointerMock($dragItemElement).start().down().move(10, 0);

        // assert
        items = this.$element.children();
        assert.ok(items.eq(0).hasClass('dx-sortable-source'), 'element has source class');
        assert.ok(items.eq(0).hasClass('dx-sortable-source-hidden'), 'element has source-hidden class');

        // act
        pointerMock($dragItemElement).up();

        // assert
        items = this.$element.children();
        assert.notOk(items.eq(0).hasClass('dx-sortable-source'), 'element has not source class');
        assert.notOk(items.eq(0).hasClass('dx-sortable-source-hidden'), 'element has not source-hidden class');
    });

    QUnit.test('Move items during dragging', function(assert) {
        // arrange
        fx.off = false;

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'push'
        });

        let items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // assert
        assert.strictEqual(items.length, 3, 'item count');

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

        // assert
        items = this.$element.children();
        const $item = items.eq(0);
        assert.strictEqual(items.length, 3, 'item count');
        assert.strictEqual($item.attr('id'), 'item1', 'first item is a source');
        assert.ok($item.hasClass('dx-sortable-source-hidden'), 'has source-hidden class');

        assert.strictEqual(items[0].style.transform, '', 'items 1 is not moved');
        assert.strictEqual(items[1].style.transform, 'translate(0px, -30px)', 'items 2 is moved up');
        assert.strictEqual(items[1].style.transitionProperty, 'transform', 'apply animation to transform only');
        assert.strictEqual(items[1].style.transitionDuration, '300ms', 'items 2 transition duration');
        assert.strictEqual(items[1].style.transitionTimingFunction, 'ease', 'items 2 transition timing function');
        assert.strictEqual(items[2].style.transform, '', 'items 3 is not moved');
    });

    QUnit.test('Move items during dragging with custom animation', function(assert) {
        // arrange
        fx.off = false;

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'push',
            animation: {
                duration: 500,
                easing: 'ease-in-out'
            }
        });

        let items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // assert
        assert.strictEqual(items.length, 3, 'item count');

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

        // assert
        items = this.$element.children();

        assert.strictEqual(items[1].style.transform, 'translate(0px, -30px)', 'items 2 is moved up');
        assert.strictEqual(items[1].style.transitionDuration, '500ms', 'items 2 transition duration');
        assert.strictEqual(items[1].style.transitionTimingFunction, 'ease-in-out', 'items 2 transition timing function');
    });

    QUnit.test('Move items during dragging if content tempalte is defined', function(assert) {
        // arrange

        this.$element = $('#itemsWithContentTemplate');

        this.createSortable({
            dropFeedbackMode: 'push'
        });

        let items = this.$element.children().children();
        const $dragItemElement = items.eq(0);

        // assert
        assert.strictEqual(items.length, 3, 'item count');

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(15, 1000);

        // assert
        items = this.$element.children().children();
        const $item = items.eq(0);
        assert.strictEqual(items.length, 3, 'item count');
        assert.strictEqual($item.attr('id'), 'item11', 'first item is a source');
        assert.ok($item.hasClass('dx-sortable-source-hidden'), 'has source-hidden class');

        assert.strictEqual(items[0].style.transform, '', 'items 1 is not moved');
        assert.strictEqual(items[1].style.transform, 'translate(0px, -30px)', 'items 2 is moved up');
        assert.strictEqual(items[2].style.transform, 'translate(0px, -30px)', 'items 3 is moved up');
    });

    QUnit.test('Drop when dropFeedbackMode is push', function(assert) {
        // arrange

        this.createSortable({
            filter: '.draggable',
            moveItemOnDrop: true,
            dropFeedbackMode: 'push'
        });

        let items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(0, 30).up();

        // assert
        items = this.$element.children();
        assert.strictEqual(items.eq(0).attr('id'), 'item2', 'second item');
        assert.strictEqual(items.eq(1).attr('id'), 'item1', 'first item');
        assert.strictEqual(items.eq(2).attr('id'), 'item3', 'third item');
    });

    QUnit.test('Drop when dropFeedbackMode is indicate', function(assert) {
        // arrange

        this.createSortable({
            filter: '.draggable',
            moveItemOnDrop: true,
            dropFeedbackMode: 'indicate'
        });

        let items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(0, 30).up();

        // assert
        items = this.$element.children();
        assert.strictEqual(items.eq(0).attr('id'), 'item2', 'second item');
        assert.strictEqual(items.eq(1).attr('id'), 'item1', 'first item');
        assert.strictEqual(items.eq(2).attr('id'), 'item3', 'third item');
    });

    QUnit.test('Remove placeholder after the drop end', function(assert) {
        // arrange
        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate'
        });

        const items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

        // assert
        assert.strictEqual($('.dx-sortable-placeholder').length, 1, 'there is a placeholder element');

        // act
        pointerMock($dragItemElement).up();

        // assert
        assert.strictEqual($('.dx-sortable-placeholder').length, 0, 'there isn\'t a placeholder element');
    });

    QUnit.test('The source item should be correct after drag and drop items', function(assert) {
        // arrange
        let $item;

        this.createSortable({
            filter: '.draggable'
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down().move(10, 0);

        // assert
        $item = items.eq(0);
        assert.ok($item.hasClass('dx-sortable-source'), 'there is a source');
        assert.strictEqual($item.attr('id'), 'item1', 'source id');

        // arrange
        pointerMock(items.eq(0)).up();

        // act
        pointerMock(items.eq(1)).start().down().move(10, 0);

        $item = items.eq(1);
        assert.ok($item.hasClass('dx-sortable-source'), 'there is a source');
        assert.strictEqual($item.attr('id'), 'item2', 'placeholder id');
    });

    QUnit.test('Dragging an item to the last position when there is ignored (not draggable) item', function(assert) {
        // arrange
        this.$element.append('<div id=\'item4\'></div>');
        this.createSortable({
            filter: '.draggable',
            moveItemOnDrop: true
        });

        let items = this.$element.children();

        // assert
        assert.strictEqual(items.length, 4, 'item count');

        // act
        const pointer = pointerMock(items.eq(0)).start().down().move(0, 90);

        // assert
        items = this.$element.children();
        assert.ok(items.eq(0).hasClass('dx-sortable-source'), 'source item');
        assert.strictEqual(items.eq(3).attr('id'), 'item4', 'ignored item');

        // act
        pointer.up();

        // assert
        items = this.$element.children();
        assert.strictEqual(items.eq(2).attr('id'), 'item1', 'source item');
        assert.strictEqual(items.eq(3).attr('id'), 'item4', 'ignored item');
    });

    QUnit.test('Dragging an item to the last position when there is ignored (not draggable) item and dropFeedbackMode option is \'indicate\'', function(assert) {
        // arrange
        this.$element.append('<div id=\'item4\'></div>');
        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            moveItemOnDrop: true
        });

        let items = this.$element.children();

        // assert
        assert.strictEqual(items.length, 4, 'item count');

        // act
        const pointer = pointerMock(items.eq(0)).start().down().move(0, 90);

        // assert
        items = this.$element.children();
        assert.equal($('.dx-sortable-placeholder').length, 1, 'placeholder exists');
        assert.strictEqual(items.eq(3).attr('id'), 'item4', 'ignored item');

        // act
        pointer.up();

        // assert
        items = this.$element.children();
        assert.strictEqual(items.eq(2).attr('id'), 'item1', 'source item');
        assert.strictEqual(items.eq(3).attr('id'), 'item4', 'ignored item');
        assert.equal($('.dx-sortable-placeholder').length, 0, 'placeholder removed');
    });

    QUnit.test('Dragging an item when the next item is hidden (dropFeedbackMode is "indicate")', function(assert) {
        // arrange
        const $items = $('#items').children();
        const onDragChangeSpy = sinon.spy();

        $items.eq(1).hide();
        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            onDragChange: onDragChangeSpy
        });

        // act
        const pointer = pointerMock($items.eq(0)).start().down().move(0, 15);

        // assert
        let $placeholderElement = $('.dx-sortable-placeholder');
        assert.notOk($placeholderElement.is(':visible'), 'placeholder is hidden');

        // act
        pointer.move(0, 45);

        // assert
        $placeholderElement = $('.dx-sortable-placeholder');
        assert.ok($placeholderElement.is(':visible'), 'placeholder is visible');
        assert.strictEqual($placeholderElement.offset().top, 58, 'placeholder position top');
        assert.strictEqual(onDragChangeSpy.getCall(0).args[0].toIndex, 2, 'toIndex');
    });

    QUnit.test('Dragging an item when the prev item is hidden (dropFeedbackMode is "indicate")', function(assert) {
        // arrange
        const $items = $('#items').children();
        const onDragChangeSpy = sinon.spy();

        $items.eq(1).hide();
        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            onDragChange: onDragChangeSpy
        });

        // act
        const pointer = pointerMock($items.eq(2)).start().down(0, 55).move(0, -10);

        // assert
        let $placeholderElement = $('.dx-sortable-placeholder');
        assert.notOk($placeholderElement.is(':visible'), 'placeholder is hidden');

        // act
        pointer.move(0, -50);

        // assert
        $placeholderElement = $('.dx-sortable-placeholder');
        assert.ok($placeholderElement.is(':visible'), 'placeholder is visible');
        assert.strictEqual($placeholderElement.offset().top, 0, 'placeholder position top');
        assert.strictEqual(onDragChangeSpy.getCall(0).args[0].toIndex, 0, 'toIndex');
    });

    QUnit.test('Dragging an item to the last position when the last item is hidden (dropFeedbackMode is "indicate")', function(assert) {
        // arrange
        const $items = $('#items').children();
        const onDragChangeSpy = sinon.spy();

        $items.last().hide();
        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            onDragChange: onDragChangeSpy
        });

        // act
        pointerMock($items.eq(0)).start().down().move(0, 60);

        // assert
        const $placeholderElement = $('.dx-sortable-placeholder');
        assert.ok($placeholderElement.is(':visible'), 'placeholder is visible');
        assert.strictEqual($placeholderElement.offset().top, 58, 'placeholder position top');
        assert.strictEqual(onDragChangeSpy.getCall(0).args[0].toIndex, 2, 'toIndex');
    });

    QUnit.test('The placeholder should not be displayed for the last visible item when it is dragged (dropFeedbackMode is "indicate")', function(assert) {
        // arrange
        let $items = $('#items').children();

        $items.eq(1).hide();
        $items.eq(2).hide();
        $('#items').append(
            $('<div id="item4" class="draggable">item4</div>'),
            $('<div id="item5" class="draggable">item5</div>').css('display', 'none')
        );

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate'
        });
        $items = $('#items').children();

        // act
        pointerMock($items.eq(3)).start().down(0, 45).move(0, 15);

        // assert
        const $placeholderElement = $('.dx-sortable-placeholder');
        assert.notOk($placeholderElement.is(':visible'), 'placeholder is hidden');
    });
});

QUnit.module('Events', crossComponentModuleConfig, () => {

    QUnit.test('onDragChange - check args when dragging an item down', function(assert) {
        // arrange
        const onDragChange = sinon.spy();

        const data = {};
        this.createSortable({
            filter: '.draggable',
            data: data,
            onDragChange: onDragChange
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

        // assert
        const args = onDragChange.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
        assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 1, 'toIndex');
        assert.strictEqual(args[0].fromData, data, 'fromData');
        assert.strictEqual(args[0].toData, data, 'toData');
    });

    QUnit.test('onDragChange - check args when dragging an item up', function(assert) {
        // arrange
        const onDragChange = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            onDragChange: onDragChange
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(2)).start().down().move(0, 30);

        // assert
        const args = onDragChange.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(2), 'source element');
        assert.strictEqual(args[0].fromIndex, 2, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 1, 'toIndex');
    });

    QUnit.test('onDragChange - check args when dragging to last position', function(assert) {
        // arrange
        const onDragChange = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            onDragChange: onDragChange
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 90);

        // assert
        const args = onDragChange.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
        assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 2, 'toIndex');
    });

    QUnit.test('\'onDragChange\' option changing', function(assert) {
        // arrange
        const onDragChange = sinon.spy();

        const sortableInstance = this.createSortable({
            filter: '.draggable'
        });

        let items = this.$element.children();

        // act
        sortableInstance.option('onDragChange', onDragChange);

        // arrange
        items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

        // assert
        const args = onDragChange.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
        assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 1, 'toIndex');
    });

    QUnit.test('\'onDragChange\' event - not drag item when eventArgs.cancel is true', function(assert) {
        // arrange

        this.createSortable({
            filter: '.draggable',
            onDragChange: function(e) {
                e.cancel = true;
            }
        });

        let items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

        // assert
        items = this.$element.children();
        assert.strictEqual(items.eq(0).attr('id'), 'item1', 'first item');
        assert.strictEqual(items.eq(1).attr('id'), 'item2', 'second item');
        assert.strictEqual(items.eq(2).attr('id'), 'item3', 'third item');
    });

    QUnit.test('onDragEnd - check args when dragging an item down', function(assert) {
        // arrange
        const onDragEnd = sinon.spy();


        this.createSortable({
            filter: '.draggable',
            data: 'x',
            onDragEnd: onDragEnd
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 30).up();

        // assert
        const args = onDragEnd.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
        assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 1, 'toIndex');
        assert.strictEqual(args[0].fromData, 'x', 'fromData');
        assert.strictEqual(args[0].toData, 'x', 'toData');
        assert.strictEqual(args[0].dropInsideItem, false, 'dropInsideItem is false');
    });

    QUnit.test('onDragEnd - check args when dragging an item up', function(assert) {
        // arrange
        const onDragEnd = sinon.spy();


        this.createSortable({
            filter: '.draggable',
            onDragEnd: onDragEnd
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(2)).start().down().move(0, 30).up();

        // assert
        const args = onDragEnd.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(2), 'source element');
        assert.strictEqual(args[0].fromIndex, 2, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 1, 'toIndex');
    });

    QUnit.test('onDragEnd - check args when dragging to last position', function(assert) {
        // arrange
        const onDragEnd = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            onDragEnd: onDragEnd
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 90).up();

        // assert
        const args = onDragEnd.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
        assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 2, 'toIndex');
    });

    QUnit.test('onDragEnd with eventArgs.cancel is true - the draggable element should not change position', function(assert) {
        // arrange

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            moveItemOnDrop: true,
            onDragEnd: function(e) {
                e.cancel = true;
            }
        });

        let items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 30).up();

        // assert
        items = this.$element.children();
        assert.strictEqual(items.eq(0).attr('id'), 'item1', 'first item');
        assert.strictEqual(items.eq(1).attr('id'), 'item2', 'second item');
        assert.strictEqual(items.eq(2).attr('id'), 'item3', 'third item');
    });

    QUnit.test('onDragEnd - check args when dropping onto itself (dropFeedbackMode is \'indicate\')', function(assert) {
        // arrange
        const onDragEnd = sinon.spy();


        this.createSortable({
            dropFeedbackMode: 'indicate',
            filter: '.draggable',
            data: 'x',
            onDragEnd: onDragEnd
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(1)).start().down(45, 45).move(10, 0).up();

        // assert
        const args = onDragEnd.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(1), 'source element');
        assert.strictEqual(args[0].fromIndex, 1, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 1, 'toIndex');
        assert.strictEqual(args[0].fromData, 'x', 'fromData');
        assert.strictEqual(args[0].toData, 'x', 'toData');
        assert.strictEqual(args[0].dropInsideItem, false, 'dropInsideItem is false');
    });

    QUnit.test('The draggable element should not change position without moveItemOnDrop', function(assert) {
        // arrange

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate'
        });

        let items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 30).up();

        // assert
        items = this.$element.children();
        assert.strictEqual(items.eq(0).attr('id'), 'item1', 'first item');
        assert.strictEqual(items.eq(1).attr('id'), 'item2', 'second item');
        assert.strictEqual(items.eq(2).attr('id'), 'item3', 'third item');
    });

    QUnit.test('onDragEnd - check args when dragging inside item', function(assert) {
        // arrange
        const onDragEnd = sinon.spy();


        this.createSortable({
            allowDropInsideItem: true,
            onDragEnd: onDragEnd
        });

        const items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 30).up();

        // assert
        const args = onDragEnd.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
        assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 1, 'toIndex');
        assert.strictEqual(args[0].dropInsideItem, true, 'dropInsideItem');
    });

    QUnit.test('onPlaceholderPrepared - check args when dragging', function(assert) {
        // arrange
        const onPlaceholderPrepared = sinon.spy();


        this.createSortable({
            filter: '.draggable',
            onPlaceholderPrepared: onPlaceholderPrepared,
            dropFeedbackMode: 'indicate'
        });

        let items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

        // assert
        items = this.$element.children();
        const args = onPlaceholderPrepared.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
        assert.ok(args[0].placeholderElement, 'placeholder element exists');
        assert.ok(args[0].dragElement, 'dragging element exists');
        assert.deepEqual($(args[0].placeholderElement).get(0), $('body').children('.dx-sortable-placeholder').get(0), 'placeholder element');
        assert.deepEqual($(args[0].dragElement).get(0), $('body').children('.dx-sortable-dragging').get(0), 'dragging element');
        assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 1, 'toIndex');
    });

    QUnit.test('\'onPlaceholderPrepared\' option changing', function(assert) {
        // arrange
        const onPlaceholderPrepared = sinon.spy();

        const sortableInstance = this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate'
        });

        let items = this.$element.children();

        // act
        sortableInstance.option('onPlaceholderPrepared', onPlaceholderPrepared);

        // arrange
        items = this.$element.children();

        // act
        pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

        // assert
        items = this.$element.children();
        const args = onPlaceholderPrepared.getCall(0).args;
        assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
        assert.deepEqual($(args[0].placeholderElement).get(0), $('body').children('.dx-sortable-placeholder').get(0), 'placeholder element');
        assert.deepEqual($(args[0].dragElement).get(0), $('body').children('.dx-sortable-dragging').get(0), 'dragging element');
        assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
        assert.strictEqual(args[0].toIndex, 1, 'toIndex');
    });

    QUnit.test('onAdd - check args', function(assert) {
        // arrange
        const onAddSpy = sinon.spy();

        const sortable1 = this.createSortable({
            filter: '.draggable',
            data: 'x',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            data: 'y',
            moveItemOnDrop: true,
            onAdd: onAddSpy
        }, $('#items2'));

        // act
        const $sourceElement = sortable1.$element().children().eq(1);
        pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(350, 30).move(50, 0).up();

        // assert
        assert.strictEqual(onAddSpy.callCount, 1, 'onAdd is called');
        assert.deepEqual(onAddSpy.getCall(0).args[0].fromComponent, sortable1, 'sourceComponent');
        assert.deepEqual(onAddSpy.getCall(0).args[0].toComponent, sortable2, 'component');
        assert.strictEqual(onAddSpy.getCall(0).args[0].fromIndex, 1, 'fromIndex');
        assert.strictEqual(onAddSpy.getCall(0).args[0].toIndex, 2, 'toIndex');
        assert.strictEqual(onAddSpy.getCall(0).args[0].fromData, 'x', 'fromData');
        assert.strictEqual(onAddSpy.getCall(0).args[0].toData, 'y', 'toData');
        assert.strictEqual(onAddSpy.getCall(0).args[0].event.type, 'dxdragend', 'event');
        assert.strictEqual($(onAddSpy.getCall(0).args[0].itemElement).get(0), $sourceElement.get(0), 'itemElement');
        assert.strictEqual($(sortable2.element()).children('#item2').length, 1, 'item is added');
    });

    QUnit.test('onAdd on drop under empty sortable if scroll exists (T1034893)', function(assert) {
        $('#container').css({
            overflow: 'auto',
            width: 200
        });

        const onAddSpy = sinon.spy();

        const sortable1 = this.createSortable({
            filter: '.draggable',
            data: 'x',
            moveItemOnDrop: true,
            group: 'shared'
        }, $('#items'));


        $('#items2').children().remove();

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            data: 'y',
            moveItemOnDrop: true,
            onAdd: onAddSpy
        }, $('#items2'));
            // act
        const $sourceElement = sortable1.$element().children().eq(1);
        pointerMock($sourceElement).start({ x: 5, y: 5 }).down().move(0, 400).move(50, 0).up();

        // assert
        assert.strictEqual(onAddSpy.callCount, 1, 'onAdd is called');
        assert.deepEqual(onAddSpy.getCall(0).args[0].fromComponent, sortable1, 'sourceComponent');
        assert.deepEqual(onAddSpy.getCall(0).args[0].toComponent, sortable2, 'component');
        assert.strictEqual(onAddSpy.getCall(0).args[0].fromIndex, 1, 'fromIndex');
        assert.strictEqual(onAddSpy.getCall(0).args[0].toIndex, 0, 'toIndex');
        assert.strictEqual(onAddSpy.getCall(0).args[0].fromData, 'x', 'fromData');
        assert.strictEqual(onAddSpy.getCall(0).args[0].toData, 'y', 'toData');
        assert.strictEqual($(onAddSpy.getCall(0).args[0].itemElement).get(0), $sourceElement.get(0), 'itemElement');
        assert.strictEqual($(sortable2.element()).children().length, 1, 'item is added');
    });

    QUnit.test('onAdd - not add item when eventArgs.cancel is true', function(assert) {
        // arrange
        const onAddSpy = sinon.spy((e) => { e.cancel = true; });

        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true,
            onAdd: onAddSpy
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

        // assert
        assert.strictEqual(onAddSpy.callCount, 1, 'onAdd is called');
        assert.strictEqual($(sortable2.element()).children('#item1').length, 0, 'item isn\'t added');
    });

    QUnit.test('onAdd - not add item without moveItemOnDrop', function(assert) {
        // arrange
        const onAddSpy = sinon.spy();

        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            onAdd: onAddSpy
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

        // assert
        assert.strictEqual(onAddSpy.callCount, 1, 'onAdd is called');
        assert.strictEqual($(sortable2.element()).children('#item1').length, 0, 'item isn\'t added');
    });

    QUnit.test('onRemove - check args', function(assert) {
        // arrange
        const onRemoveSpy = sinon.spy();

        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            data: 'x',
            onRemove: onRemoveSpy
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            moveItemOnDrop: true,
            data: 'y',
            group: 'shared'
        }, $('#items2'));

        // act
        const $sourceElement = sortable1.$element().children().eq(1);
        pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(350, 30).move(50, 0).up();

        // assert
        assert.strictEqual(onRemoveSpy.callCount, 1, 'onRemove is called');
        assert.deepEqual(onRemoveSpy.getCall(0).args[0].toComponent, sortable2, 'targetComponent');
        assert.deepEqual(onRemoveSpy.getCall(0).args[0].fromComponent, sortable1, 'component');
        assert.strictEqual(onRemoveSpy.getCall(0).args[0].fromIndex, 1, 'fromIndex');
        assert.strictEqual(onRemoveSpy.getCall(0).args[0].toIndex, 2, 'toIndex');
        assert.strictEqual(onRemoveSpy.getCall(0).args[0].fromData, 'x', 'fromData');
        assert.strictEqual(onRemoveSpy.getCall(0).args[0].toData, 'y', 'toData');
        assert.strictEqual(onRemoveSpy.getCall(0).args[0].event.type, 'dxdragend', 'event');
        assert.strictEqual($(onRemoveSpy.getCall(0).args[0].itemElement).get(0), $sourceElement.get(0), 'itemElement');
        assert.strictEqual($(sortable1.element()).children('#item2').length, 0, 'item is removed');
    });

    QUnit.test('onRemove - not add item when eventArgs.cancel is true', function(assert) {
        // arrange
        const onRemoveSpy = sinon.spy((e) => { e.cancel = true; });

        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            onRemove: onRemoveSpy
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

        // assert
        assert.strictEqual(onRemoveSpy.callCount, 1, 'onRemove is called');
        assert.strictEqual($(sortable1.element()).children('#item1').length, 1, 'item isn\'t removed');
        assert.strictEqual($(sortable1.element()).children('#item1').attr('class'), 'draggable colored-item', 'source item hasn\'t dx-sortable-source class');
        assert.strictEqual($(sortable2.element()).children('#item1').attr('class'), 'draggable colored-item', 'cloned source item hasn\'t dx-sortable-source class');
    });

    QUnit.test('onRemove - not add item without moveItemOnDrop', function(assert) {
        // arrange
        const onRemoveSpy = sinon.spy();

        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            onRemove: onRemoveSpy
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

        // assert
        assert.strictEqual(onRemoveSpy.callCount, 1, 'onRemove is called');
        assert.strictEqual($(sortable1.element()).children('#item1').length, 1, 'item isn\'t removed');
        assert.strictEqual($(sortable1.element()).children('#item1').attr('class'), 'draggable colored-item', 'source item hasn\'t dx-sortable-source class');
        assert.strictEqual($(sortable2.element()).children('#item1').length, 0, 'source item is not added to second sortable');
    });

    QUnit.test('onReorder - check args', function(assert) {
        // arrange
        const onReorderSpy = sinon.spy();

        const sortable = this.createSortable({
            filter: '.draggable',
            data: 'x',
            onReorder: onReorderSpy,
            moveItemOnDrop: true
        }, $('#items'));

        // act
        const $sourceElement = sortable.$element().children().eq(0);

        pointerMock($sourceElement).start().down().move(0, 40).move(0, 10).up();

        // assert
        assert.strictEqual(onReorderSpy.callCount, 1, 'onRemove is called');
        assert.strictEqual(onReorderSpy.getCall(0).args[0].fromIndex, 0, 'fromIndex');
        assert.strictEqual(onReorderSpy.getCall(0).args[0].toIndex, 1, 'toIndex');
        assert.strictEqual(onReorderSpy.getCall(0).args[0].fromData, 'x', 'fromData');
        assert.strictEqual(onReorderSpy.getCall(0).args[0].toData, 'x', 'toData');
        assert.strictEqual(onReorderSpy.getCall(0).args[0].event.type, 'dxdragend', 'event');
        assert.strictEqual($(onReorderSpy.getCall(0).args[0].itemElement).get(0), $sourceElement.get(0), 'itemElement');
    });

    ['push', 'indicate'].forEach((dropFeedbackMode) => {
        QUnit.test(`onReorder - eventArgs.promise is resolved (dropFeedbackMode = ${dropFeedbackMode})`, function(assert) {
            // arrange
            const d = $.Deferred();
            const onReorderSpy = sinon.spy((e) => {
                e.promise = d.promise();
            });

            const sortable = this.createSortable({
                filter: '.draggable',
                data: 'x',
                onReorder: onReorderSpy,
                moveItemOnDrop: true,
                dropFeedbackMode: dropFeedbackMode
            }, $('#items'));

            const $sourceElement = sortable.$element().children().eq(0);

            // act
            pointerMock($sourceElement).start().down().move(0, 40).move(0, 10).up();

            // assert
            let $sortableDragging = $('body').children('.dx-sortable-dragging');
            assert.strictEqual($sortableDragging.length, 1, 'there is a drag element');
            assert.strictEqual(onReorderSpy.callCount, 1, 'onRemove is called');
            assert.ok(onReorderSpy.getCall(0).args[0].promise, 'event args - promise');
            assert.ok($sourceElement.hasClass('dx-sortable-source'), 'source element');

            if(dropFeedbackMode === 'push') {
                assert.ok($sourceElement.hasClass('dx-sortable-source-hidden'), 'source element is hidden');
            }

            // act
            d.resolve();

            // assert
            $sortableDragging = $('body').children('.dx-sortable-dragging');
            assert.strictEqual($sortableDragging.length, 0, 'there is not a drag element');
            assert.notOk($sourceElement.hasClass('dx-sortable-source'), 'element has not source class');
            assert.notOk($sourceElement.hasClass('dx-sortable-source-hidden'), 'element has not source-hidden class');
        });

        QUnit.test(`onReorder - eventArgs.promise is rejected (dropFeedbackMode = ${dropFeedbackMode})`, function(assert) {
            // arrange
            const d = $.Deferred();
            const onReorderSpy = sinon.spy((e) => {
                e.promise = d.promise();
            });

            const sortable = this.createSortable({
                filter: '.draggable',
                data: 'x',
                onReorder: onReorderSpy,
                moveItemOnDrop: true,
                dropFeedbackMode: dropFeedbackMode
            }, $('#items'));

            const $sourceElement = sortable.$element().children().eq(0);

            // act
            pointerMock($sourceElement).start().down().move(0, 40).move(0, 10).up();

            // assert
            let $sortableDragging = $('body').children('.dx-sortable-dragging');
            assert.strictEqual($sortableDragging.length, 1, 'there is a drag element');
            assert.strictEqual(onReorderSpy.callCount, 1, 'onRemove is called');
            assert.ok(onReorderSpy.getCall(0).args[0].promise, 'event args - promise');
            assert.ok($sourceElement.hasClass('dx-sortable-source'), 'source element');

            if(dropFeedbackMode === 'push') {
                assert.ok($sourceElement.hasClass('dx-sortable-source-hidden'), 'source element is hidden');
            }

            // act
            d.reject();

            // assert
            $sortableDragging = $('body').children('.dx-sortable-dragging');
            assert.strictEqual($sortableDragging.length, 0, 'there is not a drag element');
            assert.notOk($sourceElement.hasClass('dx-sortable-source'), 'element has not source class');
            assert.notOk($sourceElement.hasClass('dx-sortable-source-hidden'), 'element has not source-hidden class');
        });
    });

    QUnit.test('onDragMove, onDragEnd, onDragChange, onReorder - check itemData arg', function(assert) {
        // arrange
        const itemData = { test: true };
        const options = {
            filter: '.draggable',
            onDragStart: function(e) {
                e.itemData = itemData;
            },
            onDragMove: sinon.spy(),
            onDragEnd: sinon.spy(),
            onDragChange: sinon.spy(),
            onReorder: sinon.spy()
        };

        const sortable = this.createSortable(options, $('#items'));

        // act
        const $sourceElement = sortable.$element().children().eq(0);
        pointerMock($sourceElement).start().down().move(0, 25).move(0, 5).up();

        // assert
        assert.strictEqual(options.onDragMove.getCall(0).args[0].itemData, itemData, 'itemData in onDragMove event arguments');
        assert.strictEqual(options.onDragEnd.getCall(0).args[0].itemData, itemData, 'itemData in onDragEnd event arguments');
        assert.strictEqual(options.onDragChange.getCall(0).args[0].itemData, itemData, 'itemData in onDragChange event arguments');
        assert.strictEqual(options.onReorder.getCall(0).args[0].itemData, itemData, 'itemData in onReorder event arguments');
    });

    QUnit.test('onAdd, onRemove - check itemData arg', function(assert) {
        // arrange
        const itemData = { test: true };
        const onAddSpy = sinon.spy();
        const onRemoveSpy = sinon.spy();

        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            onDragStart: function(e) {
                e.itemData = itemData;
            },
            onRemove: onRemoveSpy
        }, $('#items'));

        this.createSortable({
            filter: '.draggable',
            group: 'shared',
            onAdd: onAddSpy
        }, $('#items2'));

        // act
        const $sourceElement = sortable1.$element().children().eq(1);
        pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(350, 30).move(50, 0).up();

        // assert
        assert.deepEqual(onAddSpy.getCall(0).args[0].itemData, itemData, 'itemData in onDragMove event arguments');
        assert.deepEqual(onRemoveSpy.getCall(0).args[0].itemData, itemData, 'itemData in onDragEnd event arguments');
    });

    // T835349
    QUnit.test('The onAdd event should be fired when there is horizontal scrolling', function(assert) {
        // arrange
        const onAddSpy = sinon.spy();

        const sortable1 = this.createSortable({
            filter: '.draggable',
            data: 'x',
            group: 'shared'
        }, $('#itemsWithBothScrolls'));

        this.createSortable({
            filter: '.draggable',
            group: 'shared',
            data: 'y',
            moveItemOnDrop: true,
            onAdd: onAddSpy
        }, $('#items2'));

        // act
        const $sourceElement = $(sortable1.element()).children().eq(1);
        pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(350, 0).move(10, 0).up();

        // assert
        assert.strictEqual(onAddSpy.callCount, 1, 'onAdd event is called once');
    });

    // T835349
    QUnit.test('The onAdd event should be fired when there is vertical scrolling', function(assert) {
        // arrange
        const onAddSpy = sinon.spy();

        $('#scroll').css('top', '300px');
        $('#bothScrolls').css('height', '300px');

        const sortable1 = this.createSortable({
            filter: '.draggable',
            data: 'x',
            group: 'shared'
        }, $('#itemsWithBothScrolls'));

        this.createSortable({
            filter: '.draggable',
            group: 'shared',
            data: 'y',
            moveItemOnDrop: true,
            onAdd: onAddSpy
        }, $('#scroll'));

        // act
        const $sourceElement = $(sortable1.element()).children().eq(1);
        pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(0, 350).move(0, 10).up();

        // assert
        assert.strictEqual(onAddSpy.callCount, 1, 'onAdd event is called once');
    });
});

QUnit.module('Cross-Component Drag and Drop', crossComponentModuleConfig, () => {

    QUnit.test('Dragging item to another the sortable widget', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 3, 'second list - item count');
        assert.strictEqual(items1.filter('#item1').length, 1, 'first list - first item is not removed');
        assert.strictEqual(items2.filter('#item1').length, 0, 'second list - first item of the first list was not added');

        assert.strictEqual(items1[0].style.transform, '', 'items1 1 is not moved');
        assert.strictEqual(items1[1].style.transform, 'translate(0px, -30px)', 'items1 2 is moved up');
        assert.strictEqual(items1[2].style.transform, 'translate(0px, -30px)', 'items1 3 is moved up');

        assert.strictEqual(items2[0].style.transform, 'translate(0px, 30px)', 'items2 1 is moved down');
        assert.strictEqual(items2[1].style.transform, 'translate(0px, 30px)', 'items2 2 is moved down');
        assert.strictEqual(items2[2].style.transform, 'translate(0px, 30px)', 'items2 3 is moved down');
    });

    QUnit.test('Dragging item to another the sortable widget when allowReordering is false', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared',
            allowReordering: false
        }, $('#items'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared',
            allowReordering: false
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 3, 'second list - item count');
        assert.strictEqual(items1.filter('#item1').length, 1, 'first list - first item is not removed');
        assert.strictEqual(items2.filter('#item1').length, 0, 'second list - first item of the first list was not added');

        assert.strictEqual(items1[0].style.transform, '', 'items1 1 is not moved');
        assert.strictEqual(items1[1].style.transform, 'translate(0px, -30px)', 'items1 2 is moved up');
        assert.strictEqual(items1[2].style.transform, 'translate(0px, -30px)', 'items1 3 is moved up');

        assert.strictEqual(items2[0].style.transform, 'translate(0px, 30px)', 'items2 1 is moved down');
        assert.strictEqual(items2[1].style.transform, 'translate(0px, 30px)', 'items2 2 is moved down');
        assert.strictEqual(items2[2].style.transform, 'translate(0px, 30px)', 'items2 3 is moved down');
    });

    QUnit.test('Dragging item to another the sortable widget if dragTemplate contains scrollable', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            dragTemplate: function() {
                return $('<div>').css({
                    width: 100,
                    height: 100
                }).dxSortable();
            },
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 3, 'second list - item count');
        assert.strictEqual(items1.filter('#item1').length, 1, 'first list - first item is not removed');
        assert.strictEqual(items2.filter('#item1').length, 0, 'second list - first item of the first list was not added');

        assert.strictEqual(items1[0].style.transform, '', 'items1 1 is not moved');
        assert.strictEqual(items1[1].style.transform, 'translate(0px, -30px)', 'items1 2 is moved up');
        assert.strictEqual(items1[2].style.transform, 'translate(0px, -30px)', 'items1 3 is moved up');

        assert.strictEqual(items2[0].style.transform, 'translate(0px, 30px)', 'items2 1 is moved down');
        assert.strictEqual(items2[1].style.transform, 'translate(0px, 30px)', 'items2 2 is moved down');
        assert.strictEqual(items2[2].style.transform, 'translate(0px, 30px)', 'items2 3 is moved down');
    });

    QUnit.test('Dragging item to another the sortable widget without free space', function(assert) {
        // arrange
        $('#items2').css('height', '');
        $('#items2').children().last().css('margin', 1);


        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items2'));


        // act
        const pointer = pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        assert.strictEqual(sortable2.$element().children().last()[0].style.marginBottom, '29px', 'items2 last item has margin bottom');
        assert.strictEqual(sortable2.$element().css('overflow'), 'hidden', 'overflow is hidden to correct applying margin to sortable element');

        // act
        pointer.up();

        // assert
        assert.strictEqual(sortable2.$element().children().last()[0].style.marginBottom, '1px', 'items2 last item margin bottom is restored');
    });

    QUnit.test('Dragging an item to another the sortable widget without free space when its last element is hidden', function(assert) {
        // arrange
        $('#items2').css('height', '');
        $('#items2').children().last().hide();
        $('#items2').children().eq(-2).css('margin', 1);


        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items2'));


        // act
        const pointer = pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        assert.strictEqual(sortable2.$element().children().eq(-2)[0].style.marginBottom, '29px', 'items2 last item has margin bottom');
        assert.strictEqual(sortable2.$element().css('overflow'), 'hidden', 'overflow is hidden to correct applying margin to sortable element');

        // act
        pointer.up();

        // assert
        assert.strictEqual(sortable2.$element().children().eq(-2)[0].style.marginBottom, '1px', 'items2 last item margin bottom is restored');
    });


    QUnit.test('Dragging item with dropFeedbackMode push to another the sortable widget with dropFeedbackMode indicate', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'indicate',
            filter: '.draggable',
            group: 'shared'
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 3, 'second list - item count');
        assert.strictEqual(items1.filter('#item1').length, 1, 'first list - first item is exists');
        assert.strictEqual(items1.filter('#item1').hasClass('dx-sortable-source-hidden'), true, 'first list - first item is hidden');
        assert.strictEqual(items2.filter('#item1').length, 0, 'second list - first item of the first list is not added');
        assert.strictEqual($('body').children('.dx-sortable-placeholder').length, 1, 'placeholder is in body');
    });

    QUnit.test('Dragging item to another the sortable widget when group as object', function(assert) {
        // arrange
        const group = {};

        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: group
        }, $('#items'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: group
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 3, 'second list - item count');

        assert.strictEqual(items1[0].style.transform, '', 'items1 1 is not moved');
        assert.strictEqual(items1[1].style.transform, 'translate(0px, -30px)', 'items1 2 is moved up');
        assert.strictEqual(items1[2].style.transform, 'translate(0px, -30px)', 'items1 3 is moved up');

        assert.strictEqual(items2[0].style.transform, 'translate(0px, 30px)', 'items2 1 is moved down');
        assert.strictEqual(items2[1].style.transform, 'translate(0px, 30px)', 'items2 2 is moved down');
        assert.strictEqual(items2[2].style.transform, 'translate(0px, 30px)', 'items2 3 is moved down');

    });

    QUnit.test('Dragging item should not work when another the sortable widget does not have a group', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable'
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 3, 'second list - item count');
    });

    QUnit.test('Dropping item to another the sortable widget', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 2, 'first list - item count');
        assert.strictEqual(items2.length, 4, 'second list - item count');
        assert.strictEqual(items1.filter('#item1').length, 0, 'first list - first item is removed');
        assert.strictEqual(items2.filter('#item1').length, 1, 'second list - first item of the first list was added');
    });

    QUnit.test('Dragging item to another the sortable widget with dropFeedbackMode indicate', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            dropFeedbackMode: 'push',
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            dropFeedbackMode: 'indicate',
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 3, 'second list - item count');
        assert.strictEqual($('body').children('.dx-sortable-placeholder').length, 1, 'placeholder is in body');
    });

    QUnit.test('Dropping item to another the sortable widget with dropFeedbackMode indicate', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            dropFeedbackMode: 'indicate'
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            dropFeedbackMode: 'indicate',
            moveItemOnDrop: true
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 2, 'first list - item count');
        assert.strictEqual(items2.length, 4, 'second list - item count');
        assert.strictEqual(items1.filter('#item1').length, 0, 'first list - first item is removed');
        assert.strictEqual(items2.filter('#item1').length, 1, 'second list - first item of the first list was added');
    });

    QUnit.test('Dragging items between sortable widgets', function(assert) {
        // arrange
        let items1;
        let items2;

        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

        // assert
        items1 = $(sortable1.$element()).children();
        items2 = $(sortable2.$element()).children();
        assert.strictEqual(items1.length, 2, 'first list - item count');
        assert.strictEqual(items2.length, 4, 'second list - item count');

        // act
        pointerMock(sortable2.$element().children().eq(1)).start({ x: 304, y: 0 }).down().move(-250, 30).move(-50, 0).up();

        // assert
        items1 = sortable1.$element().children();
        items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 3, 'second list - item count');
        assert.strictEqual(items1.eq(0).attr('id'), 'item2', 'first list - first item');
        assert.strictEqual(items1.eq(1).attr('id'), 'item4', 'first list - second item');
        assert.strictEqual(items2.eq(0).attr('id'), 'item1', 'second list - first item');
        assert.strictEqual(items2.eq(1).attr('id'), 'item5', 'second list - second item');
    });

    QUnit.test('Animation should be stopped for target sortable items after leave', function(assert) {
        // arrange
        fx.off = false;

        const sortable1 = this.createSortable({
            group: 'shared',
            dropFeedbackMode: 'push'
        }, $('#items'));

        const sortable2 = this.createSortable({
            group: 'shared',
            dropFeedbackMode: 'push'
        }, $('#items2'));

        // act
        const pointer = pointerMock(sortable1.$element().children().eq(0));
        pointer.start().down().move(350, 0).move(50, 0);

        // assert
        const items2 = $(sortable2.$element()).children();
        assert.strictEqual(items2[0].style.transitionDuration, '300ms', 'items2 1 transition');
        assert.strictEqual(items2[0].style.transform, 'translate(0px, 30px)', 'items2 1 is moved down');
        assert.strictEqual(items2[1].style.transform, 'translate(0px, 30px)', 'items2 2 is moved down');
        assert.strictEqual(items2[2].style.transform, 'translate(0px, 30px)', 'items2 3 is moved down');

        // act
        pointer.move(300, 0);

        // assert
        assert.strictEqual(items2[0].style.transitionDuration, '', 'items2 1 transition is reseted');
        assert.strictEqual(items2[0].style.transform, '', 'items2 1 transform is reseted');
        assert.strictEqual(items2[1].style.transform, '', 'items2 2 transform is reseted');
        assert.strictEqual(items2[2].style.transform, '', 'items2 3 transform is reseted');
    });

    QUnit.test('items should not be moved after leave and enter', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            group: 'shared',
            dropFeedbackMode: 'push'
        }, $('#items'));

        this.createSortable({
            group: 'shared',
            dropFeedbackMode: 'push'
        }, $('#items2'));

        // act
        const pointer = pointerMock(sortable1.$element().children().eq(0));
        pointer.start().down().move(350, 0).move(50, 0).move(-350).move(-50);

        // assert
        const items1 = $(sortable1.$element()).children();
        assert.strictEqual(items1[0].style.transform, '', 'items1 1 is not moved');
        assert.strictEqual(items1[1].style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'items1 2 is not moved');
        assert.strictEqual(items1[2].style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'items1 3 is not moved');
    });

    QUnit.test('Items should not be moved after leave sortable if group is defined', function(assert) {
        // arrange
        const sortable = this.createSortable({
            group: 'shared',
            dropFeedbackMode: 'push'
        }, $('#items'));

        // act
        const pointer = pointerMock(sortable.$element().children().eq(0));
        pointer.start().down(0, 0).move(0, 1).move(0, -10);

        // assert
        const items = $(sortable.$element()).children();
        assert.strictEqual(items[0].style.transform, '', 'items 1 is not moved');
        assert.strictEqual(items[1].style.transform, '', 'items 2 is not moved');
        assert.strictEqual(items[2].style.transform, '', 'items 3 is not moved');
    });

    QUnit.test('Items should not be moved after leave sortable if group is not defined', function(assert) {
        // arrange
        const sortable = this.createSortable({
            dropFeedbackMode: 'push'
        }, $('#items'));

        // act
        const pointer = pointerMock(sortable.$element().children().eq(0));
        pointer.start().down(0, 0).move(0, 1).move(0, -10);

        // assert
        const items = $(sortable.$element()).children();
        assert.strictEqual(items[0].style.transform, '', 'items 1 is not moved');
        assert.strictEqual(items[1].style.transform, '', 'items 2 is moved up');
        assert.strictEqual(items[2].style.transform, '', 'items 3 is moved up');
    });

    QUnit.test('Update item positions when dragging an item to another the sortable widget if dropFeedbackMode is push', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items2'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

        // assert
        const items = $(sortable2.$element()).children();
        assert.equal(items.length, 3, 'item count');
        assert.strictEqual(items[0].style.transform, 'translate(0px, 30px)', 'items 1 is moved up');
        assert.strictEqual(items[1].style.transform, 'translate(0px, 30px)', 'items 2 is moved up');
        assert.strictEqual(items[2].style.transform, 'translate(0px, 30px)', 'items 3 is moved up');
    });

    QUnit.test('Drag and drop item from draggable to sortable', function(assert) {
        // arrange
        const draggable = this.createDraggable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true
        }, $('#items2'));

        // act
        pointerMock(draggable.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

        // assert
        const items1 = draggable.$element().children();
        const items2 = sortable.$element().children();
        assert.strictEqual(items1.length, 2, 'first list - item count');
        assert.strictEqual(items2.length, 4, 'second list - item count');
        assert.strictEqual(items1.filter('#item1').length, 0, 'first list - draggable item is removed');
        assert.strictEqual(items2.filter('#item1').length, 1, 'second list - item from second list');
        assert.strictEqual(items2.first().attr('id'), 'item1', 'second list - new item in first position');
    });

    QUnit.test('Drag and drop item from sortable to draggable should not move item', function(assert) {
        // arrange
        const draggable = this.createDraggable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable = this.createSortable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items2'));

        // act
        pointerMock(sortable.$element().children().eq(0)).start({ x: 304, y: 0 }).down().move(-250, 0).move(-50, 0).up();

        // assert
        const items1 = draggable.$element().children();
        const items2 = sortable.$element().children();
        assert.strictEqual(items1.length, 3, 'first list items are not changed');
        assert.strictEqual(items2.length, 3, 'second list items are not changed');
    });

    QUnit.test('Drag and drop item from sortable to draggable with drop handler', function(assert) {
        // arrange
        const draggable = this.createDraggable({
            filter: '.draggable',
            group: 'shared',
            onDrop: function(e) {
                if(e.fromComponent !== e.toComponent) {
                    $(e.element).append(e.itemElement);
                }
            }
        }, $('#items'));

        const sortable = this.createSortable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items2'));

        // act
        pointerMock(sortable.$element().children().eq(0)).start({ x: 304, y: 0 }).down().move(-250, 0).move(-50, 0).up();

        // assert
        const items1 = draggable.$element().children();
        const items2 = sortable.$element().children();
        assert.strictEqual(items1.length, 4, 'first list - item count');
        assert.strictEqual(items2.length, 2, 'second list - item count');
        assert.strictEqual(items1.filter('#item4').length, 1, 'first list - item from second list');
        assert.strictEqual(items1.last().attr('id'), 'item4', 'first list - new item in last position');
        assert.strictEqual(items2.filter('#item4').length, 0, 'second list - draggable item is removed');
    });

    QUnit.test('Drag and drop item to empty sortable', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true
        }, $('#items3'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(0, 300).move(0, 10).up();

        // assert
        const items1 = sortable1.$element().children();
        const items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 2, 'first list - item count');
        assert.strictEqual(items2.length, 1, 'second list - item count');
        assert.strictEqual(items1.filter('#item1').length, 0, 'first list - draggable item is removed');
        assert.strictEqual(items2.filter('#item1').length, 1, 'second list - item from first list');
    });

    QUnit.test('Placeholder should not visible on drag item to empty sortable', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            group: 'shared'
        }, $('#items'));

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            group: 'shared'
        }, $('#items3'));

        // act
        pointerMock(sortable1.$element().children().eq(0)).start().down().move(0, 300).move(0, 10);

        // assert
        assert.strictEqual($('.dx-sortable-placeholder').length, 2, 'placeholders exist');
        assert.strictEqual($('.dx-sortable-placeholder').eq(0).is(':visible'), false, 'placeholder 1 is not visible');
        assert.strictEqual($('.dx-sortable-placeholder').eq(1).is(':visible'), false, 'placeholder 2 is not visible');
    });

    QUnit.test('Dragging an item to another sortable and back when it is alone in the collection', function(assert) {
        // arrange
        let items1;
        let items2;

        $('#items3').append(
            $('<div id="item7" class="draggable">item7</div>').css({
                width: '300px',
                height: '30px',
                background: 'blue',
            })
        );

        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared'
        }, $('#items3'));

        // act
        const pointer = pointerMock(sortable2.$element().children().eq(0)).start({ x: 0, y: 310 }).down().move(0, -300).move(0, -10);

        // assert
        items1 = sortable1.$element().children();
        items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 1, 'second list - item count');

        assert.strictEqual(items1[0].style.transform, 'translate(0px, 30px)', 'items1 1 is moved down');
        assert.strictEqual(items1[1].style.transform, 'translate(0px, 30px)', 'items1 2 is moved down');
        assert.strictEqual(items1[2].style.transform, 'translate(0px, 30px)', 'items1 3 is moved down');

        assert.strictEqual(items2[0].style.transform, '', 'items2 1 is not moved');
        assert.strictEqual(items2.first().attr('id'), 'item7', 'source item position is not changed');
        assert.strictEqual(items2.hasClass('dx-sortable-source-hidden'), true, 'source item is hidden');

        // act
        pointer.move(0, 300).move(0, 10);

        // assert
        items1 = sortable1.$element().children();
        items2 = sortable2.$element().children();
        assert.strictEqual(items1.length, 3, 'first list - item count');
        assert.strictEqual(items2.length, 1, 'second list - item count');
        assert.strictEqual(items2.first().attr('id'), 'item7', 'second list - first item');
    });

    // T846161
    QUnit.test('The onRemove event should be fired when dragging the item from sortable to draggable', function(assert) {
        // arrange
        const onRemoveSpy = sinon.spy();
        const onDragEndSpy = sinon.spy();

        const draggable = this.createDraggable({
            filter: '.draggable',
            group: 'shared'
        }, $('#items'));

        const sortable = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            onRemove: onRemoveSpy,
            onDragEnd: onDragEndSpy
        }, $('#items2'));

        // act
        const $sortableElement = sortable.$element();
        pointerMock($sortableElement.children().eq(0)).start().down($sortableElement.offset().left, 0).move(-50, 0).up();

        // assert
        assert.strictEqual(onRemoveSpy.callCount, 1, 'onRemove event is called');
        assert.deepEqual(onRemoveSpy.getCall(0).args[0].fromComponent, sortable, 'onRemove arg - fromComponent');
        assert.deepEqual(onRemoveSpy.getCall(0).args[0].toComponent, draggable, 'onRemove arg - toComponent');
        assert.strictEqual(onRemoveSpy.getCall(0).args[0].fromIndex, 0, 'onRemove arg - fromIndex');
        assert.ok(isNaN(onRemoveSpy.getCall(0).args[0].toIndex), 'onRemove arg - toIndex');
        assert.strictEqual(onDragEndSpy.callCount, 1, 'onDragEnd event is called');
        assert.deepEqual(onDragEndSpy.getCall(0).args[0].fromComponent, sortable, 'onDragEnd arg - fromComponent');
        assert.deepEqual(onDragEndSpy.getCall(0).args[0].toComponent, draggable, 'onDragEnd arg - toComponent');
        assert.strictEqual(onDragEndSpy.getCall(0).args[0].fromIndex, 0, 'onDragEndSpy arg - fromIndex');
        assert.ok(isNaN(onDragEndSpy.getCall(0).args[0].toIndex), 'onDragEndSpy arg - toIndex');
    });
});

function getModuleConfigForTestsWithScroll(elementSelector, scrollSelector) {
    return {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();

            this.originalRAF = animationFrame.requestAnimationFrame;
            animationFrame.requestAnimationFrame = function(callback) {
                return window.setTimeout(callback, 10);
            };

            $('#qunit-fixture').addClass('qunit-fixture-visible');
            this.$element = $(elementSelector);
            this.$scroll = $(scrollSelector);
            $('#qunit-fixture').children().hide();
            this.$scroll.show();

            this.createSortable = (options) => {
                return this.sortableInstance = this.$element.dxSortable(options).dxSortable('instance');
            };
        },
        afterEach: function() {
            this.clock.restore();
            this.clock.reset();

            animationFrame.requestAnimationFrame = this.originalRAF;
            $('#qunit-fixture > div').show();

            $('#qunit-fixture').removeClass('qunit-fixture-visible');
            this.sortableInstance && this.sortableInstance.dispose();
        }
    };
}

QUnit.module('With scroll', getModuleConfigForTestsWithScroll('#itemsWithScroll', '#scroll'), () => {

    QUnit.test('Placeholder position should be updated during autoscroll', function(assert) {
        // arrange
        let previousPlaceholderOffsetTop;

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            scrollSpeed: 10
        });

        const items = this.$element.children();

        // act, assert
        const pointer = pointerMock(items.eq(0)).start().down().move(0, 189);
        this.clock.tick(10);

        pointer.move(0, 10);
        this.clock.tick(10);

        previousPlaceholderOffsetTop = $(PLACEHOLDER_SELECTOR).offset().top;

        for(let i = 0; i < 3; i++) {
            this.clock.tick(10);
            const currentPlaceholderOffsetTop = $(PLACEHOLDER_SELECTOR).offset().top;

            assert.notStrictEqual(currentPlaceholderOffsetTop, previousPlaceholderOffsetTop, 'placeholder was updated');

            previousPlaceholderOffsetTop = currentPlaceholderOffsetTop;
        }
    });

    QUnit.test('Placeholder should not be visible outside bottom of scroll container', function(assert) {
        // arrange
        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate'
        });

        const items = this.$element.children();

        // act
        const pointer = pointerMock(items.eq(0)).start().down().move(0, 250);

        // assert
        assert.ok($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is visisble');

        // act
        pointer.move(0, 50);

        // assert
        assert.notOk($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is not visible');
    });

    QUnit.test('Placeholder should be visible after page scrolling (T871213)', function(assert) {
        // arrange
        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate'
        });

        try {
            const scrollPosition = 1000;
            $('#qunit-fixture').removeClass('qunit-fixture-visible');
            $('#qunit-fixture').css('top', 0);
            $('body').css('height', 10000);
            $('#scroll').css('top', scrollPosition);
            window.scrollTo(0, scrollPosition);

            const $items = this.$element.children();

            // act
            const pointer = pointerMock($items.eq(0)).start().down(0, scrollPosition).move(0, 250);

            // assert
            assert.strictEqual(window.pageYOffset, scrollPosition);
            assert.ok($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is visisble');

            // act
            pointer.move(0, 50);

            // assert
            assert.notOk($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is not visible');
        } finally {
            $('#qunit-fixture').css('top', '');
            $('body').css('height', '');
            $('#scroll').css('top', 0);
            window.scrollTo(0, 0);
        }
    });

    QUnit.test('Placeholder should not be visible outside bottom of scroll container if overflow on sortable', function(assert) {
        // arrange
        this.$scroll.css('overflow', '');
        this.$element.css({
            overflow: 'auto',
            height: 250
        });

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate'
        });

        const items = this.$element.children();

        // act
        const pointer = pointerMock(items.eq(0)).start().down().move(0, 250);

        // assert
        assert.ok($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is visisble');

        // act
        pointer.move(0, 50);

        // assert
        assert.notOk($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is not visible');
    });

    QUnit.test('Placeholder should not be visible outside top of scroll container', function(assert) {
        // arrange
        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            autoScroll: false
        });

        const items = this.$element.children();

        this.$scroll.scrollTop(50);

        // act
        const pointer = pointerMock(items.eq(2)).start().down(0, 100).move(0, -100);

        // assert
        assert.ok($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is visisble');

        // act
        pointer.move(0, -50);

        // assert
        assert.notOk($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is not visible');
    });

    const generateItemElements = function($container, itemCount) {
        for(let i = 1; i <= itemCount; i++) {
            $container.append(
                $(`<div class="draggable">${i}</div>`).css({
                    height: 'auto',
                    border: '1px solid black',
                    padding: '5px'
                })
            );
        }
    };


    [1, 1.25].forEach((zoom) => {
        ['push', 'indicate'].forEach((dropFeedbackMode) => {
            QUnit.test(`The item position should be changed after scrolling the list to the bottom and dragging an item to the first position (zoom=${zoom}, dropFeedbackMode=${dropFeedbackMode})`, function(assert) {
                // arrange
                let scrollView;
                const originalZoom = $('body').css('zoom');

                try {
                    $('body').css('zoom', zoom);
                    $('#itemsWithScroll').empty();
                    generateItemElements($('#itemsWithScroll'), 11);

                    scrollView = $('#scroll').dxScrollView({
                        useNative: false,
                        scrollByContent: false
                    }).dxScrollView('instance');

                    this.createSortable({
                        filter: '.draggable',
                        moveItemOnDrop: true,
                        dropFeedbackMode,
                        scrollSpeed: 10
                    });

                    // act
                    scrollView.scrollTo({ y: 100 });
                    this.clock.tick(10);

                    // assert
                    assert.ok($(scrollView.container()).scrollTop() > 0, 'scrollTop > 0');

                    // act
                    let items = $(this.$element).children();
                    const pointer = pointerMock(items.last()).start().down().move(0, -200);
                    this.clock.tick(10);

                    scrollView.scrollTo({ y: 0 });
                    $(scrollView.content()).trigger('scroll');
                    this.clock.tick(10);

                    pointer.move(0, -25);
                    this.clock.tick(10);

                    pointer.up();
                    this.clock.tick(10);

                    // assert
                    items = $(this.$element).children();
                    assert.strictEqual(items.first().text(), '11', 'the last cell became the first');
                } finally {
                    $('body').css('zoom', originalZoom);
                    scrollView && scrollView.dispose();
                }
            });

            QUnit.test(`The item position should be changed after dragging a first item to the last position (zoom=${zoom}, dropFeedbackMode=${dropFeedbackMode})`, function(assert) {
                // arrange
                let scrollView;

                try {
                    $('body').css('zoom', zoom);
                    $('#itemsWithScroll').empty();
                    generateItemElements($('#itemsWithScroll'), 11);

                    scrollView = $('#scroll').dxScrollView({
                        useNative: false,
                        scrollByContent: false
                    }).dxScrollView('instance');

                    this.createSortable({
                        filter: '.draggable',
                        moveItemOnDrop: true,
                        dropFeedbackMode,
                        scrollSpeed: 10
                    });

                    // act
                    let items = $(this.$element).children();
                    const pointer = pointerMock(items.first()).start().down().move(0, 200);
                    this.clock.tick(10);

                    scrollView.scrollTo({ y: 100 });
                    this.clock.tick(100);

                    pointer.move(0, 40);
                    this.clock.tick(10);

                    pointer.up();
                    this.clock.tick(10);

                    // assert
                    items = $(this.$element).children();
                    assert.strictEqual(items.last().text(), '1', 'the first cell became the last');
                    assert.ok($(scrollView.container()).scrollTop() > 0, 'scrollTop > 0');
                } finally {
                    $('body').css('zoom', '');
                    scrollView && scrollView.dispose();
                }
            });
        });
    });
});

QUnit.module('With both scrolls', getModuleConfigForTestsWithScroll('#itemsWithBothScrolls', '#bothScrolls'), () => {

    // T830034
    QUnit.test('Placeholder width and offset should be correct if horizontal scroll exists and items have left margin', function(assert) {
        // arrange
        const maxScroll = this.$scroll.prop('scrollWidth') - this.$scroll.width();

        $('.draggable').css('margin-left', '40px');

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            scrollSpeed: 10
        });

        const items = this.$element.children();

        function scrollTestIteration(targetY, expectedWidth, expectedOffset) {
            // arrange
            const pointer = pointerMock(items.eq(0)).start().down().move(0, targetY);
            const $placeholder = $(PLACEHOLDER_SELECTOR);

            // assert
            assert.roughEqual($placeholder.width(), expectedWidth, 3, 'placeholder width');
            assert.deepEqual($placeholder.offset(), expectedOffset, 'placeholder offset');

            // act
            pointer.up();
        }

        scrollTestIteration(180, 260, { left: 40, top: 200 });

        this.$scroll.scrollLeft(20);

        scrollTestIteration(180, 280, { left: 20, top: 200 });

        this.$scroll.scrollLeft(40);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(60);
        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll - 20);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll - 40);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll - 60);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        $('.draggable').css('margin-left', '0px');
    });

    // T830034
    QUnit.test('Placeholder width and offset should be correct if horizontal scroll exists and items have right margin', function(assert) {
        // arrange
        const maxScroll = this.$scroll.prop('scrollWidth') - this.$scroll.width();

        $('.draggable').css('width', '560');
        $('.draggable').css('margin-right', '40px');

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            scrollSpeed: 10
        });

        const items = this.$element.children();

        function scrollTestIteration(targetY, expectedWidth, expectedOffset) {
            // act
            const pointer = pointerMock(items.eq(0)).start().down().move(0, targetY);
            const $placeholder = $(PLACEHOLDER_SELECTOR);

            // assert
            assert.roughEqual($placeholder.width(), expectedWidth, 3, 'placeholder width');
            assert.deepEqual($placeholder.offset(), expectedOffset, 'placeholder offset');

            // act
            pointer.up();
        }

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(20);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(40);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(60);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll - 60);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll - 40);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll - 20);

        scrollTestIteration(180, 280, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll);

        scrollTestIteration(180, 260, { left: 0, top: 200 });

        $('.draggable').css('width', '600px');
        $('.draggable').css('margin-right', '0px');
    });

    // T830034
    QUnit.test('Placeholder width and offset should be correct if horizontal scroll exists and items have right and left margins', function(assert) {
        // arrange
        const maxScroll = this.$scroll.prop('scrollWidth') - this.$scroll.width();

        $('.draggable').css('width', '520px');
        $('.draggable').css('margin-right', '40px');
        $('.draggable').css('margin-left', '40px');

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            scrollSpeed: 10
        });

        const items = this.$element.children();

        function scrollTestIteration(targetY, expectedWidth, expectedOffset) {
            // act
            const pointer = pointerMock(items.eq(0)).start().down().move(0, targetY);
            const $placeholder = $(PLACEHOLDER_SELECTOR);

            // assert
            assert.roughEqual($placeholder.width(), expectedWidth, 3, 'placeholder width');
            assert.deepEqual($placeholder.offset(), expectedOffset, 'placeholder offset');

            // act
            pointer.up();
        }

        scrollTestIteration(180, 260, { left: 40, top: 200 });

        this.$scroll.scrollLeft(20);

        scrollTestIteration(180, 280, { left: 20, top: 200 });

        this.$scroll.scrollLeft(40);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(60);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll - 60);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll - 40);

        scrollTestIteration(180, 300, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll - 20);

        scrollTestIteration(180, 280, { left: 0, top: 200 });

        this.$scroll.scrollLeft(maxScroll);

        scrollTestIteration(180, 260, { left: 0, top: 200 });

        $('.draggable').css('width', '600px');
        $('.draggable').css('margin-right', '0px');
        $('.draggable').css('margin-left', '0px');
    });

    QUnit.test('Placeholder width and offset should be correct if horizontal scroll exists, sortable has left offset and has width less then scrollable width (T1068082)', function(assert) {
        // arrange
        $('#itemsWithBothScrolls').css('padding-left', '40px');
        $('#itemsWithBothScrolls .draggable').css('width', '100px');

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            scrollSpeed: 10
        });

        const items = this.$element.children();

        function scrollTestIteration(targetY, expectedWidth, expectedOffset) {
            // arrange
            const pointer = pointerMock(items.eq(0)).start().down().move(0, targetY);
            const $placeholder = $(PLACEHOLDER_SELECTOR);

            // assert
            assert.roughEqual($placeholder.width(), expectedWidth, 3, 'placeholder width');
            assert.deepEqual($placeholder.offset(), expectedOffset, 'placeholder offset');

            // act
            pointer.up();
        }

        scrollTestIteration(180, 100, { left: 40, top: 200 });

        this.$scroll.scrollLeft(40);
        scrollTestIteration(180, 100, { left: 0, top: 200 });

        this.$scroll.scrollLeft(60);
        scrollTestIteration(180, 80, { left: 0, top: 200 });

        this.$scroll.scrollLeft(1000);
        scrollTestIteration(180, 0, { left: 0, top: 200 });
    });

    QUnit.test('Placeholder width and offset should be correct if horizontal scroll exists, sortable has right offset and has width less then scrollable width (T1068082)', function(assert) {
        // arrange
        $('#itemsWithBothScrolls').css('padding-left', '250px');
        $('#itemsWithBothScrolls .draggable').css('width', '100px');

        this.createSortable({
            filter: '.draggable',
            dropFeedbackMode: 'indicate',
            scrollSpeed: 10
        });

        const items = this.$element.children();

        function scrollTestIteration(targetY, expectedWidth, expectedOffset) {
            // arrange
            const pointer = pointerMock(items.eq(0)).start().down().move(0, targetY);
            const $placeholder = $(PLACEHOLDER_SELECTOR);

            // assert
            assert.roughEqual($placeholder.width(), expectedWidth, 3, 'placeholder width');
            assert.deepEqual($placeholder.offset(), expectedOffset, 'placeholder offset');

            // act
            pointer.up();
        }

        scrollTestIteration(180, 50, { left: 250, top: 200 });

        this.$scroll.scrollLeft(10);
        scrollTestIteration(180, 60, { left: 240, top: 200 });

        this.$scroll.scrollLeft(50);
        scrollTestIteration(180, 100, { left: 200, top: 200 });

        this.$scroll.scrollLeft(100);
        scrollTestIteration(180, 100, { left: 150, top: 200 });
    });

    QUnit.test('onReorder should not be called if item was dropped under the sortable when scroll position at the top', function(assert) {
        // arrange
        $('#bothScrolls').height(300);
        const onReorder = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            onReorder
        });

        // act
        pointerMock(this.$element.children().eq(0)).start().down().move(0, 450).up();

        // assert
        assert.equal(onReorder.callCount, 0, 'onReorder call count');
    });

    QUnit.test('onReorder should be called if item was dropped above the sortable when scroll position at the top', function(assert) {
        // arrange
        $('#bothScrolls').height(300);
        const onReorder = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            onReorder
        });

        // act
        pointerMock(this.$element.children().last()).start().down().move(0, -450).up();

        // assert
        assert.equal(onReorder.callCount, 1, 'onReorder call count');
    });

    QUnit.test('onReorder should be called if item was dropped under the sortable when scroll position at the bottom', function(assert) {
        // arrange
        $('#bothScrolls').height(300);
        $('#bothScrolls').scrollTop(1000);
        const onReorder = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            onReorder
        });

        // act
        pointerMock(this.$element.children().eq(0)).start().down().move(0, 450).up();

        // assert
        assert.equal(onReorder.callCount, 1, 'onReorder call count');
    });

    QUnit.test('onReorder should not be called if item was dropped above the sortable when scroll position at the bottom', function(assert) {
        // arrange
        $('#bothScrolls').height(300);
        $('#bothScrolls').scrollTop(1000);
        const onReorder = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            onReorder
        });

        // act
        pointerMock(this.$element.children().last()).start().down().move(0, -450).up();

        // assert
        assert.equal(onReorder.callCount, 0, 'onReorder call count');
    });

    QUnit.test('onReorder should be called if item was dropped before the sortable when scroll position at the left', function(assert) {
        // arrange
        $('#bothScrolls').height(300);
        $('#bothScrolls').width(200);
        $('#bothScrolls .draggable').css({
            width: 100,
            display: 'inline-block'
        });
        const onReorder = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            itemOrientation: 'horizontal',
            onReorder
        });

        // act
        pointerMock(this.$element.children().eq(0)).start().down().move(-50, 0).up();

        // assert
        assert.equal(onReorder.callCount, 1, 'onReorder call count');
    });

    QUnit.test('onReorder should not be called if item was dropped after the sortable when scroll position at the left', function(assert) {
        // arrange
        $('#bothScrolls').height(300);
        $('#bothScrolls').width(200);
        $('#bothScrolls .draggable').css({
            width: 100,
            display: 'inline-block'
        });
        const onReorder = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            itemOrientation: 'horizontal',
            onReorder
        });

        // act
        pointerMock(this.$element.children().eq(0)).start().down().move(350, 0).up();

        // assert
        assert.equal(onReorder.callCount, 0, 'onReorder call count');
    });

    QUnit.test('onReorder should not be called if item was dropped before the sortable when scroll position at the right', function(assert) {
        // arrange
        $('#bothScrolls').height(300);
        $('#bothScrolls').width(200);
        $('#bothScrolls .draggable').css({
            width: 100,
            display: 'inline-block'
        });
        $('#bothScrolls').scrollLeft(1000);
        const onReorder = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            itemOrientation: 'horizontal',
            onReorder
        });

        // act
        pointerMock(this.$element.children().eq(0)).start().down().move(-50, 0).up();

        // assert
        assert.equal(onReorder.callCount, 0, 'onReorder call count');
    });

    QUnit.test('onReorder should be called if item was dropped after the sortable when scroll position at the right', function(assert) {
        // arrange
        $('#bothScrolls').height(300);
        $('#bothScrolls').width(200);
        $('#bothScrolls draggable').css({
            width: 100,
            display: 'inline-block'
        });
        $('#bothScrolls').scrollLeft(1000);
        const onReorder = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            itemOrientation: 'horizontal',
            onReorder
        });

        // act
        pointerMock(this.$element.children().eq(0)).start().down().move(350, 0).up();

        // assert
        assert.equal(onReorder.callCount, 1, 'onReorder call count');
    });
});

QUnit.module('Dragging between sortables with scroll', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        $('#qunit-fixture').addClass('qunit-fixture-visible');

        this.$elements = [$('#itemsWithBothScrolls'), $('#itemsWithBothScrolls2')];
        this.$scrolls = [$('#bothScrolls'), $('#bothScrolls2')];
        this.instances = [];

        this.createOneSortable = (options, $element) => {
            const instance = $element.dxSortable(options).dxSortable('instance');

            this.instances.push(instance);

            return instance;
        };

        this.createSortable = (options) => {
            return this.$elements.map(($element) => {
                return this.createOneSortable(options, $element);
            });
        };
    },
    afterEach: function() {
        this.clock.restore();
        this.clock.reset();

        $('#qunit-fixture').removeClass('qunit-fixture-visible');
        this.instances.forEach((instance) => {
            instance.dispose();
        });
    }
}, () => {
    function dragBetweenSortableTest(that, assert, scroll, dragPos) {
        // arrange
        const onAdd = sinon.spy();
        const onRemove = sinon.spy();

        that.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true,
            onAdd,
            onRemove
        });

        // act
        that.$elements[1].scrollLeft(scroll.left);
        that.$elements[1].scrollTop(scroll.top);

        pointerMock(that.$elements[0].children().eq(0)).start().down().move(dragPos.x, dragPos.y).move(1, 1).up();

        // assert
        assert.equal(that.$elements[0].children().length, 10, 'children count');
        assert.equal(that.$elements[1].children().length, 10, 'children count');
        assert.equal(onRemove.callCount, 0, 'onRemove call count');
        assert.equal(onAdd.callCount, 0, 'onAdd call count');
    }

    QUnit.test('Dragging between two sortables with scroll', function(assert) {
        // arrange
        const onAdd = sinon.spy();
        const onRemove = sinon.spy();

        this.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true,
            onAdd,
            onRemove
        });

        // act
        pointerMock(this.$elements[0].children().eq(0)).start().down().move(650, 650).move(1, 1).up();

        // assert
        assert.equal(this.$elements[0].children().length, 9, 'children count');
        assert.equal(this.$elements[1].children().length, 11, 'children count');
        assert.equal(onRemove.callCount, 1, 'onRemove call count');
        assert.equal(onAdd.callCount, 1, 'onAdd call count');
    });

    QUnit.test('Dragging between two sortables with scroll should update itemPoints (T1035958)', function(assert) {
        // arrange
        const done = assert.async();
        let scrollTimes = 0;

        const sortable = this.createSortable({
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true,
        });

        $('.draggable').width(280);
        this.$elements[0].width(280);
        this.$elements[1].width(280);
        this.$elements[1].height(280);

        $('#bothScrolls2').css('top', 0);
        $('#bothScrolls2').css('left', 300);

        this.$scrolls[1].on('scroll', () => {
            // assert
            const itemPoints = sortable[1].option('itemPoints');

            if(scrollTimes === 0) {
                // first scroll event, itemPoints must be the same
                assert.equal(itemPoints[1].top, 50);
            } else if(scrollTimes === 1) {
                // second scroll event, itemPoints must be the same
                assert.equal(itemPoints[1].top, 49);
                done();
            }

            scrollTimes++;
        });

        // act
        pointerMock(this.$elements[0].children().eq(0)).start().down().move(300, 200).move(0, 50);
    });

    // T872379
    [true, false].forEach((needBothScrolls) => {
        QUnit.test('onAdd and onRemove events should not trigger after dragging under sortable' + (needBothScrolls ? '(both scrolls)' : '(vertical scroll)'), function(assert) {
            if(!needBothScrolls) {
                $('.draggable').width(280);
                this.$elements[0].width(280);
                this.$elements[1].width(280);
            }

            dragBetweenSortableTest(this, assert, {
                left: 0,
                top: 0
            }, {
                x: 650,
                y: 800
            });
        });

        QUnit.test('onAdd and onRemove events should not trigger after dragging above the sortable' + (needBothScrolls ? '(both scrolls)' : '(vertical scroll)'), function(assert) {
            if(!needBothScrolls) {
                $('.draggable').width(280);
                this.$elements[0].width(280);
                this.$elements[1].width(280);
            }

            dragBetweenSortableTest(this, assert, {
                left: 0,
                top: 0
            }, {
                x: 800,
                y: 650
            });
        });

        QUnit.test('onAdd and onRemove events should not trigger after dragging on the right of the sortable' + (needBothScrolls ? '(both scrolls)' : '(horizontal scroll)'), function(assert) {
            !needBothScrolls && $('.draggable').height(25);

            dragBetweenSortableTest(this, assert, {
                left: 500,
                top: 500
            }, {
                x: 650,
                y: 400
            });
        });

        QUnit.test('onAdd and onRemove events should not trigger after dragging on the left of the sortable' + (needBothScrolls ? '(both scrolls)' : '(horizontal scroll)'), function(assert) {
            !needBothScrolls && $('.draggable').height(25);

            dragBetweenSortableTest(this, assert, {
                left: 500,
                top: 500
            }, {
                x: 400,
                y: 650
            });
        });
    });
});

QUnit.module('Drag and drop with nested sortable', crossComponentModuleConfig, () => {
    QUnit.test('The onReorder event should be raised for a nested sortable', function(assert) {
        // arrange
        const onReorder1 = sinon.spy();
        const onReorder2 = sinon.spy();

        this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true,
            onReorder: onReorder1
        }, $('#parentSortable'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true,
            onReorder: onReorder2
        }, $('#nestedSortable'));

        // act
        const $itemElement = sortable2.$element().children().eq(0);
        pointerMock($itemElement).start({ x: 0, y: $itemElement.offset().top }).down().move(0, 25).move(0, 5).up();

        // assert
        assert.strictEqual(onReorder1.callCount, 0, 'parent sortable - onReorder event is not called');
        assert.strictEqual(onReorder2.callCount, 1, 'nested sortable - onReorder event is called');
        assert.deepEqual(onReorder2.getCall(0).args[0].fromComponent, sortable2, 'onReorder args - fromComponent');
        assert.deepEqual(onReorder2.getCall(0).args[0].toComponent, sortable2, 'onReorder args - toComponent');
    });

    QUnit.test('Dragging item into a nested sortable', function(assert) {
        // arrange
        const onReorder1 = sinon.spy();
        const onReorder2 = sinon.spy();
        const onAdd = sinon.spy();
        const onRemove = sinon.spy();

        const sortable1 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true,
            onReorder: onReorder1,
            onRemove: onRemove
        }, $('#parentSortable'));

        const sortable2 = this.createSortable({
            dropFeedbackMode: 'push',
            filter: '.draggable',
            group: 'shared',
            moveItemOnDrop: true,
            onReorder: onReorder2,
            onAdd: onAdd
        }, $('#nestedSortable'));

        // act
        const $itemElement = sortable1.$element().children().eq(0);
        const offsetTop = sortable2.$element().offset().top;

        pointerMock($itemElement).start({ x: 0, y: $itemElement.offset().top }).down().move(0, offsetTop + 5).move(0, 5).up();

        // assert
        assert.strictEqual(onReorder1.callCount, 0, 'parent sortable - onReorder event is not called');
        assert.strictEqual(onReorder2.callCount, 0, 'nested sortable - onReorder event is not called');

        assert.strictEqual(onRemove.callCount, 1, 'parent sortable - onRemove event is called');
        assert.strictEqual(onAdd.callCount, 1, 'nested sortable - onAdd event is called');
        assert.deepEqual(onAdd.getCall(0).args[0].fromComponent, sortable1, 'onAdd args - fromComponent');
        assert.deepEqual(onAdd.getCall(0).args[0].toComponent, sortable2, 'onAdd args - toComponent');
        assert.strictEqual(onAdd.getCall(0).args[0].toIndex, 1, 'onAdd args - toIndex');
    });

    QUnit.test('Placeholder should have correct height when drag and drop item from nested sortable to parent sortable', function(assert) {
        // arrange
        const sortable1 = this.createSortable({
            group: 'shared',
            dropFeedbackMode: 'indicate'
        }, $('#items'));

        this.createSortable({
            group: 'shared',
            dropFeedbackMode: 'indicate'
        }, $('#items2'));

        this.createSortable({
            group: 'shared',
            itemOrientation: 'horizontal',
            dropFeedbackMode: 'indicate'
        }, $('#container'));

        const $itemElement = sortable1.$element().children().eq(0);
        const pointer = pointerMock($itemElement);

        pointer.start().down().move(610, 0).move(40, 0);

        const $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual($placeholder.length, 1, 'placeholder exists');
        assert.equal($placeholder.get(0).style.height, '250px', 'placeholder height style');
        assert.equal($placeholder.get(0).style.width, '', 'placeholder width style');
        const position = translator.locate($placeholder);
        assert.strictEqual(Math.round(position.left), 604, 'placeholder position left');
        assert.strictEqual(position.top, 0, 'placeholder position top');
    });
});

QUnit.module('Drag and drop in RTL mode', moduleConfig, () => {
    // T877953
    QUnit.test('Dragging an item should work correctly when itemOrientation is "horizontal" and dropFeedbackMode is "push"', function(assert) {
        // arrange
        let $items;

        this.$element = $('#itemsHorizontal');

        this.createSortable({
            dropFeedbackMode: 'push',
            itemOrientation: 'horizontal',
            rtlEnabled: true
        });

        $items = this.$element.children();
        const $dragItemElement = $items.first();

        // act
        pointerMock($dragItemElement).start().down(220, 0).move(-20, 0).move(-10, 0);

        // assert
        $items = this.$element.children();
        assert.strictEqual($items.length, 3, 'item count');
        assert.deepEqual(translator.locate($items.eq(0)), { left: 0, top: 0 }, 'first item position');
        assert.deepEqual(translator.locate($items.eq(1)), { left: 30, top: 0 }, 'second item position');
        assert.deepEqual(translator.locate($items.eq(2)), { left: 0, top: 0 }, 'third item position');
    });

    QUnit.test('Dragging an item should work correctly when itemOrientation is "vertical" and dropFeedbackMode is "push"', function(assert) {
        // arrange
        let $items;

        this.createSortable({
            dropFeedbackMode: 'push',
            itemOrientation: 'vertical',
            rtlEnabled: true
        });

        $items = this.$element.children();
        const $dragItemElement = $items.first();

        // act
        pointerMock($dragItemElement).start().down().move(0, 30).move(0, 15);

        // assert
        $items = this.$element.children();
        assert.strictEqual($items.length, 3, 'item count');
        assert.deepEqual(translator.locate($items.eq(0)), { left: 0, top: 0 }, 'first item position');
        assert.deepEqual(translator.locate($items.eq(1)), { left: 0, top: -30 }, 'second item position');
        assert.deepEqual(translator.locate($items.eq(2)), { left: 0, top: 0 }, 'third item position');
    });

    QUnit.test('Initial placeholder if itemOrientation is "horiontal" and dropFeedbackMode is "indicate"', function(assert) {
        // arrange
        let $items;

        this.$element = $('#itemsHorizontal');

        this.createSortable({
            dropFeedbackMode: 'indicate',
            itemOrientation: 'horizontal',
            rtlEnabled: true
        });

        $items = this.$element.children();
        const $dragItemElement = $items.eq(0);

        // act
        pointerMock($dragItemElement).start().down(235, 0).move(-30, 0);

        // assert
        $items = this.$element.children();
        const $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual($items.length, 3, 'item count');
        assert.equal($placeholder.length, 1, 'element has placeholder class');
        assert.equal($placeholder.get(0).style.height, '300px', 'placeholder height style');
        assert.equal($placeholder.get(0).style.width, '', 'placeholder width style');
        assert.deepEqual(translator.locate($placeholder), { left: 190, top: 500 }, 'placeholder position');
    });

    QUnit.test('Placeholder should be displayed correctly when dragging item to last position (dropFeedbackMode is "indicate" and itemOrientation is "horiontal")', function(assert) {
        // arrange
        let items;

        this.$element = $('#itemsHorizontal');

        this.createSortable({
            dropFeedbackMode: 'indicate',
            itemOrientation: 'horizontal',
            rtlEnabled: true
        });

        items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        pointerMock($dragItemElement).start().down(250, 0).move(-100, 0);

        // assert
        items = this.$element.children();
        const $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count');
        assert.equal($placeholder.length, 1, 'element has placeholder class');
        assert.equal($placeholder.get(0).style.height, '300px', 'placeholder height style');
        assert.equal($placeholder.get(0).style.width, '', 'placeholder width style');
        assert.deepEqual(translator.locate($placeholder), { left: 160, top: 500 }, 'placeholder position');
    });

    QUnit.test('Initial placeholder if allowDropInsideItem is true and itemOrientation is "horiontal"', function(assert) {
        // arrange
        let items;
        let $placeholder;

        this.$element = $('#itemsHorizontal');

        this.createSortable({
            itemOrientation: 'horizontal',
            rtlEnabled: true,
            allowDropInsideItem: true
        });

        items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        const pointer = pointerMock($dragItemElement).start().down(235, 0).move(-30, 0);

        // assert
        items = this.$element.children();
        $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count');
        assert.ok($placeholder.hasClass('dx-sortable-placeholder'), 'element has placeholder class');
        assert.ok($placeholder.hasClass('dx-sortable-placeholder-inside'), 'element has placeholder-inside class');
        assert.equal($placeholder.get(0).style.height, '300px', 'placeholder height');
        assert.equal($placeholder.get(0).style.width, '30px', 'placeholder width');
        assert.equal($placeholder.get(0).style.transform, 'translate(190px, 500px)', 'placeholder position');

        // act
        pointer.move(-15, 0);

        // assert
        items = this.$element.children();
        $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count');
        assert.equal($placeholder.length, 1, 'placeholder exists');
        assert.notOk($placeholder.hasClass('dx-sortable-placeholder-inside'), 'element has not placeholder-inside class');
        assert.equal($placeholder.get(0).style.height, '300px', 'placeholder height');
        assert.equal($placeholder.get(0).style.width, '', 'placeholder width');
        assert.equal($placeholder.get(0).style.transform, 'translate(190px, 500px)', 'placeholder position');
    });

    QUnit.test('Placeholder should be displayed correctly when dragging inward the last item (dropFeedbackMode is "indicate" and itemOrientation is "horiontal")', function(assert) {
        // arrange
        let items;
        let $placeholder;

        this.$element = $('#itemsHorizontal');

        this.createSortable({
            itemOrientation: 'horizontal',
            rtlEnabled: true,
            allowDropInsideItem: true
        });

        items = this.$element.children();
        const $dragItemElement = items.eq(0);

        // act
        const pointer = pointerMock($dragItemElement).start().down(235, 0).move(-45, 0);

        // assert
        items = this.$element.children();
        $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count');
        assert.equal($placeholder.length, 1, 'placeholder exists');
        assert.notOk($placeholder.hasClass('dx-sortable-placeholder-inside'), 'element has not placeholder-inside class');
        assert.equal($placeholder.get(0).style.height, '300px', 'placeholder height');
        assert.equal($placeholder.get(0).style.width, '', 'placeholder width');
        assert.equal($placeholder.get(0).style.transform, 'translate(190px, 500px)', 'placeholder position');

        // act
        pointer.move(-15, 0);

        // assert
        items = this.$element.children();
        $placeholder = $('.dx-sortable-placeholder');
        assert.strictEqual(items.length, 3, 'item count');
        assert.equal($placeholder.length, 1, 'placeholder exists');
        assert.ok($placeholder.hasClass('dx-sortable-placeholder-inside'), 'element has placeholder-inside class');
        assert.equal($placeholder.get(0).style.height, '300px', 'placeholder height');
        assert.equal($placeholder.get(0).style.width, '30px', 'placeholder width');
        assert.equal($placeholder.get(0).style.transform, 'translate(160px, 500px)', 'placeholder position');
    });
});

QUnit.module('update', moduleConfig, () => {
    function repaintItems(count, height) {
        const $element = $('#items');
        $element.empty();
        for(let i = 0; i < count; i++) {
            $('<div>').addClass('draggable').css('height', height || '').appendTo($element);
        }
    }

    const getElement = (index) => $('#items').children().eq(index);

    QUnit.test('source element should be updated', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'push' });


        pointerMock(getElement(0)).start().down(15, 15).move(0, 10);
        repaintItems(2);

        // act
        sortable.update();

        // assert
        assert.ok(getElement(0).hasClass('dx-sortable-source'), 'source class is added');
        assert.ok(getElement(0).hasClass('dx-sortable-source-hidden'), 'source-hidden class is added');
    });

    QUnit.test('source element should be cleared after dragging end', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'push' });


        pointerMock(getElement(0)).start().down(15, 15).move(0, 10);
        repaintItems(2);

        // act
        sortable.update();
        pointerMock(getElement(0)).start().up();

        // assert
        assert.notOk(getElement(0).hasClass('dx-sortable-source'), 'source class is removed');
        assert.notOk(getElement(0).hasClass('dx-sortable-source-hidden'), 'source-hidden class is removed');
    });

    QUnit.test('source element should be cleared after change fromIndex to null (T952492)', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'push' });

        sortable.option('fromIndex', 0);
        repaintItems(2);

        // act
        sortable.update();
        sortable.option('fromIndex', null);

        // assert
        assert.notOk(getElement(0).hasClass('dx-sortable-source'), 'source class is removed');
        assert.notOk(getElement(0).hasClass('dx-sortable-source-hidden'), 'source-hidden class is removed');
    });

    QUnit.test('itemPoints should be updated', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'push' });


        pointerMock(getElement(0)).start().down(15, 15).move(0, 10);

        const itemHeight = 100;
        repaintItems(2, itemHeight);

        // act
        sortable.update();

        // assert
        const itemPoints = sortable.option('itemPoints');
        assert.equal(itemPoints.length, 3, 'item point count is updated');
        assert.equal(itemPoints[0].height, itemHeight, 'first point height is updated');
    });

    [false, true].forEach((autoUpdate) => {
        const notUpdatedText = autoUpdate ? '' : 'not ';
        QUnit.test(`itemPoints should ${notUpdatedText}be updated automatically on move if autoUpdate is ${autoUpdate}`, function(assert) {
            const sortable = this.createSortable({
                dropFeedbackMode: 'push',
                autoUpdate: autoUpdate
            });

            pointerMock(getElement(0)).start().down(15, 15).move(0, 10);

            const itemHeight = 100;
            repaintItems(2, itemHeight);

            // act
            pointerMock(getElement(0)).start().move(0, 1);

            // assert
            const itemPoints = sortable.option('itemPoints');
            assert.equal(itemPoints.length, autoUpdate ? 3 : 4, `item point count is ${notUpdatedText}updated`);
            assert.equal(itemPoints[0].height, autoUpdate ? itemHeight : 30, `first point height is ${notUpdatedText}updated`);
        });
    });

    QUnit.test('itemPoints should be empty if dragging is not started', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'push' });

        // act
        sortable.update();

        // assert
        assert.strictEqual(sortable.option('itemPoints'), null, 'item point count is updated');
    });

    QUnit.test('items should be moved', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'push' });

        pointerMock(getElement(0)).start().down().move(0, 50);
        repaintItems(3);

        // act
        sortable.update();

        // assert
        assert.equal(getElement(0).get(0).style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'item 1 is not moved');
        assert.equal(getElement(1).get(0).style.transform, 'translate(0px, -30px)', 'item 2 is not moved');
        assert.equal(getElement(2).get(0).style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'item 3 is not moved');
    });

    QUnit.test('placeholder should be updated if dropFeedbackMode is indicate', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'indicate' });

        pointerMock(getElement(0)).start().down().move(0, 50);
        const itemHeight = 40;
        repaintItems(3, itemHeight);

        // act
        sortable.update();

        const $placeholder = $(PLACEHOLDER_SELECTOR);

        // assert
        assert.equal($placeholder.length, 1, 'placeholder is once');
        assert.ok($placeholder.is(':visible'), 'placeholder is visible');
        assert.equal($placeholder.offset().top, 2 * itemHeight, 'placeholder position is updated');
    });

    QUnit.test('items should be moved correctly if offset is not changed', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'push' });

        sortable.option('offset', 9);
        pointerMock(getElement(0)).start().down().move(0, 50);
        repaintItems(3);

        // act
        sortable.option('offset', 9);
        sortable.update();

        // assert
        assert.equal(getElement(0).get(0).style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'item 1 is not moved');
        assert.equal(getElement(1).get(0).style.transform, 'translate(0px, -30px)', 'item 2 is moved');
        assert.equal(getElement(2).get(0).style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'item 3 is not moved');
    });

    QUnit.test('items should be moved correctly if offset is increased', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'push' });

        sortable.option('offset', 0);
        pointerMock(getElement(0)).start().down().move(0, 50);
        repaintItems(3);

        // act
        sortable.option('offset', 9);
        sortable.update();

        // assert
        assert.equal(getElement(0).get(0).style.transform, 'translate(0px, -30px)', 'item 1 is moved');
        assert.equal(getElement(1).get(0).style.transform, 'translate(0px, -30px)', 'item 2 is moved');
        assert.equal(getElement(2).get(0).style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'item 3 is not moved');
    });

    QUnit.test('items should be moved correctly if offset is decreased', function(assert) {
        const sortable = this.createSortable({ dropFeedbackMode: 'push' });

        sortable.option('offset', 9);
        pointerMock(getElement(0)).start().down().move(0, 50);
        repaintItems(3);

        // act
        sortable.option('offset', 0);
        sortable.update();

        // assert
        assert.equal(getElement(0).get(0).style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'item 1 is not moved');
        assert.equal(getElement(1).get(0).style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'item 2 is not moved');
        assert.equal(getElement(2).get(0).style.transform, 'translate(0px, 30px)', 'item 3 is moved');
    });
});

QUnit.module('autoscroll', getModuleConfigForTestsWithScroll('#itemsWithScroll', '#scroll'), () => {
    const getElement = (index) => $('#itemsWithScroll').children().eq(index);
    const itemCount = 10;
    const itemHeight = 50;

    [false, true].forEach((isHorizontal) => {
        [false, true].forEach((isBack) => {
            [false, true].forEach((toEnd) => {
                const scrollHeight = 250;
                const scrollProp = isHorizontal ? 'scrollLeft' : 'scrollTop';
                const positionProp = isHorizontal ? 'left' : 'top';
                const moveDelta = isBack ? -100 : 100;
                const downPosition = isBack ? scrollHeight - 25 : 25;
                let scrollPosition = toEnd ? scrollHeight : 35;
                if(isBack) {
                    scrollPosition = scrollHeight - scrollPosition;
                }


                QUnit.test(`itemPoints should be corrected during scroll ${isBack ? 'up' : 'down'}${toEnd ? ' to end' : ''} if orientation is ${isHorizontal ? 'horizontal' : 'vertical'}`, function(assert) {
                    const done = assert.async();
                    if(isHorizontal) {
                        this.$element.children().css({ width: 50, display: 'inline-block' });
                        this.$element.css({ width: 500, whiteSpace: 'nowrap' });
                        this.$scroll.css({ width: 250 });
                    }
                    const sortable = this.createSortable({
                        dropFeedbackMode: 'indicate',
                        scrollSpeed: 100,
                        itemOrientation: isHorizontal ? 'horizontal' : 'vertical'
                    });

                    if(isBack) {
                        this.$scroll[scrollProp](10000);
                    }

                    const pointer = pointerMock(getElement(isBack ? itemCount - 1 : 0)).start();
                    if(isHorizontal) {
                        pointer.down(downPosition, 25).move(moveDelta, 0).move(moveDelta, 0);

                    } else {
                        pointer.down(25, downPosition).move(0, moveDelta).move(0, moveDelta);
                    }

                    // act
                    this.clock.tick(toEnd ? 100 : 10);

                    // assert
                    this.$scroll.on('scroll', () => {
                        const itemPoints = sortable.option('itemPoints');
                        assert.equal(this.$scroll[scrollProp](), scrollPosition, 'scroll position');
                        assert.equal(itemPoints.length, itemCount + 1, 'item posint count');
                        for(let i = 0; i < 11; i++) {
                            assert.equal(itemPoints[i][positionProp], -scrollPosition + i * itemHeight, `point ${i} height is corrected`);
                        }
                        done();
                    });
                });
            });
        });
    });

    QUnit.test('itemPoints should be corrected during browser autoscroll (T960381)', function(assert) {
        const done = assert.async();
        const sortable = this.createSortable({
            dropFeedbackMode: 'indicate',
            itemOrientation: 'vertical'
        });

        const pointer = pointerMock(getElement(0)).start();

        pointer.down(25, 25).move(0, 100);

        const scrollBy = 100;

        // act
        this.$scroll.scrollTop(scrollBy);

        // assert
        this.$scroll.on('scroll', () => {
            const itemPoints = sortable.option('itemPoints');
            assert.equal(itemPoints.length, itemCount + 1, 'item posint count');
            for(let i = 0; i < itemPoints.length; i++) {
                assert.equal(itemPoints[i].top, -scrollBy + i * itemHeight, `point ${i} height is corrected`);
            }
            done();
        });
    });

    // T1068082
    QUnit.test('itemPoints should be corrected during browser autoscroll when a draggable element outside sortable', function(assert) {
        let scrollEventCallCount = 0;
        const done = assert.async();
        const sortable = this.createSortable({
            dropFeedbackMode: 'indicate',
            itemOrientation: 'vertical',
            group: 'test'
        });
        const pointer = pointerMock(getElement(0)).start();

        pointer.down(25, 25).move(0, 100);

        this.$scroll.on('scroll', () => {
            scrollEventCallCount++;

            // assert
            const itemPoints = sortable.option('itemPoints');
            assert.equal(itemPoints.length, itemCount + 1, 'item point count');
            for(let i = 0; i < itemPoints.length; i++) {
                assert.strictEqual(itemPoints[i].top, -scrollBy + i * itemHeight, `point ${i} height is corrected`);
            }

            if(scrollEventCallCount === 2) {
                done();
            } else {
                // act
                pointer.move(0, 135);
                scrollBy = 100;
                this.$scroll.scrollTop(scrollBy);
            }
        });

        // act
        let scrollBy = 50;
        this.$scroll.scrollTop(scrollBy);
    });
});

// T971119
QUnit.module('Check bounds for container with padding', crossComponentModuleConfig, () => {
    QUnit.test('before left', function(assert) {
        const onReorderSpy = sinon.spy();
        $('#scroll').css('padding', '50px');

        this.createSortable({
            moveItemOnDrop: true,
            onReorder: onReorderSpy
        }, $('#itemsWithScroll'));

        // act
        const $sourceElement = $('#scroll .draggable').eq(0);
        const startPosition = { x: $sourceElement.offset().left, y: $sourceElement.offset().top };
        pointerMock($sourceElement).start(startPosition).down().move(0, 100).move(-1, 10).up();
        // assert
        assert.strictEqual(onReorderSpy.callCount, 1, 'onReorder event is called');

        // act
        pointerMock($sourceElement).start(startPosition).down().move(0, 100).move(0, 10).up();
        // assert
        assert.strictEqual(onReorderSpy.callCount, 2, 'onReorder event is called');
    });
    QUnit.test('after right', function(assert) {
        const onReorderSpy = sinon.spy();

        $('#scroll').css('padding', '50px');

        this.createSortable({
            moveItemOnDrop: true,
            onReorder: onReorderSpy
        }, $('#itemsWithScroll'));

        // act
        const $sourceElement = $('#scroll .draggable').eq(0);
        const startPosition = { x: $sourceElement.offset().left, y: $sourceElement.offset().top };
        pointerMock($sourceElement).start(startPosition).down().move(0, 100).move($sourceElement.width() + 1, 10).up();
        // assert
        assert.strictEqual(onReorderSpy.callCount, 1, 'onReorder event is called');

        // act
        pointerMock($sourceElement).start(startPosition).down().move(0, 100).move($sourceElement.width(), 10).up();
        // assert
        assert.strictEqual(onReorderSpy.callCount, 2, 'onReorder event is called');
    });
    QUnit.test('above top', function(assert) {
        // arrange
        const onReorderSpy = sinon.spy();

        $('#scroll').css('padding', '50px');
        $('#scroll').css('height', '500px');

        this.createSortable({
            moveItemOnDrop: true,
            onReorder: onReorderSpy
        }, $('#itemsWithScroll'));

        // act
        const $sourceElement = $('#scroll .draggable').eq(1);
        const startPosition = { x: 50, y: 50 };
        pointerMock($sourceElement).start(startPosition).down().move(50, 0).move(10, -1).up();
        // assert
        assert.strictEqual(onReorderSpy.callCount, 1, 'onReorder event is called');

        // act
        pointerMock($sourceElement).start(startPosition).down().move(50, 0).move(10, 0).up();
        // assert
        assert.strictEqual(onReorderSpy.callCount, 2, 'onReorder event is called');
    });
    QUnit.test('under bottom', function(assert) {
        // arrange
        const onReorderSpy = sinon.spy();

        $('#scroll').css('padding', '50px');
        $('#scroll').css('height', '500px');

        this.createSortable({
            moveItemOnDrop: true,
            onReorder: onReorderSpy
        }, $('#itemsWithScroll'));

        // act
        const $firstElement = $('#scroll .draggable').eq(0);
        pointerMock($firstElement).start({ x: 50, y: 0 }).down().move(50, 0).move(10, 500 + 50 + 1).up();

        // assert
        assert.strictEqual(onReorderSpy.callCount, 1, 'onReorder event is called');

        // act
        pointerMock($firstElement).start({ x: 50, y: 0 }).down().move(50, 0).move(10, 500 + 50).up();
        // assert
        assert.strictEqual(onReorderSpy.callCount, 2, 'onReorder event is called');
    });

});


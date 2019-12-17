import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import 'ui/sortable';
import fx from 'animation/fx';
import animationFrame from 'animation/frame';
import browser from 'core/utils/browser';

import 'common.css!';

fx.off = true;


QUnit.testStart(function() {
    let markup =
        `<style>
            .draggable {
                height: 30px;
            }
            .default {
                cursor: default;
            }
        </style>
        <div id="items" style="display: inline-block; vertical-align: top; width: 300px; height: 250px; position: relative; background: grey;">
            <div id="item1" class="draggable" style="background: yellow;">item1</div>
            <div id="item2" class="draggable" style="background: red;">item2</div>
            <div id="item3" class="draggable" style="background: blue;">item3</div>
        </div>
        <div id="items2" style="display: inline-block; vertical-align: top; width: 300px; height: 250px; position: relative; background: grey;">
            <div id="item4" class="draggable" style="background: yellow;">item4</div>
            <div id="item5" class="draggable" style="background: red;">item5</div>
            <div id="item6" class="draggable" style="background: blue;">item6</div>
        </div>
        <div id="items3" style="vertical-align: top; width: 300px; height: 250px; position: relative; background: grey;"></div>
        <div id="itemsHorizontal" style="width: 250px; height: 300px;">
            <div style="width: 30px; height: 300px; float: left;">item1</div>
            <div style="width: 30px; height: 300px; float: left;">item2</div>
            <div style="width: 30px; height: 300px; float: left;">item3</div>
        </div>
        <div id="itemsWithContentTemplate" style="width: 300px; height: 250px; position: relative; background: grey;">
            <div data-options="dxTemplate:{ name:'content' }">
                <div id="item11" class="draggable" style="background: yellow;">item1</div>
                <div id="item12" class="draggable" style="background: red;">item2</div>
                <div id="item13" class="draggable" style="background: blue;">item3</div>
            </div>
        </div>
        <div id="scroll" style="height: 250px; overflow: auto; background: grey; position: absolute; left: 0; top: 0;">
            <div id="itemsWithScroll" style="width: 300px;">
                <div id="item21" class="draggable" style="height: 50px; background: yellow;">item1</div>
                <div id="item22" class="draggable" style="height: 50px; background: red;">item2</div>
                <div id="item23" class="draggable" style="height: 50px; background: blue;">item3</div>
                <div id="item24" class="draggable" style="height: 50px; background: yellow;">item4</div>
                <div id="item25" class="draggable" style="height: 50px; background: red;">item5</div>
                <div id="item26" class="draggable" style="height: 50px; background: blue;">item6</div>
                <div id="item27" class="draggable" style="height: 50px; background: yellow;">item7</div>
                <div id="item28" class="draggable" style="height: 50px; background: red;">item8</div>
                <div id="item31" class="draggable" style="height: 50px; background: yellow;">item9</div>
                <div id="item32" class="draggable" style="height: 50px; background: red;">item10</div>
            </div>
        </div>
        <div id="bothScrolls" style="height: 600px; width: 300px; overflow: auto; background: grey; position: absolute; left: 0; top: 0;">
        <div id="itemsWithBothScrolls" style="overflow: visible; width: 600px;">
            <div id="item40" class="draggable" style="height: 50px; background: red; width: 600px;">item0</div>
            <div id="item41" class="draggable" style="height: 50px; background: yellow; width: 600px;">item1</div>
            <div id="item42" class="draggable" style="height: 50px; background: red; width: 600px;">item2</div>
            <div id="item43" class="draggable" style="height: 50px; background: blue; width: 600px;">item3</div>
            <div id="item44" class="draggable" style="height: 50px; background: yellow; width: 600px;">item4</div>
            <div id="item45" class="draggable" style="height: 50px; background: red; width: 600px;">item5</div>
            <div id="item46" class="draggable" style="height: 50px; background: blue; width: 600px;">item6</div>
            <div id="item47" class="draggable" style="height: 50px; background: yellow; width: 600px;">item7</div>
            <div id="item48" class="draggable" style="height: 50px; background: red; width: 600px;">item8</div>
            <div id="item49" class="draggable" style="height: 50px; background: yellow; width: 600px;">item9</div>
        </div>
    </div>
        `;

    $('#qunit-fixture').html(markup);
});

var SORTABLE_CLASS = 'dx-sortable',
    PLACEHOLDER_CLASS = 'dx-sortable-placeholder',
    PLACEHOLDER_SELECTOR = `.${PLACEHOLDER_CLASS}`,
    MAX_INTEGER = 2147483647;

var moduleConfig = {
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

var crossComponentModuleConfig = {
    createComponent: function(componentName, options, $element) {
        let instance = ($element || this.$element)[componentName](options)[componentName]('instance');
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

QUnit.module('rendering', moduleConfig);

QUnit.test('Element has class', function(assert) {
    assert.ok(this.createSortable().$element().hasClass(SORTABLE_CLASS));
});

QUnit.test('Drag template - check args', function(assert) {
    // arrange
    let items,
        dragTemplate = sinon.spy(() => {
            return $('<div>');
        });

    this.createSortable({
        filter: '.draggable',
        dragTemplate: dragTemplate
    });

    items = this.$element.children();

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

    let $items = this.$element.children();

    // act
    pointerMock($items.eq(0)).start().down().move(10, 0);
    $('<div>').addClass('my-drag-item').appendTo($dragContainer);

    // assert
    let $sortableDragging = $('body').children('.dx-sortable-dragging');
    assert.strictEqual($sortableDragging.length, 1, 'body contains dx-sortable-dragging');
    assert.strictEqual($sortableDragging.hasClass('dx-sortable-clone'), true, 'dx-sortable-dragging has dx-sortable-clone class');
    assert.strictEqual($sortableDragging.children('.my-drag-item').length, 1, 'dx-sortable-dragging contains my-drag-item');
});

QUnit.test('Default drag template', function(assert) {
    // arrange
    this.createSortable({
    });

    var $items = this.$element.children();

    // act
    pointerMock($items.eq(0)).start().down().move(10, 0);

    // assert
    var $draggingElement = $('.dx-sortable-dragging');
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

QUnit.test('While dragging cursor should be \'grabbing/pointer\'', function(assert) {
    // arrange
    this.createSortable({});

    // act
    pointerMock(this.$element.children().eq(0)).start().down().move(10, 0);

    // assert
    let cursor = browser.msie && parseInt(browser.version) <= 11 ? 'pointer' : 'grabbing';
    assert.equal($('.dx-sortable-dragging').children().first().css('cursor'), cursor, `cursor is ${cursor}`);
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
    let cursor = browser.msie && parseInt(browser.version) <= 11 ? 'pointer' : 'grabbing';
    assert.equal($('.dx-sortable-dragging').find('.default').eq(0).css('cursor'), cursor, `cursor is ${cursor}`);
});

QUnit.module('allowReordering', moduleConfig);

QUnit.test('allowReordering = false when dropFeedbackMode is \'push\'', function(assert) {
    // arrange
    let onDragChangeSpy = sinon.spy(),
        onReorderSpy = sinon.spy();

    this.createSortable({
        filter: '.draggable',
        allowReordering: false,
        dropFeedbackMode: 'push',
        moveItemOnDrop: true,
        onDragChange: onDragChangeSpy,
        onReorder: onReorderSpy
    });

    // act
    let pointer = pointerMock(this.$element.children().first()).start().down().move(0, 65);

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
    let onDragChangeSpy = sinon.spy(),
        onReorderSpy = sinon.spy();

    this.createSortable({
        filter: '.draggable',
        allowReordering: false,
        dropFeedbackMode: 'indicate',
        moveItemOnDrop: true,
        onDragChange: onDragChangeSpy,
        onReorder: onReorderSpy
    });

    // act
    let pointer = pointerMock(this.$element.children().first()).start().down().move(0, 65);

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
    let onDragChangeSpy = sinon.spy();

    this.createSortable({
        allowReordering: false,
        allowDropInsideItem: true,
        onDragChange: onDragChangeSpy
    });

    // act
    let pointer = pointerMock(this.$element.children().first()).start().down(15, 15).move(0, 50);

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
    let onDragChangeSpy = sinon.spy();

    this.createSortable({
        allowReordering: false,
        allowDropInsideItem: true,
        onDragChange: onDragChangeSpy
    });

    // act
    let pointer = pointerMock(this.$element.children().eq(1)).start().down(15, 45).move(0, -30);

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
    var sortable = this.createSortable({
        filter: '.draggable',
        moveItemOnDrop: true
    });

    // act
    sortable.option('allowReordering', false);
    let pointer = pointerMock(this.$element.children().first()).start().down().move(0, 65);

    // assert
    assert.strictEqual(this.$element.children().get(1).style.transform, '', 'item position is not changed');

    // act
    pointer.up();

    // assert
    assert.strictEqual(this.$element.children().first().text(), 'item1', 'first item is not changed');
});


QUnit.module('placeholder and source', moduleConfig);

QUnit.test('Source item if filter is not defined', function(assert) {
    // arrange
    this.createSortable({
        dropFeedbackMode: 'push'
    });

    let $items = this.$element.children();
    let $dragItemElement = $items.eq(0);

    // assert
    assert.strictEqual($items.length, 3, 'item count');

    // act
    pointerMock($dragItemElement).start().down().move(10, 0);

    // assert
    $items = this.$element.children();
    let $source = $items.eq(0);
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
    let $dragItemElement = $items.eq(0);

    // assert
    assert.strictEqual($items.length, 3, 'item count');

    // act
    pointerMock($dragItemElement).start().down().move(10, 0);

    // assert
    $items = this.$element.children().children();
    let $source = $items.eq(0);
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
    let $dragItemElement = $items.eq(0);

    // assert
    assert.strictEqual($items.length, 3, 'item count');

    // act
    pointerMock($dragItemElement).start().down().move(10, 0);

    // assert
    $items = this.$element.children();
    let $source = $items.eq(0);
    assert.strictEqual($items.length, 3, 'item count');
    assert.ok($source.hasClass('dx-sortable-source-hidden'), 'source item is hidden');
});

QUnit.test('Initial placeholder if dropFeedbackMode is indicate', function(assert) {
    // arrange
    let items,
        $placeholder,
        $dragItemElement;

    this.createSortable({
        dropFeedbackMode: 'indicate'
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

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
    $placeholder = $('.dx-sortable-placeholder');
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
    let items,
        $placeholder,
        $dragItemElement;

    this.createSortable({
        allowDropInsideItem: true
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // act
    var pointer = pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

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

QUnit.test('Initial placeholder if dropFeedbackMode is indicate and itemOrientation is horiontal', function(assert) {
    // arrange
    let items,
        $placeholder,
        $dragItemElement;

    this.$element = $('#itemsHorizontal');

    this.createSortable({
        dropFeedbackMode: 'indicate',
        itemOrientation: 'horizontal'
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(30, 0);

    // assert
    items = this.$element.children();
    $placeholder = $('.dx-sortable-placeholder');
    assert.strictEqual(items.length, 3, 'item count');
    assert.equal($placeholder.length, 1, 'element has placeholder class');
    assert.equal($placeholder.get(0).style.height, '300px', 'placeholder height style');
    assert.equal($placeholder.get(0).style.width, '', 'placeholder width style');
    assert.equal($placeholder.get(0).style.transform, 'translate(60px, 500px)', 'placeholder position');
});

QUnit.test('Source classes toggling', function(assert) {
    // arrange
    this.createSortable({
        dropFeedbackMode: 'push'
    });

    let items = this.$element.children(),
        $dragItemElement = items.eq(0);

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
    let items,
        $item,
        $dragItemElement;

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'push'
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

    // assert
    assert.strictEqual(items.length, 3, 'item count');

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(0, 30);

    // assert
    items = this.$element.children();
    $item = items.eq(0);
    assert.strictEqual(items.length, 3, 'item count');
    assert.strictEqual($item.attr('id'), 'item1', 'first item is a source');
    assert.ok($item.hasClass('dx-sortable-source-hidden'), 'has source-hidden class');

    assert.strictEqual(items[0].style.transform, '', 'items 1 is not moved');
    assert.strictEqual(items[1].style.transform, 'translate(0px, -30px)', 'items 2 is moved up');
    assert.strictEqual(items[2].style.transform, '', 'items 3 is not moved');
});

QUnit.test('Move items during dragging if content tempalte is defined', function(assert) {
    // arrange
    let items,
        $item,
        $dragItemElement;

    this.$element = $('#itemsWithContentTemplate');

    this.createSortable({
        dropFeedbackMode: 'push'
    });

    items = this.$element.children().children();
    $dragItemElement = items.eq(0);

    // assert
    assert.strictEqual(items.length, 3, 'item count');

    // act
    pointerMock($dragItemElement).start().down(15, 15).move(15, 1000);

    // assert
    items = this.$element.children().children();
    $item = items.eq(0);
    assert.strictEqual(items.length, 3, 'item count');
    assert.strictEqual($item.attr('id'), 'item11', 'first item is a source');
    assert.ok($item.hasClass('dx-sortable-source-hidden'), 'has source-hidden class');

    assert.strictEqual(items[0].style.transform, '', 'items 1 is not moved');
    assert.strictEqual(items[1].style.transform, 'translate(0px, -30px)', 'items 2 is moved up');
    assert.strictEqual(items[2].style.transform, 'translate(0px, -30px)', 'items 3 is moved up');
});

QUnit.test('Drop when dropFeedbackMode is push', function(assert) {
    // arrange
    let items,
        $dragItemElement;

    this.createSortable({
        filter: '.draggable',
        moveItemOnDrop: true,
        dropFeedbackMode: 'push'
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

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
    let items,
        $dragItemElement;

    this.createSortable({
        filter: '.draggable',
        moveItemOnDrop: true,
        dropFeedbackMode: 'indicate'
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

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

    let items = this.$element.children(),
        $dragItemElement = items.eq(0);

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
    let items,
        $item;

    this.createSortable({
        filter: '.draggable'
    });

    items = this.$element.children();

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
    let pointer,
        items;

    this.$element.append('<div id=\'item4\'></div>');
    this.createSortable({
        filter: '.draggable',
        moveItemOnDrop: true
    });

    items = this.$element.children();

    // assert
    assert.strictEqual(items.length, 4, 'item count');

    // act
    pointer = pointerMock(items.eq(0)).start().down().move(0, 90);

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
    let pointer,
        items;

    this.$element.append('<div id=\'item4\'></div>');
    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate',
        moveItemOnDrop: true
    });

    items = this.$element.children();

    // assert
    assert.strictEqual(items.length, 4, 'item count');

    // act
    pointer = pointerMock(items.eq(0)).start().down().move(0, 90);

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


QUnit.module('Events', crossComponentModuleConfig);

QUnit.test('onDragChange - check args when dragging an item down', function(assert) {
    // arrange
    let items,
        args,
        onDragChange = sinon.spy();

    var data = {};
    this.createSortable({
        filter: '.draggable',
        data: data,
        onDragChange: onDragChange
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

    // assert
    args = onDragChange.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
    assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 1, 'toIndex');
    assert.strictEqual(args[0].fromData, data, 'fromData');
    assert.strictEqual(args[0].toData, data, 'toData');
});

QUnit.test('onDragChange - check args when dragging an item up', function(assert) {
    // arrange
    let items,
        args,
        onDragChange = sinon.spy();

    this.createSortable({
        filter: '.draggable',
        onDragChange: onDragChange
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(2)).start().down().move(0, 30);

    // assert
    args = onDragChange.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(2), 'source element');
    assert.strictEqual(args[0].fromIndex, 2, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 1, 'toIndex');
});

QUnit.test('onDragChange - check args when dragging to last position', function(assert) {
    // arrange
    let items,
        args,
        onDragChange = sinon.spy();

    this.createSortable({
        filter: '.draggable',
        onDragChange: onDragChange
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 90);

    // assert
    args = onDragChange.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
    assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 2, 'toIndex');
});

QUnit.test('\'onDragChange\' option changing', function(assert) {
    // arrange
    let args,
        items,
        onDragChange = sinon.spy();

    let sortableInstance = this.createSortable({
        filter: '.draggable'
    });

    items = this.$element.children();

    // act
    sortableInstance.option('onDragChange', onDragChange);

    // arrange
    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

    // assert
    args = onDragChange.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
    assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 1, 'toIndex');
});

QUnit.test('\'onDragChange\' event - not drag item when eventArgs.cancel is true', function(assert) {
    // arrange
    let items,
        $dragItemElement;

    this.createSortable({
        filter: '.draggable',
        onDragChange: function(e) {
            e.cancel = true;
        }
    });

    items = this.$element.children();
    $dragItemElement = items.eq(0);

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
    let items,
        args,
        onDragEnd = sinon.spy();


    this.createSortable({
        filter: '.draggable',
        data: 'x',
        onDragEnd: onDragEnd
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30).up();

    // assert
    args = onDragEnd.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
    assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 1, 'toIndex');
    assert.strictEqual(args[0].fromData, 'x', 'fromData');
    assert.strictEqual(args[0].toData, 'x', 'toData');
    assert.strictEqual(args[0].dropInsideItem, false, 'dropInsideItem is false');
});

QUnit.test('onDragEnd - check args when dragging an item up', function(assert) {
    // arrange
    let items,
        args,
        onDragEnd = sinon.spy();


    this.createSortable({
        filter: '.draggable',
        onDragEnd: onDragEnd
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(2)).start().down().move(0, 30).up();

    // assert
    args = onDragEnd.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(2), 'source element');
    assert.strictEqual(args[0].fromIndex, 2, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 1, 'toIndex');
});

QUnit.test('onDragEnd - check args when dragging to last position', function(assert) {
    // arrange
    let items,
        args,
        onDragEnd = sinon.spy();

    this.createSortable({
        filter: '.draggable',
        onDragEnd: onDragEnd
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 90).up();

    // assert
    args = onDragEnd.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
    assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 2, 'toIndex');
});

QUnit.test('onDragEnd with eventArgs.cancel is true - the draggable element should not change position', function(assert) {
    // arrange
    let items;

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate',
        moveItemOnDrop: true,
        onDragEnd: function(e) {
            e.cancel = true;
        }
    });

    items = this.$element.children();

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
    let items,
        args,
        onDragEnd = sinon.spy();


    this.createSortable({
        dropFeedbackMode: 'indicate',
        filter: '.draggable',
        data: 'x',
        onDragEnd: onDragEnd
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(1)).start().down(45, 45).move(10, 0).up();

    // assert
    args = onDragEnd.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(1), 'source element');
    assert.strictEqual(args[0].fromIndex, 1, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 1, 'toIndex');
    assert.strictEqual(args[0].fromData, 'x', 'fromData');
    assert.strictEqual(args[0].toData, 'x', 'toData');
    assert.strictEqual(args[0].dropInsideItem, false, 'dropInsideItem is false');
});

QUnit.test('The draggable element should not change position without moveItemOnDrop', function(assert) {
    // arrange
    let items;

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate'
    });

    items = this.$element.children();

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
    let items,
        args,
        onDragEnd = sinon.spy();


    this.createSortable({
        allowDropInsideItem: true,
        onDragEnd: onDragEnd
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30).up();

    // assert
    args = onDragEnd.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
    assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 1, 'toIndex');
    assert.strictEqual(args[0].dropInsideItem, true, 'dropInsideItem');
});

QUnit.test('onPlaceholderPrepared - check args when dragging', function(assert) {
    // arrange
    let items,
        args,
        onPlaceholderPrepared = sinon.spy();


    this.createSortable({
        filter: '.draggable',
        onPlaceholderPrepared: onPlaceholderPrepared,
        dropFeedbackMode: 'indicate'
    });

    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

    // assert
    items = this.$element.children();
    args = onPlaceholderPrepared.getCall(0).args;
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
    let args,
        items,
        onPlaceholderPrepared = sinon.spy();

    let sortableInstance = this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate'
    });

    items = this.$element.children();

    // act
    sortableInstance.option('onPlaceholderPrepared', onPlaceholderPrepared);

    // arrange
    items = this.$element.children();

    // act
    pointerMock(items.eq(0)).start().down(15, 15).move(0, 30);

    // assert
    items = this.$element.children();
    args = onPlaceholderPrepared.getCall(0).args;
    assert.deepEqual($(args[0].itemElement).get(0), items.get(0), 'source element');
    assert.deepEqual($(args[0].placeholderElement).get(0), $('body').children('.dx-sortable-placeholder').get(0), 'placeholder element');
    assert.deepEqual($(args[0].dragElement).get(0), $('body').children('.dx-sortable-dragging').get(0), 'dragging element');
    assert.strictEqual(args[0].fromIndex, 0, 'fromIndex');
    assert.strictEqual(args[0].toIndex, 1, 'toIndex');
});

QUnit.test('onAdd - check args', function(assert) {
    // arrange
    let onAddSpy = sinon.spy();

    let sortable1 = this.createSortable({
        filter: '.draggable',
        data: 'x',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        data: 'y',
        moveItemOnDrop: true,
        onAdd: onAddSpy
    }, $('#items2'));

    // act
    let $sourceElement = sortable1.$element().children().eq(1);
    pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(350, 30).move(50, 0).up();

    // assert
    assert.strictEqual(onAddSpy.callCount, 1, 'onAdd is called');
    assert.deepEqual(onAddSpy.getCall(0).args[0].fromComponent, sortable1, 'sourceComponent');
    assert.deepEqual(onAddSpy.getCall(0).args[0].toComponent, sortable2, 'component');
    assert.strictEqual(onAddSpy.getCall(0).args[0].fromIndex, 1, 'fromIndex');
    assert.strictEqual(onAddSpy.getCall(0).args[0].toIndex, 2, 'toIndex');
    assert.strictEqual(onAddSpy.getCall(0).args[0].fromData, 'x', 'fromData');
    assert.strictEqual(onAddSpy.getCall(0).args[0].toData, 'y', 'toData');
    assert.strictEqual($(onAddSpy.getCall(0).args[0].itemElement).get(0), $sourceElement.get(0), 'itemElement');
    assert.strictEqual($(sortable2.element()).children('#item2').length, 1, 'item is added');
});

QUnit.test('onAdd - not add item when eventArgs.cancel is true', function(assert) {
    // arrange
    let onAddSpy = sinon.spy((e) => { e.cancel = true; });

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
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
    let onAddSpy = sinon.spy();

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
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
    let onRemoveSpy = sinon.spy();

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        data: 'x',
        onRemove: onRemoveSpy
    }, $('#items'));

    let sortable2 = this.createSortable({
        filter: '.draggable',
        moveItemOnDrop: true,
        data: 'y',
        group: 'shared'
    }, $('#items2'));

    // act
    let $sourceElement = sortable1.$element().children().eq(1);
    pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(350, 30).move(50, 0).up();

    // assert
    assert.strictEqual(onRemoveSpy.callCount, 1, 'onRemove is called');
    assert.deepEqual(onRemoveSpy.getCall(0).args[0].toComponent, sortable2, 'targetComponent');
    assert.deepEqual(onRemoveSpy.getCall(0).args[0].fromComponent, sortable1, 'component');
    assert.strictEqual(onRemoveSpy.getCall(0).args[0].fromIndex, 1, 'fromIndex');
    assert.strictEqual(onRemoveSpy.getCall(0).args[0].toIndex, 2, 'toIndex');
    assert.strictEqual(onRemoveSpy.getCall(0).args[0].fromData, 'x', 'fromData');
    assert.strictEqual(onRemoveSpy.getCall(0).args[0].toData, 'y', 'toData');
    assert.strictEqual($(onRemoveSpy.getCall(0).args[0].itemElement).get(0), $sourceElement.get(0), 'itemElement');
    assert.strictEqual($(sortable1.element()).children('#item2').length, 0, 'item is removed');
});

QUnit.test('onRemove - not add item when eventArgs.cancel is true', function(assert) {
    // arrange
    let onRemoveSpy = sinon.spy((e) => { e.cancel = true; });

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        onRemove: onRemoveSpy
    }, $('#items'));

    let sortable2 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        moveItemOnDrop: true
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

    // assert
    assert.strictEqual(onRemoveSpy.callCount, 1, 'onRemove is called');
    assert.strictEqual($(sortable1.element()).children('#item1').length, 1, 'item isn\'t removed');
    assert.strictEqual($(sortable1.element()).children('#item1').attr('class'), 'draggable', 'source item hasn\'t dx-sortable-source class');
    assert.strictEqual($(sortable2.element()).children('#item1').attr('class'), 'draggable', 'cloned source item hasn\'t dx-sortable-source class');
});

QUnit.test('onRemove - not add item without moveItemOnDrop', function(assert) {
    // arrange
    let onRemoveSpy = sinon.spy();

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        onRemove: onRemoveSpy
    }, $('#items'));

    let sortable2 = this.createSortable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

    // assert
    assert.strictEqual(onRemoveSpy.callCount, 1, 'onRemove is called');
    assert.strictEqual($(sortable1.element()).children('#item1').length, 1, 'item isn\'t removed');
    assert.strictEqual($(sortable1.element()).children('#item1').attr('class'), 'draggable', 'source item hasn\'t dx-sortable-source class');
    assert.strictEqual($(sortable2.element()).children('#item1').length, 0, 'source item is not added to second sortable');
});

QUnit.test('onReorder - check args', function(assert) {
    // arrange
    let onReorderSpy = sinon.spy();

    let sortable = this.createSortable({
        filter: '.draggable',
        data: 'x',
        onReorder: onReorderSpy,
        moveItemOnDrop: true
    }, $('#items'));

    // act
    let $sourceElement = sortable.$element().children().eq(0);

    pointerMock($sourceElement).start().down().move(0, 40).move(0, 10).up();

    // assert
    assert.strictEqual(onReorderSpy.callCount, 1, 'onRemove is called');
    assert.strictEqual(onReorderSpy.getCall(0).args[0].fromIndex, 0, 'fromIndex');
    assert.strictEqual(onReorderSpy.getCall(0).args[0].toIndex, 1, 'toIndex');
    assert.strictEqual(onReorderSpy.getCall(0).args[0].fromData, 'x', 'fromData');
    assert.strictEqual(onReorderSpy.getCall(0).args[0].toData, 'x', 'toData');
    assert.strictEqual($(onReorderSpy.getCall(0).args[0].itemElement).get(0), $sourceElement.get(0), 'itemElement');
});

QUnit.test('onDragMove, onDragEnd, onDragChange, onReorder - check itemData arg', function(assert) {
    // arrange
    let itemData = { test: true },
        options = {
            filter: '.draggable',
            onDragStart: function(e) {
                e.itemData = itemData;
            },
            onDragMove: sinon.spy(),
            onDragEnd: sinon.spy(),
            onDragChange: sinon.spy(),
            onReorder: sinon.spy()
        };

    let sortable = this.createSortable(options, $('#items'));

    // act
    let $sourceElement = sortable.$element().children().eq(0);
    pointerMock($sourceElement).start().down().move(0, 25).move(0, 5).up();

    // assert
    assert.strictEqual(options.onDragMove.getCall(0).args[0].itemData, itemData, 'itemData in onDragMove event arguments');
    assert.strictEqual(options.onDragEnd.getCall(0).args[0].itemData, itemData, 'itemData in onDragEnd event arguments');
    assert.strictEqual(options.onDragChange.getCall(0).args[0].itemData, itemData, 'itemData in onDragChange event arguments');
    assert.strictEqual(options.onReorder.getCall(0).args[0].itemData, itemData, 'itemData in onReorder event arguments');
});

QUnit.test('onAdd, onRemove - check itemData arg', function(assert) {
    // arrange
    let itemData = { test: true },
        onAddSpy = sinon.spy(),
        onRemoveSpy = sinon.spy();

    let sortable1 = this.createSortable({
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
    let $sourceElement = sortable1.$element().children().eq(1);
    pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(350, 30).move(50, 0).up();

    // assert
    assert.deepEqual(onAddSpy.getCall(0).args[0].itemData, itemData, 'itemData in onDragMove event arguments');
    assert.deepEqual(onRemoveSpy.getCall(0).args[0].itemData, itemData, 'itemData in onDragEnd event arguments');
});

// T835349
QUnit.test('The onAdd event should be fired when there is horizontal scrolling', function(assert) {
    // arrange
    let onAddSpy = sinon.spy();

    let sortable1 = this.createSortable({
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
    let $sourceElement = $(sortable1.element()).children().eq(1);
    pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(350, 0).move(10, 0).up();

    // assert
    assert.strictEqual(onAddSpy.callCount, 1, 'onAdd event is called once');
});

// T835349
QUnit.test('The onAdd event should be fired when there is vertical scrolling', function(assert) {
    // arrange
    let onAddSpy = sinon.spy();

    $('#scroll').css('top', '300px');
    $('#bothScrolls').css('height', '300px');

    let sortable1 = this.createSortable({
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
    let $sourceElement = $(sortable1.element()).children().eq(1);
    pointerMock($sourceElement).start({ x: 0, y: 35 }).down().move(0, 350).move(0, 10).up();

    // assert
    assert.strictEqual(onAddSpy.callCount, 1, 'onAdd event is called once');
});


QUnit.module('Cross-Component Drag and Drop', crossComponentModuleConfig);

QUnit.test('Dragging item to another the sortable widget', function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
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
    let items1, items2;

    let sortable1 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared',
        allowReordering: false
    }, $('#items'));

    let sortable2 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared',
        allowReordering: false
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
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
    let items1, items2;

    let sortable1 = this.createSortable({
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

    let sortable2 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
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


    let sortable1 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items2'));


    // act
    let pointer = pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    assert.strictEqual(sortable2.$element().children().last()[0].style.marginBottom, '29px', 'items2 last item has margin bottom');
    assert.strictEqual(sortable2.$element().css('overflow'), 'hidden', 'overflow is hidden to correct applying margin to sortable element');

    // act
    pointer.up();

    // assert
    assert.strictEqual(sortable2.$element().children().last()[0].style.marginBottom, '1px', 'items2 last item margin bottom is restored');
});


QUnit.test('Dragging item with dropFeedbackMode push to another the sortable widget with dropFeedbackMode indicate', function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
        dropFeedbackMode: 'indicate',
        filter: '.draggable',
        group: 'shared'
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 3, 'first list - item count');
    assert.strictEqual(items2.length, 3, 'second list - item count');
    assert.strictEqual(items1.filter('#item1').length, 1, 'first list - first item is exists');
    assert.strictEqual(items1.filter('#item1').hasClass('dx-sortable-source-hidden'), true, 'first list - first item is hidden');
    assert.strictEqual(items2.filter('#item1').length, 0, 'second list - first item of the first list is not added');
    assert.strictEqual($('body').children('.dx-sortable-placeholder').length, 1, 'placeholder is in body');
});

QUnit.test('Dragging item to another the sortable widget when group as object', function(assert) {
    // arrange
    let items1,
        items2,
        group = {};

    let sortable1 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: group
    }, $('#items'));

    let sortable2 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: group
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
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
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
        filter: '.draggable'
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 3, 'first list - item count');
    assert.strictEqual(items2.length, 3, 'second list - item count');
});

QUnit.test('Dropping item to another the sortable widget', function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        moveItemOnDrop: true
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 2, 'first list - item count');
    assert.strictEqual(items2.length, 4, 'second list - item count');
    assert.strictEqual(items1.filter('#item1').length, 0, 'first list - first item is removed');
    assert.strictEqual(items2.filter('#item1').length, 1, 'second list - first item of the first list was added');
});

QUnit.test('Dragging item to another the sortable widget with dropFeedbackMode indicate', function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        dropFeedbackMode: 'push',
    }, $('#items'));

    let sortable2 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        dropFeedbackMode: 'indicate',
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 3, 'first list - item count');
    assert.strictEqual(items2.length, 3, 'second list - item count');
    assert.ok($('body').children('.dx-sortable-placeholder').length, 1, 'placeholder is in body');
});

QUnit.test('Dropping item to another the sortable widget with dropFeedbackMode indicate', function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        dropFeedbackMode: 'indicate'
    }, $('#items'));

    let sortable2 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        dropFeedbackMode: 'indicate',
        moveItemOnDrop: true
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 2, 'first list - item count');
    assert.strictEqual(items2.length, 4, 'second list - item count');
    assert.strictEqual(items1.filter('#item1').length, 0, 'first list - first item is removed');
    assert.strictEqual(items2.filter('#item1').length, 1, 'second list - first item of the first list was added');
});

QUnit.test('Dragging items between sortable widgets', function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        moveItemOnDrop: true
    }, $('#items'));

    let sortable2 = this.createSortable({
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
    let items2;

    let sortable1 = this.createSortable({
        group: 'shared',
        dropFeedbackMode: 'push'
    }, $('#items'));

    let sortable2 = this.createSortable({
        group: 'shared',
        dropFeedbackMode: 'push'
    }, $('#items2'));

    // act
    let pointer = pointerMock(sortable1.$element().children().eq(0));
    pointer.start().down().move(350, 0).move(50, 0);

    // assert
    items2 = $(sortable2.$element()).children();
    assert.strictEqual(items2[0].style.transform, 'translate(0px, 30px)', 'items2 1 is moved down');
    assert.strictEqual(items2[1].style.transform, 'translate(0px, 30px)', 'items2 2 is moved down');
    assert.strictEqual(items2[2].style.transform, 'translate(0px, 30px)', 'items2 3 is moved down');

    // act
    sinon.spy(fx, 'stop');
    pointer.move(300, 0);

    // assert
    assert.strictEqual(items2[0].style.transform, 'none', 'items2 1 is moved down');
    assert.strictEqual(items2[1].style.transform, 'none', 'items2 2 is moved down');
    assert.strictEqual(items2[2].style.transform, 'none', 'items2 3 is moved down');
    assert.strictEqual(fx.stop.callCount, 3, 'fx.stop call count');
    assert.strictEqual(fx.stop.getCall(0).args[0].get(0), items2[0], 'fx.stop called for items2 1');
    assert.strictEqual(fx.stop.getCall(1).args[0].get(0), items2[1], 'fx.stop called for items2 1');
    assert.strictEqual(fx.stop.getCall(2).args[0].get(0), items2[2], 'fx.stop called for items2 1');
});

QUnit.test('items should not be moved after leave and enter', function(assert) {
    // arrange
    let sortable1 = this.createSortable({
        group: 'shared',
        dropFeedbackMode: 'push'
    }, $('#items'));

    this.createSortable({
        group: 'shared',
        dropFeedbackMode: 'push'
    }, $('#items2'));

    // act
    let pointer = pointerMock(sortable1.$element().children().eq(0));
    pointer.start().down().move(350, 0).move(50, 0).move(-50).move(-350);

    // assert
    let items1 = $(sortable1.$element()).children();
    assert.strictEqual(items1[0].style.transform, '', 'items1 1 is not moved');
    assert.strictEqual(items1[1].style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'items1 2 is not moved');
    assert.strictEqual(items1[2].style.transform, browser.mozilla ? 'translate(0px)' : 'translate(0px, 0px)', 'items1 3 is not moved');
});

QUnit.test('Items should be moved after leave sortable if group is defined', function(assert) {
    // arrange
    let sortable = this.createSortable({
        group: 'shared',
        dropFeedbackMode: 'push'
    }, $('#items'));

    // act
    let pointer = pointerMock(sortable.$element().children().eq(0));
    pointer.start().down(0, 0).move(0, 1).move(0, -10);

    // assert
    let items = $(sortable.$element()).children();
    assert.strictEqual(items[0].style.transform, '', 'items 1 is not moved');
    assert.strictEqual(items[1].style.transform, 'translate(0px, -30px)', 'items 2 is moved up');
    assert.strictEqual(items[2].style.transform, 'translate(0px, -30px)', 'items 3 is moved up');
});

QUnit.test('Items should not be moved after leave sortable if group is not defined', function(assert) {
    // arrange
    let sortable = this.createSortable({
        dropFeedbackMode: 'push'
    }, $('#items'));

    // act
    let pointer = pointerMock(sortable.$element().children().eq(0));
    pointer.start().down(0, 0).move(0, 1).move(0, -10);

    // assert
    let items = $(sortable.$element()).children();
    assert.strictEqual(items[0].style.transform, '', 'items 1 is not moved');
    assert.strictEqual(items[1].style.transform, '', 'items 2 is moved up');
    assert.strictEqual(items[2].style.transform, '', 'items 3 is moved up');
});

QUnit.test('Update item points when dragging an item to another the sortable widget if dropFeedbackMode is push', function(assert) {
    // arrange
    let sortable1 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items2'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(350, 0).move(50, 0);

    // assert
    var itemPoints = sortable2.option('itemPoints');
    assert.equal(itemPoints.length, 4, 'point count');
    assert.deepEqual(itemPoints[0].top, 30, 'top of the first point');
    assert.deepEqual(itemPoints[0].index, 0, 'index of the first point');
    assert.deepEqual(itemPoints[1].top, 60, 'top of the first point');
    assert.deepEqual(itemPoints[1].index, 1, 'index of the first point');
    assert.deepEqual(itemPoints[2].top, 90, 'top of the second point');
    assert.deepEqual(itemPoints[2].index, 2, 'index of the second point');
    assert.deepEqual(itemPoints[3].top, 120, 'top of the third point');
    assert.deepEqual(itemPoints[3].index, 3, 'index of the third point');
});

QUnit.test('Drag and drop item from draggable to sortable', function(assert) {
    // arrange
    let items1, items2;

    let draggable = this.createDraggable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        moveItemOnDrop: true
    }, $('#items2'));

    // act
    pointerMock(draggable.$element().children().eq(0)).start().down().move(350, 0).move(50, 0).up();

    // assert
    items1 = draggable.$element().children();
    items2 = sortable.$element().children();
    assert.strictEqual(items1.length, 2, 'first list - item count');
    assert.strictEqual(items2.length, 4, 'second list - item count');
    assert.strictEqual(items1.filter('#item1').length, 0, 'first list - draggable item is removed');
    assert.strictEqual(items2.filter('#item1').length, 1, 'second list - item from second list');
    assert.strictEqual(items2.first().attr('id'), 'item1', 'second list - new item in first position');
});

QUnit.test('Drag and drop item from sortable to draggable should not move item', function(assert) {
    // arrange
    let items1, items2;

    let draggable = this.createDraggable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable = this.createSortable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items2'));

    // act
    pointerMock(sortable.$element().children().eq(0)).start({ x: 304, y: 0 }).down().move(-250, 0).move(-50, 0).up();

    // assert
    items1 = draggable.$element().children();
    items2 = sortable.$element().children();
    assert.strictEqual(items1.length, 3, 'first list items are not changed');
    assert.strictEqual(items2.length, 3, 'second list items are not changed');
});

QUnit.test('Drag and drop item from sortable to draggable with drop handler', function(assert) {
    // arrange
    let items1, items2;

    let draggable = this.createDraggable({
        filter: '.draggable',
        group: 'shared',
        onDrop: function(e) {
            if(e.fromComponent !== e.toComponent) {
                $(e.element).append(e.itemElement);
            }
        }
    }, $('#items'));

    let sortable = this.createSortable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items2'));

    // act
    pointerMock(sortable.$element().children().eq(0)).start({ x: 304, y: 0 }).down().move(-250, 0).move(-50, 0).up();

    // assert
    items1 = draggable.$element().children();
    items2 = sortable.$element().children();
    assert.strictEqual(items1.length, 4, 'first list - item count');
    assert.strictEqual(items2.length, 2, 'second list - item count');
    assert.strictEqual(items1.filter('#item4').length, 1, 'first list - item from second list');
    assert.strictEqual(items1.last().attr('id'), 'item4', 'first list - new item in last position');
    assert.strictEqual(items2.filter('#item4').length, 0, 'second list - draggable item is removed');
});

QUnit.test('Drag and drop item to empty sortable', function(assert) {
    // arrange
    let items1, items2;

    let sortable1 = this.createSortable({
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
        filter: '.draggable',
        group: 'shared',
        moveItemOnDrop: true
    }, $('#items3'));

    // act
    pointerMock(sortable1.$element().children().eq(0)).start().down().move(0, 300).move(0, 10).up();

    // assert
    items1 = sortable1.$element().children();
    items2 = sortable2.$element().children();
    assert.strictEqual(items1.length, 2, 'first list - item count');
    assert.strictEqual(items2.length, 1, 'second list - item count');
    assert.strictEqual(items1.filter('#item1').length, 0, 'first list - draggable item is removed');
    assert.strictEqual(items2.filter('#item1').length, 1, 'second list - item from first list');
});

QUnit.test('Placeholder should not visible on drag item to empty sortable', function(assert) {
    // arrange
    let sortable1 = this.createSortable({
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
    let items1, items2;

    $('#items3').append('<div id=\'item7\' class=\'draggable\' style=\'width: 300px; height: 30px; background: blue;\'>item7</div>');

    let sortable1 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items'));

    let sortable2 = this.createSortable({
        dropFeedbackMode: 'push',
        filter: '.draggable',
        group: 'shared'
    }, $('#items3'));

    // act
    let pointer = pointerMock(sortable2.$element().children().eq(0)).start({ x: 0, y: 310 }).down().move(0, -300).move(0, -10);

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

            this.createSortable = (options) => {
                return this.sortableInstance = this.$element.dxSortable(options).dxSortable('instance');
            };
        },
        afterEach: function() {
            this.clock.restore();
            this.clock.reset();

            animationFrame.requestAnimationFrame = this.originalRAF;

            $('#qunit-fixture').removeClass('qunit-fixture-visible');
            this.sortableInstance && this.sortableInstance.dispose();
        }
    };
}

QUnit.module('With scroll', getModuleConfigForTestsWithScroll('#itemsWithScroll', '#scroll'));

QUnit.test('Placeholder position should be updated during autoscroll', function(assert) {
    // arrange
    let pointer,
        items,
        previousPlaceholderOffsetTop,
        currentPlaceholderOffsetTop;

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate',
        scrollSpeed: 10
    });

    items = this.$element.children();

    // act, assert
    pointer = pointerMock(items.eq(0)).start().down().move(0, 189);
    this.clock.tick(10);

    pointer.move(0, 10);
    this.clock.tick(10);

    previousPlaceholderOffsetTop = $(PLACEHOLDER_SELECTOR).offset().top;

    for(let i = 0; i < 3; i++) {
        this.clock.tick(10);
        currentPlaceholderOffsetTop = $(PLACEHOLDER_SELECTOR).offset().top;

        assert.ok(currentPlaceholderOffsetTop !== previousPlaceholderOffsetTop, 'placeholder was updated');

        previousPlaceholderOffsetTop = currentPlaceholderOffsetTop;
    }
});

QUnit.test('Placeholder should not be visible outside bottom of scroll container', function(assert) {
    // arrange
    let pointer,
        items;

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate'
    });

    items = this.$element.children();

    // act
    pointer = pointerMock(items.eq(0)).start().down().move(0, 250);

    // assert
    assert.ok($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is visisble');

    // act
    pointer.move(0, 50);

    // assert
    assert.notOk($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is not visible');
});

QUnit.test('Placeholder should not be visible outside bottom of scroll container if overflow on sortable', function(assert) {
    // arrange
    let pointer,
        items;

    this.$scroll.css('overflow', '');
    this.$element.css({
        overflow: 'auto',
        height: 250
    });

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate'
    });

    items = this.$element.children();

    // act
    pointer = pointerMock(items.eq(0)).start().down().move(0, 250);

    // assert
    assert.ok($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is visisble');

    // act
    pointer.move(0, 50);

    // assert
    assert.notOk($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is not visible');
});

QUnit.test('Placeholder should not be visible outside top of scroll container', function(assert) {
    // arrange
    let pointer,
        items;

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate',
        autoScroll: false
    });

    items = this.$element.children();

    this.$scroll.scrollTop(50);

    // act
    pointer = pointerMock(items.eq(2)).start().down(0, 100).move(0, -100);

    // assert
    assert.ok($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is visisble');

    // act
    pointer.move(0, -50);

    // assert
    assert.notOk($(PLACEHOLDER_SELECTOR).is(':visible'), 'placeholder is not visible');
});

QUnit.module('With both scrolls', getModuleConfigForTestsWithScroll('#itemsWithBothScrolls', '#bothScrolls'));

// T830034
QUnit.test('Placeholder width and offset should be correct if horizontal scroll exists and items have left margin', function(assert) {
    // arrange
    let items,
        maxScroll = this.$scroll.prop('scrollWidth') - this.$scroll.width();

    $('.draggable').css('margin-left', '40px');

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate',
        scrollSpeed: 10
    });

    items = this.$element.children();

    function scrollTestIteration(targetY, expectedWidth, expectedOffset) {
        // act
        let pointer = pointerMock(items.eq(0)).start().down().move(0, targetY),
            $placeholder;

        $placeholder = $(PLACEHOLDER_SELECTOR);

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
    let items,
        maxScroll = this.$scroll.prop('scrollWidth') - this.$scroll.width();

    $('.draggable').css('width', '560');
    $('.draggable').css('margin-right', '40px');

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate',
        scrollSpeed: 10
    });

    items = this.$element.children();

    function scrollTestIteration(targetY, expectedWidth, expectedOffset) {
        // act
        let pointer = pointerMock(items.eq(0)).start().down().move(0, targetY),
            $placeholder;

        $placeholder = $(PLACEHOLDER_SELECTOR);

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
    let items,
        maxScroll = this.$scroll.prop('scrollWidth') - this.$scroll.width();

    $('.draggable').css('width', '520px');
    $('.draggable').css('margin-right', '40px');
    $('.draggable').css('margin-left', '40px');

    this.createSortable({
        filter: '.draggable',
        dropFeedbackMode: 'indicate',
        scrollSpeed: 10
    });

    items = this.$element.children();

    function scrollTestIteration(targetY, expectedWidth, expectedOffset) {
        // act
        let pointer = pointerMock(items.eq(0)).start().down().move(0, targetY),
            $placeholder;

        $placeholder = $(PLACEHOLDER_SELECTOR);

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

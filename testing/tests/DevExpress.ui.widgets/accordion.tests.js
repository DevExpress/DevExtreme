import $ from 'jquery';
import domUtils from 'core/utils/dom';
import holdEvent from 'events/hold';
import fx from 'animation/fx';
import { noop, deferUpdate } from 'core/utils/common';
import config from 'core/config';
import pointerMock from '../../helpers/pointerMock.js';
import { DataSource } from 'data/data_source/data_source';
import CustomStore from 'data/custom_store';
import { isRenderer } from 'core/utils/type';
import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import Accordion from 'ui/accordion';
import keyboardMock from '../../helpers/keyboardMock.js';
import themes from 'ui/themes';

import 'common.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="container">\
            <div id="accordion"></div>\
        </div>\
        \
        <div id="html-template-accordion">\
            <div style="height: 20px" data-options="dxTemplate: { name: \'title\' }" data-bind="text: title"></div>\
        </div>\
        \
        <div id="templated-accordion">\
            <div data-options="dxTemplate: { name: \'title\' }" data-bind="text: title"></div>\
            <div data-options="dxTemplate: { name: \'item\' }" data-bind="text: text"></div>\
            <div data-options="dxTemplate: { name: \'newTemplate\' }">New text</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const ACCORDION_WRAPPER_CLASS = 'dx-accordion-wrapper';
const ACCORDION_ITEM_CLASS = 'dx-accordion-item';
const ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';
const ACCORDION_ITEM_OPENED_CLASS = 'dx-accordion-item-opened';
const ACCORDION_ITEM_CLOSED_CLASS = 'dx-accordion-item-closed';

const moduleSetup = {
    beforeEach: function() {
        fx.off = true;
        this.savedSimulatedTransitionEndDelay = fx._simulatedTransitionEndDelay;
        fx._simulatedTransitionEndDelay = 0;
        executeAsyncMock.setup();

        this.$element = $('#accordion');
        this.items = [
            { title: 'Title 1', text: 'Text 1' },
            { title: 'Title 2', text: 'Text 2' },
            { title: 'Title 3', text: 'Text 3' }
        ];
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
        fx.off = false;
        fx._simulatedTransitionEndDelay = this.savedSimulatedTransitionEndDelay;
    }
};


QUnit.module('widget rendering', moduleSetup, () => {
    QUnit.test('Widget should be rendered without exception inside deferUpdate', function(assert) {
        let $accordion;

        deferUpdate(function() {
            $accordion = $('<div>').appendTo('#qunit-fixture').dxAccordion({
                items: ['Test1', 'Test2']
            });
        });

        const $accordionItemTitles = $accordion.find(`.${ACCORDION_ITEM_TITLE_CLASS}-caption`);
        const $accordionItemBodies = $accordion.find(`.${ACCORDION_ITEM_BODY_CLASS}`);

        assert.equal($accordionItemTitles.length, 2, 'two item are rendered');
        assert.equal($accordionItemTitles.eq(0).text(), 'Test1', 'first title');
        assert.equal($accordionItemTitles.eq(1).text(), 'Test2', 'second title');

        assert.equal($accordionItemBodies.length, 1, 'one item body is rendered');
        assert.equal($accordionItemBodies.eq(0).text(), 'Test1', 'first body text');
    });

    QUnit.test('item content is hidden when item is not opened', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items,
            selectedIndex: 0
        }).dxAccordion('instance');
        const $items = this.$element.find('.' + ACCORDION_ITEM_CLASS);

        instance.expandItem(1);

        assert.ok(!$items.eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'closed item has no \'item opened\' class');
        assert.ok($items.eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'opened item has \'item opened\' class');
    });

    QUnit.test('height should be correctly updated on dxshown event', function(assert) {
        const origAnimate = fx.animate;

        try {
            const $container = $('<div>');

            const $element = $('<div>').appendTo($container).dxAccordion({
                items: this.items
            });

            $element.dxAccordion('instance');

            fx.animate = function() { assert.ok(false, 'animation executed'); };

            $container.appendTo('#qunit-fixture');
            domUtils.triggerShownEvent($container);

            assert.notEqual($element.height(), 0, 'height is updated');
        } finally {
            fx.animate = origAnimate;
        }
    });

    QUnit.test('animation shouldn\'t change transform property (T354912)', function(assert) {
        const origAnimate = fx.animate;

        const $element = $('<div>').appendTo('#qunit-fixture').dxAccordion({
            items: this.items,
            deferRendering: false
        });

        try {
            fx.animate = function($element, config) {
                assert.equal(config.type, 'custom');

                return origAnimate($element, config);
            };

            $element.dxAccordion('instance').expandItem(1);
        } finally {
            fx.animate = origAnimate;
        }
    });

    QUnit.test('Item body should be rendered on item opening when the \'deferRendering\' option is true', function(assert) {
        const $element = this.$element.dxAccordion({
            items: this.items,
            selectedIndex: 0,
            multiple: false,
            deferRendering: true
        });
        const instance = $element.dxAccordion('instance');

        instance.option('selectedIndex', 1);
        assert.equal($element.find('.' + ACCORDION_ITEM_BODY_CLASS).length, 2, 'body is rendered for just opened item');
    });

    QUnit.test('Item body should be rendered on item changing when the \'deferRendering\' option is true (T586536)', function(assert) {
        const $element = this.$element.dxAccordion({
            items: this.items,
            selectedIndex: 0,
            multiple: false,
            deferRendering: true
        });
        const instance = $element.dxAccordion('instance');

        instance.option('items[0].title', 'Changed Title');
        assert.equal($element.find('.' + ACCORDION_ITEM_BODY_CLASS).length, 1, 'body is rendered');
    });

    QUnit.test('Item body should be rendered on item changing and selectionChanging when the \'deferRendering\' option is true (T586536)', function(assert) {
        const $element = this.$element.dxAccordion({
            items: this.items,
            selectedIndex: 0,
            multiple: false,
            deferRendering: true
        });
        const instance = $element.dxAccordion('instance');

        instance.option('items[1].title', 'Changed Title');
        instance.option('selectedIndex', 1);

        assert.equal($element.find('.' + ACCORDION_ITEM_BODY_CLASS).length, 2, 'bodies were rendered');
    });

    QUnit.test('Widget should be rerendered on the \'deferRendering\' option change', function(assert) {
        let renderCount = 0;
        let prevRenderCount;

        const instance = this.$element.dxAccordion({
            items: this.items,
            selectedIndex: 0,
            multiple: false,
            deferRendering: true,
            onContentReady: function() {
                prevRenderCount = renderCount;
                renderCount++;
            }
        }).dxAccordion('instance');

        instance.option('deferRendering', false);
        assert.equal(renderCount, prevRenderCount + 1, 'widget was rerendered one time on option changed');

        instance.option('deferRendering', true);
        assert.equal(renderCount, prevRenderCount + 1, 'widget was rerendered one time on option changed');
    });

    QUnit.test('onContentReady action should be fired after opened item was rendered', function(assert) {
        let count = 0;
        this.$element.dxAccordion({
            items: this.items,
            selectedIndex: 0,
            onContentReady: function(e) {
                assert.equal($(e.element).find(`.${ACCORDION_ITEM_BODY_CLASS}`).length, 1, 'item is opened');
                count++;
            }
        }).dxAccordion('instance');

        assert.equal(count, 1, 'onContentReady was fired');

    });

    QUnit.test('Special title template in Material theme', function(assert) {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        this.$element.dxAccordion({
            items: this.items
        });

        const titleCaption = this.$element.find('.dx-accordion-item-title-caption');
        assert.equal(titleCaption.length, this.items.length, 'title has caption elements');
        assert.equal(titleCaption.first().text(), 'Title 1', 'title has right text');

        themes.isMaterial = origIsMaterial;
    });
});

QUnit.module('nested accordion', moduleSetup, () => {
    QUnit.test('nested widget rendering', function(assert) {
        const that = this;

        let nested;
        this.$element.dxAccordion({
            items: this.items,
            itemTemplate: function() {
                nested = new Accordion($('<div>'), { items: that.items, selectedIndex: 0 });
                return nested.$element();
            }
        });

        $(nested.itemElements()).eq(1).trigger('dxclick');
        assert.equal(nested.isItemSelected(1), true, 'item selected by click');
    });

    QUnit.test('nested widget with onItemTitleClick', function(assert) {
        const that = this;
        let nested;
        const handleFire = sinon.stub();

        const parent = this.$element.dxAccordion({
            items: this.items,
            onItemTitleClick: handleFire,
            itemTemplate: function(itemData, itemIndex, itemElement) {
                nested = $('<div>').dxAccordion({
                    items: that.items,
                }).dxAccordion('instance');

                nested.$element().appendTo(itemElement);
            }
        }).dxAccordion('instance');

        $(nested.$element().find('.' + ACCORDION_ITEM_TITLE_CLASS)).eq(1).trigger('dxclick');
        assert.ok(handleFire.notCalled, 'parent item title click action has not been fired after click on nested widget title');

        $(parent.$element().find('.' + ACCORDION_ITEM_TITLE_CLASS)).eq(4).trigger('dxclick');
        assert.ok(handleFire.calledOnce, 'parent item title click action has been fired after click');

        parent.option('onItemTitleClick', noop);
        nested.option('onItemTitleClick', handleFire);

        $(parent.$element().find('.' + ACCORDION_ITEM_TITLE_CLASS)).eq(4).trigger('dxclick');
        assert.ok(handleFire.calledOnce, 'nested item title click action has not been fired after click on parent widget title');

        $(nested.$element().find('.' + ACCORDION_ITEM_TITLE_CLASS)).eq(0).trigger('dxclick');
        assert.equal(handleFire.callCount, 2, 'nested item title click action has been fired after click');
    });
});

QUnit.module('widget options', moduleSetup, () => {
    QUnit.test('\'onItemTitleClick\' option', function(assert) {
        let actionFiredValue = 0;

        this.$element.dxAccordion({
            items: this.items,
            onItemTitleClick: function() {
                actionFiredValue++;
            }
        })
            .dxAccordion('instance');

        const $titles = this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS);

        $($titles.eq(0)).trigger('dxclick');
        assert.equal(actionFiredValue, 1, 'first item was clicked');
        $($titles.eq(1)).trigger('dxclick');
        assert.equal(actionFiredValue, 2, 'second item was clicked');
    });

    QUnit.test('\'onItemHold\' option', function(assert) {
        let actionFiredValue = 0;

        this.$element.dxAccordion({
            items: this.items,
            onItemHold: function() {
                actionFiredValue++;
            },
            itemHoldTimeout: 0
        });

        $(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(0)).trigger(holdEvent.name);
        assert.equal(actionFiredValue, 1, 'action is fired');
    });

    QUnit.test('\'itemHoldTimeout\' option', function(assert) {
        let actionFiredValue = 0;

        this.$element.dxAccordion({
            items: this.items,
            onItemHold: function() {
                actionFiredValue++;
            },
            itemHoldTimeout: 200
        });

        const pointer = pointerMock(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(0));

        pointer.down();
        assert.equal(actionFiredValue, 0, 'action is not fired yet');
        this.clock.tick(200);
        assert.equal(actionFiredValue, 1, 'action is fired');
    });

    QUnit.test('\'onSelectionChanged\' option', function(assert) {
        let actionFiredValue = 0;

        this.$element.dxAccordion({
            items: this.items,
            onSelectionChanged: function() {
                actionFiredValue++;
            }
        });

        $(this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger('dxclick');
        assert.equal(actionFiredValue, 1, 'action is fired');
    });

    QUnit.test('dataSource option with using DataSource', function(assert) {
        let loadActionFiredValue = 0;
        const items = this.items;

        this.$element.dxAccordion({
            dataSource: new DataSource({
                load: function(loadOptions) {
                    const d = new $.Deferred();

                    setTimeout(function() {
                        loadActionFiredValue++;
                        d.resolve(items);
                    }, 10);

                    return d.promise();
                }
            })
        });

        this.clock.tick(50);
        assert.equal(loadActionFiredValue, 1, 'datasource loaded');
        assert.equal(this.$element.find('.' + ACCORDION_ITEM_CLASS).length, this.items.length, 'all items are rendered');
    });

    QUnit.test('collapsible option', function(assert) {
        this.$element.dxAccordion({
            items: this.items,
            collapsible: true
        });

        const $titles = this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS);

        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 1, 'one item content is visible');
        $($titles.eq(0)).trigger('dxclick');
        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 0, 'zero item content is visible');
    });

    QUnit.test('Closed class should be set after selection changed', function(assert) {
        this.$element.dxAccordion({
            items: this.items,
            collapsible: false
        });

        const $element = this.$element; const $titles = $element.find('.' + ACCORDION_ITEM_CLASS);

        $($titles.eq(1)).trigger('dxclick');

        assert.equal($titles.eq(0).hasClass(ACCORDION_ITEM_CLOSED_CLASS), true, 'one item content is visible');
        assert.equal($titles.eq(1).hasClass(ACCORDION_ITEM_CLOSED_CLASS), false, 'one item content is visible');
    });

    QUnit.test('multiple option', function(assert) {
        this.$element.dxAccordion({
            items: this.items,
            multiple: true
        });

        const $titles = this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS);

        $($titles.eq(1)).trigger('dxclick');
        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 2, 'two item content is visible');
        $($titles.eq(2)).trigger('dxclick');
        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 3, 'three item content is visible');
        $($titles.eq(2)).trigger('dxclick');
        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 2, 'two item content is visible');
    });

    QUnit.test('animationDuration option', function(assert) {
        fx.off = false;

        try {
            this.$element.dxAccordion({
                items: this.items,
                animationDuration: 1000
            });

            const $item = this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1); const $title = $item.find('.' + ACCORDION_ITEM_TITLE_CLASS);

            assert.ok(!$item.hasClass(ACCORDION_ITEM_OPENED_CLASS), 'content is hidden before animation is started');

            $($title).trigger('dxclick');
            assert.roughEqual($item.height(), $title.outerHeight(), 0.1, 'height of the item is equal to the title height');
            this.clock.tick(1000);

            assert.ok($item.height() > $title.outerHeight(), 'height is not 0 when animation is complete');
        } finally {
            fx.off = true;
        }
    });

    QUnit.test('disabled state option', function(assert) {
        this.$element.dxAccordion({
            items: this.items,
            disabled: true
        });

        $(this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger('dxclick');
        assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'no reaction after clicking on disabled widget');
        assert.ok(!this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'no reaction after clicking on disabled widget');
    });

    QUnit.test('visible state option', function(assert) {
        this.$element.dxAccordion({
            items: this.items,
            visible: false
        });

        assert.ok(!this.$element.is(':visible'), 'widget is hidden');
    });

    QUnit.test('height option in \'auto\' mode', function(assert) {
        const $element = $('#html-template-accordion');
        const instance = $element.dxAccordion({
            items: [
                { title: '', html: '<div style="height: 50px">' },
                { title: '', html: '<div style="height: 100px">' },
                { title: '', html: '<div style="height: 50px">' },
                { title: '', html: '<div style="height: 100px">' }
            ],
            height: 'auto',
            selectedIndex: 0
        }).dxAccordion('instance');

        assert.equal($element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(0).height(), 50, 'opened item content height is correct');
        assert.equal(instance.itemElements().eq(0).get(0).style.height, '', 'auto height set');

        instance.expandItem(1);
        assert.equal($element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(1).height(), 100, 'opened item content height is correct');
        assert.equal(instance.itemElements().eq(1).get(0).style.height, '', 'auto height set');
    });

    QUnit.test('height option in static mode', function(assert) {
        const items = [
            { title: '', html: '<div style="height: 50px">' },
            { title: '', html: '<div style="height: 100px">' },
            { title: '', html: '<div style="height: 50px">' },
            { title: '', html: '<div style="height: 100px">' }
        ];
        const widgetHeight = 500;
        const $element = $('#html-template-accordion');
        const instance = $element.dxAccordion({
            items: items,
            height: widgetHeight,
            selectedIndex: 0
        }).dxAccordion('instance');
        const closedItemsHeight = $element.find('.' + ACCORDION_ITEM_CLASS).eq(1).outerHeight() * (items.length - 1);

        assert.equal($element.find('.' + ACCORDION_ITEM_CLASS).eq(0).outerHeight(), widgetHeight - closedItemsHeight, 'opened item content height is correct');
        assert.notEqual(instance.itemElements().eq(0).get(0).style.height, '', 'auto height not set');

        instance.expandItem(1);
        assert.equal($element.find('.' + ACCORDION_ITEM_CLASS).eq(1).outerHeight(), widgetHeight - closedItemsHeight, 'opened item content height is correct');
        assert.equal($element.find('.' + ACCORDION_WRAPPER_CLASS).height(), widgetHeight, 'item container height is correct');
        assert.notEqual(instance.itemElements().eq(1).get(0).style.height, '', 'auto height not set');
    });

    QUnit.test('height option in \'auto\' mode when widget is multiple', function(assert) {
        const $element = $('#html-template-accordion');
        const instance = $element.dxAccordion({
            items: [
                { title: '', html: '<div style="height: 50px">' },
                { title: '', html: '<div style="height: 100px">' },
                { title: '', html: '<div style="height: 50px">' },
                { title: '', html: '<div style="height: 100px">' }
            ],
            height: 'auto',
            selectedIndex: 0,
            multiple: true
        }).dxAccordion('instance');

        assert.equal($element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(0).height(), 50, 'opened item content height is correct');

        instance.expandItem(1);
        assert.equal($element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(1).height(), 100, 'opened item content height is correct');
    });

    QUnit.test('height option in static mode when widget is multiple', function(assert) {
        const items = [
            { title: '', html: '<div style="height: 50px">' },
            { title: '', html: '<div style="height: 100px">' },
            { title: '', html: '<div style="height: 50px">' },
            { title: '', html: '<div style="height: 100px">' }
        ];
        const widgetHeight = 500;
        const $element = $('#html-template-accordion');
        const instance = $element.dxAccordion({
            items: items,
            height: widgetHeight,
            selectedIndex: 0,
            multiple: true
        }).dxAccordion('instance');
        const closedItemHeight = $element.find('.' + ACCORDION_ITEM_CLASS).eq(1).outerHeight();

        assert.equal($element.find('.' + ACCORDION_ITEM_CLASS).eq(0).outerHeight(), widgetHeight - closedItemHeight * (items.length - 1), 'opened item content height is correct');

        instance.expandItem(1);
        const openedItemsCount = 2; const closedItemsCount = items.length - openedItemsCount;

        assert.equal($element.find('.' + ACCORDION_ITEM_CLASS).eq(0).outerHeight(), (widgetHeight - closedItemHeight * closedItemsCount) / openedItemsCount, 'opened item content height is correct');
        assert.equal($element.find('.' + ACCORDION_ITEM_CLASS).eq(1).outerHeight(), (widgetHeight - closedItemHeight * closedItemsCount) / openedItemsCount, 'opened item content height is correct');
        assert.equal($element.find('.' + ACCORDION_WRAPPER_CLASS).height(), widgetHeight, 'item container height is correct');
    });
});

QUnit.module('widget options changed', moduleSetup, () => {
    QUnit.test('items options is changed', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items
        }).dxAccordion('instance');

        instance.option('items', [
            { title: 'Title 2', text: 'Text 2' }
        ]);

        const $items = this.$element.find('.' + ACCORDION_ITEM_CLASS);

        assert.equal($items.length, 1, 'one item is rendered');
        assert.equal($items.eq(0).find('.' + ACCORDION_ITEM_TITLE_CLASS).text(), 'Title 2', 'item title is correct');
        assert.equal($items.eq(0).find('.' + ACCORDION_ITEM_BODY_CLASS).text(), 'Text 2', 'item content is correct');
    });

    QUnit.test('selectedIndex option changing', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items
        }).dxAccordion('instance');

        instance.option('selectedIndex', 1);
        assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'second item is opened');

        instance.option('selectedIndex', -1);
        assert.equal(instance.option('selectedIndex'), 1, '\'selectedIndex\' option set to first when trying to set index which is out of range (-1)');
        assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'first item is opened when index is out of range (-1)');

        instance.option('selectedIndex', 5);
        assert.equal(instance.option('selectedIndex'), 1, '\'selectedIndex\' option set to first when trying to set index which is out of range (5)');
        assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'first item is opened when index is out of range (5)');
    });

    QUnit.test('\'onItemTitleClick\' option changed', function(assert) {
        let firstActionFired;
        let secondActionFired;

        const instance = this.$element.dxAccordion({
            items: this.items,
            onItemTitleClick: function() {
                firstActionFired = true;
            }
        }).dxAccordion('instance');

        instance.option('onItemTitleClick', function() {
            secondActionFired = true;
        });

        $(this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS)).trigger('dxclick');
        assert.ok(!firstActionFired, 'first action was not fired');
        assert.ok(secondActionFired, 'second action was fired');
    });

    QUnit.test('itemTitleTemplate option changed', function(assert) {
        const $element = $('#templated-accordion');
        const instance = $element.dxAccordion({
            items: this.items,
            itemTitleTemplate: 'title'
        }).dxAccordion('instance');

        instance.option('itemTitleTemplate', 'newTemplate');

        const $title = $element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(0);

        assert.equal($title.text(), 'New text', 'title contains text from template');
    });

    QUnit.test('itemTemplate option changed', function(assert) {
        const $element = $('#templated-accordion');
        const instance = $element.dxAccordion({
            items: this.items,
            itemTemplate: 'content'
        }).dxAccordion('instance');

        instance.option('itemTemplate', 'newTemplate');

        const $content = $element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(0);

        assert.equal($content.text(), 'New text', 'title contains text from template');
    });

    QUnit.test('itemTitleTemplate option changed (function)', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items,
            itemTitleTemplate: function(itemData, itemIndex, itemElement) {
                return $('<div>')
                    .addClass('item-title-render-first')
                    .text('User title: ' + itemData.title);
            }
        }).dxAccordion('instance');

        instance.option('itemTitleTemplate', function(itemData, itemIndex, itemElement) {
            return $('<div>')
                .addClass('item-title-render-changed')
                .text('Changed: ' + itemData.title);
        });

        const $item = this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(0);

        assert.ok(!$item.children().hasClass('item-title-render-first'), 'title is not rendered by initial render');
        assert.ok($item.children().hasClass('item-title-render-changed'), 'title is element specified in new render function');

        assert.equal($item.text(), 'Changed: ' + this.items[0].title, 'text in rendered element is correct');
    });

    QUnit.test('itemTemplate option changed (function)', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items,
            itemTitleRender: function(itemData, itemIndex, itemElement) {
                return $('<div>')
                    .addClass('item-content-render-first')
                    .text('User content: ' + itemData.text);
            }
        }).dxAccordion('instance');

        instance.option('itemTemplate', function(itemData, itemIndex, itemElement) {
            assert.equal(isRenderer(itemElement), !!config().useJQuery, 'element is correct');
            return $('<div>')
                .addClass('item-content-render-changed')
                .text('Changed: ' + itemData.text);
        });

        const $item = this.$element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(0);
        assert.ok(!$item.children().hasClass('item-content-render-first'), 'content is not rendered by initial render');
        assert.ok($item.children().hasClass('item-content-render-changed'), 'content has element specified in new render function');

        assert.equal($item.text(), 'Changed: ' + this.items[0].text, 'text in rendered element is correct');
    });

    QUnit.test('collapsible option changed', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items,
            collapsible: true
        }).dxAccordion('instance');
        const $titles = this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS);

        $($titles.eq(1)).trigger('dxclick');
        instance.option('collapsible', false);

        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 1, 'only one item is opened');
    });

    QUnit.test('animationDuration option changed', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items,
            animationDuration: 3000
        }).dxAccordion('instance');

        fx.off = false;

        try {
            instance.option('animationDuration', 1000);

            const $item = this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1); const $title = $item.find('.' + ACCORDION_ITEM_TITLE_CLASS);

            assert.ok(!$item.hasClass(ACCORDION_ITEM_OPENED_CLASS), 'content is hidden before animation is started');

            $($title).trigger('dxclick');
            assert.roughEqual($item.height(), $title.outerHeight(), 0.1, 'height of the item is equal to the title height');
            this.clock.tick(1000);

            assert.ok($item.height() > $title.outerHeight(), 'height is not 0 when animation is complete');
        } finally {
            fx.off = true;
        }
    });

    QUnit.test('\'itemHoldTimeout\' option changed', function(assert) {
        let actionFiredValue = 0;

        const instance = this.$element.dxAccordion({
            items: this.items,
            onItemHold: function() {
                actionFiredValue++;
            },
            itemHoldTimeout: 500
        }).dxAccordion('instance');

        const pointer = pointerMock(this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(0));

        instance.option('itemHoldTimeout', 200);
        pointer.down();
        assert.equal(actionFiredValue, 0, 'action is not fired yet');
        this.clock.tick(200);
        assert.equal(actionFiredValue, 1, 'action is fired');
    });

    QUnit.test('disabled state option', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items,
            disabled: false
        }).dxAccordion('instance');

        instance.option('disabled', true);
        assert.ok(this.$element.hasClass('dx-state-disabled'), 'widget has \'disabled\' class');
        $(this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger('dxclick');
        assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'no reaction after clicking on disabled widget');
        assert.ok(!this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'no reaction after clicking on disabled widget');

        instance.option('disabled', false);
        assert.ok(!this.$element.hasClass('dx-state-disabled'), 'widget has no \'disabled\' class');
        $(this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger('dxclick');
        assert.ok(!this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'item is unselected after clicking on the other title on enabled widget');
        assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'item is selected after clicking on enabled widget');
    });

    QUnit.test('visible state option', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items
        }).dxAccordion('instance');

        instance.option('visible', false);
        assert.ok(!this.$element.is(':visible'), 'widget is hidden');
        instance.option('visible', true);
        assert.ok(this.$element.is(':visible'), 'widget is shown');
    });

    QUnit.test('\'onItemRendered\' option', function(assert) {
        let actionValue = 0;

        this.$element.dxAccordion({
            items: this.items,
            onItemRendered: function() {
                actionValue++;
            }
        });

        assert.equal(actionValue, this.items.length, '\'onItemRendered\' fired once for each item');
    });

    QUnit.test('subscribe on the itemClick event when a title of item is changed', function(assert) {
        const itemClickStub = sinon.stub();
        const instance = this.$element.dxAccordion({
            items: this.items,
            onItemTitleClick: itemClickStub
        }).dxAccordion('instance');

        instance.option('items[0].title', 'New title');

        this.$element.find(`.${ACCORDION_ITEM_TITLE_CLASS}`).first().trigger('dxclick');

        assert.ok(itemClickStub.called, 'event was thrown');
    });
});

QUnit.module('widget behavior', moduleSetup, () => {
    QUnit.test('item selection', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items
        }).dxAccordion('instance');

        $(this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger('dxclick');

        assert.equal(instance.option('selectedIndex'), 1, 'second item is selected');
        assert.notEqual(this.$element.find('.' + ACCORDION_ITEM_BODY_CLASS).eq(1).css('display'), 'none', 'selected item\'s content is shown');
    });

    QUnit.test('only clicked item is opened', function(assert) {
        this.$element.dxAccordion({
            items: this.items
        });

        $(this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(1)).trigger('dxclick');
        assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(1).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'second item is opened');
        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 1, 'only one item is opened');

        $(this.$element.find('.' + ACCORDION_ITEM_TITLE_CLASS).eq(2)).trigger('dxclick');
        this.clock.tick(300);
        assert.ok(this.$element.find('.' + ACCORDION_ITEM_CLASS).eq(2).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'third item is opened');
        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 1, 'only one item is opened');
    });

    QUnit.test('expandItem public method', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items
        }).dxAccordion('instance');

        instance.expandItem(2);
        let $items = this.$element.find('.' + ACCORDION_ITEM_CLASS);

        assert.ok($items.eq(2).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'specified item is opened');
        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 1, 'only one item is opened');
        assert.equal(instance.option('selectedIndex'), 2, '\'selectedIndex\' is correct');

        instance.option('multiple', true);
        instance.expandItem(0);
        $items = this.$element.find('.' + ACCORDION_ITEM_CLASS);

        assert.ok($items.eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'specified item is opened in multiple mode');
        assert.equal(this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length, 2, 'two items are opened in multiple mode');
        assert.equal(instance.option('selectedItems').length, 2, 'two items are selected in multiple mode');
    });

    QUnit.test('collapseItem public method', function(assert) {
        const instance = this.$element.dxAccordion({
            items: this.items
        }).dxAccordion('instance');

        instance.collapseItem(0);
        let $items = this.$element.find('.' + ACCORDION_ITEM_BODY_CLASS); let itemsVisible = this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length;

        assert.ok($items.eq(0).is(':visible'), 'specified item is not closed in non-collapsible mode');
        assert.equal(itemsVisible, 1, 'one item is opened');

        instance.option('collapsible', true);
        instance.collapseItem(0);
        $items = this.$element.find('.' + ACCORDION_ITEM_BODY_CLASS);
        itemsVisible = this.$element.find('.' + ACCORDION_ITEM_OPENED_CLASS).length;

        assert.ok(!$items.eq(0).hasClass(ACCORDION_ITEM_OPENED_CLASS), 'specified item is closed in non-collapsible mode');
        assert.equal(itemsVisible, 0, 'ne items are opened');
    });

    QUnit.test('expandItem method should return deferred', function(assert) {
        let actionValue = 0;

        const instance = this.$element.dxAccordion({
            items: this.items,
            animationDuration: 300
        }).dxAccordion('instance');


        fx.off = false;

        instance.expandItem(2).done(function() {
            actionValue++;
        });

        assert.equal(actionValue, 0, 'waiting animation to complete before method execution');
        this.clock.tick(300);
        assert.equal(actionValue, 1, 'method executed after animation completed');
    });

    QUnit.test('collapseItem method should return deferred', function(assert) {
        let actionValue = 0;

        const instance = this.$element.dxAccordion({
            items: this.items,
            animationDuration: 300,
            collapsible: true
        }).dxAccordion('instance');


        fx.off = false;

        instance.collapseItem(0).done(function() {
            actionValue++;
        });

        assert.equal(actionValue, 0, 'waiting animation to complete before method execution');
        this.clock.tick(300);
        assert.equal(actionValue, 1, 'method executed after animation completed');
    });

    QUnit.test('\'onItemClick\' firing conditions', function(assert) {
        let titleActionFired = 0; let itemActionFired = 0;

        this.$element.dxAccordion({
            items: this.items,
            onItemClick: function() {
                itemActionFired++;
            },
            onItemTitleClick: function() {
                titleActionFired++;
            }
        })
            .dxAccordion('instance');

        const $items = this.$element.find('.' + ACCORDION_ITEM_CLASS);

        $($items.eq(0).find('.' + ACCORDION_ITEM_TITLE_CLASS)).trigger('dxclick');
        assert.equal(titleActionFired, 1, 'onItemTitleClick was fired on itemTitle click');
        assert.equal(itemActionFired, 1, '\'onItemClick\' was fired on itemTitle click');

        $($items.eq(0).find('.' + ACCORDION_ITEM_BODY_CLASS)).trigger('dxclick');
        assert.equal(titleActionFired, 1, 'onItemTitleClick was not fired on itemContent click');
        assert.equal(itemActionFired, 2, '\'onItemClick\' was fired on itemContent click');
    });
});

QUnit.module('update method', () => {
    QUnit.test('update should recalculate widget height', function(assert) {
        const done = assert.async();

        const $container = $('#container').height(100);
        const $accordion = $('#accordion').dxAccordion({
            items: [1],
            selectedIndex: 0,
            animationDuration: 0,
            height: '100%'
        });
        const $item = $accordion.dxAccordion('itemElements').eq(0);
        const height = $item.height();

        $container.height(200);
        $accordion.dxAccordion('updateDimensions').done(function() {
            assert.equal($item.height(), height + 100, 'height was recalculated');
            done();
        });
    });

    QUnit.test('update should recalculate widget height with animation', function(assert) {
        const $container = $('#container').height(100);
        const $accordion = $('#accordion').dxAccordion({
            items: [1],
            selectedIndex: 0,
            animationDuration: 0,
            height: '100%'
        });
        const $item = $accordion.dxAccordion('itemElements').eq(0);

        $container.height(200);
        $accordion.dxAccordion('updateDimensions');
        assert.equal(fx.isAnimating($item), true, 'animation present');
    });

    QUnit.test('update result should should be resolved after animation complete', function(assert) {
        const done = assert.async();

        const $container = $('#container').height(100);
        const $accordion = $('#accordion').dxAccordion({
            items: [1],
            selectedIndex: 0,
            animationDuration: 0,
            height: '100%'
        });
        const $item = $accordion.dxAccordion('itemElements').eq(0);

        $container.height(200);
        $accordion.dxAccordion('updateDimensions').done(function() {
            assert.equal(fx.isAnimating($item), false, 'animation is complete');
            done();
        });
    });
});

QUnit.module('keyboard navigation', moduleSetup, () => {
    QUnit.test('selectedIndex changes by keyboard', function(assert) {
        assert.expect(1);

        const instance = this.$element.dxAccordion({
            items: this.items,
            focusStateEnabled: true,
            selectedIndex: 0
        }).dxAccordion('instance');
        const keyboard = keyboardMock(this.$element);

        $(this.$element).trigger('focusin');
        keyboard.keyDown('down');
        keyboard.keyDown('space');
        assert.equal(instance.option('selectedIndex'), 1, 'index is right');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria-multiselectable property', function(assert) {
        const $element = $('#accordion').dxAccordion({
            multiple: false
        });
        const instance = $element.dxAccordion('instance');

        assert.equal($element.attr('aria-multiselectable'), 'false', 'multiselectable on init');

        instance.option('multiple', true);
        assert.equal($element.attr('aria-multiselectable'), 'true', 'multiselectable on option change');
    });

    QUnit.test('body should be hidden if item is closed', function(assert) {
        const accordion = new Accordion($('#accordion'), {
            items: [{ title: 'Title 1', text: 'Text 1' }],
            collapsible: true,
            selectedIndex: -1,
            deferRendering: false
        });
        const $itemBody = accordion.itemElements().eq(0).find('.' + ACCORDION_ITEM_BODY_CLASS);

        accordion.expandItem(0);
        assert.equal($itemBody.attr('aria-hidden'), 'false', 'body readable');

        accordion.collapseItem(0);
        assert.equal($itemBody.attr('aria-hidden'), 'true', 'body readable');
    });
});

QUnit.module('Live Update', {
    beforeEach: function() {
        this.itemRenderedSpy = sinon.spy();
        this.itemDeletedSpy = sinon.spy();
        this.data = [{
            id: 0,
            text: '0',
            content: '0 content'
        },
        {
            id: 1,
            text: '1',
            content: '1 content'
        },
        {
            id: 2,
            text: '2',
            content: '2 content'
        }];
        this.createAccordion = (dataSourceOptions, repaintChangesOnly) => {
            const dataSource = new DataSource($.extend({
                paginate: false,
                pushAggregationTimeout: 0,
                store: new CustomStore({
                    load: () => this.data,
                    remove: (key) => {
                        const removedItem = this.data.filter(item => item.id === key)[0];
                        if(removedItem) {
                            this.data.splice(this.data.indexOf(removedItem), 1);
                        }
                    },
                    key: 'id'
                })
            }, dataSourceOptions));

            return new Accordion($('#accordion'), {
                dataSource: dataSource,
                repaintChangesOnly: repaintChangesOnly,
                onContentReady: (e) => {
                    e.component.option('onItemRendered', this.itemRenderedSpy);
                    e.component.option('onItemDeleted', this.itemDeletedSpy);
                }
            });
        };
    }
}, function() {
    QUnit.test('update item', function(assert) {
        const store = this.createAccordion().getDataSource().store();

        const pushData = [{ type: 'update', data: {
            id: 1,
            text: '1 Updated',
            content: '1 content'
        }, key: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check updated item');
    });

    QUnit.test('add item', function(assert) {
        const store = this.createAccordion().getDataSource().store();

        const pushData = [{ type: 'insert', data: {
            id: 3,
            text: '3 Inserted',
            content: '3 content'
        } }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData, pushData[0].data, 'check added item');
    });

    QUnit.test('remove item', function(assert) {
        const accordion = this.createAccordion({}, true);
        const store = accordion.getDataSource().store();

        const pushData = [{ type: 'remove', key: 1 }];
        store.push(pushData);

        assert.equal(this.itemRenderedSpy.callCount, 0, 'items are not refreshed after remove');
        assert.equal(this.itemDeletedSpy.callCount, 1, 'removed items count');
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.text, '1', 'check removed item');
        assert.equal(accordion.option('items').length, 2, ' items count');
    });

    QUnit.test('repaintChangesOnly, update item instance', function(assert) {
        const dataSource = this.createAccordion({}, true).getDataSource();

        this.data[0] = {
            id: 0,
            text: '0 Updated',
            content: '0 content'
        };
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after reload');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, '0 Updated', 'check updated item');
    });

    QUnit.test('repaintChangesOnly, add item', function(assert) {
        const dataSource = this.createAccordion({}, true).getDataSource();

        this.data.push({
            id: 3,
            text: '3 Inserted',
            content: '3 content'
        });
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 1, 'only one item is updated after push');
        assert.deepEqual(this.itemRenderedSpy.firstCall.args[0].itemData.text, '3 Inserted', 'check added item');
    });

    QUnit.test('repaintChangesOnly, remove item', function(assert) {
        const accordion = this.createAccordion({}, true);
        const dataSource = accordion.getDataSource();

        this.data.splice(1, 1);
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 0, 'items are not refreshed after remove');
        assert.equal(this.itemDeletedSpy.callCount, 1, 'removed items count');
        assert.equal(accordion.option('items').length, 2, ' items count');
        assert.deepEqual(this.itemDeletedSpy.firstCall.args[0].itemData.text, '1', 'check removed item');
    });

    QUnit.test('repaintChangesOnly, double remove the same item', function(assert) {
        const accordion = this.createAccordion({}, true);
        const dataSource = accordion.getDataSource();
        const store = this.createAccordion().getDataSource().store();

        store.remove(1);
        dataSource.load();

        store.remove(1);
        dataSource.load();

        assert.equal(this.itemRenderedSpy.callCount, 0, 'items are not refreshed after remove');
        assert.equal(this.itemDeletedSpy.callCount, 1, 'removed items count');
        assert.equal(this.itemDeletedSpy.firstCall.args[0].itemData.text, '1', 'check removed item');
    });

    QUnit.test('repaintChangesOnly, change selected index after remove', function(assert) {
        const accordion = this.createAccordion({}, true);
        const dataSource = accordion.getDataSource();

        this.data.splice(1, 1);
        dataSource.load();

        accordion.option('selectedIndex', 1);
        assert.equal(accordion.itemElements().find('.' + ACCORDION_ITEM_BODY_CLASS).length, 2);
    });

    QUnit.test('repaintChangesOnly, remove selected item', function(assert) {
        this.data.push({
            id: 3,
            text: '3',
            content: '3 content'
        });

        const clock = sinon.useFakeTimers();
        const accordion = this.createAccordion({}, true);
        const dataSource = accordion.getDataSource();

        accordion.option('selectedIndex', 1);
        this.data.splice(1, 1);
        dataSource.load();

        accordion.isItemSelected(accordion.itemElements()[1]);

        assert.equal(accordion.itemElements().find('.' + ACCORDION_ITEM_BODY_CLASS).length, 2);
        clock.restore();
    });
});

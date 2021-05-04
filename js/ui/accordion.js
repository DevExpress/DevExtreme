import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import fx from '../animation/fx';
import { name as clickEventName } from '../events/click';
import devices from '../core/devices';
import domAdapter from '../core/dom_adapter';
import { extend } from '../core/utils/extend';
import { deferRender } from '../core/utils/common';
import { getPublicElement } from '../core/element';
import * as iteratorUtils from '../core/utils/iterator';
import { isPlainObject, isDefined } from '../core/utils/type';
import registerComponent from '../core/component_registrator';
import { addNamespace } from '../events/utils/index';
import CollectionWidget from './collection/ui.collection_widget.live_update';
import { when, Deferred } from '../core/utils/deferred';
import { BindableTemplate } from '../core/templates/bindable_template';
import { getImageContainer } from '../core/utils/icon';
import { isMaterial } from './themes';

// STYLE accordion

const ACCORDION_CLASS = 'dx-accordion';
const ACCORDION_WRAPPER_CLASS = 'dx-accordion-wrapper';
const ACCORDION_ITEM_CLASS = 'dx-accordion-item';
const ACCORDION_ITEM_OPENED_CLASS = 'dx-accordion-item-opened';
const ACCORDION_ITEM_CLOSED_CLASS = 'dx-accordion-item-closed';
const ACCORDION_ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const ACCORDION_ITEM_BODY_CLASS = 'dx-accordion-item-body';
const ACCORDION_ITEM_TITLE_CAPTION_CLASS = 'dx-accordion-item-title-caption';

const ACCORDION_ITEM_DATA_KEY = 'dxAccordionItemData';

const Accordion = CollectionWidget.inherit({

    _activeStateUnit: '.' + ACCORDION_ITEM_CLASS,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {


            hoverStateEnabled: true,

            height: undefined,

            itemTitleTemplate: 'title',

            onItemTitleClick: null,

            selectedIndex: 0,

            collapsible: false,

            multiple: false,

            animationDuration: 300,

            deferRendering: true,


            selectionByClick: true,
            activeStateEnabled: true,
            _itemAttributes: { role: 'tab' },
            _animationEasing: 'ease'
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return isMaterial();
                },
                options: {
                    animationDuration: 200,
                    _animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }
            }
        ]);
    },

    _itemElements: function() {
        return this._itemContainer().children(this._itemSelector());
    },

    _init: function() {
        this.callBase();

        this.option('selectionRequired', !this.option('collapsible'));
        this.option('selectionMode', this.option('multiple') ? 'multiple' : 'single');

        const $element = this.$element();
        $element.addClass(ACCORDION_CLASS);

        this._$container = $('<div>').addClass(ACCORDION_WRAPPER_CLASS);
        $element.append(this._$container);
    },

    _initTemplates: function() {
        this.callBase();
        /**
        * @name dxAccordionItem
        * @inherits CollectionWidgetItem
        * @type object
        */
        this._templateManager.addDefaultTemplates({
            title: new BindableTemplate(function($container, data) {
                if(isPlainObject(data)) {
                    const $iconElement = getImageContainer(data.icon);
                    if($iconElement) {
                        $container.append($iconElement);
                    }

                    if(isDefined(data.title) && !isPlainObject(data.title)) {
                        $container.append(domAdapter.createTextNode(data.title));
                    }
                } else {
                    if(isDefined(data)) {
                        $container.text(String(data));
                    }
                }

                $container.wrapInner($('<div>').addClass(ACCORDION_ITEM_TITLE_CAPTION_CLASS));
            }, ['title', 'icon'], this.option('integrationOptions.watchMethod'))
        });
    },

    _initMarkup: function() {
        this._deferredItems = [];
        this.callBase();

        this.setAria({
            'role': 'tablist',
            'multiselectable': this.option('multiple')
        });

        deferRender(() => {
            const selectedItemIndices = this._getSelectedItemIndices();
            this._renderSelection(selectedItemIndices, []);
        });
    },

    _render: function() {
        this.callBase();

        this._updateItemHeightsWrapper(true);
    },

    _itemDataKey: function() {
        return ACCORDION_ITEM_DATA_KEY;
    },

    _itemClass: function() {
        return ACCORDION_ITEM_CLASS;
    },

    _itemContainer: function() {
        return this._$container;
    },

    _itemTitles: function() {
        return this._itemElements().find('.' + ACCORDION_ITEM_TITLE_CLASS);
    },

    _itemContents: function() {
        return this._itemElements().find('.' + ACCORDION_ITEM_BODY_CLASS);
    },

    _getItemData: function(target) {
        return $(target).parent().data(this._itemDataKey()) || this.callBase.apply(this, arguments);
    },

    _executeItemRenderAction: function(itemData) {
        if(itemData.type) {
            return;
        }

        this.callBase.apply(this, arguments);
    },

    _itemSelectHandler: function(e) {
        if($(e.target).closest(this._itemContents()).length) {
            return;
        }

        this.callBase.apply(this, arguments);
    },

    _afterItemElementDeleted: function($item, deletedActionArgs) {
        this._deferredItems.splice(deletedActionArgs.itemIndex, 1);
        this.callBase.apply(this, arguments);
    },

    _renderItemContent: function(args) {
        const itemTitle = this.callBase(extend({}, args, {
            contentClass: ACCORDION_ITEM_TITLE_CLASS,
            templateProperty: 'titleTemplate',
            defaultTemplateName: this.option('itemTitleTemplate')
        }));

        this._attachItemTitleClickAction(itemTitle);

        const deferred = new Deferred();
        if(isDefined(this._deferredItems[args.index])) {
            this._deferredItems[args.index] = deferred;
        } else {
            this._deferredItems.push(deferred);
        }

        if(!this.option('deferRendering') || this._getSelectedItemIndices().indexOf(args.index) >= 0) {
            deferred.resolve();
        }

        deferred.done(this.callBase.bind(this, extend({}, args, {
            contentClass: ACCORDION_ITEM_BODY_CLASS,
            container: getPublicElement($('<div>').appendTo($(itemTitle).parent()))
        })));
    },

    _attachItemTitleClickAction: function(itemTitle) {
        const eventName = addNamespace(clickEventName, this.NAME);

        eventsEngine.off(itemTitle, eventName);
        eventsEngine.on(itemTitle, eventName, this._itemTitleClickHandler.bind(this));
    },

    _itemTitleClickHandler: function(e) {
        this._itemDXEventHandler(e, 'onItemTitleClick');
    },

    _renderSelection: function(addedSelection, removedSelection) {
        this._itemElements().addClass(ACCORDION_ITEM_CLOSED_CLASS);
        this.setAria('hidden', true, this._itemContents());

        this._updateItems(addedSelection, removedSelection);
    },

    _updateSelection: function(addedSelection, removedSelection) {
        this._updateItems(addedSelection, removedSelection);
        this._updateItemHeightsWrapper(false);
    },

    _updateItems: function(addedSelection, removedSelection) {
        const $items = this._itemElements();

        iteratorUtils.each(addedSelection, (_, index) => {
            this._deferredItems[index].resolve();

            const $item = $items.eq(index)
                .addClass(ACCORDION_ITEM_OPENED_CLASS)
                .removeClass(ACCORDION_ITEM_CLOSED_CLASS);
            this.setAria('hidden', false, $item.find('.' + ACCORDION_ITEM_BODY_CLASS));
        });

        iteratorUtils.each(removedSelection, (_, index) => {
            const $item = $items.eq(index)
                .removeClass(ACCORDION_ITEM_OPENED_CLASS);
            this.setAria('hidden', true, $item.find('.' + ACCORDION_ITEM_BODY_CLASS));
        });
    },

    _updateItemHeightsWrapper: function(skipAnimation) {
        if(this.option('templatesRenderAsynchronously')) {
            this._animationTimer = setTimeout(function() {
                this._updateItemHeights(skipAnimation);
            }.bind(this));
        } else {
            this._updateItemHeights(skipAnimation);
        }
    },

    _updateItemHeights: function(skipAnimation) {
        const that = this;
        const deferredAnimate = that._deferredAnimate;
        const itemHeight = this._splitFreeSpace(this._calculateFreeSpace());

        clearTimeout(this._animationTimer);

        return when.apply($, [].slice.call(this._itemElements()).map(function(item) {
            return that._updateItemHeight($(item), itemHeight, skipAnimation);
        })).done(function() {
            if(deferredAnimate) {
                deferredAnimate.resolveWith(that);
            }
        });
    },

    _updateItemHeight: function($item, itemHeight, skipAnimation) {
        const $title = $item.children('.' + ACCORDION_ITEM_TITLE_CLASS);

        if(fx.isAnimating($item)) {
            fx.stop($item);
        }

        const startItemHeight = $item.outerHeight();
        const finalItemHeight = $item.hasClass(ACCORDION_ITEM_OPENED_CLASS)
            ? itemHeight + $title.outerHeight() || $item.height('auto').outerHeight()
            : $title.outerHeight();

        return this._animateItem($item, startItemHeight, finalItemHeight, skipAnimation, !!itemHeight);
    },

    _animateItem: function($element, startHeight, endHeight, skipAnimation, fixedHeight) {
        let d;
        if(skipAnimation || startHeight === endHeight) {
            $element.css('height', endHeight);
            d = new Deferred().resolve();
        } else {
            d = fx.animate($element, {
                type: 'custom',
                from: { height: startHeight },
                to: { height: endHeight },
                duration: this.option('animationDuration'),
                easing: this.option('_animationEasing')
            });
        }

        return d.done(function() {
            if($element.hasClass(ACCORDION_ITEM_OPENED_CLASS) && !fixedHeight) {
                $element.css('height', '');
            }

            $element
                .not('.' + ACCORDION_ITEM_OPENED_CLASS)
                .addClass(ACCORDION_ITEM_CLOSED_CLASS);
        });
    },

    _splitFreeSpace: function(freeSpace) {
        if(!freeSpace) {
            return freeSpace;
        }

        return freeSpace / this.option('selectedItems').length;
    },

    _calculateFreeSpace: function() {
        const height = this.option('height');
        if(height === undefined || height === 'auto') {
            return;
        }

        const $titles = this._itemTitles();
        let itemsHeight = 0;

        iteratorUtils.each($titles, function(_, title) {
            itemsHeight += $(title).outerHeight();
        });

        return this.$element().height() - itemsHeight;
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged: function() {
        this._updateItemHeights(true);
    },

    _clean: function() {
        clearTimeout(this._animationTimer);
        this.callBase();
    },

    _tryParseItemPropertyName: function(fullName) {
        const matches = fullName.match(/.*\.(.*)/);

        if(isDefined(matches) && (matches.length >= 1)) {
            return matches[1];
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'items':
                this.callBase(args);

                if(this._tryParseItemPropertyName(args.fullName) === 'title') {
                    this._renderSelection(this._getSelectedItemIndices(), []);
                }
                this._updateItemHeightsWrapper(true);
                break;
            case 'animationDuration':
            case 'onItemTitleClick':
            case '_animationEasing':
                break;
            case 'collapsible':
                this.option('selectionRequired', !this.option('collapsible'));
                break;
            case 'itemTitleTemplate':
            case 'height':
            case 'deferRendering':
                this._invalidate();
                break;
            case 'multiple':
                this.option('selectionMode', args.value ? 'multiple' : 'single');
                break;
            default:
                this.callBase(args);
        }
    },

    expandItem: function(index) {
        this._deferredAnimate = new Deferred();

        this.selectItem(index);

        return this._deferredAnimate.promise();
    },

    collapseItem: function(index) {
        this._deferredAnimate = new Deferred();

        this.unselectItem(index);

        return this._deferredAnimate.promise();
    },

    updateDimensions: function() {
        return this._updateItemHeights(false);
    }

});

registerComponent('dxAccordion', Accordion);

export default Accordion;

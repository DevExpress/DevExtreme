import { getWidth, getHeight, getOuterWidth } from '../core/utils/size';
import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import devices from '../core/devices';
import registerComponent from '../core/component_registrator';
import Button from './button';
import { render } from './widget/utils.ink_ripple';
import { addNamespace } from '../events/utils/index';
import { extend } from '../core/utils/extend';
import { isPlainObject } from '../core/utils/type';
import pointerEvents from '../events/pointer';
import { each } from '../core/utils/iterator';
import TabsItem from './tabs/item';
import { TABS_EXPANDED_CLASS } from './tabs/constants';
import { isMaterial, current as currentTheme } from './themes';
import holdEvent from '../events/hold';
import Scrollable from './scroll_view/ui.scrollable';
import { default as CollectionWidget } from './collection/ui.collection_widget.live_update';
import { getImageContainer } from '../core/utils/icon';
import { BindableTemplate } from '../core/templates/bindable_template';
import { Deferred, when } from '../core/utils/deferred';
import { isReachedLeft, isReachedRight, isReachedTop, isReachedBottom } from '../renovation/ui/scroll_view/utils/get_boundary_props';
import { getScrollLeftMax } from '../renovation/ui/scroll_view/utils/get_scroll_left_max';
import { getWindow } from '../core/utils/window';

// STYLE tabs

const TABS_CLASS = 'dx-tabs';
const TABS_WRAPPER_CLASS = 'dx-tabs-wrapper';
const TABS_STRETCHED_CLASS = 'dx-tabs-stretched';
const TABS_SCROLLABLE_CLASS = 'dx-tabs-scrollable';
const TABS_NAV_BUTTONS_CLASS = 'dx-tabs-nav-buttons';
const TABS_ORIENTATION_CLASS = {
    vertical: 'dx-tabs-vertical',
    horizontal: 'dx-tabs-horizontal',
};
const TABS_ICON_POSITION_CLASS = {
    top: 'dx-tabs-icon-position-top',
    end: 'dx-tabs-icon-position-end',
    bottom: 'dx-tabs-icon-position-bottom',
    start: 'dx-tabs-icon-position-start',
};

const OVERFLOW_HIDDEN_CLASS = 'dx-overflow-hidden';

const TABS_ITEM_CLASS = 'dx-tab';
const TABS_ITEM_SELECTED_CLASS = 'dx-tab-selected';

const TABS_NAV_BUTTON_CLASS = 'dx-tabs-nav-button';
const TABS_LEFT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-left';
const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';

const TABS_ITEM_TEXT_CLASS = 'dx-tab-text';

const STATE_DISABLED_CLASS = 'dx-state-disabled';
const FOCUSED_DISABLED_NEXT_TAB_CLASS = 'dx-focused-disabled-next-tab';
const FOCUSED_DISABLED_PREV_TAB_CLASS = 'dx-focused-disabled-prev-tab';

const TABS_ITEM_DATA_KEY = 'dxTabData';

const BUTTON_NEXT_ICON = 'chevronnext';
const BUTTON_PREV_ICON = 'chevronprev';

const FEEDBACK_HIDE_TIMEOUT = 100;
const FEEDBACK_DURATION_INTERVAL = 5;
const FEEDBACK_SCROLL_TIMEOUT = 300;

const TAB_OFFSET = 30;

const ORIENTATION = {
    horizontal: 'horizontal',
    vertical: 'vertical',
};

const SCROLLABLE_DIRECTION = {
    horizontal: 'horizontal',
    vertical: 'vertical',
};

const ICON_POSITION = {
    top: 'top',
    end: 'end',
    bottom: 'bottom',
    start: 'start',
};


const Tabs = CollectionWidget.inherit({

    _activeStateUnit: '.' + TABS_ITEM_CLASS,

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            hoverStateEnabled: true,
            showNavButtons: true,
            scrollByContent: true,
            scrollingEnabled: true,
            selectionMode: 'single',
            orientation: ORIENTATION.horizontal,
            iconPosition: ICON_POSITION.start,

            /**
             * @name dxTabsOptions.activeStateEnabled
             * @hidden
             * @default true
            */

            activeStateEnabled: true,
            selectionRequired: false,
            selectOnFocus: true,
            loopItemFocus: false,
            useInkRipple: false,
            badgeExpr: function(data) { return data ? data.badge : undefined; },
            _itemAttributes: { role: 'tab' },
        });
    },

    _defaultOptionsRules: function() {
        const themeName = currentTheme();

        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType !== 'desktop';
                },
                options: {
                    showNavButtons: false
                }
            },
            {
                device: { deviceType: 'desktop' },
                options: {
                    scrollByContent: false
                }
            },
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
                    return isMaterial(themeName);
                },
                options: {
                    useInkRipple: true,
                    selectOnFocus: false
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();
        this.setAria('role', 'tablist');
        this.$element().addClass(TABS_CLASS);
        this._toggleOrientationClass(this.option('orientation'));
        this._toggleIconPositionClass();
        this._renderWrapper();
        this._renderMultiple();

        this._feedbackHideTimeout = FEEDBACK_HIDE_TIMEOUT;
    },

    _initTemplates: function() {
        this.callBase();
        this._templateManager.addDefaultTemplates({
            item: new BindableTemplate((function($container, data) {
                if(isPlainObject(data)) {
                    this._prepareDefaultItemTemplate(data, $container);
                } else {
                    $container.text(String(data));
                }

                const $iconElement = getImageContainer(data.icon);
                $iconElement && $iconElement.prependTo($container);
                $container.wrapInner($('<span>').addClass(TABS_ITEM_TEXT_CLASS));
            }).bind(this), ['text', 'html', 'icon'], this.option('integrationOptions.watchMethod'))
        });
    },

    _createItemByTemplate: function _createItemByTemplate(itemTemplate, renderArgs) {
        const { itemData, container, index } = renderArgs;
        this._deferredTemplates[index] = new Deferred();
        return itemTemplate.render({
            model: itemData,
            container,
            index,
            onRendered: () => this._deferredTemplates[index].resolve()
        });
    },

    _itemClass: function() {
        return TABS_ITEM_CLASS;
    },

    _selectedItemClass: function() {
        return TABS_ITEM_SELECTED_CLASS;
    },

    _itemDataKey: function() {
        return TABS_ITEM_DATA_KEY;
    },

    _initMarkup: function() {
        this._deferredTemplates = [];
        this.callBase();

        this.option('useInkRipple') && this._renderInkRipple();

        this.$element().addClass(OVERFLOW_HIDDEN_CLASS);
    },

    _render: function() {
        this.callBase();
        this._deferRenderScrolling();
    },

    _deferRenderScrolling() {
        when.apply(this, this._deferredTemplates).done(() => this._renderScrolling());
    },

    _renderScrolling() {
        const removeClasses = [TABS_STRETCHED_CLASS, TABS_EXPANDED_CLASS, OVERFLOW_HIDDEN_CLASS];
        this.$element().removeClass(removeClasses.join(' '));

        if(this.option('scrollingEnabled') && this._isItemsSizeExceeded()) {
            if(!this._scrollable) {
                this._renderScrollable();
                this._renderNavButtons();
            }

            const scrollable = this.getScrollable();
            scrollable.update();

            if(this.option('rtlEnabled')) {
                const maxLeftOffset = getScrollLeftMax($(this.getScrollable().container()).get(0));
                scrollable.scrollTo({ left: maxLeftOffset });
            }
            this._updateNavButtonsVisibility();

            this._scrollToItem(this.option('selectedItem'));
        }

        if(!(this.option('scrollingEnabled') && this._isItemsSizeExceeded())) {
            this._cleanScrolling();

            if(this._needStretchItems()) {
                this.$element().addClass(TABS_STRETCHED_CLASS);
            }

            this.$element()
                .removeClass(TABS_NAV_BUTTONS_CLASS)
                .addClass(TABS_EXPANDED_CLASS);
        }
    },

    _isVertical() {
        return this.option('orientation') === ORIENTATION.vertical;
    },

    _isServerSide() {
        const window = getWindow();

        return window.isWindowMock || !window;
    },

    _isItemsSizeExceeded() {
        const isVertical = this._isVertical();
        const isItemsSizeExceeded = isVertical ? this._isItemsHeightExceeded() : this._isItemsWidthExceeded();

        return isItemsSizeExceeded;
    },

    _isItemsWidthExceeded() {
        const $visibleItems = this._getVisibleItems();
        const tabItemsWidth = this._getSummaryItemsSize('width', $visibleItems, true);
        const elementWidth = getWidth(this.$element());

        if([tabItemsWidth, elementWidth].includes(0)) {
            return false;
        }

        const isItemsWidthExceeded = tabItemsWidth + 5 > elementWidth;

        return isItemsWidthExceeded;
    },

    _isItemsHeightExceeded() {
        const $visibleItems = this._getVisibleItems();
        const itemsHeight = this._getSummaryItemsSize('height', $visibleItems, true);
        const elementHeight = getHeight(this.$element());

        return itemsHeight - 1 > elementHeight;
    },

    _needStretchItems() {
        const $visibleItems = this._getVisibleItems();
        const elementWidth = getWidth(this.$element());
        const itemsWidth = [];

        each($visibleItems, (_, item) => {
            itemsWidth.push(getOuterWidth(item, true));
        });

        const maxTabWidth = Math.max.apply(null, itemsWidth);
        const needStretchItems = maxTabWidth >= elementWidth / $visibleItems.length;

        return needStretchItems;
    },

    _cleanNavButtons: function() {
        if(!this._leftButton || !this._rightButton) return;

        this._leftButton.$element().remove();
        this._rightButton.$element().remove();
        this._leftButton = null;
        this._rightButton = null;
    },

    _cleanScrolling: function() {
        if(!this._scrollable) return;

        this._$wrapper.appendTo(this.$element());

        this._scrollable.$element().remove();
        this._scrollable = null;

        this._cleanNavButtons();
    },

    _renderInkRipple: function() {
        this._inkRipple = render();
    },

    _getPointerEvent() {
        return pointerEvents.up;
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        const config = {
            element: $element,
            event: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _renderMultiple: function() {
        if(this.option('selectionMode') === 'multiple') {
            this.option('selectOnFocus', false);
        }
    },

    _renderWrapper: function() {
        this._$wrapper = $('<div>').addClass(TABS_WRAPPER_CLASS);
        this.$element().append(this._$wrapper);
    },

    _itemContainer: function() {
        return this._$wrapper;
    },

    _getScrollableDirection() {
        const isVertical = this._isVertical();
        const scrollableDirection = isVertical ? SCROLLABLE_DIRECTION.vertical : SCROLLABLE_DIRECTION.horizontal;

        return scrollableDirection;
    },

    _updateScrollableDirection() {
        const scrollable = this.getScrollable();

        if(scrollable) {
            const scrollableDirection = this._getScrollableDirection();

            scrollable.option('direction', scrollableDirection);
        } else {
            this._renderScrolling();
        }
    },

    _renderScrollable() {
        const $itemContainer = this.$element().wrapInner($('<div>').addClass(TABS_SCROLLABLE_CLASS)).children();

        this._scrollable = this._createComponent($itemContainer, Scrollable, {
            direction: this._getScrollableDirection(),
            showScrollbar: 'never',
            useKeyboard: false,
            useNative: false,
            scrollByContent: this.option('scrollByContent'),
            onScroll: () => {
                this._updateNavButtonsVisibility();
            },
        });

        this.$element().append(this._scrollable.$element());
    },

    _scrollToItem: function(itemData) {
        if(!this._scrollable) return;

        const $item = this._editStrategy.getItemElement(itemData);
        this._scrollable.scrollToElement($item);
    },

    _renderNavButtons: function() {
        this.$element().toggleClass(TABS_NAV_BUTTONS_CLASS, this.option('showNavButtons'));

        if(!this.option('showNavButtons')) return;

        const rtlEnabled = this.option('rtlEnabled');
        this._leftButton = this._createNavButton(-TAB_OFFSET, rtlEnabled ? BUTTON_NEXT_ICON : BUTTON_PREV_ICON);

        const $leftButton = this._leftButton.$element();
        $leftButton.addClass(TABS_LEFT_NAV_BUTTON_CLASS);
        this.$element().prepend($leftButton);

        this._rightButton = this._createNavButton(TAB_OFFSET, rtlEnabled ? BUTTON_PREV_ICON : BUTTON_NEXT_ICON);

        const $rightButton = this._rightButton.$element();
        $rightButton.addClass(TABS_RIGHT_NAV_BUTTON_CLASS);
        this.$element().append($rightButton);
    },

    _updateNavButtonsVisibility() {
        const isVertical = this._isVertical();
        const scrollable = this.getScrollable();

        if(isVertical) {
            this._leftButton?.option('disabled', isReachedTop(scrollable.scrollTop(), 1));
            this._rightButton?.option('disabled', isReachedBottom($(scrollable.container()).get(0), scrollable.scrollTop(), 0, 1));
        } else {
            this._leftButton?.option('disabled', isReachedLeft(scrollable.scrollLeft(), 1));
            this._rightButton?.option('disabled', isReachedRight($(scrollable.container()).get(0), scrollable.scrollLeft(), 1));
        }
    },

    _updateScrollPosition: function(offset, duration) {
        this._scrollable.update();
        this._scrollable.scrollBy(offset / duration);
    },

    _createNavButton: function(offset, icon) {
        const that = this;

        const holdAction = that._createAction(function() {
            that._holdInterval = setInterval(function() {
                that._updateScrollPosition(offset, FEEDBACK_DURATION_INTERVAL);
            }, FEEDBACK_DURATION_INTERVAL);
        });

        const holdEventName = addNamespace(holdEvent.name, 'dxNavButton');
        const pointerUpEventName = addNamespace(pointerEvents.up, 'dxNavButton');
        const pointerOutEventName = addNamespace(pointerEvents.out, 'dxNavButton');

        const navButton = this._createComponent($('<div>').addClass(TABS_NAV_BUTTON_CLASS), Button, {
            focusStateEnabled: false,
            icon: icon,
            onClick: function() {
                that._updateScrollPosition(offset, 1);
            },
            integrationOptions: {}
        });

        const $navButton = navButton.$element();

        eventsEngine.on($navButton, holdEventName, { timeout: FEEDBACK_SCROLL_TIMEOUT }, (function(e) { holdAction({ event: e }); }).bind(this));
        eventsEngine.on($navButton, pointerUpEventName, function() {
            that._clearInterval();
        });
        eventsEngine.on($navButton, pointerOutEventName, function() {
            that._clearInterval();
        });

        return navButton;
    },

    _clearInterval: function() {
        if(this._holdInterval) clearInterval(this._holdInterval);
    },

    _updateSelection: function(addedSelection) {
        this._scrollable && this._scrollable.scrollToElement(this.itemElements().eq(addedSelection[0]));
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._dimensionChanged();
        }
    },

    _dimensionChanged: function() {
        this._renderScrolling();
    },

    _itemSelectHandler: function(e) {
        if(this.option('selectionMode') === 'single' && this.isItemSelected(e.currentTarget)) {
            return;
        }

        this.callBase(e);
    },

    _clean: function() {
        this._deferredTemplates = [];
        this._cleanScrolling();
        this.callBase();
    },

    _toggleTabsVerticalClass(value) {
        this.$element().toggleClass(TABS_ORIENTATION_CLASS.vertical, value);
    },

    _toggleTabsHorizontalClass(value) {
        this.$element().toggleClass(TABS_ORIENTATION_CLASS.horizontal, value);
    },

    _toggleOrientationClass(orientation) {
        const isVertical = orientation === ORIENTATION.vertical;

        this._toggleTabsVerticalClass(isVertical);
        this._toggleTabsHorizontalClass(!isVertical);
    },

    _getTabIconPositionClass() {
        const position = this.option('iconPosition');

        switch(position) {
            case ICON_POSITION.top:
                return TABS_ICON_POSITION_CLASS.top;
            case ICON_POSITION.end:
                return TABS_ICON_POSITION_CLASS.end;
            case ICON_POSITION.bottom:
                return TABS_ICON_POSITION_CLASS.bottom;
            case ICON_POSITION.start:
            default:
                return TABS_ICON_POSITION_CLASS.start;
        }
    },

    _toggleIconPositionClass() {
        for(const key in TABS_ICON_POSITION_CLASS) {
            this.$element().removeClass(TABS_ICON_POSITION_CLASS[key]);
        }

        const newClass = this._getTabIconPositionClass();

        this.$element().addClass(newClass);
    },

    _toggleFocusedDisabledNextClass(currentIndex, isNextDisabled) {
        this._itemElements().eq(currentIndex).toggleClass(FOCUSED_DISABLED_NEXT_TAB_CLASS, isNextDisabled);
    },

    _toggleFocusedDisabledPrevClass(currentIndex, isPrevDisabled) {
        this._itemElements().eq(currentIndex).toggleClass(FOCUSED_DISABLED_PREV_TAB_CLASS, isPrevDisabled);
    },

    _toggleFocusedDisabledClasses(value) {
        const { selectedIndex: currentIndex } = this.option();

        this._itemElements()
            .removeClass(FOCUSED_DISABLED_NEXT_TAB_CLASS)
            .removeClass(FOCUSED_DISABLED_PREV_TAB_CLASS);

        const prevItemIndex = currentIndex - 1;
        const nextItemIndex = currentIndex + 1;

        const nextFocusedIndex = $(value).index();

        const isNextDisabled = this._itemElements().eq(nextItemIndex).hasClass(STATE_DISABLED_CLASS);
        const isPrevDisabled = this._itemElements().eq(prevItemIndex).hasClass(STATE_DISABLED_CLASS);

        const shouldNextClassBeSetted = isNextDisabled && nextFocusedIndex === nextItemIndex;
        const shouldPrevClassBeSetted = isPrevDisabled && nextFocusedIndex === prevItemIndex;

        this._toggleFocusedDisabledNextClass(currentIndex, shouldNextClassBeSetted);
        this._toggleFocusedDisabledPrevClass(currentIndex, shouldPrevClassBeSetted);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'useInkRipple':
            case 'scrollingEnabled':
            case 'showNavButtons':
                this._invalidate();
                break;
            case 'scrollByContent':
                this._scrollable && this._scrollable.option(args.name, args.value);
                break;
            case 'width':
            case 'height':
                this.callBase(args);
                this._dimensionChanged();
                break;
            case 'selectionMode':
                this._renderMultiple();
                this.callBase(args);
                break;
            case 'badgeExpr':
                this._invalidate();
                break;
            case 'focusedElement': {
                this._toggleFocusedDisabledClasses(args.value);
                this.callBase(args);
                this._scrollToItem(args.value);
                break;
            }
            case 'orientation': {
                this._toggleOrientationClass(args.value);
                if(!this._isServerSide()) {
                    this._updateScrollableDirection();
                }
                break;
            }
            case 'iconPosition': {
                this._toggleIconPositionClass();
                break;
            }
            default:
                this.callBase(args);
        }
    },

    _afterItemElementInserted() {
        this.callBase();
        this._deferRenderScrolling();
    },

    _afterItemElementDeleted($item, deletedActionArgs) {
        this.callBase($item, deletedActionArgs);
        this._renderScrolling();
    },

    getScrollable() {
        return this._scrollable;
    }
});

Tabs.ItemClass = TabsItem;

registerComponent('dxTabs', Tabs);

export default Tabs;

/**
 * @name dxTabsItem
 * @inherits CollectionWidgetItem
 * @type object
 */

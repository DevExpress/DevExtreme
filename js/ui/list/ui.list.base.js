import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { ensureDefined, noop } from '../../core/utils/common';
import { isPlainObject } from '../../core/utils/type';
import { getImageContainer } from '../../core/utils/icon';
import { getPublicElement } from '../../core/element';
import { each } from '../../core/utils/iterator';
import { compileGetter } from '../../core/utils/data';
import { extend } from '../../core/utils/extend';
import fx from '../../animation/fx';
import { name as clickEventName } from '../../events/click';
import { end as swipeEventEnd } from '../../events/swipe';
import { nativeScrolling } from '../../core/utils/support';
import messageLocalization from '../../localization/message';
import { render } from '../widget/utils.ink_ripple';
import devices from '../../core/devices';
import ListItem from './item';
import Button from '../button';
import { addNamespace } from '../../events/utils/index';
import { current, isMaterial } from '../themes';
import { hasWindow } from '../../core/utils/window';
import ScrollView from '../scroll_view';
import { deviceDependentOptions } from '../scroll_view/ui.scrollable.device';
import CollectionWidget from '../collection/ui.collection_widget.live_update';
import { BindableTemplate } from '../../core/templates/bindable_template';
import { Deferred } from '../../core/utils/deferred';
import DataConverterMixin from '../shared/grouped_data_converter_mixin';

const LIST_CLASS = 'dx-list';
const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_ITEM_SELECTOR = '.' + LIST_ITEM_CLASS;
const LIST_ITEM_ICON_CONTAINER_CLASS = 'dx-list-item-icon-container';
const LIST_ITEM_ICON_CLASS = 'dx-list-item-icon';
const LIST_GROUP_CLASS = 'dx-list-group';
const LIST_GROUP_HEADER_CLASS = 'dx-list-group-header';
const LIST_GROUP_BODY_CLASS = 'dx-list-group-body';
const LIST_COLLAPSIBLE_GROUPS_CLASS = 'dx-list-collapsible-groups';
const LIST_GROUP_COLLAPSED_CLASS = 'dx-list-group-collapsed';
const LIST_GROUP_HEADER_INDICATOR_CLASS = 'dx-list-group-header-indicator';
const LIST_HAS_NEXT_CLASS = 'dx-has-next';
const LIST_NEXT_BUTTON_CLASS = 'dx-list-next-button';
const WRAP_ITEM_TEXT_CLASS = 'dx-wrap-item-text';
const SELECT_ALL_ITEM_SELECTOR = '.dx-list-select-all';

const LIST_ITEM_DATA_KEY = 'dxListItemData';
const LIST_FEEDBACK_SHOW_TIMEOUT = 70;

const groupItemsGetter = compileGetter('items');

let _scrollView;

export const ListBase = CollectionWidget.inherit({

    _activeStateUnit: [LIST_ITEM_SELECTOR, SELECT_ALL_ITEM_SELECTOR].join(','),

    _supportedKeys: function() {
        const that = this;

        const moveFocusPerPage = function(direction) {
            let $item = getEdgeVisibleItem(direction);
            const isFocusedItem = $item.is(that.option('focusedElement'));

            if(isFocusedItem) {
                scrollListTo($item, direction);
                $item = getEdgeVisibleItem(direction);
            }

            that.option('focusedElement', getPublicElement($item));
            that.scrollToItem($item);
        };

        function getEdgeVisibleItem(direction) {
            const scrollTop = that.scrollTop();
            const containerHeight = that.$element().height();

            let $item = $(that.option('focusedElement'));
            let isItemVisible = true;

            if(!$item.length) {
                return $();
            }

            while(isItemVisible) {
                const $nextItem = $item[direction]();

                if(!$nextItem.length) {
                    break;
                }

                const nextItemLocation = $nextItem.position().top + $nextItem.outerHeight() / 2;
                isItemVisible = nextItemLocation < containerHeight + scrollTop && nextItemLocation > scrollTop;

                if(isItemVisible) {
                    $item = $nextItem;
                }
            }

            return $item;
        }

        function scrollListTo($item, direction) {
            let resultPosition = $item.position().top;

            if(direction === 'prev') {
                resultPosition = $item.position().top - that.$element().height() + $item.outerHeight();
            }

            that.scrollTo(resultPosition);
        }

        return extend(this.callBase(), {
            leftArrow: noop,
            rightArrow: noop,
            pageUp: function() {
                moveFocusPerPage('prev');
                return false;
            },
            pageDown: function() {
                moveFocusPerPage('next');
                return false;
            }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {


            hoverStateEnabled: true,

            pullRefreshEnabled: false,

            scrollingEnabled: true,

            showScrollbar: 'onScroll',

            useNativeScrolling: true,

            bounceEnabled: true,

            scrollByContent: true,

            scrollByThumb: false,

            pullingDownText: messageLocalization.format('dxList-pullingDownText'),

            pulledDownText: messageLocalization.format('dxList-pulledDownText'),

            refreshingText: messageLocalization.format('dxList-refreshingText'),

            pageLoadingText: messageLocalization.format('dxList-pageLoadingText'),

            onScroll: null,

            onPullRefresh: null,

            onPageLoading: null,

            pageLoadMode: 'scrollBottom',

            nextButtonText: messageLocalization.format('dxList-nextButtonText'),

            onItemSwipe: null,

            grouped: false,

            onGroupRendered: null,

            collapsibleGroups: false,

            groupTemplate: 'group',

            indicateLoading: true,

            /**
            * @name dxListOptions.selectedIndex
            * @type number
            * @default -1
            * @hidden
            */

            /**
            * @name dxListOptions.selectedItem
            * @hidden
            */

            activeStateEnabled: true,

            _itemAttributes: { 'role': 'option' },
            _listAttributes: { 'role': 'listbox' },

            useInkRipple: false,

            wrapItemText: false,

            _swipeEnabled: true,

            _revertPageOnEmptyLoad: false,

            showChevronExpr: function(data) { return data ? data.showChevron : undefined; },
            badgeExpr: function(data) { return data ? data.badge : undefined; }
            /**
            * @name dxListItem
            * @inherits CollectionWidgetItem
            * @type object
            */
        });
    },

    _defaultOptionsRules: function() {
        const themeName = current();

        return this.callBase().concat(deviceDependentOptions(), [
            {
                device: function() {
                    return !nativeScrolling;
                },
                options: {
                    useNativeScrolling: false
                }
            },
            {
                device: function(device) {
                    return !nativeScrolling && !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic';
                },
                options: {
                    showScrollbar: 'onHover',

                    pageLoadMode: 'nextButton'
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
                    pullingDownText: '',

                    pulledDownText: '',

                    refreshingText: '',

                    pageLoadingText: '',
                    useInkRipple: true
                }
            }
        ]);
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._updateLoadingState(true);
        }
    },

    _itemClass: function() {
        return LIST_ITEM_CLASS;
    },

    _itemDataKey: function() {
        return LIST_ITEM_DATA_KEY;
    },

    _itemContainer: function() {
        return this._$container;
    },

    _saveSelectionChangeEvent: function(e) {
        this._selectionChangeEventInstance = e;
    },

    _getSelectionChangeEvent: function() {
        return this._selectionChangeEventInstance;
    },

    _refreshItemElements: function() {
        if(!this.option('grouped')) {
            this._itemElementsCache = this._itemContainer().children(this._itemSelector());
        } else {
            this._itemElementsCache = this._itemContainer()
                .children('.' + LIST_GROUP_CLASS)
                .children('.' + LIST_GROUP_BODY_CLASS)
                .children(this._itemSelector());
        }
    },

    _modifyByChanges: function() {
        this.callBase.apply(this, arguments);

        this._refreshItemElements();
        this._updateLoadingState(true);
    },

    reorderItem: function(itemElement, toItemElement) {
        const promise = this.callBase(itemElement, toItemElement);

        return promise.done(function() {
            this._refreshItemElements();
        });
    },

    deleteItem: function(itemElement) {
        const promise = this.callBase(itemElement);

        return promise.done(function() {
            this._refreshItemElements();
        });
    },

    _itemElements: function() {
        return this._itemElementsCache;
    },

    _itemSelectHandler: function(e) {
        if(this.option('selectionMode') === 'single' && this.isItemSelected(e.currentTarget)) {
            return;
        }

        this.callBase(e);
    },

    _allowDynamicItemsAppend: function() {
        return true;
    },

    _resetDataSourcePageIndex: function() {
        const currentDataSource = this.getDataSource();

        if(currentDataSource && currentDataSource.pageIndex() !== 0) {
            currentDataSource.pageIndex(0);
            currentDataSource.load();
        }
    },

    _init: function() {
        this.callBase();
        this._resetDataSourcePageIndex();
        this._$container = this.$element();

        this._initScrollView();

        this._feedbackShowTimeout = LIST_FEEDBACK_SHOW_TIMEOUT;
        this._createGroupRenderAction();
    },

    _scrollBottomMode: function() {
        return this.option('pageLoadMode') === 'scrollBottom';
    },

    _nextButtonMode: function() {
        return this.option('pageLoadMode') === 'nextButton';
    },

    _dataSourceOptions: function() {
        const scrollBottom = this._scrollBottomMode();
        const nextButton = this._nextButtonMode();

        return extend(this.callBase(), {
            paginate: ensureDefined(scrollBottom || nextButton, true)
        });
    },

    _getGroupedOption: function() {
        return this.option('grouped');
    },

    _dataSourceFromUrlLoadMode: function() {
        return 'raw';
    },

    _initScrollView: function() {
        const scrollingEnabled = this.option('scrollingEnabled');
        const pullRefreshEnabled = scrollingEnabled && this.option('pullRefreshEnabled');
        const autoPagingEnabled = scrollingEnabled && this._scrollBottomMode() && !!this._dataSource;

        this._scrollView = this._createComponent(this.$element(), getScrollView(), {
            disabled: this.option('disabled') || !scrollingEnabled,
            onScroll: this._scrollHandler.bind(this),
            onPullDown: pullRefreshEnabled ? this._pullDownHandler.bind(this) : null,
            onReachBottom: autoPagingEnabled ? this._scrollBottomHandler.bind(this) : null,
            showScrollbar: this.option('showScrollbar'),
            useNative: this.option('useNativeScrolling'),
            bounceEnabled: this.option('bounceEnabled'),
            scrollByContent: this.option('scrollByContent'),
            scrollByThumb: this.option('scrollByThumb'),
            pullingDownText: this.option('pullingDownText'),
            pulledDownText: this.option('pulledDownText'),
            refreshingText: this.option('refreshingText'),
            reachBottomText: this.option('pageLoadingText'),
            useKeyboard: false
        });

        this._$container = $(this._scrollView.content());

        if(this.option('wrapItemText')) {
            this._$container.addClass(WRAP_ITEM_TEXT_CLASS);
        }

        this._createScrollViewActions();
    },

    _createScrollViewActions: function() {
        this._scrollAction = this._createActionByOption('onScroll');
        this._pullRefreshAction = this._createActionByOption('onPullRefresh');
        this._pageLoadingAction = this._createActionByOption('onPageLoading');
    },

    _scrollHandler: function(e) {
        this._scrollAction && this._scrollAction(e);
    },

    _initTemplates: function() {
        this._templateManager.addDefaultTemplates({
            group: new BindableTemplate(function($container, data) {
                if(isPlainObject(data)) {
                    if(data.key) {
                        $container.text(data.key);
                    }
                } else {
                    $container.text(String(data));
                }
            }, ['key'], this.option('integrationOptions.watchMethod'))
        });
        this.callBase();
    },

    _prepareDefaultItemTemplate: function(data, $container) {
        this.callBase(data, $container);

        if(data.icon) {
            const $icon = getImageContainer(data.icon).addClass(LIST_ITEM_ICON_CLASS);
            const $iconContainer = $('<div>').addClass(LIST_ITEM_ICON_CONTAINER_CLASS);

            $iconContainer.append($icon);

            $container.prepend($iconContainer);
        }
    },

    _getBindableFields: function() {
        return ['text', 'html', 'icon'];
    },

    _updateLoadingState: function(tryLoadMore) {
        const isDataLoaded = !tryLoadMore || this._isLastPage();
        const scrollBottomMode = this._scrollBottomMode();
        const stopLoading = isDataLoaded || !scrollBottomMode;
        const hideLoadIndicator = stopLoading && !this._isDataSourceLoading();

        if(stopLoading || this._scrollViewIsFull()) {
            this._scrollView.release(hideLoadIndicator);
            this._toggleNextButton(this._shouldRenderNextButton() && !this._isLastPage());
            this._loadIndicationSuppressed(false);
        } else {
            this._infiniteDataLoading();
        }
    },

    _shouldRenderNextButton: function() {
        return this._nextButtonMode() && this._dataSource && this._dataSource.isLoaded();
    },

    _dataSourceLoadingChangedHandler: function(isLoading) {
        if(this._loadIndicationSuppressed()) {
            return;
        }

        if(isLoading && this.option('indicateLoading')) {
            this._showLoadingIndicatorTimer = setTimeout((function() {
                const isEmpty = !this._itemElements().length;
                if(this._scrollView && !isEmpty) {
                    this._scrollView.startLoading();
                }
            }).bind(this));
        } else {
            clearTimeout(this._showLoadingIndicatorTimer);
            this._scrollView && this._scrollView.finishLoading();
        }
    },

    _dataSourceChangedHandler: function(newItems) {
        if(!this._shouldAppendItems() && hasWindow()) {
            this._scrollView && this._scrollView.scrollTo(0);
        }

        this.callBase.apply(this, arguments);
    },

    _refreshContent: function() {
        this._prepareContent();
        this._fireContentReadyAction();
    },

    _hideLoadingIfLoadIndicationOff: function() {
        if(!this.option('indicateLoading')) {
            this._dataSourceLoadingChangedHandler(false);
        }
    },

    _loadIndicationSuppressed: function(value) {
        if(!arguments.length) {
            return this._isLoadIndicationSuppressed;
        }
        this._isLoadIndicationSuppressed = value;
    },

    _scrollViewIsFull: function() {
        return !this._scrollView || this._scrollView.isFull();
    },

    _pullDownHandler: function(e) {
        this._pullRefreshAction(e);

        if(this._dataSource && !this._isDataSourceLoading()) {
            this._clearSelectedItems();
            this._dataSource.pageIndex(0);
            this._dataSource.reload();
        } else {
            this._updateLoadingState();
        }
    },

    _infiniteDataLoading: function() {
        const isElementVisible = this.$element().is(':visible');

        if(isElementVisible && !this._scrollViewIsFull() && !this._isDataSourceLoading() && !this._isLastPage()) {
            clearTimeout(this._loadNextPageTimer);
            this._loadNextPageTimer = setTimeout(() => {
                this._loadNextPage().done(this._setPreviousPageIfNewIsEmpty.bind(this));
            });
        }
    },

    _setPreviousPageIfNewIsEmpty: function(result) {
        if(this.option('_revertPageOnEmptyLoad')) {
            const dataSource = this.getDataSource();
            const pageIndex = dataSource?.pageIndex();

            if(result?.length === 0 && pageIndex > 0) {
                this._fireContentReadyAction();
                dataSource.pageIndex(pageIndex - 1);
            }
        }
    },

    _scrollBottomHandler: function(e) {
        this._pageLoadingAction(e);

        if(!this._isDataSourceLoading() && !this._isLastPage()) {
            this._loadNextPage();
        } else {
            this._updateLoadingState();
        }
    },

    _renderItems: function(items) {
        if(this.option('grouped')) {
            each(items, this._renderGroup.bind(this));
            this._attachGroupCollapseEvent();
            this._renderEmptyMessage();

            if(isMaterial()) {
                this.attachGroupHeaderInkRippleEvents();
            }
        } else {
            this.callBase.apply(this, arguments);
        }

        this._refreshItemElements();
        this._updateLoadingState(true);
    },

    _attachGroupCollapseEvent: function() {
        const eventName = addNamespace(clickEventName, this.NAME);
        const selector = '.' + LIST_GROUP_HEADER_CLASS;
        const $element = this.$element();
        const collapsibleGroups = this.option('collapsibleGroups');

        $element.toggleClass(LIST_COLLAPSIBLE_GROUPS_CLASS, collapsibleGroups);

        eventsEngine.off($element, eventName, selector);
        if(collapsibleGroups) {
            eventsEngine.on($element, eventName, selector, (function(e) {
                this._createAction((function(e) {
                    const $group = $(e.event.currentTarget).parent();
                    this._collapseGroupHandler($group);
                    if(this.option('focusStateEnabled')) {
                        this.option('focusedElement', getPublicElement($group.find('.' + LIST_ITEM_CLASS).eq(0)));
                    }
                }).bind(this), {
                    validatingTargetName: 'element'
                })({
                    event: e
                });
            }).bind(this));
        }
    },

    _collapseGroupHandler: function($group, toggle) {
        const deferred = new Deferred();

        if($group.hasClass(LIST_GROUP_COLLAPSED_CLASS) === toggle) {
            return deferred.resolve();
        }

        const $groupBody = $group.children('.' + LIST_GROUP_BODY_CLASS);

        const startHeight = $groupBody.outerHeight();
        const endHeight = startHeight === 0 ? $groupBody.height('auto').outerHeight() : 0;

        $group.toggleClass(LIST_GROUP_COLLAPSED_CLASS, toggle);

        fx.animate($groupBody, {
            type: 'custom',
            from: { height: startHeight },
            to: { height: endHeight },
            duration: 200,
            complete: (function() {
                this.updateDimensions();
                this._updateLoadingState();
                deferred.resolve();
            }).bind(this)
        });

        return deferred.promise();
    },

    _dataSourceLoadErrorHandler: function() {
        this._forgetNextPageLoading();

        if(this._initialized) {
            this._renderEmptyMessage();
            this._updateLoadingState();
        }
    },

    _initMarkup: function() {
        this._itemElementsCache = $();

        this.$element().addClass(LIST_CLASS);
        this.callBase();
        this.option('useInkRipple') && this._renderInkRipple();

        this.setAria('role', this.option('_listAttributes').role);
    },

    _renderInkRipple: function() {
        this._inkRipple = render();
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);
        const that = this;

        if(!this._inkRipple) {
            return;
        }

        const config = {
            element: $element,
            event: e
        };

        if(value) {
            if(isMaterial()) {
                this._inkRippleTimer = setTimeout(function() {
                    that._inkRipple.showWave(config);
                }, LIST_FEEDBACK_SHOW_TIMEOUT / 2);
            } else {
                that._inkRipple.showWave(config);
            }
        } else {
            clearTimeout(this._inkRippleTimer);
            this._inkRipple.hideWave(config);
        }
    },

    _postprocessRenderItem: function(args) {
        this._refreshItemElements();
        this.callBase.apply(this, arguments);

        if(this.option('_swipeEnabled')) {
            this._attachSwipeEvent($(args.itemElement));
        }
    },

    _attachSwipeEvent: function($itemElement) {
        const endEventName = addNamespace(swipeEventEnd, this.NAME);

        eventsEngine.on($itemElement, endEventName, this._itemSwipeEndHandler.bind(this));
    },

    _itemSwipeEndHandler: function(e) {
        this._itemDXEventHandler(e, 'onItemSwipe', {
            direction: e.offset < 0 ? 'left' : 'right'
        });
    },

    _nextButtonHandler: function(e) {
        this._pageLoadingAction(e);

        const source = this._dataSource;
        if(source && !source.isLoading()) {
            this._scrollView.toggleLoading(true);
            this._$nextButton.detach();
            this._loadIndicationSuppressed(true);
            this._loadNextPage();
        }
    },

    _renderGroup: function(index, group) {
        const $groupElement = $('<div>')
            .addClass(LIST_GROUP_CLASS)
            .appendTo(this._itemContainer());

        const $groupHeaderElement = $('<div>')
            .addClass(LIST_GROUP_HEADER_CLASS)
            .appendTo($groupElement);

        const groupTemplateName = this.option('groupTemplate');
        const groupTemplate = this._getTemplate(group.template || groupTemplateName, group, index, $groupHeaderElement);
        const renderArgs = {
            index: index,
            itemData: group,
            container: getPublicElement($groupHeaderElement)
        };

        this._createItemByTemplate(groupTemplate, renderArgs);

        if(isMaterial()) {
            $('<div>')
                .addClass(LIST_GROUP_HEADER_INDICATOR_CLASS)
                .prependTo($groupHeaderElement);
        }

        this._renderingGroupIndex = index;

        const $groupBody = $('<div>')
            .addClass(LIST_GROUP_BODY_CLASS)
            .appendTo($groupElement);

        each(groupItemsGetter(group) || [], (function(index, item) {
            this._renderItem(index, item, $groupBody);
        }).bind(this));

        this._groupRenderAction({
            groupElement: getPublicElement($groupElement),
            groupIndex: index,
            groupData: group
        });
    },

    downInkRippleHandler: function(e) {
        this._toggleActiveState($(e.currentTarget), true, e);
    },

    upInkRippleHandler: function(e) {
        this._toggleActiveState($(e.currentTarget), false);
    },

    attachGroupHeaderInkRippleEvents: function() {
        const selector = '.' + LIST_GROUP_HEADER_CLASS;
        const $element = this.$element();

        this._downInkRippleHandler = this._downInkRippleHandler || this.downInkRippleHandler.bind(this);
        this._upInkRippleHandler = this._upInkRippleHandler || this.upInkRippleHandler.bind(this);

        const downArguments = [$element, 'dxpointerdown', selector, this._downInkRippleHandler];
        const upArguments = [$element, 'dxpointerup dxpointerout', selector, this._upInkRippleHandler];

        eventsEngine.off(...downArguments);
        eventsEngine.on(...downArguments);

        eventsEngine.off(...upArguments);
        eventsEngine.on(...upArguments);
    },

    _createGroupRenderAction: function() {
        this._groupRenderAction = this._createActionByOption('onGroupRendered');
    },

    _clean: function() {
        clearTimeout(this._inkRippleTimer);
        if(this._$nextButton) {
            this._$nextButton.remove();
            this._$nextButton = null;
        }
        delete this._inkRipple;
        this.callBase.apply(this, arguments);
    },

    _dispose: function() {
        clearTimeout(this._holdTimer);
        clearTimeout(this._loadNextPageTimer);
        clearTimeout(this._showLoadingIndicatorTimer);
        this.callBase();
    },

    _toggleDisabledState: function(value) {
        this.callBase(value);
        this._scrollView.option('disabled', value || !this.option('scrollingEnabled'));
    },

    _toggleNextButton: function(value) {
        const dataSource = this._dataSource;
        const $nextButton = this._getNextButton();

        this.$element().toggleClass(LIST_HAS_NEXT_CLASS, value);

        if(value && dataSource && dataSource.isLoaded()) {
            $nextButton.appendTo(this._itemContainer());
        }

        if(!value) {
            $nextButton.detach();
        }
    },

    _getNextButton: function() {
        if(!this._$nextButton) {
            this._$nextButton = this._createNextButton();
        }
        return this._$nextButton;
    },

    _createNextButton: function() {
        const $result = $('<div>').addClass(LIST_NEXT_BUTTON_CLASS);

        const $button = $('<div>').appendTo($result);

        this._createComponent($button, Button, {
            text: this.option('nextButtonText'),
            onClick: this._nextButtonHandler.bind(this),
            type: isMaterial() ? 'default' : undefined,
            integrationOptions: {}
        });

        return $result;
    },

    _moveFocus: function() {
        this.callBase.apply(this, arguments);

        this.scrollToItem(this.option('focusedElement'));
    },

    _refresh: function() {
        if(!hasWindow()) {
            this.callBase();
        } else {
            const scrollTop = this._scrollView.scrollTop();
            this.callBase();
            scrollTop && this._scrollView.scrollTo(scrollTop);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'pageLoadMode':
                this._toggleNextButton(args.value);
                this._initScrollView();
                break;
            case 'dataSource':
                this.callBase(args);
                this._initScrollView();
                break;
            case 'pullingDownText':
            case 'pulledDownText':
            case 'refreshingText':
            case 'pageLoadingText':
            case 'showScrollbar':
            case 'bounceEnabled':
            case 'scrollByContent':
            case 'scrollByThumb':
            case 'useNativeScrolling':
            case 'scrollingEnabled':
            case 'pullRefreshEnabled':
                this._initScrollView();
                this._updateLoadingState();
                break;
            case 'nextButtonText':
            case 'onItemSwipe':
            case 'useInkRipple':
                this._invalidate();
                break;
            case 'onScroll':
            case 'onPullRefresh':
            case 'onPageLoading':
                this._createScrollViewActions();
                break;
            case 'grouped':
            case 'collapsibleGroups':
            case 'groupTemplate':
                this._invalidate();
                break;
            case 'wrapItemText':
                this._$container.toggleClass(WRAP_ITEM_TEXT_CLASS, args.value);
                break;
            case 'onGroupRendered':
                this._createGroupRenderAction();
                break;
            case 'width':
            case 'height':
                this.callBase(args);
                this._scrollView.update();
                break;
            case 'indicateLoading':
                this._hideLoadingIfLoadIndicationOff();
                break;
            case 'visible':
                this.callBase(args);
                this._scrollView.update();
                break;
            case 'rtlEnabled':
                this._initScrollView();
                this.callBase(args);
                break;
            case 'showChevronExpr':
            case 'badgeExpr':
                this._invalidate();
                break;
            case '_swipeEnabled':
            case '_revertPageOnEmptyLoad':
                break;
            case '_listAttributes':
                break;
            default:
                this.callBase(args);
        }
    },

    _extendActionArgs: function($itemElement) {
        if(!this.option('grouped')) {
            return this.callBase($itemElement);
        }

        const $group = $itemElement.closest('.' + LIST_GROUP_CLASS);
        const $item = $group.find('.' + LIST_ITEM_CLASS);
        return extend(this.callBase($itemElement), {
            itemIndex: {
                group: $group.index(),
                item: $item.index($itemElement)
            }
        });
    },

    expandGroup: function(groupIndex) {
        const deferred = new Deferred();
        const $group = this._itemContainer().find('.' + LIST_GROUP_CLASS).eq(groupIndex);

        this._collapseGroupHandler($group, false).done((function() {
            deferred.resolveWith(this);
        }).bind(this));

        return deferred.promise();
    },

    collapseGroup: function(groupIndex) {
        const deferred = new Deferred();
        const $group = this._itemContainer().find('.' + LIST_GROUP_CLASS).eq(groupIndex);

        this._collapseGroupHandler($group, true).done((function() {
            deferred.resolveWith(this);
        }).bind(this));

        return deferred;
    },

    updateDimensions: function() {
        const that = this;
        const deferred = new Deferred();

        if(that._scrollView) {
            that._scrollView.update().done(function() {
                !that._scrollViewIsFull() && that._updateLoadingState(true);
                deferred.resolveWith(that);
            });
        } else {
            deferred.resolveWith(that);
        }

        return deferred.promise();
    },

    reload: function() {
        this.callBase();
        this.scrollTo(0);
        this._pullDownHandler();
    },

    repaint: function() {
        this.scrollTo(0);
        this.callBase();
    },

    scrollTop: function() {
        return this._scrollView.scrollOffset().top;
    },

    clientHeight: function() {
        return this._scrollView.clientHeight();
    },

    scrollHeight: function() {
        return this._scrollView.scrollHeight();
    },

    scrollBy: function(distance) {
        this._scrollView.scrollBy(distance);
    },

    scrollTo: function(location) {
        this._scrollView.scrollTo(location);
    },

    scrollToItem: function(itemElement) {
        const $item = this._editStrategy.getItemElement(itemElement);

        this._scrollView.scrollToElement($item);
    }

}).include(DataConverterMixin);

ListBase.ItemClass = ListItem;

function getScrollView() {
    return _scrollView || ScrollView;
}

export function setScrollView(value) {
    _scrollView = value;
}

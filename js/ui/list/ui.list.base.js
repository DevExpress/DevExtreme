"use strict";

var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    compileGetter = require("../../core/utils/data").compileGetter,
    extend = require("../../core/utils/extend").extend,
    clickEvent = require("../../events/click"),
    swipeEvents = require("../../events/swipe"),
    support = require("../../core/utils/support"),
    messageLocalization = require("../../localization/message"),
    inkRipple = require("../widget/utils.ink_ripple"),
    devices = require("../../core/devices"),
    ListItem = require("./item"),
    Button = require("../button"),
    eventUtils = require("../../events/utils"),
    themes = require("../themes"),
    ScrollView = require("../scroll_view"),
    deviceDependentOptions = require("../scroll_view/ui.scrollable").deviceDependentOptions,
    CollectionWidget = require("../collection/ui.collection_widget.edit"),
    BindableTemplate = require("../widget/bindable_template");

var LIST_CLASS = "dx-list",
    LIST_ITEM_CLASS = "dx-list-item",
    LIST_ITEM_SELECTOR = "." + LIST_ITEM_CLASS,
    LIST_GROUP_CLASS = "dx-list-group",
    LIST_GROUP_HEADER_CLASS = "dx-list-group-header",
    LIST_GROUP_BODY_CLASS = "dx-list-group-body",
    LIST_COLLAPSIBLE_GROUPS_CLASS = "dx-list-collapsible-groups",
    LIST_GROUP_COLLAPSED_CLASS = "dx-list-group-collapsed",
    LIST_HAS_NEXT_CLASS = "dx-has-next",
    LIST_NEXT_BUTTON_CLASS = "dx-list-next-button",

    LIST_ITEM_DATA_KEY = "dxListItemData",
    LIST_FEEDBACK_SHOW_TIMEOUT = 70;

var groupItemsGetter = compileGetter("items");

var ListBase = CollectionWidget.inherit({

    _activeStateUnit: LIST_ITEM_SELECTOR,

    _supportedKeys: function() {
        var that = this;

        var moveFocusPerPage = function(direction) {
            var $item = getEdgeVisibleItem(direction),
                isFocusedItem = $item.is(that.option("focusedElement"));

            if(isFocusedItem) {
                scrollListTo($item, direction);
                $item = getEdgeVisibleItem(direction);
            }

            that.option("focusedElement", $item);
            that.scrollToItem($item);
        };

        var getEdgeVisibleItem = function(direction) {
            var scrollTop = that.scrollTop(),
                containerHeight = that.element().height();

            var $item = that.option("focusedElement"),
                isItemVisible = true;

            if(!$item) {
                return $();
            }

            while(isItemVisible) {
                var $nextItem = $item[direction]();

                if(!$nextItem.length) {
                    break;
                }

                var nextItemLocation = $nextItem.position().top + $nextItem.outerHeight() / 2;
                isItemVisible = nextItemLocation < containerHeight + scrollTop && nextItemLocation > scrollTop;

                if(isItemVisible) {
                    $item = $nextItem;
                }
            }

            return $item;
        };

        var scrollListTo = function($item, direction) {
            var resultPosition = $item.position().top;

            if(direction === "prev") {
                resultPosition = $item.position().top - that.element().height() + $item.outerHeight();
            }

            that.scrollTo(resultPosition);
        };

        return extend(this.callBase(), {
            leftArrow: commonUtils.noop,
            rightArrow: commonUtils.noop,
            pageUp: function() {
                moveFocusPerPage("prev");
                return false;
            },
            pageDown: function() {
                moveFocusPerPage("next");
                return false;
            }
        });
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            /**
            * @name dxListOptions_autoPagingEnabled
            * @publicName autoPagingEnabled
            * @deprecated #pageLoadMode
            * @extend_doc
            */
            "autoPagingEnabled": { since: "15.1", message: "Use the 'pageLoadMode' option instead" },

            /**
            * @name dxListOptions_showNextButton
            * @publicName showNextButton
            * @deprecated #pageLoadMode
            * @extend_doc
            */
            "showNextButton": { since: "15.1", message: "Use the 'pageLoadMode' option instead" }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {

            /**
             * @name dxListOptions_hoverStateEnabled
             * @publicName hoverStateEnabled
             * @type boolean
             * @default true
             * @extend_doc
             */
            hoverStateEnabled: true,

            /**
            * @name dxListOptions_pullRefreshEnabled
            * @publicName pullRefreshEnabled
            * @type boolean
            * @default false
            */
            pullRefreshEnabled: false,

            /**
            * @name dxListOptions_scrollingEnabled
            * @publicName scrollingEnabled
            * @type boolean
            * @default true
            */
            scrollingEnabled: true,

            /**
            * @name dxListOptions_showScrollbar
            * @publicName showScrollbar
            * @type string
            * @acceptValues 'onScroll'|'onHover'|'always'|'never'
            * @default 'onScroll'
            */
            showScrollbar: "onScroll",

            useNativeScrolling: true,

            /**
            * @name dxListOptions_bounceEnabled
            * @publicName bounceEnabled
            * @type boolean
            * @default true
            */
            bounceEnabled: true,

            /**
            * @name dxListOptions_scrollByContent
            * @publicName scrollByContent
            * @type boolean
            * @default true
            */
            scrollByContent: true,

            /**
            * @name dxListOptions_scrollByThumb
            * @publicName scrollByThumb
            * @type boolean
            * @default false
            */
            scrollByThumb: false,

            /**
            * @name dxListOptions_pullingDownText
            * @publicName pullingDownText
            * @type string
            * @default "Pull down to refresh..."
            */
            pullingDownText: messageLocalization.format("dxList-pullingDownText"),

            /**
            * @name dxListOptions_pulledDownText
            * @publicName pulledDownText
            * @type string
            * @default "Release to refresh..."
            */
            pulledDownText: messageLocalization.format("dxList-pulledDownText"),

            /**
            * @name dxListOptions_refreshingText
            * @publicName refreshingText
            * @type string
            * @default "Refreshing..."
            */
            refreshingText: messageLocalization.format("dxList-refreshingText"),

            /**
            * @name dxListOptions_pageLoadingText
            * @publicName pageLoadingText
            * @type string
            * @default "Loading..."
            */
            pageLoadingText: messageLocalization.format("dxList-pageLoadingText"),

            /**
            * @name dxListOptions_onScroll
            * @publicName onScroll
            * @extends Action
            * @type_function_param1_field4 jQueryEvent:jQueryEvent
            * @type_function_param1_field5 scrollOffset:object
            * @type_function_param1_field6 reachedLeft:boolean
            * @type_function_param1_field7 reachedRight:boolean
            * @type_function_param1_field8 reachedTop:boolean
            * @type_function_param1_field9 reachedBottom:boolean
            * @action
            */
            onScroll: null,

            /**
            * @name dxListOptions_onPullRefresh
            * @publicName onPullRefresh
            * @extends Action
            * @action
            */
            onPullRefresh: null,

            /**
            * @name dxListOptions_onPageLoading
            * @publicName onPageLoading
            * @extends Action
            * @action
            */
            onPageLoading: null,

            /**
            * @name dxListOptions_pageLoadMode
            * @publicName pageLoadMode
            * @type string
            * @default "scrollBottom"
            * @acceptValues 'scrollBottom'|'nextButton'
            */
            pageLoadMode: "scrollBottom",

            /**
            * @name dxListOptions_nextButtonText
            * @publicName nextButtonText
            * @type string
            * @default "More"
            */
            nextButtonText: messageLocalization.format("dxList-nextButtonText"),

            /**
            * @name dxListOptions_onItemSwipe
            * @publicName onItemSwipe
            * @extends Action
            * @type_function_param1_field4 jQueryEvent:jQueryEvent
            * @type_function_param1_field5 itemData:object
            * @type_function_param1_field6 itemElement:jQuery
            * @type_function_param1_field7 itemIndex:number | object
            * @type_function_param1_field8 direction:string
            * @action
            */
            onItemSwipe: null,

            /**
            * @name dxListOptions_grouped
            * @publicName grouped
            * @type boolean
            * @default false
            */
            grouped: false,

            /**
            * @name dxListOptions_onGroupRendered
            * @publicName onGroupRendered
            * @extends Action
            * @type_function_param1_field4 groupData:object
            * @type_function_param1_field5 groupElement:jQuery
            * @type_function_param1_field6 groupIndex:number
            * @action
            */
            onGroupRendered: null,

            /**
            * @name dxListOptions_collapsibleGroups
            * @publicName collapsibleGroups
            * @type boolean
            * @default false
            */
            collapsibleGroups: false,

            /**
            * @name dxListOptions_groupTemplate
            * @publicName groupTemplate
            * @type template
            * @default "group"
            * @type_function_param1 groupData:object
            * @type_function_param2 groupIndex:number
            * @type_function_param3 groupElement:object
            * @type_function_return string|Node|jQuery
            */
            groupTemplate: "group",

            /**
            * @name dxListOptions_indicateLoading
            * @publicName indicateLoading
            * @type boolean
            * @default true
            */
            indicateLoading: true,

            /**
            * @name dxListOptions_selectedIndex
            * @publicName selectedIndex
            * @type number
            * @default -1
            * @hidden
            */

            /**
            * @name dxListOptions_selectedItem
            * @publicName selectedItem
            * @hidden
            * @extend_doc
            */

            /**
             * @name dxListOptions_activeStateEnabled
             * @publicName activeStateEnabled
             * @type boolean
             * @default true
             * @extend_doc
             */
            activeStateEnabled: true,

            _itemAttributes: { "role": "option" },

            useInkRipple: false,

            /**
            * @name dxListOptions_onItemClick
            * @publicName onItemClick
            * @type function|string
            * @extends Action
            * @type_function_param1_field4 itemData:object
            * @type_function_param1_field5 itemElement:jQuery
            * @type_function_param1_field6 itemIndex:number | object
            * @action
            */

            /**
            * @name dxListOptions_onItemContextMenu
            * @publicName onItemContextMenu
            * @extends Action
            * @type_function_param1_field6 itemIndex:number | object
            * @action
            * @extend_doc
            */

            /**
            * @name dxListOptions_onItemHold
            * @publicName onItemHold
            * @extends Action
            * @type_function_param1_field6 itemIndex:number | object
            * @action
            * @extend_doc
            */

            showChevronExpr: function(data) { return data ? data.showChevron : undefined; },
            badgeExpr: function(data) { return data ? data.badge : undefined; }

            /**
            * @name dxListItemTemplate_badge
            * @publicName badge
            * @type String
            */
            /**
            * @name dxListItemTemplate_showChevron
            * @publicName showChevron
            * @type boolean
            */

            /**
            * @name dxListItemTemplate_key
            * @publicName key
            * @type String
            */
        });
    },

    _defaultOptionsRules: function() {
        /**
        * @name dxListOptions_useNativeScrolling
        * @publicName useNativeScrolling
        * @custom_default_for_android_below_version_4 false
        * @custom_default_for_desktop false
        * @custom_default_for_mac_desktop true
        */
        return this.callBase().concat(deviceDependentOptions(), [
            {
                device: function() {
                    return !support.nativeScrolling;
                },
                options: {
                    /**
                    * @name dxListOptions_useNativeScrolling
                    * @publicName useNativeScrolling
                    * @type boolean
                    * @default true
                    */
                    useNativeScrolling: false
                }
            },
            {
                device: function(device) {
                    return !support.nativeScrolling && !devices.isSimulator() && devices.real().platform === "generic" && device.platform === "generic";
                },
                options: {
                    /**
                    * @name dxListOptions_showScrollbar
                    * @publicName showScrollbar
                    * @custom_default_for_android_below_version_4 "onHover"
                    * @custom_default_for_desktop "onHover"
                    */
                    showScrollbar: "onHover",

                    /**
                    * @name dxListOptions_pageLoadMode
                    * @publicName pageLoadMode
                    * @custom_default_for_android_below_version_4 "nextButton"
                    * @custom_default_for_desktop "nextButton"
                    */
                    pageLoadMode: "nextButton"
                }
            },
            {
                device: function() {
                    return devices.real().deviceType === "desktop" && !devices.isSimulator();
                },
                options: {
                    /**
                    * @name dxListOptions_focusStateEnabled
                    * @publicName focusStateEnabled
                    * @type boolean
                    * @custom_default_for_generic true
                    * @extend_doc
                    */
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return /android5/.test(themes.current());
                },
                options: {
                    useInkRipple: true
                }
            },
            {
                device: function() {
                    return devices.current().platform === "win" && devices.isSimulator();
                },

                options: {
                    bounceEnabled: false
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

    _refreshItemElements: function() {
        if(!this.option("grouped")) {
            this._itemElementsCache = this._itemContainer().children(this._itemSelector());
        } else {
            this._itemElementsCache = this._itemContainer()
                 .children("." + LIST_GROUP_CLASS)
                 .children("." + LIST_GROUP_BODY_CLASS)
                 .children(this._itemSelector());
        }
    },

    _reorderItem: function(itemElement, toItemElement) {
        this.callBase(itemElement, toItemElement);
        this._refreshItemElements();
    },

    _deleteItem: function(itemElement) {
        this.callBase(itemElement);
        this._refreshItemElements();
    },

    _itemElements: function() {
        return this._itemElementsCache;
    },

    _itemSelectHandler: function(e) {
        if(this.option("selectionMode") === "single" && this.isItemSelected(e.currentTarget)) {
            return;
        }

        this.callBase(e);
    },

    _allowDynamicItemsAppend: function() {
        return true;
    },

    _init: function() {
        this.callBase();
        this._$container = this.element();

        this._initScrollView();

        this._feedbackShowTimeout = LIST_FEEDBACK_SHOW_TIMEOUT;
        this._createGroupRenderAction();

        this.setAria("role", "listbox");
    },

    _dataSourceOptions: function() {
        this._suppressDeprecatedWarnings();
        var pagingEnabled = this.option("autoPagingEnabled");
        pagingEnabled = commonUtils.isDefined(this.option("showNextButton")) ? pagingEnabled || this.option("showNextButton") : pagingEnabled;
        this._resumeDeprecatedWarnings();

        return extend(this.callBase(), {
            paginate: commonUtils.isDefined(pagingEnabled) ? pagingEnabled : true
        });
    },

    _dataSourceFromUrlLoadMode: function() {
        return "raw";
    },

    _initScrollView: function() {
        this._suppressDeprecatedWarnings();
        var scrollingEnabled = this.option("scrollingEnabled"),
            pullRefreshEnabled = scrollingEnabled && this.option("pullRefreshEnabled"),
            autoPagingEnabled = scrollingEnabled && commonUtils.ensureDefined(this.option("autoPagingEnabled"), this.option("pageLoadMode") === "scrollBottom") && !!this._dataSource;
        this._resumeDeprecatedWarnings();

        this._scrollView = this._createComponent(this.element(), ScrollView, {
            disabled: this.option("disabled") || !scrollingEnabled,
            onScroll: this._scrollHandler.bind(this),
            onPullDown: pullRefreshEnabled ? this._pullDownHandler.bind(this) : null,
            onReachBottom: autoPagingEnabled ? this._scrollBottomHandler.bind(this) : null,
            showScrollbar: this.option("showScrollbar"),
            useNative: this.option("useNativeScrolling"),
            bounceEnabled: this.option("bounceEnabled"),
            scrollByContent: this.option("scrollByContent"),
            scrollByThumb: this.option("scrollByThumb"),
            pullingDownText: this.option("pullingDownText"),
            pulledDownText: this.option("pulledDownText"),
            refreshingText: this.option("refreshingText"),
            reachBottomText: this.option("pageLoadingText"),
            useKeyboard: false
        });

        this._$container = this._scrollView.content();

        this._createScrollViewActions();
    },

    _createScrollViewActions: function() {
        this._scrollAction = this._createActionByOption("onScroll");
        this._pullRefreshAction = this._createActionByOption("onPullRefresh");
        this._pageLoadingAction = this._createActionByOption("onPageLoading");
    },

    _scrollHandler: function(e) {
        this._scrollAction && this._scrollAction(e);
    },

    _initTemplates: function() {
        this.callBase();

        this._defaultTemplates["group"] = new BindableTemplate(function($container, data) {
            if(typeUtils.isPlainObject(data)) {
                if(data.key) {
                    $container.text(data.key);
                }
            } else {
                $container.html(String(data));
            }
        }, ["key"], this.option("integrationOptions.watchMethod"));
    },

    _updateLoadingState: function(tryLoadMore) {
        this._suppressDeprecatedWarnings();
        var isDataLoaded = !tryLoadMore || this._isLastPage(),
            autoPagingEnabled = commonUtils.ensureDefined(this.option("autoPagingEnabled"), this.option("pageLoadMode") === "scrollBottom"),
            stopLoading = isDataLoaded || !autoPagingEnabled,
            hideLoadIndicator = stopLoading && !this._isDataSourceLoading();
        this._resumeDeprecatedWarnings();

        if(stopLoading || this._scrollViewIsFull()) {
            this._scrollView.release(hideLoadIndicator);
            this._toggleNextButton(this._shouldRenderNextButton() && !isDataLoaded);
            this._loadIndicationSuppressed(false);
        } else {
            this._infiniteDataLoading();
        }
    },

    _shouldRenderNextButton: function() {
        this._suppressDeprecatedWarnings();
        var result = commonUtils.ensureDefined(this.option("showNextButton"), this.option("pageLoadMode") === "nextButton") && this._dataSource && this._dataSource.isLoaded();
        this._resumeDeprecatedWarnings();
        return result;
    },

    _dataSourceLoadingChangedHandler: function(isLoading) {
        if(this._loadIndicationSuppressed()) {
            return;
        }

        if(isLoading && this.option("indicateLoading")) {
            this._showLoadingIndicatorTimer = setTimeout((function() {
                var isEmpty = !this._itemElements().length;
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
        if(!this._shouldAppendItems()) {
            this._scrollView && this._scrollView.scrollTo(0);
        }

        this.callBase(newItems);
    },

    _hideLoadingIfLoadIndicationOff: function() {
        if(!this.option("indicateLoading")) {
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
        var isElementVisible = this.element().is(":visible");

        if(isElementVisible && !this._scrollViewIsFull() && !this._isDataSourceLoading() && !this._isLastPage()) {
            clearTimeout(this._loadNextPageTimer);
            this._loadNextPageTimer = setTimeout(this._loadNextPage.bind(this));
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
        if(this.option("grouped")) {
            $.each(items, this._renderGroup.bind(this));
            this._attachGroupCollapseEvent();
            this._renderEmptyMessage();
        } else {
            this.callBase.apply(this, arguments);
        }

        this._refreshItemElements();
        this._updateLoadingState(true);
    },

    _attachGroupCollapseEvent: function() {
        var eventName = eventUtils.addNamespace(clickEvent.name, this.NAME),
            selector = "." + LIST_GROUP_HEADER_CLASS,
            $element = this.element(),
            collapsibleGroups = this.option("collapsibleGroups");

        $element.toggleClass(LIST_COLLAPSIBLE_GROUPS_CLASS, collapsibleGroups);

        $element.off(eventName, selector);
        if(collapsibleGroups) {
            $element.on(eventName, selector, (function(e) {
                this._createAction((function(e) {
                    var $group = $(e.jQueryEvent.currentTarget).parent();
                    this._collapseGroupHandler($group);
                    if(this.option("focusStateEnabled")) {
                        this.option("focusedElement", $group.find("." + LIST_ITEM_CLASS).eq(0));
                    }
                }).bind(this), {
                    validatingTargetName: "element"
                })({
                    jQueryEvent: e
                });
            }).bind(this));
        }
    },

    _collapseGroupHandler: function($group, toggle) {
        var deferred = $.Deferred(),

            $groupBody = $group.children("." + LIST_GROUP_BODY_CLASS);

        $group.toggleClass(LIST_GROUP_COLLAPSED_CLASS, toggle);

        var slideMethod = "slideToggle";
        if(toggle === true) {
            slideMethod = "slideUp";
        }
        if(toggle === false) {
            slideMethod = "slideDown";
        }
        $groupBody[slideMethod]({
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

    _render: function() {
        this._itemElementsCache = $();

        this.element().addClass(LIST_CLASS);
        this.callBase();

        this.option("useInkRipple") && this._renderInkRipple();
    },

    _renderInkRipple: function() {
        this._inkRipple = inkRipple.render();
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        var config = {
            element: $element,
            jQueryEvent: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _postprocessRenderItem: function(args) {
        this._refreshItemElements();
        this.callBase.apply(this, arguments);

        if(this.option("onItemSwipe")) {
            this._attachSwipeEvent($(args.itemElement));
        }
    },

    _attachSwipeEvent: function($itemElement) {
        var endEventName = eventUtils.addNamespace(swipeEvents.end, this.NAME);

        $itemElement
            .on(endEventName, this._itemSwipeEndHandler.bind(this));
    },

    _itemSwipeEndHandler: function(e) {
        this._itemJQueryEventHandler(e, "onItemSwipe", {
            direction: e.offset < 0 ? "left" : "right"
        });
    },

    _nextButtonHandler: function() {
        var source = this._dataSource;

        if(source && !source.isLoading()) {
            this._scrollView.toggleLoading(true);
            this._$nextButton.detach();
            this._loadIndicationSuppressed(true);
            this._loadNextPage();
        }
    },

    _renderGroup: function(index, group) {
        var $groupElement = $("<div>")
            .addClass(LIST_GROUP_CLASS)
            .appendTo(this._itemContainer());

        var $groupHeaderElement = $("<div>")
            .addClass(LIST_GROUP_HEADER_CLASS)
            .appendTo($groupElement);

        var groupTemplateName = this.option("groupTemplate"),
            groupTemplate = this._getTemplate(group.template || groupTemplateName, group, index, $groupHeaderElement),
            renderArgs = {
                index: index,
                itemData: group,
                container: $groupHeaderElement
            };

        this._createItemByTemplate(groupTemplate, renderArgs);

        this._renderingGroupIndex = index;

        var $groupBody = $("<div>")
            .addClass(LIST_GROUP_BODY_CLASS)
            .appendTo($groupElement);

        $.each(groupItemsGetter(group) || [], (function(index, item) {
            this._renderItem(index, item, $groupBody);
        }).bind(this));

        this._groupRenderAction({
            groupElement: $groupElement,
            groupIndex: index,
            groupData: group
        });
    },

    _createGroupRenderAction: function() {
        this._groupRenderAction = this._createActionByOption("onGroupRendered");
    },

    _clean: function() {
        if(this._$nextButton) {
            this._$nextButton.remove();
            this._$nextButton = null;
        }
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
        this._scrollView.option("disabled", value || !this.option("scrollingEnabled"));
    },

    _toggleNextButton: function(value) {
        var dataSource = this._dataSource,
            $nextButton = this._getNextButton();

        this.element().toggleClass(LIST_HAS_NEXT_CLASS, value);

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
        var $result = $("<div>").addClass(LIST_NEXT_BUTTON_CLASS);

        var $button = $("<div>").appendTo($result);

        this._createComponent($button, Button, {
            text: this.option("nextButtonText"),
            onClick: this._nextButtonHandler.bind(this),
            integrationOptions: {}
        });

        return $result;
    },

    _moveFocus: function() {
        this.callBase.apply(this, arguments);

        this.scrollToItem(this.option("focusedElement"));
    },

    _refresh: function() {
        var scrollTop = this._scrollView.scrollTop();
        this.callBase();
        scrollTop && this._scrollView.scrollTo(scrollTop);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "pageLoadMode":
                this._toggleNextButton(args.value);
                this._initScrollView();
                break;
            case "showNextButton":
                this._toggleNextButton(args.value);
                break;
            case "dataSource":
                this.callBase(args);
                this._initScrollView();
                break;
            case "pullingDownText":
            case "pulledDownText":
            case "refreshingText":
            case "pageLoadingText":
            case "useNative":
            case "showScrollbar":
            case "bounceEnabled":
            case "scrollByContent":
            case "scrollByThumb":
            case "scrollingEnabled":
            case "pullRefreshEnabled":
            case "autoPagingEnabled":
                this._initScrollView();
                this._updateLoadingState();
                break;
            case "nextButtonText":
            case "onItemSwipe":
            case "useInkRipple":
                this._invalidate();
                break;
            case "onScroll":
            case "onPullRefresh":
            case "onPageLoading":
                this._createScrollViewActions();
                this._invalidate();
                break;
            case "grouped":
            case "collapsibleGroups":
            case "groupTemplate":
                this._invalidate();
                break;
            case "onGroupRendered":
                this._createGroupRenderAction();
                break;
            case "width":
            case "height":
                this.callBase(args);
                this._scrollView.update();
                break;
            case "indicateLoading":
                this._hideLoadingIfLoadIndicationOff();
                break;
            case "visible":
                this.callBase(args);
                this._scrollView.update();
                break;
            case "rtlEnabled":
                this._initScrollView();
                this.callBase(args);
                break;
            case "showChevronExpr":
            case "badgeExpr":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _extendActionArgs: function($itemElement) {
        if(!this.option("grouped")) {
            return this.callBase($itemElement);
        }

        var $group = $itemElement.closest("." + LIST_GROUP_CLASS);
        var $item = $group.find("." + LIST_ITEM_CLASS);
        return extend(this.callBase($itemElement), {
            itemIndex: {
                group: $group.index(),
                item: $item.index($itemElement)
            }
        });
    },

    /**
    * @name dxListMethods_expandGroup
    * @publicName expandGroup(groupIndex)
    * @param1 groupIndex:Number
    * @return Promise
    */
    expandGroup: function(groupIndex) {
        var deferred = $.Deferred(),
            $group = this._itemContainer().find("." + LIST_GROUP_CLASS).eq(groupIndex);

        this._collapseGroupHandler($group, false).done((function() {
            deferred.resolveWith(this);
        }).bind(this));

        return deferred.promise();
    },

    /**
    * @name dxListMethods_collapseGroup
    * @publicName collapseGroup(groupIndex)
    * @param1 groupIndex:Number
    * @return Promise
    */
    collapseGroup: function(groupIndex) {
        var deferred = $.Deferred(),
            $group = this._itemContainer().find("." + LIST_GROUP_CLASS).eq(groupIndex);

        this._collapseGroupHandler($group, true).done((function() {
            deferred.resolveWith(this);
        }).bind(this));

        return deferred;
    },

    /**
    * @name dxListMethods_updateDimensions
    * @publicName updateDimensions()
    * @return Promise
    */
    updateDimensions: function() {
        var that = this,
            deferred = $.Deferred();

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

    /**
    * @name dxListMethods_reload
    * @publicName reload()
    */
    reload: function() {
        this.scrollTo(0);
        this._pullDownHandler();
    },

    repaint: function() {
        this.scrollTo(0);
        this.callBase();
    },

    /**
    * @name dxListMethods_scrollTop
    * @publicName scrollTop()
    * @return numeric
    */
    scrollTop: function() {
        return this._scrollView.scrollOffset().top;
    },

    /**
    * @name dxListMethods_clientHeight
    * @publicName clientHeight()
    * @return numeric
    */
    clientHeight: function() {
        return this._scrollView.clientHeight();
    },

    /**
    * @name dxListMethods_scrollHeight
    * @publicName scrollHeight()
    * @return numeric
    */
    scrollHeight: function() {
        return this._scrollView.scrollHeight();
    },

    /**
    * @name dxListMethods_scrollBy
    * @publicName scrollBy(distance)
    * @param1 distance:numeric
    */
    scrollBy: function(distance) {
        this._scrollView.scrollBy(distance);
    },

    /**
    * @name dxListMethods_scrollTo
    * @publicName scrollTo(location)
    * @param1 location:numeric
    */
    scrollTo: function(location) {
        this._scrollView.scrollTo(location);
    },

    /**
    * @name dxListMethods_scrollToItem
    * @publicName scrollToItem(itemElement)
    * @param1 itemElement:Node
    */
    /**
    * @name dxListMethods_scrollToItem
    * @publicName scrollToItem(itemIndex)
    * @param1 itemIndex:Number|Object
    */
    scrollToItem: function(itemElement) {
        var $item = this._editStrategy.getItemElement(itemElement);

        this._scrollView.scrollToElement($item);
    }

});

ListBase.ItemClass = ListItem;

module.exports = ListBase;

///#DEBUG
module.exports.mockScrollView = function(Mock) {
    ScrollView = Mock;
};
///#ENDDEBUG

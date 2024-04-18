System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/list', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxList, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiItemComponent, DxiMenuItemComponent, DxoItemDraggingModule, DxoCursorOffsetModule, DxiItemModule, DxiMenuItemModule, DxoSearchEditorOptionsModule, DxiButtonModule, DxoOptionsModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            ContentChildren = module.ContentChildren;
            NgModule = module.NgModule;
        }, function (module) {
            DxList = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiItemComponent = module.DxiItemComponent;
            DxiMenuItemComponent = module.DxiMenuItemComponent;
            DxoItemDraggingModule = module.DxoItemDraggingModule;
            DxoCursorOffsetModule = module.DxoCursorOffsetModule;
            DxiItemModule = module.DxiItemModule;
            DxiMenuItemModule = module.DxiMenuItemModule;
            DxoSearchEditorOptionsModule = module.DxoSearchEditorOptionsModule;
            DxiButtonModule = module.DxiButtonModule;
            DxoOptionsModule = module.DxoOptionsModule;
        }, null, null, null, null, null, null, null, null, null, null],
        execute: (function () {

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:max-line-length */
            /**
             * The List is a UI component that represents a collection of items in a scrollable list.

             */
            class DxListComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the shortcut key that sets focus on the UI component.
                
                 */
                get accessKey() {
                    return this._getOption('accessKey');
                }
                set accessKey(value) {
                    this._setOption('accessKey', value);
                }
                /**
                 * Specifies whether the UI component changes its visual state as a result of user interaction.
                
                 */
                get activeStateEnabled() {
                    return this._getOption('activeStateEnabled');
                }
                set activeStateEnabled(value) {
                    this._setOption('activeStateEnabled', value);
                }
                /**
                 * Specifies whether or not an end user can delete list items.
                
                 */
                get allowItemDeleting() {
                    return this._getOption('allowItemDeleting');
                }
                set allowItemDeleting(value) {
                    this._setOption('allowItemDeleting', value);
                }
                /**
                 * A Boolean value specifying whether to enable or disable the bounce-back effect.
                
                 */
                get bounceEnabled() {
                    return this._getOption('bounceEnabled');
                }
                set bounceEnabled(value) {
                    this._setOption('bounceEnabled', value);
                }
                /**
                 * Specifies whether or not an end user can collapse groups.
                
                 */
                get collapsibleGroups() {
                    return this._getOption('collapsibleGroups');
                }
                set collapsibleGroups(value) {
                    this._setOption('collapsibleGroups', value);
                }
                /**
                 * Binds the UI component to data.
                
                 */
                get dataSource() {
                    return this._getOption('dataSource');
                }
                set dataSource(value) {
                    this._setOption('dataSource', value);
                }
                /**
                 * Specifies whether the UI component responds to user interaction.
                
                 */
                get disabled() {
                    return this._getOption('disabled');
                }
                set disabled(value) {
                    this._setOption('disabled', value);
                }
                /**
                 * Specifies the data field whose values should be displayed. Defaults to &apos;text&apos; when the data source contains objects.
                
                 */
                get displayExpr() {
                    return this._getOption('displayExpr');
                }
                set displayExpr(value) {
                    this._setOption('displayExpr', value);
                }
                /**
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Specifies whether the UI component can be focused using keyboard navigation.
                
                 */
                get focusStateEnabled() {
                    return this._getOption('focusStateEnabled');
                }
                set focusStateEnabled(value) {
                    this._setOption('focusStateEnabled', value);
                }
                /**
                 * Specifies whether data items should be grouped.
                
                 */
                get grouped() {
                    return this._getOption('grouped');
                }
                set grouped(value) {
                    this._setOption('grouped', value);
                }
                /**
                 * Specifies a custom template for group captions.
                
                 */
                get groupTemplate() {
                    return this._getOption('groupTemplate');
                }
                set groupTemplate(value) {
                    this._setOption('groupTemplate', value);
                }
                /**
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
                }
                /**
                 * Specifies text for a hint that appears when a user pauses on the UI component.
                
                 */
                get hint() {
                    return this._getOption('hint');
                }
                set hint(value) {
                    this._setOption('hint', value);
                }
                /**
                 * Specifies whether the UI component changes its state when a user pauses on it.
                
                 */
                get hoverStateEnabled() {
                    return this._getOption('hoverStateEnabled');
                }
                set hoverStateEnabled(value) {
                    this._setOption('hoverStateEnabled', value);
                }
                /**
                 * Specifies whether or not to show the loading panel when the DataSource bound to the UI component is loading data.
                
                 */
                get indicateLoading() {
                    return this._getOption('indicateLoading');
                }
                set indicateLoading(value) {
                    this._setOption('indicateLoading', value);
                }
                /**
                 * Specifies the way a user can delete items from the list.
                
                 */
                get itemDeleteMode() {
                    return this._getOption('itemDeleteMode');
                }
                set itemDeleteMode(value) {
                    this._setOption('itemDeleteMode', value);
                }
                /**
                 * Configures item reordering using drag and drop gestures.
                
                 */
                get itemDragging() {
                    return this._getOption('itemDragging');
                }
                set itemDragging(value) {
                    this._setOption('itemDragging', value);
                }
                /**
                 * The time period in milliseconds before the onItemHold event is raised.
                
                 */
                get itemHoldTimeout() {
                    return this._getOption('itemHoldTimeout');
                }
                set itemHoldTimeout(value) {
                    this._setOption('itemHoldTimeout', value);
                }
                /**
                 * An array of items displayed by the UI component.
                
                 */
                get items() {
                    return this._getOption('items');
                }
                set items(value) {
                    this._setOption('items', value);
                }
                /**
                 * Specifies a custom template for items.
                
                 */
                get itemTemplate() {
                    return this._getOption('itemTemplate');
                }
                set itemTemplate(value) {
                    this._setOption('itemTemplate', value);
                }
                /**
                 * Specifies the key property that provides key values to access data items. Each key value must be unique.
                
                 */
                get keyExpr() {
                    return this._getOption('keyExpr');
                }
                set keyExpr(value) {
                    this._setOption('keyExpr', value);
                }
                /**
                 * Specifies the array of items for a context menu called for a list item.
                
                 */
                get menuItems() {
                    return this._getOption('menuItems');
                }
                set menuItems(value) {
                    this._setOption('menuItems', value);
                }
                /**
                 * Specifies whether an item context menu is shown when a user holds or swipes an item.
                
                 */
                get menuMode() {
                    return this._getOption('menuMode');
                }
                set menuMode(value) {
                    this._setOption('menuMode', value);
                }
                /**
                 * The text displayed on the button used to load the next page from the data source.
                
                 */
                get nextButtonText() {
                    return this._getOption('nextButtonText');
                }
                set nextButtonText(value) {
                    this._setOption('nextButtonText', value);
                }
                /**
                 * Specifies the text or HTML markup displayed by the UI component if the item collection is empty.
                
                 */
                get noDataText() {
                    return this._getOption('noDataText');
                }
                set noDataText(value) {
                    this._setOption('noDataText', value);
                }
                /**
                 * Specifies the text shown in the pullDown panel, which is displayed when the list is scrolled to the bottom.
                
                 */
                get pageLoadingText() {
                    return this._getOption('pageLoadingText');
                }
                set pageLoadingText(value) {
                    this._setOption('pageLoadingText', value);
                }
                /**
                 * Specifies whether the next page is loaded when a user scrolls the UI component to the bottom or when the &apos;next&apos; button is clicked.
                
                 */
                get pageLoadMode() {
                    return this._getOption('pageLoadMode');
                }
                set pageLoadMode(value) {
                    this._setOption('pageLoadMode', value);
                }
                /**
                 * Specifies the text displayed in the pullDown panel when the list is pulled below the refresh threshold.
                
                 */
                get pulledDownText() {
                    return this._getOption('pulledDownText');
                }
                set pulledDownText(value) {
                    this._setOption('pulledDownText', value);
                }
                /**
                 * Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold.
                
                 */
                get pullingDownText() {
                    return this._getOption('pullingDownText');
                }
                set pullingDownText(value) {
                    this._setOption('pullingDownText', value);
                }
                /**
                 * A Boolean value specifying whether or not the UI component supports the &apos;pull down to refresh&apos; gesture.
                
                 */
                get pullRefreshEnabled() {
                    return this._getOption('pullRefreshEnabled');
                }
                set pullRefreshEnabled(value) {
                    this._setOption('pullRefreshEnabled', value);
                }
                /**
                 * Specifies the text displayed in the pullDown panel while the list is being refreshed.
                
                 */
                get refreshingText() {
                    return this._getOption('refreshingText');
                }
                set refreshingText(value) {
                    this._setOption('refreshingText', value);
                }
                /**
                 * Specifies whether to repaint only those elements whose data changed.
                
                 */
                get repaintChangesOnly() {
                    return this._getOption('repaintChangesOnly');
                }
                set repaintChangesOnly(value) {
                    this._setOption('repaintChangesOnly', value);
                }
                /**
                 * Switches the UI component to a right-to-left representation.
                
                 */
                get rtlEnabled() {
                    return this._getOption('rtlEnabled');
                }
                set rtlEnabled(value) {
                    this._setOption('rtlEnabled', value);
                }
                /**
                 * A Boolean value specifying if the list is scrolled by content.
                
                 */
                get scrollByContent() {
                    return this._getOption('scrollByContent');
                }
                set scrollByContent(value) {
                    this._setOption('scrollByContent', value);
                }
                /**
                 * Specifies whether a user can scroll the content with the scrollbar. Applies only if useNativeScrolling is false.
                
                 */
                get scrollByThumb() {
                    return this._getOption('scrollByThumb');
                }
                set scrollByThumb(value) {
                    this._setOption('scrollByThumb', value);
                }
                /**
                 * A Boolean value specifying whether to enable or disable list scrolling.
                
                 */
                get scrollingEnabled() {
                    return this._getOption('scrollingEnabled');
                }
                set scrollingEnabled(value) {
                    this._setOption('scrollingEnabled', value);
                }
                /**
                 * Configures the search panel.
                
                 */
                get searchEditorOptions() {
                    return this._getOption('searchEditorOptions');
                }
                set searchEditorOptions(value) {
                    this._setOption('searchEditorOptions', value);
                }
                /**
                 * Specifies whether the search panel is visible.
                
                 */
                get searchEnabled() {
                    return this._getOption('searchEnabled');
                }
                set searchEnabled(value) {
                    this._setOption('searchEnabled', value);
                }
                /**
                 * Specifies a data object&apos;s field name or an expression whose value is compared to the search string.
                
                 */
                get searchExpr() {
                    return this._getOption('searchExpr');
                }
                set searchExpr(value) {
                    this._setOption('searchExpr', value);
                }
                /**
                 * Specifies a comparison operation used to search UI component items.
                
                 */
                get searchMode() {
                    return this._getOption('searchMode');
                }
                set searchMode(value) {
                    this._setOption('searchMode', value);
                }
                /**
                 * Specifies a delay in milliseconds between when a user finishes typing, and the search is executed.
                
                 */
                get searchTimeout() {
                    return this._getOption('searchTimeout');
                }
                set searchTimeout(value) {
                    this._setOption('searchTimeout', value);
                }
                /**
                 * Specifies the current search string.
                
                 */
                get searchValue() {
                    return this._getOption('searchValue');
                }
                set searchValue(value) {
                    this._setOption('searchValue', value);
                }
                /**
                 * Specifies the mode in which all items are selected.
                
                 */
                get selectAllMode() {
                    return this._getOption('selectAllMode');
                }
                set selectAllMode(value) {
                    this._setOption('selectAllMode', value);
                }
                /**
                 * Specifies the text displayed at the &apos;Select All&apos; check box.
                
                 */
                get selectAllText() {
                    return this._getOption('selectAllText');
                }
                set selectAllText(value) {
                    this._setOption('selectAllText', value);
                }
                /**
                 * Specifies whether an item is selected if a user clicks it.
                
                 */
                get selectByClick() {
                    return this._getOption('selectByClick');
                }
                set selectByClick(value) {
                    this._setOption('selectByClick', value);
                }
                /**
                 * Specifies an array of currently selected item keys.
                
                 */
                get selectedItemKeys() {
                    return this._getOption('selectedItemKeys');
                }
                set selectedItemKeys(value) {
                    this._setOption('selectedItemKeys', value);
                }
                /**
                 * An array of currently selected item objects.
                
                 */
                get selectedItems() {
                    return this._getOption('selectedItems');
                }
                set selectedItems(value) {
                    this._setOption('selectedItems', value);
                }
                /**
                 * Specifies item selection mode.
                
                 */
                get selectionMode() {
                    return this._getOption('selectionMode');
                }
                set selectionMode(value) {
                    this._setOption('selectionMode', value);
                }
                /**
                 * Specifies when the UI component shows the scrollbar.
                
                 */
                get showScrollbar() {
                    return this._getOption('showScrollbar');
                }
                set showScrollbar(value) {
                    this._setOption('showScrollbar', value);
                }
                /**
                 * Specifies whether or not to display controls used to select list items.
                
                 */
                get showSelectionControls() {
                    return this._getOption('showSelectionControls');
                }
                set showSelectionControls(value) {
                    this._setOption('showSelectionControls', value);
                }
                /**
                 * Specifies the number of the element when the Tab key is used for navigating.
                
                 */
                get tabIndex() {
                    return this._getOption('tabIndex');
                }
                set tabIndex(value) {
                    this._setOption('tabIndex', value);
                }
                /**
                 * Specifies whether or not the UI component uses native scrolling.
                
                 */
                get useNativeScrolling() {
                    return this._getOption('useNativeScrolling');
                }
                set useNativeScrolling(value) {
                    this._setOption('useNativeScrolling', value);
                }
                /**
                 * Specifies whether the UI component is visible.
                
                 */
                get visible() {
                    return this._getOption('visible');
                }
                set visible(value) {
                    this._setOption('visible', value);
                }
                /**
                 * Specifies the UI component&apos;s width.
                
                 */
                get width() {
                    return this._getOption('width');
                }
                set width(value) {
                    this._setOption('width', value);
                }
                /**
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed when a group element is rendered.
                
                
                 */
                onGroupRendered;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed when a collection item is clicked or tapped.
                
                
                 */
                onItemClick;
                /**
                
                 * A function that is executed when a collection item is right-clicked or pressed.
                
                
                 */
                onItemContextMenu;
                /**
                
                 * A function that is executed after a list item is deleted from the data source.
                
                
                 */
                onItemDeleted;
                /**
                
                 * A function that is executed before a collection item is deleted from the data source.
                
                
                 */
                onItemDeleting;
                /**
                
                 * A function that is executed when a collection item has been held for a specified period.
                
                
                 */
                onItemHold;
                /**
                
                 * A function that is executed after a collection item is rendered.
                
                
                 */
                onItemRendered;
                /**
                
                 * A function that is executed after a list item is moved to another position.
                
                
                 */
                onItemReordered;
                /**
                
                 * A function that is executed when a list item is swiped.
                
                
                 */
                onItemSwipe;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed before the next page is loaded.
                
                
                 */
                onPageLoading;
                /**
                
                 * A function that is executed when the &apos;pull to refresh&apos; gesture is performed. Supported on mobile devices only.
                
                
                 */
                onPullRefresh;
                /**
                
                 * A function that is executed on each scroll gesture.
                
                
                 */
                onScroll;
                /**
                
                 * A function that is executed when the &apos;Select All&apos; check box value is changed. Applies only if the selectionMode is &apos;all&apos;.
                
                
                 */
                onSelectAllValueChanged;
                /**
                
                 * A function that is executed when a collection item is selected or selection is canceled.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                activeStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowItemDeletingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                bounceEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                collapsibleGroupsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                displayExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                groupedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                groupTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                indicateLoadingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemDeleteModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemDraggingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemHoldTimeoutChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                keyExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                menuItemsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                menuModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                nextButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                noDataTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pageLoadingTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pageLoadModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pulledDownTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pullingDownTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pullRefreshEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                refreshingTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                repaintChangesOnlyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollByContentChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollByThumbChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollingEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchEditorOptionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchTimeoutChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectAllModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectAllTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectByClickChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemKeysChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectionModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showScrollbarChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showSelectionControlsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                useNativeScrollingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                get itemsChildren() {
                    return this._getOption('items');
                }
                set itemsChildren(value) {
                    this.setChildren('items', value);
                }
                get menuItemsChildren() {
                    return this._getOption('menuItems');
                }
                set menuItemsChildren(value) {
                    this.setChildren('menuItems', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'groupRendered', emit: 'onGroupRendered' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'itemClick', emit: 'onItemClick' },
                        { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
                        { subscribe: 'itemDeleted', emit: 'onItemDeleted' },
                        { subscribe: 'itemDeleting', emit: 'onItemDeleting' },
                        { subscribe: 'itemHold', emit: 'onItemHold' },
                        { subscribe: 'itemRendered', emit: 'onItemRendered' },
                        { subscribe: 'itemReordered', emit: 'onItemReordered' },
                        { subscribe: 'itemSwipe', emit: 'onItemSwipe' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'pageLoading', emit: 'onPageLoading' },
                        { subscribe: 'pullRefresh', emit: 'onPullRefresh' },
                        { subscribe: 'scroll', emit: 'onScroll' },
                        { subscribe: 'selectAllValueChanged', emit: 'onSelectAllValueChanged' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'allowItemDeletingChange' },
                        { emit: 'bounceEnabledChange' },
                        { emit: 'collapsibleGroupsChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'displayExprChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'groupedChange' },
                        { emit: 'groupTemplateChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'indicateLoadingChange' },
                        { emit: 'itemDeleteModeChange' },
                        { emit: 'itemDraggingChange' },
                        { emit: 'itemHoldTimeoutChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'keyExprChange' },
                        { emit: 'menuItemsChange' },
                        { emit: 'menuModeChange' },
                        { emit: 'nextButtonTextChange' },
                        { emit: 'noDataTextChange' },
                        { emit: 'pageLoadingTextChange' },
                        { emit: 'pageLoadModeChange' },
                        { emit: 'pulledDownTextChange' },
                        { emit: 'pullingDownTextChange' },
                        { emit: 'pullRefreshEnabledChange' },
                        { emit: 'refreshingTextChange' },
                        { emit: 'repaintChangesOnlyChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollByContentChange' },
                        { emit: 'scrollByThumbChange' },
                        { emit: 'scrollingEnabledChange' },
                        { emit: 'searchEditorOptionsChange' },
                        { emit: 'searchEnabledChange' },
                        { emit: 'searchExprChange' },
                        { emit: 'searchModeChange' },
                        { emit: 'searchTimeoutChange' },
                        { emit: 'searchValueChange' },
                        { emit: 'selectAllModeChange' },
                        { emit: 'selectAllTextChange' },
                        { emit: 'selectByClickChange' },
                        { emit: 'selectedItemKeysChange' },
                        { emit: 'selectedItemsChange' },
                        { emit: 'selectionModeChange' },
                        { emit: 'showScrollbarChange' },
                        { emit: 'showSelectionControlsChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'useNativeScrollingChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxList(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('items', changes);
                    this.setupChanges('menuItems', changes);
                    this.setupChanges('searchExpr', changes);
                    this.setupChanges('selectedItemKeys', changes);
                    this.setupChanges('selectedItems', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('items');
                    this._idh.doCheck('menuItems');
                    this._idh.doCheck('searchExpr');
                    this._idh.doCheck('selectedItemKeys');
                    this._idh.doCheck('selectedItems');
                    this._watcherHelper.checkWatchers();
                    super.ngDoCheck();
                    super.clearChangedOptions();
                }
                _setOption(name, value) {
                    let isSetup = this._idh.setupSingle(name, value);
                    let isChanged = this._idh.getChanges(name, value) !== null;
                    if (isSetup || isChanged) {
                        super._setOption(name, value);
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxListComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxListComponent, selector: "dx-list", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", allowItemDeleting: "allowItemDeleting", bounceEnabled: "bounceEnabled", collapsibleGroups: "collapsibleGroups", dataSource: "dataSource", disabled: "disabled", displayExpr: "displayExpr", elementAttr: "elementAttr", focusStateEnabled: "focusStateEnabled", grouped: "grouped", groupTemplate: "groupTemplate", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", indicateLoading: "indicateLoading", itemDeleteMode: "itemDeleteMode", itemDragging: "itemDragging", itemHoldTimeout: "itemHoldTimeout", items: "items", itemTemplate: "itemTemplate", keyExpr: "keyExpr", menuItems: "menuItems", menuMode: "menuMode", nextButtonText: "nextButtonText", noDataText: "noDataText", pageLoadingText: "pageLoadingText", pageLoadMode: "pageLoadMode", pulledDownText: "pulledDownText", pullingDownText: "pullingDownText", pullRefreshEnabled: "pullRefreshEnabled", refreshingText: "refreshingText", repaintChangesOnly: "repaintChangesOnly", rtlEnabled: "rtlEnabled", scrollByContent: "scrollByContent", scrollByThumb: "scrollByThumb", scrollingEnabled: "scrollingEnabled", searchEditorOptions: "searchEditorOptions", searchEnabled: "searchEnabled", searchExpr: "searchExpr", searchMode: "searchMode", searchTimeout: "searchTimeout", searchValue: "searchValue", selectAllMode: "selectAllMode", selectAllText: "selectAllText", selectByClick: "selectByClick", selectedItemKeys: "selectedItemKeys", selectedItems: "selectedItems", selectionMode: "selectionMode", showScrollbar: "showScrollbar", showSelectionControls: "showSelectionControls", tabIndex: "tabIndex", useNativeScrolling: "useNativeScrolling", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onGroupRendered: "onGroupRendered", onInitialized: "onInitialized", onItemClick: "onItemClick", onItemContextMenu: "onItemContextMenu", onItemDeleted: "onItemDeleted", onItemDeleting: "onItemDeleting", onItemHold: "onItemHold", onItemRendered: "onItemRendered", onItemReordered: "onItemReordered", onItemSwipe: "onItemSwipe", onOptionChanged: "onOptionChanged", onPageLoading: "onPageLoading", onPullRefresh: "onPullRefresh", onScroll: "onScroll", onSelectAllValueChanged: "onSelectAllValueChanged", onSelectionChanged: "onSelectionChanged", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", allowItemDeletingChange: "allowItemDeletingChange", bounceEnabledChange: "bounceEnabledChange", collapsibleGroupsChange: "collapsibleGroupsChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", displayExprChange: "displayExprChange", elementAttrChange: "elementAttrChange", focusStateEnabledChange: "focusStateEnabledChange", groupedChange: "groupedChange", groupTemplateChange: "groupTemplateChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", indicateLoadingChange: "indicateLoadingChange", itemDeleteModeChange: "itemDeleteModeChange", itemDraggingChange: "itemDraggingChange", itemHoldTimeoutChange: "itemHoldTimeoutChange", itemsChange: "itemsChange", itemTemplateChange: "itemTemplateChange", keyExprChange: "keyExprChange", menuItemsChange: "menuItemsChange", menuModeChange: "menuModeChange", nextButtonTextChange: "nextButtonTextChange", noDataTextChange: "noDataTextChange", pageLoadingTextChange: "pageLoadingTextChange", pageLoadModeChange: "pageLoadModeChange", pulledDownTextChange: "pulledDownTextChange", pullingDownTextChange: "pullingDownTextChange", pullRefreshEnabledChange: "pullRefreshEnabledChange", refreshingTextChange: "refreshingTextChange", repaintChangesOnlyChange: "repaintChangesOnlyChange", rtlEnabledChange: "rtlEnabledChange", scrollByContentChange: "scrollByContentChange", scrollByThumbChange: "scrollByThumbChange", scrollingEnabledChange: "scrollingEnabledChange", searchEditorOptionsChange: "searchEditorOptionsChange", searchEnabledChange: "searchEnabledChange", searchExprChange: "searchExprChange", searchModeChange: "searchModeChange", searchTimeoutChange: "searchTimeoutChange", searchValueChange: "searchValueChange", selectAllModeChange: "selectAllModeChange", selectAllTextChange: "selectAllTextChange", selectByClickChange: "selectByClickChange", selectedItemKeysChange: "selectedItemKeysChange", selectedItemsChange: "selectedItemsChange", selectionModeChange: "selectionModeChange", showScrollbarChange: "showScrollbarChange", showSelectionControlsChange: "showSelectionControlsChange", tabIndexChange: "tabIndexChange", useNativeScrollingChange: "useNativeScrollingChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "itemsChildren", predicate: DxiItemComponent }, { propertyName: "menuItemsChildren", predicate: DxiMenuItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxListComponent", DxListComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxListComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-list',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { accessKey: [{
                            type: Input
                        }], activeStateEnabled: [{
                            type: Input
                        }], allowItemDeleting: [{
                            type: Input
                        }], bounceEnabled: [{
                            type: Input
                        }], collapsibleGroups: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], displayExpr: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], grouped: [{
                            type: Input
                        }], groupTemplate: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], indicateLoading: [{
                            type: Input
                        }], itemDeleteMode: [{
                            type: Input
                        }], itemDragging: [{
                            type: Input
                        }], itemHoldTimeout: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], keyExpr: [{
                            type: Input
                        }], menuItems: [{
                            type: Input
                        }], menuMode: [{
                            type: Input
                        }], nextButtonText: [{
                            type: Input
                        }], noDataText: [{
                            type: Input
                        }], pageLoadingText: [{
                            type: Input
                        }], pageLoadMode: [{
                            type: Input
                        }], pulledDownText: [{
                            type: Input
                        }], pullingDownText: [{
                            type: Input
                        }], pullRefreshEnabled: [{
                            type: Input
                        }], refreshingText: [{
                            type: Input
                        }], repaintChangesOnly: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrollByContent: [{
                            type: Input
                        }], scrollByThumb: [{
                            type: Input
                        }], scrollingEnabled: [{
                            type: Input
                        }], searchEditorOptions: [{
                            type: Input
                        }], searchEnabled: [{
                            type: Input
                        }], searchExpr: [{
                            type: Input
                        }], searchMode: [{
                            type: Input
                        }], searchTimeout: [{
                            type: Input
                        }], searchValue: [{
                            type: Input
                        }], selectAllMode: [{
                            type: Input
                        }], selectAllText: [{
                            type: Input
                        }], selectByClick: [{
                            type: Input
                        }], selectedItemKeys: [{
                            type: Input
                        }], selectedItems: [{
                            type: Input
                        }], selectionMode: [{
                            type: Input
                        }], showScrollbar: [{
                            type: Input
                        }], showSelectionControls: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], useNativeScrolling: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onGroupRendered: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onItemClick: [{
                            type: Output
                        }], onItemContextMenu: [{
                            type: Output
                        }], onItemDeleted: [{
                            type: Output
                        }], onItemDeleting: [{
                            type: Output
                        }], onItemHold: [{
                            type: Output
                        }], onItemRendered: [{
                            type: Output
                        }], onItemReordered: [{
                            type: Output
                        }], onItemSwipe: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onPageLoading: [{
                            type: Output
                        }], onPullRefresh: [{
                            type: Output
                        }], onScroll: [{
                            type: Output
                        }], onSelectAllValueChanged: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], allowItemDeletingChange: [{
                            type: Output
                        }], bounceEnabledChange: [{
                            type: Output
                        }], collapsibleGroupsChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], displayExprChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], groupedChange: [{
                            type: Output
                        }], groupTemplateChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], indicateLoadingChange: [{
                            type: Output
                        }], itemDeleteModeChange: [{
                            type: Output
                        }], itemDraggingChange: [{
                            type: Output
                        }], itemHoldTimeoutChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], keyExprChange: [{
                            type: Output
                        }], menuItemsChange: [{
                            type: Output
                        }], menuModeChange: [{
                            type: Output
                        }], nextButtonTextChange: [{
                            type: Output
                        }], noDataTextChange: [{
                            type: Output
                        }], pageLoadingTextChange: [{
                            type: Output
                        }], pageLoadModeChange: [{
                            type: Output
                        }], pulledDownTextChange: [{
                            type: Output
                        }], pullingDownTextChange: [{
                            type: Output
                        }], pullRefreshEnabledChange: [{
                            type: Output
                        }], refreshingTextChange: [{
                            type: Output
                        }], repaintChangesOnlyChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scrollByContentChange: [{
                            type: Output
                        }], scrollByThumbChange: [{
                            type: Output
                        }], scrollingEnabledChange: [{
                            type: Output
                        }], searchEditorOptionsChange: [{
                            type: Output
                        }], searchEnabledChange: [{
                            type: Output
                        }], searchExprChange: [{
                            type: Output
                        }], searchModeChange: [{
                            type: Output
                        }], searchTimeoutChange: [{
                            type: Output
                        }], searchValueChange: [{
                            type: Output
                        }], selectAllModeChange: [{
                            type: Output
                        }], selectAllTextChange: [{
                            type: Output
                        }], selectByClickChange: [{
                            type: Output
                        }], selectedItemKeysChange: [{
                            type: Output
                        }], selectedItemsChange: [{
                            type: Output
                        }], selectionModeChange: [{
                            type: Output
                        }], showScrollbarChange: [{
                            type: Output
                        }], showSelectionControlsChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], useNativeScrollingChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }], menuItemsChildren: [{
                            type: ContentChildren,
                            args: [DxiMenuItemComponent]
                        }] } });
            class DxListModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxListModule, declarations: [DxListComponent], imports: [DxoItemDraggingModule,
                        DxoCursorOffsetModule,
                        DxiItemModule,
                        DxiMenuItemModule,
                        DxoSearchEditorOptionsModule,
                        DxiButtonModule,
                        DxoOptionsModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxListComponent, DxoItemDraggingModule,
                        DxoCursorOffsetModule,
                        DxiItemModule,
                        DxiMenuItemModule,
                        DxoSearchEditorOptionsModule,
                        DxiButtonModule,
                        DxoOptionsModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxListModule, imports: [DxoItemDraggingModule,
                        DxoCursorOffsetModule,
                        DxiItemModule,
                        DxiMenuItemModule,
                        DxoSearchEditorOptionsModule,
                        DxiButtonModule,
                        DxoOptionsModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoItemDraggingModule,
                        DxoCursorOffsetModule,
                        DxiItemModule,
                        DxiMenuItemModule,
                        DxoSearchEditorOptionsModule,
                        DxiButtonModule,
                        DxoOptionsModule,
                        DxTemplateModule] });
            } exports("DxListModule", DxListModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxListModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoItemDraggingModule,
                                    DxoCursorOffsetModule,
                                    DxiItemModule,
                                    DxiMenuItemModule,
                                    DxoSearchEditorOptionsModule,
                                    DxiButtonModule,
                                    DxoOptionsModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxListComponent
                                ],
                                exports: [
                                    DxListComponent,
                                    DxoItemDraggingModule,
                                    DxoCursorOffsetModule,
                                    DxiItemModule,
                                    DxiMenuItemModule,
                                    DxoSearchEditorOptionsModule,
                                    DxiButtonModule,
                                    DxoOptionsModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));

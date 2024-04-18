System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/tree_view', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxTreeView, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiItemComponent, DxiItemModule, DxoSearchEditorOptionsModule, DxiButtonModule, DxoOptionsModule;
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
            DxTreeView = module.default;
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
            DxiItemModule = module.DxiItemModule;
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
             * The TreeView UI component is a tree-like representation of textual data.

             */
            class DxTreeViewComponent extends DxComponent {
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
                 * Specifies whether or not to animate item collapsing and expanding.
                
                 */
                get animationEnabled() {
                    return this._getOption('animationEnabled');
                }
                set animationEnabled(value) {
                    this._setOption('animationEnabled', value);
                }
                /**
                 * Specifies a custom collapse icon.
                
                 */
                get collapseIcon() {
                    return this._getOption('collapseIcon');
                }
                set collapseIcon(value) {
                    this._setOption('collapseIcon', value);
                }
                /**
                 * Allows you to load nodes on demand.
                
                 */
                get createChildren() {
                    return this._getOption('createChildren');
                }
                set createChildren(value) {
                    this._setOption('createChildren', value);
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
                 * Notifies the UI component of the used data structure.
                
                 */
                get dataStructure() {
                    return this._getOption('dataStructure');
                }
                set dataStructure(value) {
                    this._setOption('dataStructure', value);
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
                 * Specifies the name of the data source item field whose value defines whether or not the corresponding UI component item is disabled.
                
                 */
                get disabledExpr() {
                    return this._getOption('disabledExpr');
                }
                set disabledExpr(value) {
                    this._setOption('disabledExpr', value);
                }
                /**
                 * Specifies the data field whose values should be displayed.
                
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
                 * Specifies whether or not a user can expand all tree view items by the &apos;*&apos; hot key.
                
                 */
                get expandAllEnabled() {
                    return this._getOption('expandAllEnabled');
                }
                set expandAllEnabled(value) {
                    this._setOption('expandAllEnabled', value);
                }
                /**
                 * Specifies which data source field specifies whether an item is expanded.
                
                 */
                get expandedExpr() {
                    return this._getOption('expandedExpr');
                }
                set expandedExpr(value) {
                    this._setOption('expandedExpr', value);
                }
                /**
                 * Specifies the event on which to expand/collapse a node.
                
                 */
                get expandEvent() {
                    return this._getOption('expandEvent');
                }
                set expandEvent(value) {
                    this._setOption('expandEvent', value);
                }
                /**
                 * Specifies a custom expand icon.
                
                 */
                get expandIcon() {
                    return this._getOption('expandIcon');
                }
                set expandIcon(value) {
                    this._setOption('expandIcon', value);
                }
                /**
                 * Specifies whether or not all parent nodes of an initially expanded node are displayed expanded.
                
                 */
                get expandNodesRecursive() {
                    return this._getOption('expandNodesRecursive');
                }
                set expandNodesRecursive(value) {
                    this._setOption('expandNodesRecursive', value);
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
                 * Specifies the name of the data source item field whose value defines whether or not the corresponding node includes child nodes.
                
                 */
                get hasItemsExpr() {
                    return this._getOption('hasItemsExpr');
                }
                set hasItemsExpr(value) {
                    this._setOption('hasItemsExpr', value);
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
                 * Specifies which data field contains nested items.
                
                 */
                get itemsExpr() {
                    return this._getOption('itemsExpr');
                }
                set itemsExpr(value) {
                    this._setOption('itemsExpr', value);
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
                 * Specifies which data field provides keys for TreeView items.
                
                 */
                get keyExpr() {
                    return this._getOption('keyExpr');
                }
                set keyExpr(value) {
                    this._setOption('keyExpr', value);
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
                 * Specifies the name of the data source item field for holding the parent key of the corresponding node.
                
                 */
                get parentIdExpr() {
                    return this._getOption('parentIdExpr');
                }
                set parentIdExpr(value) {
                    this._setOption('parentIdExpr', value);
                }
                /**
                 * Specifies the parent ID value of the root item.
                
                 */
                get rootValue() {
                    return this._getOption('rootValue');
                }
                set rootValue(value) {
                    this._setOption('rootValue', value);
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
                 * A string value specifying available scrolling directions.
                
                 */
                get scrollDirection() {
                    return this._getOption('scrollDirection');
                }
                set scrollDirection(value) {
                    this._setOption('scrollDirection', value);
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
                 * Specifies the name of the data source item field whose value defines whether or not the corresponding UI component items is selected.
                
                 */
                get selectedExpr() {
                    return this._getOption('selectedExpr');
                }
                set selectedExpr(value) {
                    this._setOption('selectedExpr', value);
                }
                /**
                 * Specifies item selection mode. Applies only if selection is enabled.
                
                 */
                get selectionMode() {
                    return this._getOption('selectionMode');
                }
                set selectionMode(value) {
                    this._setOption('selectionMode', value);
                }
                /**
                 * Specifies whether all child nodes should be selected when their parent node is selected. Applies only if the selectionMode is &apos;multiple&apos;.
                
                 */
                get selectNodesRecursive() {
                    return this._getOption('selectNodesRecursive');
                }
                set selectNodesRecursive(value) {
                    this._setOption('selectNodesRecursive', value);
                }
                /**
                 * Specifies the checkbox display mode.
                
                 */
                get showCheckBoxesMode() {
                    return this._getOption('showCheckBoxesMode');
                }
                set showCheckBoxesMode(value) {
                    this._setOption('showCheckBoxesMode', value);
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
                 * Enables the virtual mode in which nodes are loaded on demand. Use it to enhance the performance on large datasets.
                
                 */
                get virtualModeEnabled() {
                    return this._getOption('virtualModeEnabled');
                }
                set virtualModeEnabled(value) {
                    this._setOption('virtualModeEnabled', value);
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
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed when a collection item is clicked or tapped.
                
                
                 */
                onItemClick;
                /**
                
                 * A function that is executed when a tree view item is collapsed.
                
                
                 */
                onItemCollapsed;
                /**
                
                 * A function that is executed when a collection item is right-clicked or pressed.
                
                
                 */
                onItemContextMenu;
                /**
                
                 * A function that is executed when a tree view item is expanded.
                
                
                 */
                onItemExpanded;
                /**
                
                 * A function that is executed when a collection item has been held for a specified period.
                
                
                 */
                onItemHold;
                /**
                
                 * A function that is executed after a collection item is rendered.
                
                
                 */
                onItemRendered;
                /**
                
                 * A function that is executed when a single TreeView item is selected or selection is canceled.
                
                
                 */
                onItemSelectionChanged;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when the &apos;Select All&apos; check box value is changed. Applies only if showCheckBoxesMode is &apos;selectAll&apos; and selectionMode is &apos;multiple&apos;.
                
                
                 */
                onSelectAllValueChanged;
                /**
                
                 * A function that is executed when a TreeView item is selected or selection is canceled.
                
                
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
                animationEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                collapseIconChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                createChildrenChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataStructureChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledExprChange;
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
                expandAllEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                expandedExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                expandEventChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                expandIconChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                expandNodesRecursiveChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hasItemsExprChange;
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
                itemHoldTimeoutChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemsExprChange;
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
                noDataTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                parentIdExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rootValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollDirectionChange;
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
                selectAllTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectByClickChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectionModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectNodesRecursiveChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showCheckBoxesModeChange;
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
                virtualModeEnabledChange;
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
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'itemClick', emit: 'onItemClick' },
                        { subscribe: 'itemCollapsed', emit: 'onItemCollapsed' },
                        { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
                        { subscribe: 'itemExpanded', emit: 'onItemExpanded' },
                        { subscribe: 'itemHold', emit: 'onItemHold' },
                        { subscribe: 'itemRendered', emit: 'onItemRendered' },
                        { subscribe: 'itemSelectionChanged', emit: 'onItemSelectionChanged' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'selectAllValueChanged', emit: 'onSelectAllValueChanged' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'animationEnabledChange' },
                        { emit: 'collapseIconChange' },
                        { emit: 'createChildrenChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'dataStructureChange' },
                        { emit: 'disabledChange' },
                        { emit: 'disabledExprChange' },
                        { emit: 'displayExprChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'expandAllEnabledChange' },
                        { emit: 'expandedExprChange' },
                        { emit: 'expandEventChange' },
                        { emit: 'expandIconChange' },
                        { emit: 'expandNodesRecursiveChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'hasItemsExprChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'itemHoldTimeoutChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemsExprChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'keyExprChange' },
                        { emit: 'noDataTextChange' },
                        { emit: 'parentIdExprChange' },
                        { emit: 'rootValueChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollDirectionChange' },
                        { emit: 'searchEditorOptionsChange' },
                        { emit: 'searchEnabledChange' },
                        { emit: 'searchExprChange' },
                        { emit: 'searchModeChange' },
                        { emit: 'searchTimeoutChange' },
                        { emit: 'searchValueChange' },
                        { emit: 'selectAllTextChange' },
                        { emit: 'selectByClickChange' },
                        { emit: 'selectedExprChange' },
                        { emit: 'selectionModeChange' },
                        { emit: 'selectNodesRecursiveChange' },
                        { emit: 'showCheckBoxesModeChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'useNativeScrollingChange' },
                        { emit: 'virtualModeEnabledChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxTreeView(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('items', changes);
                    this.setupChanges('searchExpr', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('items');
                    this._idh.doCheck('searchExpr');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeViewComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxTreeViewComponent, selector: "dx-tree-view", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", animationEnabled: "animationEnabled", collapseIcon: "collapseIcon", createChildren: "createChildren", dataSource: "dataSource", dataStructure: "dataStructure", disabled: "disabled", disabledExpr: "disabledExpr", displayExpr: "displayExpr", elementAttr: "elementAttr", expandAllEnabled: "expandAllEnabled", expandedExpr: "expandedExpr", expandEvent: "expandEvent", expandIcon: "expandIcon", expandNodesRecursive: "expandNodesRecursive", focusStateEnabled: "focusStateEnabled", hasItemsExpr: "hasItemsExpr", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", itemHoldTimeout: "itemHoldTimeout", items: "items", itemsExpr: "itemsExpr", itemTemplate: "itemTemplate", keyExpr: "keyExpr", noDataText: "noDataText", parentIdExpr: "parentIdExpr", rootValue: "rootValue", rtlEnabled: "rtlEnabled", scrollDirection: "scrollDirection", searchEditorOptions: "searchEditorOptions", searchEnabled: "searchEnabled", searchExpr: "searchExpr", searchMode: "searchMode", searchTimeout: "searchTimeout", searchValue: "searchValue", selectAllText: "selectAllText", selectByClick: "selectByClick", selectedExpr: "selectedExpr", selectionMode: "selectionMode", selectNodesRecursive: "selectNodesRecursive", showCheckBoxesMode: "showCheckBoxesMode", tabIndex: "tabIndex", useNativeScrolling: "useNativeScrolling", virtualModeEnabled: "virtualModeEnabled", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onItemCollapsed: "onItemCollapsed", onItemContextMenu: "onItemContextMenu", onItemExpanded: "onItemExpanded", onItemHold: "onItemHold", onItemRendered: "onItemRendered", onItemSelectionChanged: "onItemSelectionChanged", onOptionChanged: "onOptionChanged", onSelectAllValueChanged: "onSelectAllValueChanged", onSelectionChanged: "onSelectionChanged", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", animationEnabledChange: "animationEnabledChange", collapseIconChange: "collapseIconChange", createChildrenChange: "createChildrenChange", dataSourceChange: "dataSourceChange", dataStructureChange: "dataStructureChange", disabledChange: "disabledChange", disabledExprChange: "disabledExprChange", displayExprChange: "displayExprChange", elementAttrChange: "elementAttrChange", expandAllEnabledChange: "expandAllEnabledChange", expandedExprChange: "expandedExprChange", expandEventChange: "expandEventChange", expandIconChange: "expandIconChange", expandNodesRecursiveChange: "expandNodesRecursiveChange", focusStateEnabledChange: "focusStateEnabledChange", hasItemsExprChange: "hasItemsExprChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", itemHoldTimeoutChange: "itemHoldTimeoutChange", itemsChange: "itemsChange", itemsExprChange: "itemsExprChange", itemTemplateChange: "itemTemplateChange", keyExprChange: "keyExprChange", noDataTextChange: "noDataTextChange", parentIdExprChange: "parentIdExprChange", rootValueChange: "rootValueChange", rtlEnabledChange: "rtlEnabledChange", scrollDirectionChange: "scrollDirectionChange", searchEditorOptionsChange: "searchEditorOptionsChange", searchEnabledChange: "searchEnabledChange", searchExprChange: "searchExprChange", searchModeChange: "searchModeChange", searchTimeoutChange: "searchTimeoutChange", searchValueChange: "searchValueChange", selectAllTextChange: "selectAllTextChange", selectByClickChange: "selectByClickChange", selectedExprChange: "selectedExprChange", selectionModeChange: "selectionModeChange", selectNodesRecursiveChange: "selectNodesRecursiveChange", showCheckBoxesModeChange: "showCheckBoxesModeChange", tabIndexChange: "tabIndexChange", useNativeScrollingChange: "useNativeScrollingChange", virtualModeEnabledChange: "virtualModeEnabledChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "itemsChildren", predicate: DxiItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxTreeViewComponent", DxTreeViewComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeViewComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-tree-view',
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
                        }], animationEnabled: [{
                            type: Input
                        }], collapseIcon: [{
                            type: Input
                        }], createChildren: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], dataStructure: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], disabledExpr: [{
                            type: Input
                        }], displayExpr: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], expandAllEnabled: [{
                            type: Input
                        }], expandedExpr: [{
                            type: Input
                        }], expandEvent: [{
                            type: Input
                        }], expandIcon: [{
                            type: Input
                        }], expandNodesRecursive: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], hasItemsExpr: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], itemHoldTimeout: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], itemsExpr: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], keyExpr: [{
                            type: Input
                        }], noDataText: [{
                            type: Input
                        }], parentIdExpr: [{
                            type: Input
                        }], rootValue: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrollDirection: [{
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
                        }], selectAllText: [{
                            type: Input
                        }], selectByClick: [{
                            type: Input
                        }], selectedExpr: [{
                            type: Input
                        }], selectionMode: [{
                            type: Input
                        }], selectNodesRecursive: [{
                            type: Input
                        }], showCheckBoxesMode: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], useNativeScrolling: [{
                            type: Input
                        }], virtualModeEnabled: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onItemClick: [{
                            type: Output
                        }], onItemCollapsed: [{
                            type: Output
                        }], onItemContextMenu: [{
                            type: Output
                        }], onItemExpanded: [{
                            type: Output
                        }], onItemHold: [{
                            type: Output
                        }], onItemRendered: [{
                            type: Output
                        }], onItemSelectionChanged: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onSelectAllValueChanged: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], animationEnabledChange: [{
                            type: Output
                        }], collapseIconChange: [{
                            type: Output
                        }], createChildrenChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], dataStructureChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], disabledExprChange: [{
                            type: Output
                        }], displayExprChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], expandAllEnabledChange: [{
                            type: Output
                        }], expandedExprChange: [{
                            type: Output
                        }], expandEventChange: [{
                            type: Output
                        }], expandIconChange: [{
                            type: Output
                        }], expandNodesRecursiveChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], hasItemsExprChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], itemHoldTimeoutChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], itemsExprChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], keyExprChange: [{
                            type: Output
                        }], noDataTextChange: [{
                            type: Output
                        }], parentIdExprChange: [{
                            type: Output
                        }], rootValueChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scrollDirectionChange: [{
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
                        }], selectAllTextChange: [{
                            type: Output
                        }], selectByClickChange: [{
                            type: Output
                        }], selectedExprChange: [{
                            type: Output
                        }], selectionModeChange: [{
                            type: Output
                        }], selectNodesRecursiveChange: [{
                            type: Output
                        }], showCheckBoxesModeChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], useNativeScrollingChange: [{
                            type: Output
                        }], virtualModeEnabledChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }] } });
            class DxTreeViewModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxTreeViewModule, declarations: [DxTreeViewComponent], imports: [DxiItemModule,
                        DxoSearchEditorOptionsModule,
                        DxiButtonModule,
                        DxoOptionsModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxTreeViewComponent, DxiItemModule,
                        DxoSearchEditorOptionsModule,
                        DxiButtonModule,
                        DxoOptionsModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeViewModule, imports: [DxiItemModule,
                        DxoSearchEditorOptionsModule,
                        DxiButtonModule,
                        DxoOptionsModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiItemModule,
                        DxoSearchEditorOptionsModule,
                        DxiButtonModule,
                        DxoOptionsModule,
                        DxTemplateModule] });
            } exports("DxTreeViewModule", DxTreeViewModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeViewModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiItemModule,
                                    DxoSearchEditorOptionsModule,
                                    DxiButtonModule,
                                    DxoOptionsModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxTreeViewComponent
                                ],
                                exports: [
                                    DxTreeViewComponent,
                                    DxiItemModule,
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

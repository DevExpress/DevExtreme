System.register(['@angular/platform-browser', '@angular/core', 'devextreme/bundles/dx.all', 'devextreme/ui/tree_list', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxTreeList, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiColumnComponent, DxoColumnChooserModule, DxoPositionModule, DxoAtModule, DxoBoundaryOffsetModule, DxoCollisionModule, DxoMyModule, DxoOffsetModule, DxoSearchModule, DxoSelectionModule, DxoColumnFixingModule, DxoTextsModule, DxiColumnModule, DxiButtonModule, DxoHeaderFilterModule, DxoLookupModule, DxoFormatModule, DxoFormItemModule, DxoLabelModule, DxiValidationRuleModule, DxoEditingModule, DxiChangeModule, DxoFormModule, DxoColCountByScreenModule, DxiItemModule, DxoTabPanelOptionsModule, DxiTabModule, DxoButtonOptionsModule, DxoPopupModule, DxoAnimationModule, DxoHideModule, DxoFromModule, DxoToModule, DxoShowModule, DxiToolbarItemModule, DxoFilterBuilderModule, DxiCustomOperationModule, DxiFieldModule, DxoFilterOperationDescriptionsModule, DxoGroupOperationDescriptionsModule, DxoFilterBuilderPopupModule, DxoFilterPanelModule, DxoFilterRowModule, DxoOperationDescriptionsModule, DxoKeyboardNavigationModule, DxoLoadPanelModule, DxoPagerModule, DxoPagingModule, DxoRemoteOperationsModule, DxoRowDraggingModule, DxoCursorOffsetModule, DxoScrollingModule, DxoSearchPanelModule, DxoSortingModule, DxoStateStoringModule, DxoToolbarModule;
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
        }, null, function (module) {
            DxTreeList = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiColumnComponent = module.DxiColumnComponent;
            DxoColumnChooserModule = module.DxoColumnChooserModule;
            DxoPositionModule = module.DxoPositionModule;
            DxoAtModule = module.DxoAtModule;
            DxoBoundaryOffsetModule = module.DxoBoundaryOffsetModule;
            DxoCollisionModule = module.DxoCollisionModule;
            DxoMyModule = module.DxoMyModule;
            DxoOffsetModule = module.DxoOffsetModule;
            DxoSearchModule = module.DxoSearchModule;
            DxoSelectionModule = module.DxoSelectionModule;
            DxoColumnFixingModule = module.DxoColumnFixingModule;
            DxoTextsModule = module.DxoTextsModule;
            DxiColumnModule = module.DxiColumnModule;
            DxiButtonModule = module.DxiButtonModule;
            DxoHeaderFilterModule = module.DxoHeaderFilterModule;
            DxoLookupModule = module.DxoLookupModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoFormItemModule = module.DxoFormItemModule;
            DxoLabelModule = module.DxoLabelModule;
            DxiValidationRuleModule = module.DxiValidationRuleModule;
            DxoEditingModule = module.DxoEditingModule;
            DxiChangeModule = module.DxiChangeModule;
            DxoFormModule = module.DxoFormModule;
            DxoColCountByScreenModule = module.DxoColCountByScreenModule;
            DxiItemModule = module.DxiItemModule;
            DxoTabPanelOptionsModule = module.DxoTabPanelOptionsModule;
            DxiTabModule = module.DxiTabModule;
            DxoButtonOptionsModule = module.DxoButtonOptionsModule;
            DxoPopupModule = module.DxoPopupModule;
            DxoAnimationModule = module.DxoAnimationModule;
            DxoHideModule = module.DxoHideModule;
            DxoFromModule = module.DxoFromModule;
            DxoToModule = module.DxoToModule;
            DxoShowModule = module.DxoShowModule;
            DxiToolbarItemModule = module.DxiToolbarItemModule;
            DxoFilterBuilderModule = module.DxoFilterBuilderModule;
            DxiCustomOperationModule = module.DxiCustomOperationModule;
            DxiFieldModule = module.DxiFieldModule;
            DxoFilterOperationDescriptionsModule = module.DxoFilterOperationDescriptionsModule;
            DxoGroupOperationDescriptionsModule = module.DxoGroupOperationDescriptionsModule;
            DxoFilterBuilderPopupModule = module.DxoFilterBuilderPopupModule;
            DxoFilterPanelModule = module.DxoFilterPanelModule;
            DxoFilterRowModule = module.DxoFilterRowModule;
            DxoOperationDescriptionsModule = module.DxoOperationDescriptionsModule;
            DxoKeyboardNavigationModule = module.DxoKeyboardNavigationModule;
            DxoLoadPanelModule = module.DxoLoadPanelModule;
            DxoPagerModule = module.DxoPagerModule;
            DxoPagingModule = module.DxoPagingModule;
            DxoRemoteOperationsModule = module.DxoRemoteOperationsModule;
            DxoRowDraggingModule = module.DxoRowDraggingModule;
            DxoCursorOffsetModule = module.DxoCursorOffsetModule;
            DxoScrollingModule = module.DxoScrollingModule;
            DxoSearchPanelModule = module.DxoSearchPanelModule;
            DxoSortingModule = module.DxoSortingModule;
            DxoStateStoringModule = module.DxoStateStoringModule;
            DxoToolbarModule = module.DxoToolbarModule;
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
             * The TreeList is a UI component that represents data from a local or remote source in the form of a multi-column tree view. This UI component offers such features as sorting, filtering, editing, selection, etc.

             */
            class DxTreeListComponent extends DxComponent {
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
                 * Specifies whether a user can reorder columns.
                
                 */
                get allowColumnReordering() {
                    return this._getOption('allowColumnReordering');
                }
                set allowColumnReordering(value) {
                    this._setOption('allowColumnReordering', value);
                }
                /**
                 * Specifies whether a user can resize columns.
                
                 */
                get allowColumnResizing() {
                    return this._getOption('allowColumnResizing');
                }
                set allowColumnResizing(value) {
                    this._setOption('allowColumnResizing', value);
                }
                /**
                 * Specifies whether all rows are expanded initially.
                
                 */
                get autoExpandAll() {
                    return this._getOption('autoExpandAll');
                }
                set autoExpandAll(value) {
                    this._setOption('autoExpandAll', value);
                }
                /**
                 * Automatically scrolls the component to the focused row when the focusedRowKey is changed.
                
                 */
                get autoNavigateToFocusedRow() {
                    return this._getOption('autoNavigateToFocusedRow');
                }
                set autoNavigateToFocusedRow(value) {
                    this._setOption('autoNavigateToFocusedRow', value);
                }
                /**
                 * Specifies whether data should be cached.
                
                 */
                get cacheEnabled() {
                    return this._getOption('cacheEnabled');
                }
                set cacheEnabled(value) {
                    this._setOption('cacheEnabled', value);
                }
                /**
                 * Enables a hint that appears when a user hovers the mouse pointer over a cell with truncated content.
                
                 */
                get cellHintEnabled() {
                    return this._getOption('cellHintEnabled');
                }
                set cellHintEnabled(value) {
                    this._setOption('cellHintEnabled', value);
                }
                /**
                 * Specifies whether columns should adjust their widths to the content.
                
                 */
                get columnAutoWidth() {
                    return this._getOption('columnAutoWidth');
                }
                set columnAutoWidth(value) {
                    this._setOption('columnAutoWidth', value);
                }
                /**
                 * Configures the column chooser.
                
                 */
                get columnChooser() {
                    return this._getOption('columnChooser');
                }
                set columnChooser(value) {
                    this._setOption('columnChooser', value);
                }
                /**
                 * Configures column fixing.
                
                 */
                get columnFixing() {
                    return this._getOption('columnFixing');
                }
                set columnFixing(value) {
                    this._setOption('columnFixing', value);
                }
                /**
                 * Specifies whether the UI component should hide columns to adapt to the screen or container size. Ignored if allowColumnResizing is true and columnResizingMode is &apos;widget&apos;.
                
                 */
                get columnHidingEnabled() {
                    return this._getOption('columnHidingEnabled');
                }
                set columnHidingEnabled(value) {
                    this._setOption('columnHidingEnabled', value);
                }
                /**
                 * Specifies the minimum width of columns.
                
                 */
                get columnMinWidth() {
                    return this._getOption('columnMinWidth');
                }
                set columnMinWidth(value) {
                    this._setOption('columnMinWidth', value);
                }
                /**
                 * Specifies how the UI component resizes columns. Applies only if allowColumnResizing is true.
                
                 */
                get columnResizingMode() {
                    return this._getOption('columnResizingMode');
                }
                set columnResizingMode(value) {
                    this._setOption('columnResizingMode', value);
                }
                /**
                 * Configures columns.
                
                 */
                get columns() {
                    return this._getOption('columns');
                }
                set columns(value) {
                    this._setOption('columns', value);
                }
                /**
                 * Specifies the width for all data columns. Has a lower priority than the column.width property.
                
                 */
                get columnWidth() {
                    return this._getOption('columnWidth');
                }
                set columnWidth(value) {
                    this._setOption('columnWidth', value);
                }
                /**
                 * Customizes columns after they are created.
                
                 */
                get customizeColumns() {
                    return this._getOption('customizeColumns');
                }
                set customizeColumns(value) {
                    this._setOption('customizeColumns', value);
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
                 * Specifies the format in which date-time values should be sent to the server.
                
                 */
                get dateSerializationFormat() {
                    return this._getOption('dateSerializationFormat');
                }
                set dateSerializationFormat(value) {
                    this._setOption('dateSerializationFormat', value);
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
                 * Configures editing.
                
                 */
                get editing() {
                    return this._getOption('editing');
                }
                set editing(value) {
                    this._setOption('editing', value);
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
                 * Indicates whether to show the error row.
                
                 */
                get errorRowEnabled() {
                    return this._getOption('errorRowEnabled');
                }
                set errorRowEnabled(value) {
                    this._setOption('errorRowEnabled', value);
                }
                /**
                 * Specifies keys of the initially expanded rows.
                
                 */
                get expandedRowKeys() {
                    return this._getOption('expandedRowKeys');
                }
                set expandedRowKeys(value) {
                    this._setOption('expandedRowKeys', value);
                }
                /**
                 * Specifies whether nodes appear expanded or collapsed after filtering is applied.
                
                 */
                get expandNodesOnFiltering() {
                    return this._getOption('expandNodesOnFiltering');
                }
                set expandNodesOnFiltering(value) {
                    this._setOption('expandNodesOnFiltering', value);
                }
                /**
                 * Configures the integrated filter builder.
                
                 */
                get filterBuilder() {
                    return this._getOption('filterBuilder');
                }
                set filterBuilder(value) {
                    this._setOption('filterBuilder', value);
                }
                /**
                 * Configures the popup in which the integrated filter builder is shown.
                
                 */
                get filterBuilderPopup() {
                    return this._getOption('filterBuilderPopup');
                }
                set filterBuilderPopup(value) {
                    this._setOption('filterBuilderPopup', value);
                }
                /**
                 * Specifies whether filter and search results should include matching rows only, matching rows with ancestors, or matching rows with ancestors and descendants (full branch).
                
                 */
                get filterMode() {
                    return this._getOption('filterMode');
                }
                set filterMode(value) {
                    this._setOption('filterMode', value);
                }
                /**
                 * Configures the filter panel.
                
                 */
                get filterPanel() {
                    return this._getOption('filterPanel');
                }
                set filterPanel(value) {
                    this._setOption('filterPanel', value);
                }
                /**
                 * Configures the filter row.
                
                 */
                get filterRow() {
                    return this._getOption('filterRow');
                }
                set filterRow(value) {
                    this._setOption('filterRow', value);
                }
                /**
                 * Specifies whether to synchronize the filter row, header filter, and filter builder. The synchronized filter expression is stored in the filterValue property.
                
                 */
                get filterSyncEnabled() {
                    return this._getOption('filterSyncEnabled');
                }
                set filterSyncEnabled(value) {
                    this._setOption('filterSyncEnabled', value);
                }
                /**
                 * Specifies a filter expression.
                
                 */
                get filterValue() {
                    return this._getOption('filterValue');
                }
                set filterValue(value) {
                    this._setOption('filterValue', value);
                }
                /**
                 * The index of the column that contains the focused data cell. This index is taken from the columns array.
                
                 */
                get focusedColumnIndex() {
                    return this._getOption('focusedColumnIndex');
                }
                set focusedColumnIndex(value) {
                    this._setOption('focusedColumnIndex', value);
                }
                /**
                 * Specifies whether the focused row feature is enabled.
                
                 */
                get focusedRowEnabled() {
                    return this._getOption('focusedRowEnabled');
                }
                set focusedRowEnabled(value) {
                    this._setOption('focusedRowEnabled', value);
                }
                /**
                 * Specifies or indicates the focused data row&apos;s index.
                
                 */
                get focusedRowIndex() {
                    return this._getOption('focusedRowIndex');
                }
                set focusedRowIndex(value) {
                    this._setOption('focusedRowIndex', value);
                }
                /**
                 * Specifies initially or currently focused grid row&apos;s key.
                
                 */
                get focusedRowKey() {
                    return this._getOption('focusedRowKey');
                }
                set focusedRowKey(value) {
                    this._setOption('focusedRowKey', value);
                }
                /**
                 * Specifies which data field defines whether the node has children.
                
                 */
                get hasItemsExpr() {
                    return this._getOption('hasItemsExpr');
                }
                set hasItemsExpr(value) {
                    this._setOption('hasItemsExpr', value);
                }
                /**
                 * Configures the header filter feature.
                
                 */
                get headerFilter() {
                    return this._getOption('headerFilter');
                }
                set headerFilter(value) {
                    this._setOption('headerFilter', value);
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
                 * Specifies whether to highlight rows and cells with edited data. repaintChangesOnly should be true.
                
                 */
                get highlightChanges() {
                    return this._getOption('highlightChanges');
                }
                set highlightChanges(value) {
                    this._setOption('highlightChanges', value);
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
                 * Specifies which data field contains nested items. Set this property when your data has a hierarchical structure.
                
                 */
                get itemsExpr() {
                    return this._getOption('itemsExpr');
                }
                set itemsExpr(value) {
                    this._setOption('itemsExpr', value);
                }
                /**
                 * Configures keyboard navigation.
                
                 */
                get keyboardNavigation() {
                    return this._getOption('keyboardNavigation');
                }
                set keyboardNavigation(value) {
                    this._setOption('keyboardNavigation', value);
                }
                /**
                 * Specifies the key property (or properties) that provide(s) key values to access data items. Each key value must be unique.
                
                 */
                get keyExpr() {
                    return this._getOption('keyExpr');
                }
                set keyExpr(value) {
                    this._setOption('keyExpr', value);
                }
                /**
                 * Configures the load panel.
                
                 */
                get loadPanel() {
                    return this._getOption('loadPanel');
                }
                set loadPanel(value) {
                    this._setOption('loadPanel', value);
                }
                /**
                 * Specifies a text string shown when the widget does not display any data.
                
                 */
                get noDataText() {
                    return this._getOption('noDataText');
                }
                set noDataText(value) {
                    this._setOption('noDataText', value);
                }
                /**
                 * Configures the pager.
                
                 */
                get pager() {
                    return this._getOption('pager');
                }
                set pager(value) {
                    this._setOption('pager', value);
                }
                /**
                 * Configures paging.
                
                 */
                get paging() {
                    return this._getOption('paging');
                }
                set paging(value) {
                    this._setOption('paging', value);
                }
                /**
                 * Specifies which data field provides parent keys.
                
                 */
                get parentIdExpr() {
                    return this._getOption('parentIdExpr');
                }
                set parentIdExpr(value) {
                    this._setOption('parentIdExpr', value);
                }
                /**
                 * Notifies the TreeList of the server&apos;s data processing operations. Applies only if data has a plain structure.
                
                 */
                get remoteOperations() {
                    return this._getOption('remoteOperations');
                }
                set remoteOperations(value) {
                    this._setOption('remoteOperations', value);
                }
                /**
                 * Specifies whether to render the filter row, command columns, and columns with showEditorAlways set to true after other elements.
                
                 */
                get renderAsync() {
                    return this._getOption('renderAsync');
                }
                set renderAsync(value) {
                    this._setOption('renderAsync', value);
                }
                /**
                 * Specifies whether to repaint only those cells whose data changed.
                
                 */
                get repaintChangesOnly() {
                    return this._getOption('repaintChangesOnly');
                }
                set repaintChangesOnly(value) {
                    this._setOption('repaintChangesOnly', value);
                }
                /**
                 * Specifies the root node&apos;s identifier. Applies if dataStructure is &apos;plain&apos;.
                
                 */
                get rootValue() {
                    return this._getOption('rootValue');
                }
                set rootValue(value) {
                    this._setOption('rootValue', value);
                }
                /**
                 * Specifies whether rows should be shaded differently.
                
                 */
                get rowAlternationEnabled() {
                    return this._getOption('rowAlternationEnabled');
                }
                set rowAlternationEnabled(value) {
                    this._setOption('rowAlternationEnabled', value);
                }
                /**
                 * Configures row reordering using drag and drop gestures.
                
                 */
                get rowDragging() {
                    return this._getOption('rowDragging');
                }
                set rowDragging(value) {
                    this._setOption('rowDragging', value);
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
                 * Configures scrolling.
                
                 */
                get scrolling() {
                    return this._getOption('scrolling');
                }
                set scrolling(value) {
                    this._setOption('scrolling', value);
                }
                /**
                 * Configures the search panel.
                
                 */
                get searchPanel() {
                    return this._getOption('searchPanel');
                }
                set searchPanel(value) {
                    this._setOption('searchPanel', value);
                }
                /**
                 * Allows you to select rows or determine which rows are selected.
                
                 */
                get selectedRowKeys() {
                    return this._getOption('selectedRowKeys');
                }
                set selectedRowKeys(value) {
                    this._setOption('selectedRowKeys', value);
                }
                /**
                 * Configures runtime selection.
                
                 */
                get selection() {
                    return this._getOption('selection');
                }
                set selection(value) {
                    this._setOption('selection', value);
                }
                /**
                 * Specifies whether the outer borders of the UI component are visible.
                
                 */
                get showBorders() {
                    return this._getOption('showBorders');
                }
                set showBorders(value) {
                    this._setOption('showBorders', value);
                }
                /**
                 * Specifies whether column headers are visible.
                
                 */
                get showColumnHeaders() {
                    return this._getOption('showColumnHeaders');
                }
                set showColumnHeaders(value) {
                    this._setOption('showColumnHeaders', value);
                }
                /**
                 * Specifies whether vertical lines that separate one column from another are visible.
                
                 */
                get showColumnLines() {
                    return this._getOption('showColumnLines');
                }
                set showColumnLines(value) {
                    this._setOption('showColumnLines', value);
                }
                /**
                 * Specifies whether horizontal lines that separate one row from another are visible.
                
                 */
                get showRowLines() {
                    return this._getOption('showRowLines');
                }
                set showRowLines(value) {
                    this._setOption('showRowLines', value);
                }
                /**
                 * Configures runtime sorting.
                
                 */
                get sorting() {
                    return this._getOption('sorting');
                }
                set sorting(value) {
                    this._setOption('sorting', value);
                }
                /**
                 * Configures state storing.
                
                 */
                get stateStoring() {
                    return this._getOption('stateStoring');
                }
                set stateStoring(value) {
                    this._setOption('stateStoring', value);
                }
                /**
                 * Specifies whether to show only relevant values in the header filter and filter row.
                
                 */
                get syncLookupFilterValues() {
                    return this._getOption('syncLookupFilterValues');
                }
                set syncLookupFilterValues(value) {
                    this._setOption('syncLookupFilterValues', value);
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
                 * Configures the toolbar.
                
                 */
                get toolbar() {
                    return this._getOption('toolbar');
                }
                set toolbar(value) {
                    this._setOption('toolbar', value);
                }
                /**
                 * Specifies whether to enable two-way data binding.
                
                 */
                get twoWayBindingEnabled() {
                    return this._getOption('twoWayBindingEnabled');
                }
                set twoWayBindingEnabled(value) {
                    this._setOption('twoWayBindingEnabled', value);
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
                 * Specifies whether text that does not fit into a column should be wrapped.
                
                 */
                get wordWrapEnabled() {
                    return this._getOption('wordWrapEnabled');
                }
                set wordWrapEnabled(value) {
                    this._setOption('wordWrapEnabled', value);
                }
                /**
                
                 * A function that is executed before an adaptive detail row is rendered.
                
                
                 */
                onAdaptiveDetailRowPreparing;
                /**
                
                 * A function that is executed when a cell is clicked or tapped. Executed before onRowClick.
                
                
                 */
                onCellClick;
                /**
                
                 * A function that is executed when a cell is double-clicked or double-tapped. Executed before onRowDblClick.
                
                
                 */
                onCellDblClick;
                /**
                
                 * A function that is executed after the pointer enters or leaves a cell.
                
                
                 */
                onCellHoverChanged;
                /**
                
                 * A function that is executed after a grid cell is created.
                
                
                 */
                onCellPrepared;
                /**
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed before the context menu is rendered.
                
                
                 */
                onContextMenuPreparing;
                /**
                
                 * A function that is executed when an error occurs in the data source.
                
                
                 */
                onDataErrorOccurred;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed after row changes are discarded.
                
                
                 */
                onEditCanceled;
                /**
                
                 * A function that is executed when the edit operation is canceled, but row changes are not yet discarded.
                
                
                 */
                onEditCanceling;
                /**
                
                 * A function that is executed before a cell or row switches to the editing state.
                
                
                 */
                onEditingStart;
                /**
                
                 * A function that is executed after an editor is created. Not executed for cells with an editCellTemplate.
                
                
                 */
                onEditorPrepared;
                /**
                
                 * A function used to customize a cell&apos;s editor. Not executed for cells with an editCellTemplate.
                
                
                 */
                onEditorPreparing;
                /**
                
                 * A function that is executed after the focused cell changes. Applies only to cells in data rows.
                
                
                 */
                onFocusedCellChanged;
                /**
                
                 * A function that is executed before the focused cell changes. Applies only to cells in data rows.
                
                
                 */
                onFocusedCellChanging;
                /**
                
                 * A function that executed when the focused row changes. Applies only to data rows. focusedRowEnabled should be true.
                
                
                 */
                onFocusedRowChanged;
                /**
                
                 * A function that is executed before the focused row changes. Applies only to data rows. focusedRowEnabled should be true.
                
                
                 */
                onFocusedRowChanging;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed before a new row is added to the UI component.
                
                
                 */
                onInitNewRow;
                /**
                
                 * A function that is executed when the UI component is in focus and a key has been pressed down.
                
                
                 */
                onKeyDown;
                /**
                
                 * A function that is executed after the loaded nodes are initialized.
                
                
                 */
                onNodesInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a grid row is clicked or tapped.
                
                
                 */
                onRowClick;
                /**
                
                 * A function that is executed after a row is collapsed.
                
                
                 */
                onRowCollapsed;
                /**
                
                 * A function that is executed before a row is collapsed.
                
                
                 */
                onRowCollapsing;
                /**
                
                 * A function that is executed when a row is double-clicked or double-tapped. Executed after onCellDblClick.
                
                
                 */
                onRowDblClick;
                /**
                
                 * A function that is executed after a row is expanded.
                
                
                 */
                onRowExpanded;
                /**
                
                 * A function that is executed before a row is expanded.
                
                
                 */
                onRowExpanding;
                /**
                
                 * A function that is executed after a new row has been inserted into the data source.
                
                
                 */
                onRowInserted;
                /**
                
                 * A function that is executed before a new row is inserted into the data source.
                
                
                 */
                onRowInserting;
                /**
                
                 * A function that is executed after a row is created.
                
                
                 */
                onRowPrepared;
                /**
                
                 * A function that is executed after a row has been removed from the data source.
                
                
                 */
                onRowRemoved;
                /**
                
                 * A function that is executed before a row is removed from the data source.
                
                
                 */
                onRowRemoving;
                /**
                
                 * A function that is executed after a row has been updated in the data source.
                
                
                 */
                onRowUpdated;
                /**
                
                 * A function that is executed before a row is updated in the data source.
                
                
                 */
                onRowUpdating;
                /**
                
                 * A function that is executed after cells in a row are validated against validation rules.
                
                
                 */
                onRowValidating;
                /**
                
                 * A function that is executed after row changes are saved.
                
                
                 */
                onSaved;
                /**
                
                 * A function that is executed before pending row changes are saved.
                
                
                 */
                onSaving;
                /**
                
                 * A function that is executed after selecting a row or clearing its selection.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * A function that is executed before the toolbar is created.
                
                
                 */
                onToolbarPreparing;
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
                allowColumnReorderingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowColumnResizingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                autoExpandAllChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                autoNavigateToFocusedRowChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                cacheEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                cellHintEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                columnAutoWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                columnChooserChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                columnFixingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                columnHidingEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                columnMinWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                columnResizingModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                columnsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                columnWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customizeColumnsChange;
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
                dateSerializationFormatChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                editingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                errorRowEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                expandedRowKeysChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                expandNodesOnFilteringChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterBuilderChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterBuilderPopupChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterPanelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterRowChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterSyncEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusedColumnIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusedRowEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusedRowIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusedRowKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hasItemsExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                headerFilterChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                highlightChangesChange;
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
                itemsExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                keyboardNavigationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                keyExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                loadPanelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                noDataTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pagerChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                pagingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                parentIdExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                remoteOperationsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                renderAsyncChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                repaintChangesOnlyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rootValueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rowAlternationEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rowDraggingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                searchPanelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedRowKeysChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showBordersChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showColumnHeadersChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showColumnLinesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showRowLinesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                sortingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                stateStoringChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                syncLookupFilterValuesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                toolbarChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                twoWayBindingEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                wordWrapEnabledChange;
                get columnsChildren() {
                    return this._getOption('columns');
                }
                set columnsChildren(value) {
                    this.setChildren('columns', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'adaptiveDetailRowPreparing', emit: 'onAdaptiveDetailRowPreparing' },
                        { subscribe: 'cellClick', emit: 'onCellClick' },
                        { subscribe: 'cellDblClick', emit: 'onCellDblClick' },
                        { subscribe: 'cellHoverChanged', emit: 'onCellHoverChanged' },
                        { subscribe: 'cellPrepared', emit: 'onCellPrepared' },
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'contextMenuPreparing', emit: 'onContextMenuPreparing' },
                        { subscribe: 'dataErrorOccurred', emit: 'onDataErrorOccurred' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'editCanceled', emit: 'onEditCanceled' },
                        { subscribe: 'editCanceling', emit: 'onEditCanceling' },
                        { subscribe: 'editingStart', emit: 'onEditingStart' },
                        { subscribe: 'editorPrepared', emit: 'onEditorPrepared' },
                        { subscribe: 'editorPreparing', emit: 'onEditorPreparing' },
                        { subscribe: 'focusedCellChanged', emit: 'onFocusedCellChanged' },
                        { subscribe: 'focusedCellChanging', emit: 'onFocusedCellChanging' },
                        { subscribe: 'focusedRowChanged', emit: 'onFocusedRowChanged' },
                        { subscribe: 'focusedRowChanging', emit: 'onFocusedRowChanging' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'initNewRow', emit: 'onInitNewRow' },
                        { subscribe: 'keyDown', emit: 'onKeyDown' },
                        { subscribe: 'nodesInitialized', emit: 'onNodesInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'rowClick', emit: 'onRowClick' },
                        { subscribe: 'rowCollapsed', emit: 'onRowCollapsed' },
                        { subscribe: 'rowCollapsing', emit: 'onRowCollapsing' },
                        { subscribe: 'rowDblClick', emit: 'onRowDblClick' },
                        { subscribe: 'rowExpanded', emit: 'onRowExpanded' },
                        { subscribe: 'rowExpanding', emit: 'onRowExpanding' },
                        { subscribe: 'rowInserted', emit: 'onRowInserted' },
                        { subscribe: 'rowInserting', emit: 'onRowInserting' },
                        { subscribe: 'rowPrepared', emit: 'onRowPrepared' },
                        { subscribe: 'rowRemoved', emit: 'onRowRemoved' },
                        { subscribe: 'rowRemoving', emit: 'onRowRemoving' },
                        { subscribe: 'rowUpdated', emit: 'onRowUpdated' },
                        { subscribe: 'rowUpdating', emit: 'onRowUpdating' },
                        { subscribe: 'rowValidating', emit: 'onRowValidating' },
                        { subscribe: 'saved', emit: 'onSaved' },
                        { subscribe: 'saving', emit: 'onSaving' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { subscribe: 'toolbarPreparing', emit: 'onToolbarPreparing' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'allowColumnReorderingChange' },
                        { emit: 'allowColumnResizingChange' },
                        { emit: 'autoExpandAllChange' },
                        { emit: 'autoNavigateToFocusedRowChange' },
                        { emit: 'cacheEnabledChange' },
                        { emit: 'cellHintEnabledChange' },
                        { emit: 'columnAutoWidthChange' },
                        { emit: 'columnChooserChange' },
                        { emit: 'columnFixingChange' },
                        { emit: 'columnHidingEnabledChange' },
                        { emit: 'columnMinWidthChange' },
                        { emit: 'columnResizingModeChange' },
                        { emit: 'columnsChange' },
                        { emit: 'columnWidthChange' },
                        { emit: 'customizeColumnsChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'dataStructureChange' },
                        { emit: 'dateSerializationFormatChange' },
                        { emit: 'disabledChange' },
                        { emit: 'editingChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'errorRowEnabledChange' },
                        { emit: 'expandedRowKeysChange' },
                        { emit: 'expandNodesOnFilteringChange' },
                        { emit: 'filterBuilderChange' },
                        { emit: 'filterBuilderPopupChange' },
                        { emit: 'filterModeChange' },
                        { emit: 'filterPanelChange' },
                        { emit: 'filterRowChange' },
                        { emit: 'filterSyncEnabledChange' },
                        { emit: 'filterValueChange' },
                        { emit: 'focusedColumnIndexChange' },
                        { emit: 'focusedRowEnabledChange' },
                        { emit: 'focusedRowIndexChange' },
                        { emit: 'focusedRowKeyChange' },
                        { emit: 'hasItemsExprChange' },
                        { emit: 'headerFilterChange' },
                        { emit: 'heightChange' },
                        { emit: 'highlightChangesChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'itemsExprChange' },
                        { emit: 'keyboardNavigationChange' },
                        { emit: 'keyExprChange' },
                        { emit: 'loadPanelChange' },
                        { emit: 'noDataTextChange' },
                        { emit: 'pagerChange' },
                        { emit: 'pagingChange' },
                        { emit: 'parentIdExprChange' },
                        { emit: 'remoteOperationsChange' },
                        { emit: 'renderAsyncChange' },
                        { emit: 'repaintChangesOnlyChange' },
                        { emit: 'rootValueChange' },
                        { emit: 'rowAlternationEnabledChange' },
                        { emit: 'rowDraggingChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollingChange' },
                        { emit: 'searchPanelChange' },
                        { emit: 'selectedRowKeysChange' },
                        { emit: 'selectionChange' },
                        { emit: 'showBordersChange' },
                        { emit: 'showColumnHeadersChange' },
                        { emit: 'showColumnLinesChange' },
                        { emit: 'showRowLinesChange' },
                        { emit: 'sortingChange' },
                        { emit: 'stateStoringChange' },
                        { emit: 'syncLookupFilterValuesChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'toolbarChange' },
                        { emit: 'twoWayBindingEnabledChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'wordWrapEnabledChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxTreeList(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('columns', changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('expandedRowKeys', changes);
                    this.setupChanges('selectedRowKeys', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('columns');
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('expandedRowKeys');
                    this._idh.doCheck('selectedRowKeys');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeListComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxTreeListComponent, selector: "dx-tree-list", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", allowColumnReordering: "allowColumnReordering", allowColumnResizing: "allowColumnResizing", autoExpandAll: "autoExpandAll", autoNavigateToFocusedRow: "autoNavigateToFocusedRow", cacheEnabled: "cacheEnabled", cellHintEnabled: "cellHintEnabled", columnAutoWidth: "columnAutoWidth", columnChooser: "columnChooser", columnFixing: "columnFixing", columnHidingEnabled: "columnHidingEnabled", columnMinWidth: "columnMinWidth", columnResizingMode: "columnResizingMode", columns: "columns", columnWidth: "columnWidth", customizeColumns: "customizeColumns", dataSource: "dataSource", dataStructure: "dataStructure", dateSerializationFormat: "dateSerializationFormat", disabled: "disabled", editing: "editing", elementAttr: "elementAttr", errorRowEnabled: "errorRowEnabled", expandedRowKeys: "expandedRowKeys", expandNodesOnFiltering: "expandNodesOnFiltering", filterBuilder: "filterBuilder", filterBuilderPopup: "filterBuilderPopup", filterMode: "filterMode", filterPanel: "filterPanel", filterRow: "filterRow", filterSyncEnabled: "filterSyncEnabled", filterValue: "filterValue", focusedColumnIndex: "focusedColumnIndex", focusedRowEnabled: "focusedRowEnabled", focusedRowIndex: "focusedRowIndex", focusedRowKey: "focusedRowKey", hasItemsExpr: "hasItemsExpr", headerFilter: "headerFilter", height: "height", highlightChanges: "highlightChanges", hint: "hint", hoverStateEnabled: "hoverStateEnabled", itemsExpr: "itemsExpr", keyboardNavigation: "keyboardNavigation", keyExpr: "keyExpr", loadPanel: "loadPanel", noDataText: "noDataText", pager: "pager", paging: "paging", parentIdExpr: "parentIdExpr", remoteOperations: "remoteOperations", renderAsync: "renderAsync", repaintChangesOnly: "repaintChangesOnly", rootValue: "rootValue", rowAlternationEnabled: "rowAlternationEnabled", rowDragging: "rowDragging", rtlEnabled: "rtlEnabled", scrolling: "scrolling", searchPanel: "searchPanel", selectedRowKeys: "selectedRowKeys", selection: "selection", showBorders: "showBorders", showColumnHeaders: "showColumnHeaders", showColumnLines: "showColumnLines", showRowLines: "showRowLines", sorting: "sorting", stateStoring: "stateStoring", syncLookupFilterValues: "syncLookupFilterValues", tabIndex: "tabIndex", toolbar: "toolbar", twoWayBindingEnabled: "twoWayBindingEnabled", visible: "visible", width: "width", wordWrapEnabled: "wordWrapEnabled" }, outputs: { onAdaptiveDetailRowPreparing: "onAdaptiveDetailRowPreparing", onCellClick: "onCellClick", onCellDblClick: "onCellDblClick", onCellHoverChanged: "onCellHoverChanged", onCellPrepared: "onCellPrepared", onContentReady: "onContentReady", onContextMenuPreparing: "onContextMenuPreparing", onDataErrorOccurred: "onDataErrorOccurred", onDisposing: "onDisposing", onEditCanceled: "onEditCanceled", onEditCanceling: "onEditCanceling", onEditingStart: "onEditingStart", onEditorPrepared: "onEditorPrepared", onEditorPreparing: "onEditorPreparing", onFocusedCellChanged: "onFocusedCellChanged", onFocusedCellChanging: "onFocusedCellChanging", onFocusedRowChanged: "onFocusedRowChanged", onFocusedRowChanging: "onFocusedRowChanging", onInitialized: "onInitialized", onInitNewRow: "onInitNewRow", onKeyDown: "onKeyDown", onNodesInitialized: "onNodesInitialized", onOptionChanged: "onOptionChanged", onRowClick: "onRowClick", onRowCollapsed: "onRowCollapsed", onRowCollapsing: "onRowCollapsing", onRowDblClick: "onRowDblClick", onRowExpanded: "onRowExpanded", onRowExpanding: "onRowExpanding", onRowInserted: "onRowInserted", onRowInserting: "onRowInserting", onRowPrepared: "onRowPrepared", onRowRemoved: "onRowRemoved", onRowRemoving: "onRowRemoving", onRowUpdated: "onRowUpdated", onRowUpdating: "onRowUpdating", onRowValidating: "onRowValidating", onSaved: "onSaved", onSaving: "onSaving", onSelectionChanged: "onSelectionChanged", onToolbarPreparing: "onToolbarPreparing", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", allowColumnReorderingChange: "allowColumnReorderingChange", allowColumnResizingChange: "allowColumnResizingChange", autoExpandAllChange: "autoExpandAllChange", autoNavigateToFocusedRowChange: "autoNavigateToFocusedRowChange", cacheEnabledChange: "cacheEnabledChange", cellHintEnabledChange: "cellHintEnabledChange", columnAutoWidthChange: "columnAutoWidthChange", columnChooserChange: "columnChooserChange", columnFixingChange: "columnFixingChange", columnHidingEnabledChange: "columnHidingEnabledChange", columnMinWidthChange: "columnMinWidthChange", columnResizingModeChange: "columnResizingModeChange", columnsChange: "columnsChange", columnWidthChange: "columnWidthChange", customizeColumnsChange: "customizeColumnsChange", dataSourceChange: "dataSourceChange", dataStructureChange: "dataStructureChange", dateSerializationFormatChange: "dateSerializationFormatChange", disabledChange: "disabledChange", editingChange: "editingChange", elementAttrChange: "elementAttrChange", errorRowEnabledChange: "errorRowEnabledChange", expandedRowKeysChange: "expandedRowKeysChange", expandNodesOnFilteringChange: "expandNodesOnFilteringChange", filterBuilderChange: "filterBuilderChange", filterBuilderPopupChange: "filterBuilderPopupChange", filterModeChange: "filterModeChange", filterPanelChange: "filterPanelChange", filterRowChange: "filterRowChange", filterSyncEnabledChange: "filterSyncEnabledChange", filterValueChange: "filterValueChange", focusedColumnIndexChange: "focusedColumnIndexChange", focusedRowEnabledChange: "focusedRowEnabledChange", focusedRowIndexChange: "focusedRowIndexChange", focusedRowKeyChange: "focusedRowKeyChange", hasItemsExprChange: "hasItemsExprChange", headerFilterChange: "headerFilterChange", heightChange: "heightChange", highlightChangesChange: "highlightChangesChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", itemsExprChange: "itemsExprChange", keyboardNavigationChange: "keyboardNavigationChange", keyExprChange: "keyExprChange", loadPanelChange: "loadPanelChange", noDataTextChange: "noDataTextChange", pagerChange: "pagerChange", pagingChange: "pagingChange", parentIdExprChange: "parentIdExprChange", remoteOperationsChange: "remoteOperationsChange", renderAsyncChange: "renderAsyncChange", repaintChangesOnlyChange: "repaintChangesOnlyChange", rootValueChange: "rootValueChange", rowAlternationEnabledChange: "rowAlternationEnabledChange", rowDraggingChange: "rowDraggingChange", rtlEnabledChange: "rtlEnabledChange", scrollingChange: "scrollingChange", searchPanelChange: "searchPanelChange", selectedRowKeysChange: "selectedRowKeysChange", selectionChange: "selectionChange", showBordersChange: "showBordersChange", showColumnHeadersChange: "showColumnHeadersChange", showColumnLinesChange: "showColumnLinesChange", showRowLinesChange: "showRowLinesChange", sortingChange: "sortingChange", stateStoringChange: "stateStoringChange", syncLookupFilterValuesChange: "syncLookupFilterValuesChange", tabIndexChange: "tabIndexChange", toolbarChange: "toolbarChange", twoWayBindingEnabledChange: "twoWayBindingEnabledChange", visibleChange: "visibleChange", widthChange: "widthChange", wordWrapEnabledChange: "wordWrapEnabledChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "columnsChildren", predicate: DxiColumnComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxTreeListComponent", DxTreeListComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeListComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-tree-list',
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
                        }], allowColumnReordering: [{
                            type: Input
                        }], allowColumnResizing: [{
                            type: Input
                        }], autoExpandAll: [{
                            type: Input
                        }], autoNavigateToFocusedRow: [{
                            type: Input
                        }], cacheEnabled: [{
                            type: Input
                        }], cellHintEnabled: [{
                            type: Input
                        }], columnAutoWidth: [{
                            type: Input
                        }], columnChooser: [{
                            type: Input
                        }], columnFixing: [{
                            type: Input
                        }], columnHidingEnabled: [{
                            type: Input
                        }], columnMinWidth: [{
                            type: Input
                        }], columnResizingMode: [{
                            type: Input
                        }], columns: [{
                            type: Input
                        }], columnWidth: [{
                            type: Input
                        }], customizeColumns: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], dataStructure: [{
                            type: Input
                        }], dateSerializationFormat: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], editing: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], errorRowEnabled: [{
                            type: Input
                        }], expandedRowKeys: [{
                            type: Input
                        }], expandNodesOnFiltering: [{
                            type: Input
                        }], filterBuilder: [{
                            type: Input
                        }], filterBuilderPopup: [{
                            type: Input
                        }], filterMode: [{
                            type: Input
                        }], filterPanel: [{
                            type: Input
                        }], filterRow: [{
                            type: Input
                        }], filterSyncEnabled: [{
                            type: Input
                        }], filterValue: [{
                            type: Input
                        }], focusedColumnIndex: [{
                            type: Input
                        }], focusedRowEnabled: [{
                            type: Input
                        }], focusedRowIndex: [{
                            type: Input
                        }], focusedRowKey: [{
                            type: Input
                        }], hasItemsExpr: [{
                            type: Input
                        }], headerFilter: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], highlightChanges: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], itemsExpr: [{
                            type: Input
                        }], keyboardNavigation: [{
                            type: Input
                        }], keyExpr: [{
                            type: Input
                        }], loadPanel: [{
                            type: Input
                        }], noDataText: [{
                            type: Input
                        }], pager: [{
                            type: Input
                        }], paging: [{
                            type: Input
                        }], parentIdExpr: [{
                            type: Input
                        }], remoteOperations: [{
                            type: Input
                        }], renderAsync: [{
                            type: Input
                        }], repaintChangesOnly: [{
                            type: Input
                        }], rootValue: [{
                            type: Input
                        }], rowAlternationEnabled: [{
                            type: Input
                        }], rowDragging: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrolling: [{
                            type: Input
                        }], searchPanel: [{
                            type: Input
                        }], selectedRowKeys: [{
                            type: Input
                        }], selection: [{
                            type: Input
                        }], showBorders: [{
                            type: Input
                        }], showColumnHeaders: [{
                            type: Input
                        }], showColumnLines: [{
                            type: Input
                        }], showRowLines: [{
                            type: Input
                        }], sorting: [{
                            type: Input
                        }], stateStoring: [{
                            type: Input
                        }], syncLookupFilterValues: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], toolbar: [{
                            type: Input
                        }], twoWayBindingEnabled: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], wordWrapEnabled: [{
                            type: Input
                        }], onAdaptiveDetailRowPreparing: [{
                            type: Output
                        }], onCellClick: [{
                            type: Output
                        }], onCellDblClick: [{
                            type: Output
                        }], onCellHoverChanged: [{
                            type: Output
                        }], onCellPrepared: [{
                            type: Output
                        }], onContentReady: [{
                            type: Output
                        }], onContextMenuPreparing: [{
                            type: Output
                        }], onDataErrorOccurred: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onEditCanceled: [{
                            type: Output
                        }], onEditCanceling: [{
                            type: Output
                        }], onEditingStart: [{
                            type: Output
                        }], onEditorPrepared: [{
                            type: Output
                        }], onEditorPreparing: [{
                            type: Output
                        }], onFocusedCellChanged: [{
                            type: Output
                        }], onFocusedCellChanging: [{
                            type: Output
                        }], onFocusedRowChanged: [{
                            type: Output
                        }], onFocusedRowChanging: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onInitNewRow: [{
                            type: Output
                        }], onKeyDown: [{
                            type: Output
                        }], onNodesInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onRowClick: [{
                            type: Output
                        }], onRowCollapsed: [{
                            type: Output
                        }], onRowCollapsing: [{
                            type: Output
                        }], onRowDblClick: [{
                            type: Output
                        }], onRowExpanded: [{
                            type: Output
                        }], onRowExpanding: [{
                            type: Output
                        }], onRowInserted: [{
                            type: Output
                        }], onRowInserting: [{
                            type: Output
                        }], onRowPrepared: [{
                            type: Output
                        }], onRowRemoved: [{
                            type: Output
                        }], onRowRemoving: [{
                            type: Output
                        }], onRowUpdated: [{
                            type: Output
                        }], onRowUpdating: [{
                            type: Output
                        }], onRowValidating: [{
                            type: Output
                        }], onSaved: [{
                            type: Output
                        }], onSaving: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], onToolbarPreparing: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], allowColumnReorderingChange: [{
                            type: Output
                        }], allowColumnResizingChange: [{
                            type: Output
                        }], autoExpandAllChange: [{
                            type: Output
                        }], autoNavigateToFocusedRowChange: [{
                            type: Output
                        }], cacheEnabledChange: [{
                            type: Output
                        }], cellHintEnabledChange: [{
                            type: Output
                        }], columnAutoWidthChange: [{
                            type: Output
                        }], columnChooserChange: [{
                            type: Output
                        }], columnFixingChange: [{
                            type: Output
                        }], columnHidingEnabledChange: [{
                            type: Output
                        }], columnMinWidthChange: [{
                            type: Output
                        }], columnResizingModeChange: [{
                            type: Output
                        }], columnsChange: [{
                            type: Output
                        }], columnWidthChange: [{
                            type: Output
                        }], customizeColumnsChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], dataStructureChange: [{
                            type: Output
                        }], dateSerializationFormatChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], editingChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], errorRowEnabledChange: [{
                            type: Output
                        }], expandedRowKeysChange: [{
                            type: Output
                        }], expandNodesOnFilteringChange: [{
                            type: Output
                        }], filterBuilderChange: [{
                            type: Output
                        }], filterBuilderPopupChange: [{
                            type: Output
                        }], filterModeChange: [{
                            type: Output
                        }], filterPanelChange: [{
                            type: Output
                        }], filterRowChange: [{
                            type: Output
                        }], filterSyncEnabledChange: [{
                            type: Output
                        }], filterValueChange: [{
                            type: Output
                        }], focusedColumnIndexChange: [{
                            type: Output
                        }], focusedRowEnabledChange: [{
                            type: Output
                        }], focusedRowIndexChange: [{
                            type: Output
                        }], focusedRowKeyChange: [{
                            type: Output
                        }], hasItemsExprChange: [{
                            type: Output
                        }], headerFilterChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], highlightChangesChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], itemsExprChange: [{
                            type: Output
                        }], keyboardNavigationChange: [{
                            type: Output
                        }], keyExprChange: [{
                            type: Output
                        }], loadPanelChange: [{
                            type: Output
                        }], noDataTextChange: [{
                            type: Output
                        }], pagerChange: [{
                            type: Output
                        }], pagingChange: [{
                            type: Output
                        }], parentIdExprChange: [{
                            type: Output
                        }], remoteOperationsChange: [{
                            type: Output
                        }], renderAsyncChange: [{
                            type: Output
                        }], repaintChangesOnlyChange: [{
                            type: Output
                        }], rootValueChange: [{
                            type: Output
                        }], rowAlternationEnabledChange: [{
                            type: Output
                        }], rowDraggingChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scrollingChange: [{
                            type: Output
                        }], searchPanelChange: [{
                            type: Output
                        }], selectedRowKeysChange: [{
                            type: Output
                        }], selectionChange: [{
                            type: Output
                        }], showBordersChange: [{
                            type: Output
                        }], showColumnHeadersChange: [{
                            type: Output
                        }], showColumnLinesChange: [{
                            type: Output
                        }], showRowLinesChange: [{
                            type: Output
                        }], sortingChange: [{
                            type: Output
                        }], stateStoringChange: [{
                            type: Output
                        }], syncLookupFilterValuesChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], toolbarChange: [{
                            type: Output
                        }], twoWayBindingEnabledChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], wordWrapEnabledChange: [{
                            type: Output
                        }], columnsChildren: [{
                            type: ContentChildren,
                            args: [DxiColumnComponent]
                        }] } });
            class DxTreeListModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxTreeListModule, declarations: [DxTreeListComponent], imports: [DxoColumnChooserModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoSearchModule,
                        DxoSelectionModule,
                        DxoColumnFixingModule,
                        DxoTextsModule,
                        DxiColumnModule,
                        DxiButtonModule,
                        DxoHeaderFilterModule,
                        DxoLookupModule,
                        DxoFormatModule,
                        DxoFormItemModule,
                        DxoLabelModule,
                        DxiValidationRuleModule,
                        DxoEditingModule,
                        DxiChangeModule,
                        DxoFormModule,
                        DxoColCountByScreenModule,
                        DxiItemModule,
                        DxoTabPanelOptionsModule,
                        DxiTabModule,
                        DxoButtonOptionsModule,
                        DxoPopupModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxoFilterBuilderModule,
                        DxiCustomOperationModule,
                        DxiFieldModule,
                        DxoFilterOperationDescriptionsModule,
                        DxoGroupOperationDescriptionsModule,
                        DxoFilterBuilderPopupModule,
                        DxoFilterPanelModule,
                        DxoFilterRowModule,
                        DxoOperationDescriptionsModule,
                        DxoKeyboardNavigationModule,
                        DxoLoadPanelModule,
                        DxoPagerModule,
                        DxoPagingModule,
                        DxoRemoteOperationsModule,
                        DxoRowDraggingModule,
                        DxoCursorOffsetModule,
                        DxoScrollingModule,
                        DxoSearchPanelModule,
                        DxoSortingModule,
                        DxoStateStoringModule,
                        DxoToolbarModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxTreeListComponent, DxoColumnChooserModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoSearchModule,
                        DxoSelectionModule,
                        DxoColumnFixingModule,
                        DxoTextsModule,
                        DxiColumnModule,
                        DxiButtonModule,
                        DxoHeaderFilterModule,
                        DxoLookupModule,
                        DxoFormatModule,
                        DxoFormItemModule,
                        DxoLabelModule,
                        DxiValidationRuleModule,
                        DxoEditingModule,
                        DxiChangeModule,
                        DxoFormModule,
                        DxoColCountByScreenModule,
                        DxiItemModule,
                        DxoTabPanelOptionsModule,
                        DxiTabModule,
                        DxoButtonOptionsModule,
                        DxoPopupModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxoFilterBuilderModule,
                        DxiCustomOperationModule,
                        DxiFieldModule,
                        DxoFilterOperationDescriptionsModule,
                        DxoGroupOperationDescriptionsModule,
                        DxoFilterBuilderPopupModule,
                        DxoFilterPanelModule,
                        DxoFilterRowModule,
                        DxoOperationDescriptionsModule,
                        DxoKeyboardNavigationModule,
                        DxoLoadPanelModule,
                        DxoPagerModule,
                        DxoPagingModule,
                        DxoRemoteOperationsModule,
                        DxoRowDraggingModule,
                        DxoCursorOffsetModule,
                        DxoScrollingModule,
                        DxoSearchPanelModule,
                        DxoSortingModule,
                        DxoStateStoringModule,
                        DxoToolbarModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeListModule, imports: [DxoColumnChooserModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoSearchModule,
                        DxoSelectionModule,
                        DxoColumnFixingModule,
                        DxoTextsModule,
                        DxiColumnModule,
                        DxiButtonModule,
                        DxoHeaderFilterModule,
                        DxoLookupModule,
                        DxoFormatModule,
                        DxoFormItemModule,
                        DxoLabelModule,
                        DxiValidationRuleModule,
                        DxoEditingModule,
                        DxiChangeModule,
                        DxoFormModule,
                        DxoColCountByScreenModule,
                        DxiItemModule,
                        DxoTabPanelOptionsModule,
                        DxiTabModule,
                        DxoButtonOptionsModule,
                        DxoPopupModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxoFilterBuilderModule,
                        DxiCustomOperationModule,
                        DxiFieldModule,
                        DxoFilterOperationDescriptionsModule,
                        DxoGroupOperationDescriptionsModule,
                        DxoFilterBuilderPopupModule,
                        DxoFilterPanelModule,
                        DxoFilterRowModule,
                        DxoOperationDescriptionsModule,
                        DxoKeyboardNavigationModule,
                        DxoLoadPanelModule,
                        DxoPagerModule,
                        DxoPagingModule,
                        DxoRemoteOperationsModule,
                        DxoRowDraggingModule,
                        DxoCursorOffsetModule,
                        DxoScrollingModule,
                        DxoSearchPanelModule,
                        DxoSortingModule,
                        DxoStateStoringModule,
                        DxoToolbarModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoColumnChooserModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoSearchModule,
                        DxoSelectionModule,
                        DxoColumnFixingModule,
                        DxoTextsModule,
                        DxiColumnModule,
                        DxiButtonModule,
                        DxoHeaderFilterModule,
                        DxoLookupModule,
                        DxoFormatModule,
                        DxoFormItemModule,
                        DxoLabelModule,
                        DxiValidationRuleModule,
                        DxoEditingModule,
                        DxiChangeModule,
                        DxoFormModule,
                        DxoColCountByScreenModule,
                        DxiItemModule,
                        DxoTabPanelOptionsModule,
                        DxiTabModule,
                        DxoButtonOptionsModule,
                        DxoPopupModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxoFilterBuilderModule,
                        DxiCustomOperationModule,
                        DxiFieldModule,
                        DxoFilterOperationDescriptionsModule,
                        DxoGroupOperationDescriptionsModule,
                        DxoFilterBuilderPopupModule,
                        DxoFilterPanelModule,
                        DxoFilterRowModule,
                        DxoOperationDescriptionsModule,
                        DxoKeyboardNavigationModule,
                        DxoLoadPanelModule,
                        DxoPagerModule,
                        DxoPagingModule,
                        DxoRemoteOperationsModule,
                        DxoRowDraggingModule,
                        DxoCursorOffsetModule,
                        DxoScrollingModule,
                        DxoSearchPanelModule,
                        DxoSortingModule,
                        DxoStateStoringModule,
                        DxoToolbarModule,
                        DxTemplateModule] });
            } exports("DxTreeListModule", DxTreeListModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTreeListModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoColumnChooserModule,
                                    DxoPositionModule,
                                    DxoAtModule,
                                    DxoBoundaryOffsetModule,
                                    DxoCollisionModule,
                                    DxoMyModule,
                                    DxoOffsetModule,
                                    DxoSearchModule,
                                    DxoSelectionModule,
                                    DxoColumnFixingModule,
                                    DxoTextsModule,
                                    DxiColumnModule,
                                    DxiButtonModule,
                                    DxoHeaderFilterModule,
                                    DxoLookupModule,
                                    DxoFormatModule,
                                    DxoFormItemModule,
                                    DxoLabelModule,
                                    DxiValidationRuleModule,
                                    DxoEditingModule,
                                    DxiChangeModule,
                                    DxoFormModule,
                                    DxoColCountByScreenModule,
                                    DxiItemModule,
                                    DxoTabPanelOptionsModule,
                                    DxiTabModule,
                                    DxoButtonOptionsModule,
                                    DxoPopupModule,
                                    DxoAnimationModule,
                                    DxoHideModule,
                                    DxoFromModule,
                                    DxoToModule,
                                    DxoShowModule,
                                    DxiToolbarItemModule,
                                    DxoFilterBuilderModule,
                                    DxiCustomOperationModule,
                                    DxiFieldModule,
                                    DxoFilterOperationDescriptionsModule,
                                    DxoGroupOperationDescriptionsModule,
                                    DxoFilterBuilderPopupModule,
                                    DxoFilterPanelModule,
                                    DxoFilterRowModule,
                                    DxoOperationDescriptionsModule,
                                    DxoKeyboardNavigationModule,
                                    DxoLoadPanelModule,
                                    DxoPagerModule,
                                    DxoPagingModule,
                                    DxoRemoteOperationsModule,
                                    DxoRowDraggingModule,
                                    DxoCursorOffsetModule,
                                    DxoScrollingModule,
                                    DxoSearchPanelModule,
                                    DxoSortingModule,
                                    DxoStateStoringModule,
                                    DxoToolbarModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxTreeListComponent
                                ],
                                exports: [
                                    DxTreeListComponent,
                                    DxoColumnChooserModule,
                                    DxoPositionModule,
                                    DxoAtModule,
                                    DxoBoundaryOffsetModule,
                                    DxoCollisionModule,
                                    DxoMyModule,
                                    DxoOffsetModule,
                                    DxoSearchModule,
                                    DxoSelectionModule,
                                    DxoColumnFixingModule,
                                    DxoTextsModule,
                                    DxiColumnModule,
                                    DxiButtonModule,
                                    DxoHeaderFilterModule,
                                    DxoLookupModule,
                                    DxoFormatModule,
                                    DxoFormItemModule,
                                    DxoLabelModule,
                                    DxiValidationRuleModule,
                                    DxoEditingModule,
                                    DxiChangeModule,
                                    DxoFormModule,
                                    DxoColCountByScreenModule,
                                    DxiItemModule,
                                    DxoTabPanelOptionsModule,
                                    DxiTabModule,
                                    DxoButtonOptionsModule,
                                    DxoPopupModule,
                                    DxoAnimationModule,
                                    DxoHideModule,
                                    DxoFromModule,
                                    DxoToModule,
                                    DxoShowModule,
                                    DxiToolbarItemModule,
                                    DxoFilterBuilderModule,
                                    DxiCustomOperationModule,
                                    DxiFieldModule,
                                    DxoFilterOperationDescriptionsModule,
                                    DxoGroupOperationDescriptionsModule,
                                    DxoFilterBuilderPopupModule,
                                    DxoFilterPanelModule,
                                    DxoFilterRowModule,
                                    DxoOperationDescriptionsModule,
                                    DxoKeyboardNavigationModule,
                                    DxoLoadPanelModule,
                                    DxoPagerModule,
                                    DxoPagingModule,
                                    DxoRemoteOperationsModule,
                                    DxoRowDraggingModule,
                                    DxoCursorOffsetModule,
                                    DxoScrollingModule,
                                    DxoSearchPanelModule,
                                    DxoSortingModule,
                                    DxoStateStoringModule,
                                    DxoToolbarModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));

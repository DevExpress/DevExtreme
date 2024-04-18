System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/pivot_grid', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxPivotGrid, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoDataSourceModule, DxiFieldModule, DxoFormatModule, DxoHeaderFilterModule, DxoStoreModule, DxoExportModule, DxoFieldChooserModule, DxoTextsModule, DxoFieldPanelModule, DxoSearchModule, DxoLoadPanelModule, DxoScrollingModule, DxoStateStoringModule;
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
            NgModule = module.NgModule;
        }, function (module) {
            DxPivotGrid = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoDataSourceModule = module.DxoDataSourceModule;
            DxiFieldModule = module.DxiFieldModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoHeaderFilterModule = module.DxoHeaderFilterModule;
            DxoStoreModule = module.DxoStoreModule;
            DxoExportModule = module.DxoExportModule;
            DxoFieldChooserModule = module.DxoFieldChooserModule;
            DxoTextsModule = module.DxoTextsModule;
            DxoFieldPanelModule = module.DxoFieldPanelModule;
            DxoSearchModule = module.DxoSearchModule;
            DxoLoadPanelModule = module.DxoLoadPanelModule;
            DxoScrollingModule = module.DxoScrollingModule;
            DxoStateStoringModule = module.DxoStateStoringModule;
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
             * The PivotGrid is a UI component that allows you to display and analyze multi-dimensional data from a local storage or an OLAP cube.

             */
            class DxPivotGridComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Allows users to expand/collapse all header items within the same header level. Ignored if the PivotGridDataSource&apos;s paginate property is true.
                
                 */
                get allowExpandAll() {
                    return this._getOption('allowExpandAll');
                }
                set allowExpandAll(value) {
                    this._setOption('allowExpandAll', value);
                }
                /**
                 * Allows a user to filter fields by selecting or deselecting values in the popup menu.
                
                 */
                get allowFiltering() {
                    return this._getOption('allowFiltering');
                }
                set allowFiltering(value) {
                    this._setOption('allowFiltering', value);
                }
                /**
                 * Allows an end user to change sorting properties.
                
                 */
                get allowSorting() {
                    return this._getOption('allowSorting');
                }
                set allowSorting(value) {
                    this._setOption('allowSorting', value);
                }
                /**
                 * Allows users to sort the pivot grid by summary values instead of field values. Ignored if the PivotGridDataSource&apos;s paginate property is true.
                
                 */
                get allowSortingBySummary() {
                    return this._getOption('allowSortingBySummary');
                }
                set allowSortingBySummary(value) {
                    this._setOption('allowSortingBySummary', value);
                }
                /**
                 * Specifies the area to which data field headers must belong.
                
                 */
                get dataFieldArea() {
                    return this._getOption('dataFieldArea');
                }
                set dataFieldArea(value) {
                    this._setOption('dataFieldArea', value);
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
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Specifies whether HTML tags are displayed as plain text or applied to cell values.
                
                 */
                get encodeHtml() {
                    return this._getOption('encodeHtml');
                }
                set encodeHtml(value) {
                    this._setOption('encodeHtml', value);
                }
                /**
                 * Configures client-side exporting.
                
                 */
                get export() {
                    return this._getOption('export');
                }
                set export(value) {
                    this._setOption('export', value);
                }
                /**
                 * The Field Chooser configuration properties.
                
                 */
                get fieldChooser() {
                    return this._getOption('fieldChooser');
                }
                set fieldChooser(value) {
                    this._setOption('fieldChooser', value);
                }
                /**
                 * Configures the field panel.
                
                 */
                get fieldPanel() {
                    return this._getOption('fieldPanel');
                }
                set fieldPanel(value) {
                    this._setOption('fieldPanel', value);
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
                 * Specifies whether or not to hide rows and columns with no data.
                
                 */
                get hideEmptySummaryCells() {
                    return this._getOption('hideEmptySummaryCells');
                }
                set hideEmptySummaryCells(value) {
                    this._setOption('hideEmptySummaryCells', value);
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
                 * Specifies properties configuring the load panel.
                
                 */
                get loadPanel() {
                    return this._getOption('loadPanel');
                }
                set loadPanel(value) {
                    this._setOption('loadPanel', value);
                }
                /**
                 * Specifies the layout of items in the row header.
                
                 */
                get rowHeaderLayout() {
                    return this._getOption('rowHeaderLayout');
                }
                set rowHeaderLayout(value) {
                    this._setOption('rowHeaderLayout', value);
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
                 * A configuration object specifying scrolling properties.
                
                 */
                get scrolling() {
                    return this._getOption('scrolling');
                }
                set scrolling(value) {
                    this._setOption('scrolling', value);
                }
                /**
                 * Specifies whether the outer borders of the grid are visible or not.
                
                 */
                get showBorders() {
                    return this._getOption('showBorders');
                }
                set showBorders(value) {
                    this._setOption('showBorders', value);
                }
                /**
                 * Specifies whether to display the Grand Total column.
                
                 */
                get showColumnGrandTotals() {
                    return this._getOption('showColumnGrandTotals');
                }
                set showColumnGrandTotals(value) {
                    this._setOption('showColumnGrandTotals', value);
                }
                /**
                 * Specifies whether to display the Total columns.
                
                 */
                get showColumnTotals() {
                    return this._getOption('showColumnTotals');
                }
                set showColumnTotals(value) {
                    this._setOption('showColumnTotals', value);
                }
                /**
                 * Specifies whether to display the Grand Total row.
                
                 */
                get showRowGrandTotals() {
                    return this._getOption('showRowGrandTotals');
                }
                set showRowGrandTotals(value) {
                    this._setOption('showRowGrandTotals', value);
                }
                /**
                 * Specifies whether to display the Total rows. Applies only if rowHeaderLayout is &apos;standard&apos;.
                
                 */
                get showRowTotals() {
                    return this._getOption('showRowTotals');
                }
                set showRowTotals(value) {
                    this._setOption('showRowTotals', value);
                }
                /**
                 * Specifies where to show the total rows or columns.
                
                 */
                get showTotalsPrior() {
                    return this._getOption('showTotalsPrior');
                }
                set showTotalsPrior(value) {
                    this._setOption('showTotalsPrior', value);
                }
                /**
                 * A configuration object specifying properties related to state storing.
                
                 */
                get stateStoring() {
                    return this._getOption('stateStoring');
                }
                set stateStoring(value) {
                    this._setOption('stateStoring', value);
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
                 * Strings that can be changed or localized in the PivotGrid UI component.
                
                 */
                get texts() {
                    return this._getOption('texts');
                }
                set texts(value) {
                    this._setOption('texts', value);
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
                 * Specifies whether long text in header items should be wrapped.
                
                 */
                get wordWrapEnabled() {
                    return this._getOption('wordWrapEnabled');
                }
                set wordWrapEnabled(value) {
                    this._setOption('wordWrapEnabled', value);
                }
                /**
                
                 * A function that is executed when a pivot grid cell is clicked or tapped.
                
                
                 */
                onCellClick;
                /**
                
                 * A function that is executed after a pivot grid cell is created.
                
                
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
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed before data is exported.
                
                
                 */
                onExporting;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowExpandAllChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowFilteringChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowSortingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowSortingBySummaryChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataFieldAreaChange;
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
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                encodeHtmlChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                exportChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                fieldChooserChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                fieldPanelChange;
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
                hideEmptySummaryCellsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                loadPanelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rowHeaderLayoutChange;
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
                showBordersChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showColumnGrandTotalsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showColumnTotalsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showRowGrandTotalsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showRowTotalsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showTotalsPriorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                stateStoringChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                textsChange;
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
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'cellClick', emit: 'onCellClick' },
                        { subscribe: 'cellPrepared', emit: 'onCellPrepared' },
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'contextMenuPreparing', emit: 'onContextMenuPreparing' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'exporting', emit: 'onExporting' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { emit: 'allowExpandAllChange' },
                        { emit: 'allowFilteringChange' },
                        { emit: 'allowSortingChange' },
                        { emit: 'allowSortingBySummaryChange' },
                        { emit: 'dataFieldAreaChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'encodeHtmlChange' },
                        { emit: 'exportChange' },
                        { emit: 'fieldChooserChange' },
                        { emit: 'fieldPanelChange' },
                        { emit: 'headerFilterChange' },
                        { emit: 'heightChange' },
                        { emit: 'hideEmptySummaryCellsChange' },
                        { emit: 'hintChange' },
                        { emit: 'loadPanelChange' },
                        { emit: 'rowHeaderLayoutChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollingChange' },
                        { emit: 'showBordersChange' },
                        { emit: 'showColumnGrandTotalsChange' },
                        { emit: 'showColumnTotalsChange' },
                        { emit: 'showRowGrandTotalsChange' },
                        { emit: 'showRowTotalsChange' },
                        { emit: 'showTotalsPriorChange' },
                        { emit: 'stateStoringChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'textsChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'wordWrapEnabledChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxPivotGrid(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxPivotGridComponent, selector: "dx-pivot-grid", inputs: { allowExpandAll: "allowExpandAll", allowFiltering: "allowFiltering", allowSorting: "allowSorting", allowSortingBySummary: "allowSortingBySummary", dataFieldArea: "dataFieldArea", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", encodeHtml: "encodeHtml", export: "export", fieldChooser: "fieldChooser", fieldPanel: "fieldPanel", headerFilter: "headerFilter", height: "height", hideEmptySummaryCells: "hideEmptySummaryCells", hint: "hint", loadPanel: "loadPanel", rowHeaderLayout: "rowHeaderLayout", rtlEnabled: "rtlEnabled", scrolling: "scrolling", showBorders: "showBorders", showColumnGrandTotals: "showColumnGrandTotals", showColumnTotals: "showColumnTotals", showRowGrandTotals: "showRowGrandTotals", showRowTotals: "showRowTotals", showTotalsPrior: "showTotalsPrior", stateStoring: "stateStoring", tabIndex: "tabIndex", texts: "texts", visible: "visible", width: "width", wordWrapEnabled: "wordWrapEnabled" }, outputs: { onCellClick: "onCellClick", onCellPrepared: "onCellPrepared", onContentReady: "onContentReady", onContextMenuPreparing: "onContextMenuPreparing", onDisposing: "onDisposing", onExporting: "onExporting", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", allowExpandAllChange: "allowExpandAllChange", allowFilteringChange: "allowFilteringChange", allowSortingChange: "allowSortingChange", allowSortingBySummaryChange: "allowSortingBySummaryChange", dataFieldAreaChange: "dataFieldAreaChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", encodeHtmlChange: "encodeHtmlChange", exportChange: "exportChange", fieldChooserChange: "fieldChooserChange", fieldPanelChange: "fieldPanelChange", headerFilterChange: "headerFilterChange", heightChange: "heightChange", hideEmptySummaryCellsChange: "hideEmptySummaryCellsChange", hintChange: "hintChange", loadPanelChange: "loadPanelChange", rowHeaderLayoutChange: "rowHeaderLayoutChange", rtlEnabledChange: "rtlEnabledChange", scrollingChange: "scrollingChange", showBordersChange: "showBordersChange", showColumnGrandTotalsChange: "showColumnGrandTotalsChange", showColumnTotalsChange: "showColumnTotalsChange", showRowGrandTotalsChange: "showRowGrandTotalsChange", showRowTotalsChange: "showRowTotalsChange", showTotalsPriorChange: "showTotalsPriorChange", stateStoringChange: "stateStoringChange", tabIndexChange: "tabIndexChange", textsChange: "textsChange", visibleChange: "visibleChange", widthChange: "widthChange", wordWrapEnabledChange: "wordWrapEnabledChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxPivotGridComponent", DxPivotGridComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-pivot-grid',
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
                            }] }], propDecorators: { allowExpandAll: [{
                            type: Input
                        }], allowFiltering: [{
                            type: Input
                        }], allowSorting: [{
                            type: Input
                        }], allowSortingBySummary: [{
                            type: Input
                        }], dataFieldArea: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], encodeHtml: [{
                            type: Input
                        }], export: [{
                            type: Input
                        }], fieldChooser: [{
                            type: Input
                        }], fieldPanel: [{
                            type: Input
                        }], headerFilter: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hideEmptySummaryCells: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], loadPanel: [{
                            type: Input
                        }], rowHeaderLayout: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrolling: [{
                            type: Input
                        }], showBorders: [{
                            type: Input
                        }], showColumnGrandTotals: [{
                            type: Input
                        }], showColumnTotals: [{
                            type: Input
                        }], showRowGrandTotals: [{
                            type: Input
                        }], showRowTotals: [{
                            type: Input
                        }], showTotalsPrior: [{
                            type: Input
                        }], stateStoring: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], texts: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], wordWrapEnabled: [{
                            type: Input
                        }], onCellClick: [{
                            type: Output
                        }], onCellPrepared: [{
                            type: Output
                        }], onContentReady: [{
                            type: Output
                        }], onContextMenuPreparing: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onExporting: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], allowExpandAllChange: [{
                            type: Output
                        }], allowFilteringChange: [{
                            type: Output
                        }], allowSortingChange: [{
                            type: Output
                        }], allowSortingBySummaryChange: [{
                            type: Output
                        }], dataFieldAreaChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], encodeHtmlChange: [{
                            type: Output
                        }], exportChange: [{
                            type: Output
                        }], fieldChooserChange: [{
                            type: Output
                        }], fieldPanelChange: [{
                            type: Output
                        }], headerFilterChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hideEmptySummaryCellsChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], loadPanelChange: [{
                            type: Output
                        }], rowHeaderLayoutChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scrollingChange: [{
                            type: Output
                        }], showBordersChange: [{
                            type: Output
                        }], showColumnGrandTotalsChange: [{
                            type: Output
                        }], showColumnTotalsChange: [{
                            type: Output
                        }], showRowGrandTotalsChange: [{
                            type: Output
                        }], showRowTotalsChange: [{
                            type: Output
                        }], showTotalsPriorChange: [{
                            type: Output
                        }], stateStoringChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], textsChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], wordWrapEnabledChange: [{
                            type: Output
                        }] } });
            class DxPivotGridModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridModule, declarations: [DxPivotGridComponent], imports: [DxoDataSourceModule,
                        DxiFieldModule,
                        DxoFormatModule,
                        DxoHeaderFilterModule,
                        DxoStoreModule,
                        DxoExportModule,
                        DxoFieldChooserModule,
                        DxoTextsModule,
                        DxoFieldPanelModule,
                        DxoSearchModule,
                        DxoLoadPanelModule,
                        DxoScrollingModule,
                        DxoStateStoringModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxPivotGridComponent, DxoDataSourceModule,
                        DxiFieldModule,
                        DxoFormatModule,
                        DxoHeaderFilterModule,
                        DxoStoreModule,
                        DxoExportModule,
                        DxoFieldChooserModule,
                        DxoTextsModule,
                        DxoFieldPanelModule,
                        DxoSearchModule,
                        DxoLoadPanelModule,
                        DxoScrollingModule,
                        DxoStateStoringModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridModule, imports: [DxoDataSourceModule,
                        DxiFieldModule,
                        DxoFormatModule,
                        DxoHeaderFilterModule,
                        DxoStoreModule,
                        DxoExportModule,
                        DxoFieldChooserModule,
                        DxoTextsModule,
                        DxoFieldPanelModule,
                        DxoSearchModule,
                        DxoLoadPanelModule,
                        DxoScrollingModule,
                        DxoStateStoringModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoDataSourceModule,
                        DxiFieldModule,
                        DxoFormatModule,
                        DxoHeaderFilterModule,
                        DxoStoreModule,
                        DxoExportModule,
                        DxoFieldChooserModule,
                        DxoTextsModule,
                        DxoFieldPanelModule,
                        DxoSearchModule,
                        DxoLoadPanelModule,
                        DxoScrollingModule,
                        DxoStateStoringModule,
                        DxTemplateModule] });
            } exports("DxPivotGridModule", DxPivotGridModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxPivotGridModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoDataSourceModule,
                                    DxiFieldModule,
                                    DxoFormatModule,
                                    DxoHeaderFilterModule,
                                    DxoStoreModule,
                                    DxoExportModule,
                                    DxoFieldChooserModule,
                                    DxoTextsModule,
                                    DxoFieldPanelModule,
                                    DxoSearchModule,
                                    DxoLoadPanelModule,
                                    DxoScrollingModule,
                                    DxoStateStoringModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxPivotGridComponent
                                ],
                                exports: [
                                    DxPivotGridComponent,
                                    DxoDataSourceModule,
                                    DxiFieldModule,
                                    DxoFormatModule,
                                    DxoHeaderFilterModule,
                                    DxoStoreModule,
                                    DxoExportModule,
                                    DxoFieldChooserModule,
                                    DxoTextsModule,
                                    DxoFieldPanelModule,
                                    DxoSearchModule,
                                    DxoLoadPanelModule,
                                    DxoScrollingModule,
                                    DxoStateStoringModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));

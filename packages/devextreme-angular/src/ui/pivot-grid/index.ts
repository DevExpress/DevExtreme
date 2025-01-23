/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges
} from '@angular/core';


import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { PivotGridDataFieldArea, CellClickEvent, CellPreparedEvent, ContentReadyEvent, ContextMenuPreparingEvent, DisposingEvent, ExportingEvent, InitializedEvent, OptionChangedEvent, PivotGridRowHeaderLayout, PivotGridTotalDisplayMode } from 'devextreme/ui/pivot_grid';
import { PivotGridDataSourceOptions } from 'devextreme/ui/pivot_grid/data_source';
import { ApplyChangesMode, HeaderFilterSearchConfig, StateStoreType } from 'devextreme/common/grids';
import { FieldChooserLayout, ScrollMode, Mode } from 'devextreme/common';

import DxPivotGrid from 'devextreme/ui/pivot_grid';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxoFieldChooserModule } from 'devextreme-angular/ui/nested';
import { DxoTextsModule } from 'devextreme-angular/ui/nested';
import { DxoFieldPanelModule } from 'devextreme-angular/ui/nested';
import { DxoHeaderFilterModule } from 'devextreme-angular/ui/nested';
import { DxoSearchModule } from 'devextreme-angular/ui/nested';
import { DxoLoadPanelModule } from 'devextreme-angular/ui/nested';
import { DxoScrollingModule } from 'devextreme-angular/ui/nested';
import { DxoStateStoringModule } from 'devextreme-angular/ui/nested';

import { DxoPivotGridExportModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridFieldChooserModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridFieldChooserTextsModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridFieldPanelModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridFieldPanelTextsModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridHeaderFilterModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridHeaderFilterTextsModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridLoadPanelModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridPivotGridTextsModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridScrollingModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridSearchModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridStateStoringModule } from 'devextreme-angular/ui/pivot-grid/nested';
import { DxoPivotGridTextsModule } from 'devextreme-angular/ui/pivot-grid/nested';




/**
 * [descr:dxPivotGrid]

 */
@Component({
    selector: 'dx-pivot-grid',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxPivotGridComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxPivotGrid = null;

    /**
     * [descr:dxPivotGridOptions.allowExpandAll]
    
     */
    @Input()
    get allowExpandAll(): boolean {
        return this._getOption('allowExpandAll');
    }
    set allowExpandAll(value: boolean) {
        this._setOption('allowExpandAll', value);
    }


    /**
     * [descr:dxPivotGridOptions.allowFiltering]
    
     */
    @Input()
    get allowFiltering(): boolean {
        return this._getOption('allowFiltering');
    }
    set allowFiltering(value: boolean) {
        this._setOption('allowFiltering', value);
    }


    /**
     * [descr:dxPivotGridOptions.allowSorting]
    
     */
    @Input()
    get allowSorting(): boolean {
        return this._getOption('allowSorting');
    }
    set allowSorting(value: boolean) {
        this._setOption('allowSorting', value);
    }


    /**
     * [descr:dxPivotGridOptions.allowSortingBySummary]
    
     */
    @Input()
    get allowSortingBySummary(): boolean {
        return this._getOption('allowSortingBySummary');
    }
    set allowSortingBySummary(value: boolean) {
        this._setOption('allowSortingBySummary', value);
    }


    /**
     * [descr:dxPivotGridOptions.dataFieldArea]
    
     */
    @Input()
    get dataFieldArea(): PivotGridDataFieldArea {
        return this._getOption('dataFieldArea');
    }
    set dataFieldArea(value: PivotGridDataFieldArea) {
        this._setOption('dataFieldArea', value);
    }


    /**
     * [descr:dxPivotGridOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<any> | null | PivotGridDataSource | PivotGridDataSourceOptions {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | null | PivotGridDataSource | PivotGridDataSourceOptions) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:WidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxPivotGridOptions.encodeHtml]
    
     */
    @Input()
    get encodeHtml(): boolean {
        return this._getOption('encodeHtml');
    }
    set encodeHtml(value: boolean) {
        this._setOption('encodeHtml', value);
    }


    /**
     * [descr:dxPivotGridOptions.export]
    
     */
    @Input()
    get export(): { enabled?: boolean } {
        return this._getOption('export');
    }
    set export(value: { enabled?: boolean }) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxPivotGridOptions.fieldChooser]
    
     */
    @Input()
    get fieldChooser(): { allowSearch?: boolean, applyChangesMode?: ApplyChangesMode, enabled?: boolean, height?: number, layout?: FieldChooserLayout, searchTimeout?: number, texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }, title?: string, width?: number } {
        return this._getOption('fieldChooser');
    }
    set fieldChooser(value: { allowSearch?: boolean, applyChangesMode?: ApplyChangesMode, enabled?: boolean, height?: number, layout?: FieldChooserLayout, searchTimeout?: number, texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }, title?: string, width?: number }) {
        this._setOption('fieldChooser', value);
    }


    /**
     * [descr:dxPivotGridOptions.fieldPanel]
    
     */
    @Input()
    get fieldPanel(): { allowFieldDragging?: boolean, showColumnFields?: boolean, showDataFields?: boolean, showFilterFields?: boolean, showRowFields?: boolean, texts?: { columnFieldArea?: string, dataFieldArea?: string, filterFieldArea?: string, rowFieldArea?: string }, visible?: boolean } {
        return this._getOption('fieldPanel');
    }
    set fieldPanel(value: { allowFieldDragging?: boolean, showColumnFields?: boolean, showDataFields?: boolean, showFilterFields?: boolean, showRowFields?: boolean, texts?: { columnFieldArea?: string, dataFieldArea?: string, filterFieldArea?: string, rowFieldArea?: string }, visible?: boolean }) {
        this._setOption('fieldPanel', value);
    }


    /**
     * [descr:dxPivotGridOptions.headerFilter]
    
     */
    @Input()
    get headerFilter(): { allowSearch?: boolean, allowSelectAll?: boolean, height?: number, search?: HeaderFilterSearchConfig, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number } {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: { allowSearch?: boolean, allowSelectAll?: boolean, height?: number, search?: HeaderFilterSearchConfig, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number }) {
        this._setOption('headerFilter', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
        this._setOption('height', value);
    }


    /**
     * [descr:dxPivotGridOptions.hideEmptySummaryCells]
    
     */
    @Input()
    get hideEmptySummaryCells(): boolean {
        return this._getOption('hideEmptySummaryCells');
    }
    set hideEmptySummaryCells(value: boolean) {
        this._setOption('hideEmptySummaryCells', value);
    }


    /**
     * [descr:WidgetOptions.hint]
    
     */
    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }


    /**
     * [descr:dxPivotGridOptions.loadPanel]
    
     */
    @Input()
    get loadPanel(): { enabled?: boolean, height?: number, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number } {
        return this._getOption('loadPanel');
    }
    set loadPanel(value: { enabled?: boolean, height?: number, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number }) {
        this._setOption('loadPanel', value);
    }


    /**
     * [descr:dxPivotGridOptions.rowHeaderLayout]
    
     */
    @Input()
    get rowHeaderLayout(): PivotGridRowHeaderLayout {
        return this._getOption('rowHeaderLayout');
    }
    set rowHeaderLayout(value: PivotGridRowHeaderLayout) {
        this._setOption('rowHeaderLayout', value);
    }


    /**
     * [descr:DOMComponentOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxPivotGridOptions.scrolling]
    
     */
    @Input()
    get scrolling(): { mode?: ScrollMode, useNative?: boolean | Mode } {
        return this._getOption('scrolling');
    }
    set scrolling(value: { mode?: ScrollMode, useNative?: boolean | Mode }) {
        this._setOption('scrolling', value);
    }


    /**
     * [descr:dxPivotGridOptions.showBorders]
    
     */
    @Input()
    get showBorders(): boolean {
        return this._getOption('showBorders');
    }
    set showBorders(value: boolean) {
        this._setOption('showBorders', value);
    }


    /**
     * [descr:dxPivotGridOptions.showColumnGrandTotals]
    
     */
    @Input()
    get showColumnGrandTotals(): boolean {
        return this._getOption('showColumnGrandTotals');
    }
    set showColumnGrandTotals(value: boolean) {
        this._setOption('showColumnGrandTotals', value);
    }


    /**
     * [descr:dxPivotGridOptions.showColumnTotals]
    
     */
    @Input()
    get showColumnTotals(): boolean {
        return this._getOption('showColumnTotals');
    }
    set showColumnTotals(value: boolean) {
        this._setOption('showColumnTotals', value);
    }


    /**
     * [descr:dxPivotGridOptions.showRowGrandTotals]
    
     */
    @Input()
    get showRowGrandTotals(): boolean {
        return this._getOption('showRowGrandTotals');
    }
    set showRowGrandTotals(value: boolean) {
        this._setOption('showRowGrandTotals', value);
    }


    /**
     * [descr:dxPivotGridOptions.showRowTotals]
    
     */
    @Input()
    get showRowTotals(): boolean {
        return this._getOption('showRowTotals');
    }
    set showRowTotals(value: boolean) {
        this._setOption('showRowTotals', value);
    }


    /**
     * [descr:dxPivotGridOptions.showTotalsPrior]
    
     */
    @Input()
    get showTotalsPrior(): PivotGridTotalDisplayMode {
        return this._getOption('showTotalsPrior');
    }
    set showTotalsPrior(value: PivotGridTotalDisplayMode) {
        this._setOption('showTotalsPrior', value);
    }


    /**
     * [descr:dxPivotGridOptions.stateStoring]
    
     */
    @Input()
    get stateStoring(): { customLoad?: Function, customSave?: ((state: any) => void), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: StateStoreType } {
        return this._getOption('stateStoring');
    }
    set stateStoring(value: { customLoad?: Function, customSave?: ((state: any) => void), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: StateStoreType }) {
        this._setOption('stateStoring', value);
    }


    /**
     * [descr:WidgetOptions.tabIndex]
    
     */
    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }


    /**
     * [descr:dxPivotGridOptions.texts]
    
     */
    @Input()
    get texts(): { collapseAll?: string, dataNotAvailable?: string, expandAll?: string, exportToExcel?: string, grandTotal?: string, noData?: string, removeAllSorting?: string, showFieldChooser?: string, sortColumnBySummary?: string, sortRowBySummary?: string, total?: string } {
        return this._getOption('texts');
    }
    set texts(value: { collapseAll?: string, dataNotAvailable?: string, expandAll?: string, exportToExcel?: string, grandTotal?: string, noData?: string, removeAllSorting?: string, showFieldChooser?: string, sortColumnBySummary?: string, sortRowBySummary?: string, total?: string }) {
        this._setOption('texts', value);
    }


    /**
     * [descr:WidgetOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }


    /**
     * [descr:dxPivotGridOptions.wordWrapEnabled]
    
     */
    @Input()
    get wordWrapEnabled(): boolean {
        return this._getOption('wordWrapEnabled');
    }
    set wordWrapEnabled(value: boolean) {
        this._setOption('wordWrapEnabled', value);
    }

    /**
    
     * [descr:dxPivotGridOptions.onCellClick]
    
    
     */
    @Output() onCellClick: EventEmitter<CellClickEvent>;

    /**
    
     * [descr:dxPivotGridOptions.onCellPrepared]
    
    
     */
    @Output() onCellPrepared: EventEmitter<CellPreparedEvent>;

    /**
    
     * [descr:dxPivotGridOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxPivotGridOptions.onContextMenuPreparing]
    
    
     */
    @Output() onContextMenuPreparing: EventEmitter<ContextMenuPreparingEvent>;

    /**
    
     * [descr:dxPivotGridOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxPivotGridOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxPivotGridOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxPivotGridOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowExpandAllChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowFilteringChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowSortingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowSortingBySummaryChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataFieldAreaChange: EventEmitter<PivotGridDataFieldArea>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<any> | null | PivotGridDataSource | PivotGridDataSourceOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() encodeHtmlChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() exportChange: EventEmitter<{ enabled?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() fieldChooserChange: EventEmitter<{ allowSearch?: boolean, applyChangesMode?: ApplyChangesMode, enabled?: boolean, height?: number, layout?: FieldChooserLayout, searchTimeout?: number, texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }, title?: string, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() fieldPanelChange: EventEmitter<{ allowFieldDragging?: boolean, showColumnFields?: boolean, showDataFields?: boolean, showFilterFields?: boolean, showRowFields?: boolean, texts?: { columnFieldArea?: string, dataFieldArea?: string, filterFieldArea?: string, rowFieldArea?: string }, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() headerFilterChange: EventEmitter<{ allowSearch?: boolean, allowSelectAll?: boolean, height?: number, search?: HeaderFilterSearchConfig, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hideEmptySummaryCellsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hintChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadPanelChange: EventEmitter<{ enabled?: boolean, height?: number, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rowHeaderLayoutChange: EventEmitter<PivotGridRowHeaderLayout>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollingChange: EventEmitter<{ mode?: ScrollMode, useNative?: boolean | Mode }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showBordersChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showColumnGrandTotalsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showColumnTotalsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showRowGrandTotalsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showRowTotalsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showTotalsPriorChange: EventEmitter<PivotGridTotalDisplayMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stateStoringChange: EventEmitter<{ customLoad?: Function, customSave?: ((state: any) => void), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: StateStoreType }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() textsChange: EventEmitter<{ collapseAll?: string, dataNotAvailable?: string, expandAll?: string, exportToExcel?: string, grandTotal?: string, noData?: string, removeAllSorting?: string, showFieldChooser?: string, sortColumnBySummary?: string, sortRowBySummary?: string, total?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() wordWrapEnabledChange: EventEmitter<boolean>;








    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

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

    protected _createInstance(element, options) {

        return new DxPivotGrid(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
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

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
  imports: [
    DxoExportModule,
    DxoFieldChooserModule,
    DxoTextsModule,
    DxoFieldPanelModule,
    DxoHeaderFilterModule,
    DxoSearchModule,
    DxoLoadPanelModule,
    DxoScrollingModule,
    DxoStateStoringModule,
    DxoPivotGridExportModule,
    DxoPivotGridFieldChooserModule,
    DxoPivotGridFieldChooserTextsModule,
    DxoPivotGridFieldPanelModule,
    DxoPivotGridFieldPanelTextsModule,
    DxoPivotGridHeaderFilterModule,
    DxoPivotGridHeaderFilterTextsModule,
    DxoPivotGridLoadPanelModule,
    DxoPivotGridPivotGridTextsModule,
    DxoPivotGridScrollingModule,
    DxoPivotGridSearchModule,
    DxoPivotGridStateStoringModule,
    DxoPivotGridTextsModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxPivotGridComponent
  ],
  exports: [
    DxPivotGridComponent,
    DxoExportModule,
    DxoFieldChooserModule,
    DxoTextsModule,
    DxoFieldPanelModule,
    DxoHeaderFilterModule,
    DxoSearchModule,
    DxoLoadPanelModule,
    DxoScrollingModule,
    DxoStateStoringModule,
    DxoPivotGridExportModule,
    DxoPivotGridFieldChooserModule,
    DxoPivotGridFieldChooserTextsModule,
    DxoPivotGridFieldPanelModule,
    DxoPivotGridFieldPanelTextsModule,
    DxoPivotGridHeaderFilterModule,
    DxoPivotGridHeaderFilterTextsModule,
    DxoPivotGridLoadPanelModule,
    DxoPivotGridPivotGridTextsModule,
    DxoPivotGridScrollingModule,
    DxoPivotGridSearchModule,
    DxoPivotGridStateStoringModule,
    DxoPivotGridTextsModule,
    DxTemplateModule
  ]
})
export class DxPivotGridModule { }

import type * as DxPivotGridTypes from "devextreme/ui/pivot_grid_types";
export { DxPivotGridTypes };



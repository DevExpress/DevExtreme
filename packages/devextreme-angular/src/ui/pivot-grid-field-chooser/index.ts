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
import { ApplyChangesMode, HeaderFilterSearchConfig } from 'devextreme/common/grids';
import { FieldChooserLayout } from 'devextreme/common';
import { ContentReadyEvent, ContextMenuPreparingEvent, DisposingEvent, InitializedEvent, OptionChangedEvent } from 'devextreme/ui/pivot_grid_field_chooser';

import DxPivotGridFieldChooser from 'devextreme/ui/pivot_grid_field_chooser';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoHeaderFilterModule } from 'devextreme-angular/ui/nested';
import { DxoSearchModule } from 'devextreme-angular/ui/nested';
import { DxoTextsModule } from 'devextreme-angular/ui/nested';

import { DxoPivotGridFieldChooserHeaderFilterModule } from 'devextreme-angular/ui/pivot-grid-field-chooser/nested';
import { DxoPivotGridFieldChooserHeaderFilterTextsModule } from 'devextreme-angular/ui/pivot-grid-field-chooser/nested';
import { DxoPivotGridFieldChooserPivotGridFieldChooserTextsModule } from 'devextreme-angular/ui/pivot-grid-field-chooser/nested';
import { DxoPivotGridFieldChooserSearchModule } from 'devextreme-angular/ui/pivot-grid-field-chooser/nested';
import { DxoPivotGridFieldChooserTextsModule } from 'devextreme-angular/ui/pivot-grid-field-chooser/nested';




/**
 * [descr:dxPivotGridFieldChooser]

 */
@Component({
    selector: 'dx-pivot-grid-field-chooser',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxPivotGridFieldChooserComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxPivotGridFieldChooser = null;

    /**
     * [descr:WidgetOptions.accessKey]
    
     */
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }


    /**
     * [descr:WidgetOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxPivotGridFieldChooserOptions.allowSearch]
    
     */
    @Input()
    get allowSearch(): boolean {
        return this._getOption('allowSearch');
    }
    set allowSearch(value: boolean) {
        this._setOption('allowSearch', value);
    }


    /**
     * [descr:dxPivotGridFieldChooserOptions.applyChangesMode]
    
     */
    @Input()
    get applyChangesMode(): ApplyChangesMode {
        return this._getOption('applyChangesMode');
    }
    set applyChangesMode(value: ApplyChangesMode) {
        this._setOption('applyChangesMode', value);
    }


    /**
     * [descr:dxPivotGridFieldChooserOptions.dataSource]
    
     */
    @Input()
    get dataSource(): null | PivotGridDataSource {
        return this._getOption('dataSource');
    }
    set dataSource(value: null | PivotGridDataSource) {
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
     * [descr:dxPivotGridFieldChooserOptions.encodeHtml]
    
     */
    @Input()
    get encodeHtml(): boolean {
        return this._getOption('encodeHtml');
    }
    set encodeHtml(value: boolean) {
        this._setOption('encodeHtml', value);
    }


    /**
     * [descr:WidgetOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxPivotGridFieldChooserOptions.headerFilter]
    
     */
    @Input()
    get headerFilter(): { allowSearch?: boolean, allowSelectAll?: boolean, height?: number, search?: HeaderFilterSearchConfig, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number } {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: { allowSearch?: boolean, allowSelectAll?: boolean, height?: number, search?: HeaderFilterSearchConfig, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number }) {
        this._setOption('headerFilter', value);
    }


    /**
     * [descr:dxPivotGridFieldChooserOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
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
     * [descr:WidgetOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxPivotGridFieldChooserOptions.layout]
    
     */
    @Input()
    get layout(): FieldChooserLayout {
        return this._getOption('layout');
    }
    set layout(value: FieldChooserLayout) {
        this._setOption('layout', value);
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
     * [descr:dxPivotGridFieldChooserOptions.searchTimeout]
    
     */
    @Input()
    get searchTimeout(): number {
        return this._getOption('searchTimeout');
    }
    set searchTimeout(value: number) {
        this._setOption('searchTimeout', value);
    }


    /**
     * [descr:dxPivotGridFieldChooserOptions.state]
    
     */
    @Input()
    get state(): any {
        return this._getOption('state');
    }
    set state(value: any) {
        this._setOption('state', value);
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
     * [descr:dxPivotGridFieldChooserOptions.texts]
    
     */
    @Input()
    get texts(): { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string } {
        return this._getOption('texts');
    }
    set texts(value: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }) {
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
    
     * [descr:dxPivotGridFieldChooserOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxPivotGridFieldChooserOptions.onContextMenuPreparing]
    
    
     */
    @Output() onContextMenuPreparing: EventEmitter<ContextMenuPreparingEvent>;

    /**
    
     * [descr:dxPivotGridFieldChooserOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxPivotGridFieldChooserOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxPivotGridFieldChooserOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() activeStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowSearchChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() applyChangesModeChange: EventEmitter<ApplyChangesMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<null | PivotGridDataSource>;

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
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() headerFilterChange: EventEmitter<{ allowSearch?: boolean, allowSelectAll?: boolean, height?: number, search?: HeaderFilterSearchConfig, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hintChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() layoutChange: EventEmitter<FieldChooserLayout>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchTimeoutChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() textsChange: EventEmitter<{ allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;








    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'contextMenuPreparing', emit: 'onContextMenuPreparing' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'allowSearchChange' },
            { emit: 'applyChangesModeChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'encodeHtmlChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'headerFilterChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'layoutChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'searchTimeoutChange' },
            { emit: 'stateChange' },
            { emit: 'tabIndexChange' },
            { emit: 'textsChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxPivotGridFieldChooser(element, options);
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
    DxoHeaderFilterModule,
    DxoSearchModule,
    DxoTextsModule,
    DxoPivotGridFieldChooserHeaderFilterModule,
    DxoPivotGridFieldChooserHeaderFilterTextsModule,
    DxoPivotGridFieldChooserPivotGridFieldChooserTextsModule,
    DxoPivotGridFieldChooserSearchModule,
    DxoPivotGridFieldChooserTextsModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxPivotGridFieldChooserComponent
  ],
  exports: [
    DxPivotGridFieldChooserComponent,
    DxoHeaderFilterModule,
    DxoSearchModule,
    DxoTextsModule,
    DxoPivotGridFieldChooserHeaderFilterModule,
    DxoPivotGridFieldChooserHeaderFilterTextsModule,
    DxoPivotGridFieldChooserPivotGridFieldChooserTextsModule,
    DxoPivotGridFieldChooserSearchModule,
    DxoPivotGridFieldChooserTextsModule,
    DxTemplateModule
  ]
})
export class DxPivotGridFieldChooserModule { }

import type * as DxPivotGridFieldChooserTypes from "devextreme/ui/pivot_grid_field_chooser_types";
export { DxPivotGridFieldChooserTypes };



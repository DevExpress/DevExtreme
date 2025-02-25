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
    forwardRef,
    HostListener,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';


import { dxFilterBuilderCustomOperation, dxFilterBuilderField, GroupOperation, ContentReadyEvent, DisposingEvent, EditorPreparedEvent, EditorPreparingEvent, InitializedEvent, OptionChangedEvent, ValueChangedEvent } from 'devextreme/ui/filter_builder';

import DxFilterBuilder from 'devextreme/ui/filter_builder';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxiCustomOperationModule } from 'devextreme-angular/ui/nested';
import { DxiFieldModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoLookupModule } from 'devextreme-angular/ui/nested';
import { DxoFilterOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoGroupOperationDescriptionsModule } from 'devextreme-angular/ui/nested';

import { DxiFilterBuilderCustomOperationModule } from 'devextreme-angular/ui/filter-builder/nested';
import { DxiFilterBuilderFieldModule } from 'devextreme-angular/ui/filter-builder/nested';
import { DxoFilterBuilderFilterOperationDescriptionsModule } from 'devextreme-angular/ui/filter-builder/nested';
import { DxoFilterBuilderFormatModule } from 'devextreme-angular/ui/filter-builder/nested';
import { DxoFilterBuilderGroupOperationDescriptionsModule } from 'devextreme-angular/ui/filter-builder/nested';
import { DxoFilterBuilderLookupModule } from 'devextreme-angular/ui/filter-builder/nested';

import { DxiCustomOperationComponent } from 'devextreme-angular/ui/nested';
import { DxiFieldComponent } from 'devextreme-angular/ui/nested';

import { DxiFilterBuilderCustomOperationComponent } from 'devextreme-angular/ui/filter-builder/nested';
import { DxiFilterBuilderFieldComponent } from 'devextreme-angular/ui/filter-builder/nested';



const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DxFilterBuilderComponent),
    multi: true
};
/**
 * [descr:dxFilterBuilder]

 */
@Component({
    selector: 'dx-filter-builder',
    template: '',
    host: { ngSkipHydration: 'true' },
    providers: [
        DxTemplateHost,
        WatcherHelper,
        CUSTOM_VALUE_ACCESSOR_PROVIDER,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxFilterBuilderComponent extends DxComponent implements OnDestroy, ControlValueAccessor, OnChanges, DoCheck {
    instance: DxFilterBuilder = null;

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
     * [descr:dxFilterBuilderOptions.allowHierarchicalFields]
    
     */
    @Input()
    get allowHierarchicalFields(): boolean {
        return this._getOption('allowHierarchicalFields');
    }
    set allowHierarchicalFields(value: boolean) {
        this._setOption('allowHierarchicalFields', value);
    }


    /**
     * [descr:dxFilterBuilderOptions.customOperations]
    
     */
    @Input()
    get customOperations(): Array<dxFilterBuilderCustomOperation> {
        return this._getOption('customOperations');
    }
    set customOperations(value: Array<dxFilterBuilderCustomOperation>) {
        this._setOption('customOperations', value);
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
     * [descr:dxFilterBuilderOptions.fields]
    
     */
    @Input()
    get fields(): Array<dxFilterBuilderField> {
        return this._getOption('fields');
    }
    set fields(value: Array<dxFilterBuilderField>) {
        this._setOption('fields', value);
    }


    /**
     * [descr:dxFilterBuilderOptions.filterOperationDescriptions]
    
     */
    @Input()
    get filterOperationDescriptions(): { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string } {
        return this._getOption('filterOperationDescriptions');
    }
    set filterOperationDescriptions(value: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }) {
        this._setOption('filterOperationDescriptions', value);
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
     * [descr:dxFilterBuilderOptions.groupOperationDescriptions]
    
     */
    @Input()
    get groupOperationDescriptions(): { and?: string, notAnd?: string, notOr?: string, or?: string } {
        return this._getOption('groupOperationDescriptions');
    }
    set groupOperationDescriptions(value: { and?: string, notAnd?: string, notOr?: string, or?: string }) {
        this._setOption('groupOperationDescriptions', value);
    }


    /**
     * [descr:dxFilterBuilderOptions.groupOperations]
    
     */
    @Input()
    get groupOperations(): Array<GroupOperation> {
        return this._getOption('groupOperations');
    }
    set groupOperations(value: Array<GroupOperation>) {
        this._setOption('groupOperations', value);
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
     * [descr:dxFilterBuilderOptions.maxGroupLevel]
    
     */
    @Input()
    get maxGroupLevel(): number | undefined {
        return this._getOption('maxGroupLevel');
    }
    set maxGroupLevel(value: number | undefined) {
        this._setOption('maxGroupLevel', value);
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
     * [descr:dxFilterBuilderOptions.value]
    
     */
    @Input()
    get value(): Array<any> | Function | string {
        return this._getOption('value');
    }
    set value(value: Array<any> | Function | string) {
        this._setOption('value', value);
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
    
     * [descr:dxFilterBuilderOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxFilterBuilderOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxFilterBuilderOptions.onEditorPrepared]
    
    
     */
    @Output() onEditorPrepared: EventEmitter<EditorPreparedEvent>;

    /**
    
     * [descr:dxFilterBuilderOptions.onEditorPreparing]
    
    
     */
    @Output() onEditorPreparing: EventEmitter<EditorPreparingEvent>;

    /**
    
     * [descr:dxFilterBuilderOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxFilterBuilderOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxFilterBuilderOptions.onValueChanged]
    
    
     */
    @Output() onValueChanged: EventEmitter<ValueChangedEvent>;

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
    @Output() allowHierarchicalFieldsChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customOperationsChange: EventEmitter<Array<dxFilterBuilderCustomOperation>>;

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
    @Output() fieldsChange: EventEmitter<Array<dxFilterBuilderField>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterOperationDescriptionsChange: EventEmitter<{ between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupOperationDescriptionsChange: EventEmitter<{ and?: string, notAnd?: string, notOr?: string, or?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupOperationsChange: EventEmitter<Array<GroupOperation>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

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
    @Output() maxGroupLevelChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<Array<any> | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onBlur: EventEmitter<any>;


    @HostListener('valueChange', ['$event']) change(_) { }
    @HostListener('onBlur', ['$event']) touched = (_) => {};


    @ContentChildren(DxiFilterBuilderCustomOperationComponent)
    get customOperationsChildren(): QueryList<DxiFilterBuilderCustomOperationComponent> {
        return this._getOption('customOperations');
    }
    set customOperationsChildren(value) {
        this._setChildren('customOperations', value, 'DxiFilterBuilderCustomOperationComponent');
    }

    @ContentChildren(DxiFilterBuilderFieldComponent)
    get fieldsChildren(): QueryList<DxiFilterBuilderFieldComponent> {
        return this._getOption('fields');
    }
    set fieldsChildren(value) {
        this._setChildren('fields', value, 'DxiFilterBuilderFieldComponent');
    }


    @ContentChildren(DxiCustomOperationComponent)
    get customOperationsLegacyChildren(): QueryList<DxiCustomOperationComponent> {
        return this._getOption('customOperations');
    }
    set customOperationsLegacyChildren(value) {
        this._setChildren('customOperations', value, 'DxiCustomOperationComponent');
    }

    @ContentChildren(DxiFieldComponent)
    get fieldsLegacyChildren(): QueryList<DxiFieldComponent> {
        return this._getOption('fields');
    }
    set fieldsLegacyChildren(value) {
        this._setChildren('fields', value, 'DxiFieldComponent');
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'editorPrepared', emit: 'onEditorPrepared' },
            { subscribe: 'editorPreparing', emit: 'onEditorPreparing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'valueChanged', emit: 'onValueChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'allowHierarchicalFieldsChange' },
            { emit: 'customOperationsChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'fieldsChange' },
            { emit: 'filterOperationDescriptionsChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'groupOperationDescriptionsChange' },
            { emit: 'groupOperationsChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'maxGroupLevelChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'tabIndexChange' },
            { emit: 'valueChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'onBlur' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxFilterBuilder(element, options);
    }


    writeValue(value: any): void {
        this.eventHelper.lockedValueChangeEvent = true;
        this.value = value;
        this.eventHelper.lockedValueChangeEvent = false;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    registerOnChange(fn: (_: any) => void): void { this.change = fn; }
    registerOnTouched(fn: () => void): void { this.touched = fn; }

    _createWidget(element: any) {
        super._createWidget(element);
        this.instance.on('focusOut', (e) => {
            this.eventHelper.fireNgEvent('onBlur', [e]);
        });
    }

    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('customOperations', changes);
        this.setupChanges('fields', changes);
        this.setupChanges('groupOperations', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('customOperations');
        this._idh.doCheck('fields');
        this._idh.doCheck('groupOperations');
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
    DxiCustomOperationModule,
    DxiFieldModule,
    DxoFormatModule,
    DxoLookupModule,
    DxoFilterOperationDescriptionsModule,
    DxoGroupOperationDescriptionsModule,
    DxiFilterBuilderCustomOperationModule,
    DxiFilterBuilderFieldModule,
    DxoFilterBuilderFilterOperationDescriptionsModule,
    DxoFilterBuilderFormatModule,
    DxoFilterBuilderGroupOperationDescriptionsModule,
    DxoFilterBuilderLookupModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxFilterBuilderComponent
  ],
  exports: [
    DxFilterBuilderComponent,
    DxiCustomOperationModule,
    DxiFieldModule,
    DxoFormatModule,
    DxoLookupModule,
    DxoFilterOperationDescriptionsModule,
    DxoGroupOperationDescriptionsModule,
    DxiFilterBuilderCustomOperationModule,
    DxiFilterBuilderFieldModule,
    DxoFilterBuilderFilterOperationDescriptionsModule,
    DxoFilterBuilderFormatModule,
    DxoFilterBuilderGroupOperationDescriptionsModule,
    DxoFilterBuilderLookupModule,
    DxTemplateModule
  ]
})
export class DxFilterBuilderModule { }

import type * as DxFilterBuilderTypes from "devextreme/ui/filter_builder_types";
export { DxFilterBuilderTypes };



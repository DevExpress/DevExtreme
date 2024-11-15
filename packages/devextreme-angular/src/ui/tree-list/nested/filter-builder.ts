/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    Output,
    EventEmitter,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { dxFilterBuilderCustomOperation, dxFilterBuilderField, GroupOperation, ContentReadyEvent, DisposingEvent, EditorPreparedEvent, EditorPreparingEvent, InitializedEvent, OptionChangedEvent, ValueChangedEvent } from 'devextreme/ui/filter_builder';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiTreeListCustomOperationComponent } from './custom-operation-dxi';
import { DxiTreeListFieldComponent } from './field-dxi';


@Component({
    selector: 'dxo-tree-list-filter-builder',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListFilterBuilderComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    @Input()
    get allowHierarchicalFields(): boolean {
        return this._getOption('allowHierarchicalFields');
    }
    set allowHierarchicalFields(value: boolean) {
        this._setOption('allowHierarchicalFields', value);
    }

    @Input()
    get customOperations(): Array<dxFilterBuilderCustomOperation> {
        return this._getOption('customOperations');
    }
    set customOperations(value: Array<dxFilterBuilderCustomOperation>) {
        this._setOption('customOperations', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }

    @Input()
    get fields(): Array<dxFilterBuilderField> {
        return this._getOption('fields');
    }
    set fields(value: Array<dxFilterBuilderField>) {
        this._setOption('fields', value);
    }

    @Input()
    get filterOperationDescriptions(): { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string } {
        return this._getOption('filterOperationDescriptions');
    }
    set filterOperationDescriptions(value: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }) {
        this._setOption('filterOperationDescriptions', value);
    }

    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    @Input()
    get groupOperationDescriptions(): { and?: string, notAnd?: string, notOr?: string, or?: string } {
        return this._getOption('groupOperationDescriptions');
    }
    set groupOperationDescriptions(value: { and?: string, notAnd?: string, notOr?: string, or?: string }) {
        this._setOption('groupOperationDescriptions', value);
    }

    @Input()
    get groupOperations(): Array<GroupOperation> {
        return this._getOption('groupOperations');
    }
    set groupOperations(value: Array<GroupOperation>) {
        this._setOption('groupOperations', value);
    }

    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
        this._setOption('height', value);
    }

    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    @Input()
    get maxGroupLevel(): number | undefined {
        return this._getOption('maxGroupLevel');
    }
    set maxGroupLevel(value: number | undefined) {
        this._setOption('maxGroupLevel', value);
    }

    @Input()
    get onContentReady(): ((e: ContentReadyEvent) => void) {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: ((e: ContentReadyEvent) => void)) {
        this._setOption('onContentReady', value);
    }

    @Input()
    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    @Input()
    get onEditorPrepared(): ((e: EditorPreparedEvent) => void) {
        return this._getOption('onEditorPrepared');
    }
    set onEditorPrepared(value: ((e: EditorPreparedEvent) => void)) {
        this._setOption('onEditorPrepared', value);
    }

    @Input()
    get onEditorPreparing(): ((e: EditorPreparingEvent) => void) {
        return this._getOption('onEditorPreparing');
    }
    set onEditorPreparing(value: ((e: EditorPreparingEvent) => void)) {
        this._setOption('onEditorPreparing', value);
    }

    @Input()
    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    @Input()
    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get onValueChanged(): ((e: ValueChangedEvent) => void) {
        return this._getOption('onValueChanged');
    }
    set onValueChanged(value: ((e: ValueChangedEvent) => void)) {
        this._setOption('onValueChanged', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    @Input()
    get value(): Array<any> | (() => any) | string {
        return this._getOption('value');
    }
    set value(value: Array<any> | (() => any) | string) {
        this._setOption('value', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<Array<any> | (() => any) | string>;
    protected get _optionPath() {
        return 'filterBuilder';
    }


    @ContentChildren(forwardRef(() => DxiTreeListCustomOperationComponent))
    get customOperationsChildren(): QueryList<DxiTreeListCustomOperationComponent> {
        return this._getOption('customOperations');
    }
    set customOperationsChildren(value) {
        this.setChildren('customOperations', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListFieldComponent))
    get fieldsChildren(): QueryList<DxiTreeListFieldComponent> {
        return this._getOption('fields');
    }
    set fieldsChildren(value) {
        this.setChildren('fields', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'valueChange' }
        ]);

        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoTreeListFilterBuilderComponent
  ],
  exports: [
    DxoTreeListFilterBuilderComponent
  ],
})
export class DxoTreeListFilterBuilderModule { }

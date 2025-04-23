/* tslint:disable:max-line-length */


import {
    Component,
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




import * as CommonTypes from 'devextreme/common';
import { HorizontalAlignment, DataType, Format, SortOrder } from 'devextreme/common';
import { FilterType } from 'devextreme/common/grids';
import { dxFormSimpleItem } from 'devextreme/ui/form';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiCardViewAsyncRuleComponent } from './async-rule-dxi';
import { DxiCardViewCompareRuleComponent } from './compare-rule-dxi';
import { DxiCardViewCustomRuleComponent } from './custom-rule-dxi';
import { DxiCardViewEmailRuleComponent } from './email-rule-dxi';
import { DxiCardViewNumericRuleComponent } from './numeric-rule-dxi';
import { DxiCardViewPatternRuleComponent } from './pattern-rule-dxi';
import { DxiCardViewRangeRuleComponent } from './range-rule-dxi';
import { DxiCardViewRequiredRuleComponent } from './required-rule-dxi';
import { DxiCardViewStringLengthRuleComponent } from './string-length-rule-dxi';
import { DxiCardViewValidationRuleComponent } from './validation-rule-dxi';


@Component({
    selector: 'dxi-card-view-column',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiCardViewColumnComponent extends CollectionNestedOption {
    @Input()
    get alignment(): HorizontalAlignment | undefined {
        return this._getOption('alignment');
    }
    set alignment(value: HorizontalAlignment | undefined) {
        this._setOption('alignment', value);
    }

    @Input()
    get allowEditing(): boolean {
        return this._getOption('allowEditing');
    }
    set allowEditing(value: boolean) {
        this._setOption('allowEditing', value);
    }

    @Input()
    get allowFiltering(): boolean {
        return this._getOption('allowFiltering');
    }
    set allowFiltering(value: boolean) {
        this._setOption('allowFiltering', value);
    }

    @Input()
    get allowHeaderFiltering(): boolean {
        return this._getOption('allowHeaderFiltering');
    }
    set allowHeaderFiltering(value: boolean) {
        this._setOption('allowHeaderFiltering', value);
    }

    @Input()
    get allowHiding(): boolean {
        return this._getOption('allowHiding');
    }
    set allowHiding(value: boolean) {
        this._setOption('allowHiding', value);
    }

    @Input()
    get allowReordering(): boolean {
        return this._getOption('allowReordering');
    }
    set allowReordering(value: boolean) {
        this._setOption('allowReordering', value);
    }

    @Input()
    get allowSearch(): boolean {
        return this._getOption('allowSearch');
    }
    set allowSearch(value: boolean) {
        this._setOption('allowSearch', value);
    }

    @Input()
    get allowSorting(): boolean {
        return this._getOption('allowSorting');
    }
    set allowSorting(value: boolean) {
        this._setOption('allowSorting', value);
    }

    @Input()
    get calculateDisplayValue(): ((cardData: any) => any) {
        return this._getOption('calculateDisplayValue');
    }
    set calculateDisplayValue(value: ((cardData: any) => any)) {
        this._setOption('calculateDisplayValue', value);
    }

    @Input()
    get calculateFieldValue(): ((cardData: any) => any) {
        return this._getOption('calculateFieldValue');
    }
    set calculateFieldValue(value: ((cardData: any) => any)) {
        this._setOption('calculateFieldValue', value);
    }

    @Input()
    get calculateFilterExpression(): ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | Array<any> | Function) {
        return this._getOption('calculateFilterExpression');
    }
    set calculateFilterExpression(value: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | Array<any> | Function)) {
        this._setOption('calculateFilterExpression', value);
    }

    @Input()
    get calculateSortValue(): ((cardData: any) => any) | string {
        return this._getOption('calculateSortValue');
    }
    set calculateSortValue(value: ((cardData: any) => any) | string) {
        this._setOption('calculateSortValue', value);
    }

    @Input()
    get caption(): string | undefined {
        return this._getOption('caption');
    }
    set caption(value: string | undefined) {
        this._setOption('caption', value);
    }

    @Input()
    get customizeText(): ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get dataField(): string | undefined {
        return this._getOption('dataField');
    }
    set dataField(value: string | undefined) {
        this._setOption('dataField', value);
    }

    @Input()
    get dataType(): DataType | undefined {
        return this._getOption('dataType');
    }
    set dataType(value: DataType | undefined) {
        this._setOption('dataType', value);
    }

    @Input()
    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
        this._setOption('editorOptions', value);
    }

    @Input()
    get falseText(): string {
        return this._getOption('falseText');
    }
    set falseText(value: string) {
        this._setOption('falseText', value);
    }

    @Input()
    get fieldCaptionTemplate(): any {
        return this._getOption('fieldCaptionTemplate');
    }
    set fieldCaptionTemplate(value: any) {
        this._setOption('fieldCaptionTemplate', value);
    }

    @Input()
    get fieldTemplate(): any {
        return this._getOption('fieldTemplate');
    }
    set fieldTemplate(value: any) {
        this._setOption('fieldTemplate', value);
    }

    @Input()
    get fieldValueTemplate(): any {
        return this._getOption('fieldValueTemplate');
    }
    set fieldValueTemplate(value: any) {
        this._setOption('fieldValueTemplate', value);
    }

    @Input()
    get filterType(): FilterType {
        return this._getOption('filterType');
    }
    set filterType(value: FilterType) {
        this._setOption('filterType', value);
    }

    @Input()
    get filterValue(): any | undefined {
        return this._getOption('filterValue');
    }
    set filterValue(value: any | undefined) {
        this._setOption('filterValue', value);
    }

    @Input()
    get filterValues(): Array<any> {
        return this._getOption('filterValues');
    }
    set filterValues(value: Array<any>) {
        this._setOption('filterValues', value);
    }

    @Input()
    get format(): Format {
        return this._getOption('format');
    }
    set format(value: Format) {
        this._setOption('format', value);
    }

    @Input()
    get formItem(): dxFormSimpleItem {
        return this._getOption('formItem');
    }
    set formItem(value: dxFormSimpleItem) {
        this._setOption('formItem', value);
    }

    @Input()
    get headerFilter(): Record<string, any> {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: Record<string, any>) {
        this._setOption('headerFilter', value);
    }

    @Input()
    get headerItemCssClass(): string {
        return this._getOption('headerItemCssClass');
    }
    set headerItemCssClass(value: string) {
        this._setOption('headerItemCssClass', value);
    }

    @Input()
    get headerItemTemplate(): any {
        return this._getOption('headerItemTemplate');
    }
    set headerItemTemplate(value: any) {
        this._setOption('headerItemTemplate', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    @Input()
    get setFieldValue(): ((newData: any, value: any, currentCardData: any) => any) {
        return this._getOption('setFieldValue');
    }
    set setFieldValue(value: ((newData: any, value: any, currentCardData: any) => any)) {
        this._setOption('setFieldValue', value);
    }

    @Input()
    get showInColumnChooser(): boolean {
        return this._getOption('showInColumnChooser');
    }
    set showInColumnChooser(value: boolean) {
        this._setOption('showInColumnChooser', value);
    }

    @Input()
    get sortIndex(): number | undefined {
        return this._getOption('sortIndex');
    }
    set sortIndex(value: number | undefined) {
        this._setOption('sortIndex', value);
    }

    @Input()
    get sortingMethod(): ((value1: any, value2: any) => number) | undefined {
        return this._getOption('sortingMethod');
    }
    set sortingMethod(value: ((value1: any, value2: any) => number) | undefined) {
        this._setOption('sortingMethod', value);
    }

    @Input()
    get sortOrder(): SortOrder | undefined {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: SortOrder | undefined) {
        this._setOption('sortOrder', value);
    }

    @Input()
    get trueText(): string {
        return this._getOption('trueText');
    }
    set trueText(value: string) {
        this._setOption('trueText', value);
    }

    @Input()
    get validationRules(): Array<CommonTypes.ValidationRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<CommonTypes.ValidationRule>) {
        this._setOption('validationRules', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get visibleIndex(): number | undefined {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number | undefined) {
        this._setOption('visibleIndex', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterValueChange: EventEmitter<any | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterValuesChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortIndexChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortOrderChange: EventEmitter<SortOrder | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleIndexChange: EventEmitter<number | undefined>;
    protected get _optionPath() {
        return 'columns';
    }


    @ContentChildren(forwardRef(() => DxiCardViewAsyncRuleComponent))
    get asyncRulesChildren(): QueryList<DxiCardViewAsyncRuleComponent> {
        return this._getOption('validationRules');
    }
    set asyncRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewCompareRuleComponent))
    get compareRulesChildren(): QueryList<DxiCardViewCompareRuleComponent> {
        return this._getOption('validationRules');
    }
    set compareRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewCustomRuleComponent))
    get customRulesChildren(): QueryList<DxiCardViewCustomRuleComponent> {
        return this._getOption('validationRules');
    }
    set customRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewEmailRuleComponent))
    get emailRulesChildren(): QueryList<DxiCardViewEmailRuleComponent> {
        return this._getOption('validationRules');
    }
    set emailRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewNumericRuleComponent))
    get numericRulesChildren(): QueryList<DxiCardViewNumericRuleComponent> {
        return this._getOption('validationRules');
    }
    set numericRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewPatternRuleComponent))
    get patternRulesChildren(): QueryList<DxiCardViewPatternRuleComponent> {
        return this._getOption('validationRules');
    }
    set patternRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewRangeRuleComponent))
    get rangeRulesChildren(): QueryList<DxiCardViewRangeRuleComponent> {
        return this._getOption('validationRules');
    }
    set rangeRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewRequiredRuleComponent))
    get requiredRulesChildren(): QueryList<DxiCardViewRequiredRuleComponent> {
        return this._getOption('validationRules');
    }
    set requiredRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewStringLengthRuleComponent))
    get stringLengthRulesChildren(): QueryList<DxiCardViewStringLengthRuleComponent> {
        return this._getOption('validationRules');
    }
    set stringLengthRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewValidationRuleComponent))
    get validationRulesChildren(): QueryList<DxiCardViewValidationRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'filterValueChange' },
            { emit: 'filterValuesChange' },
            { emit: 'sortIndexChange' },
            { emit: 'sortOrderChange' },
            { emit: 'visibleChange' },
            { emit: 'visibleIndexChange' }
        ]);

        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiCardViewColumnComponent
  ],
  exports: [
    DxiCardViewColumnComponent
  ],
})
export class DxiCardViewColumnModule { }

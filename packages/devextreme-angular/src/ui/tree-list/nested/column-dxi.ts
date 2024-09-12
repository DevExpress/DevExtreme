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




import { AsyncRule, CompareRule, CustomRule, DataType, EmailRule, HorizontalAlignment, NumericRule, PatternRule, RangeRule, RequiredRule, SearchMode, SortOrder, StringLengthRule } from 'devextreme/common';
import { ColumnHeaderFilterSearchConfig, FilterOperation, FilterType, FixedPosition, HeaderFilterGroupInterval, SelectedFilterOperation } from 'devextreme/common/grids';
import { Store } from 'devextreme/data';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { Format } from 'devextreme/localization';
import { SimpleItem } from 'devextreme/ui/form';
import { dxTreeListColumn, dxTreeListColumnButton, TreeListCommandColumnType, TreeListPredefinedColumnButton } from 'devextreme/ui/tree_list';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiTreeListButtonComponent } from './button-dxi';
import { DxiTreeListValidationRuleComponent } from './validation-rule-dxi';


@Component({
    selector: 'dxi-tree-list-column',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiTreeListColumnComponent extends CollectionNestedOption {
    @Input()
    get alignment(): HorizontalAlignment | string | undefined {
        return this._getOption('alignment');
    }
    set alignment(value: HorizontalAlignment | string | undefined) {
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
    get allowFixing(): boolean {
        return this._getOption('allowFixing');
    }
    set allowFixing(value: boolean) {
        this._setOption('allowFixing', value);
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
    get allowResizing(): boolean {
        return this._getOption('allowResizing');
    }
    set allowResizing(value: boolean) {
        this._setOption('allowResizing', value);
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
    get buttons(): Array<TreeListPredefinedColumnButton | dxTreeListColumnButton> {
        return this._getOption('buttons');
    }
    set buttons(value: Array<TreeListPredefinedColumnButton | dxTreeListColumnButton>) {
        this._setOption('buttons', value);
    }

    @Input()
    get calculateCellValue(): Function {
        return this._getOption('calculateCellValue');
    }
    set calculateCellValue(value: Function) {
        this._setOption('calculateCellValue', value);
    }

    @Input()
    get calculateDisplayValue(): Function | string {
        return this._getOption('calculateDisplayValue');
    }
    set calculateDisplayValue(value: Function | string) {
        this._setOption('calculateDisplayValue', value);
    }

    @Input()
    get calculateFilterExpression(): Function {
        return this._getOption('calculateFilterExpression');
    }
    set calculateFilterExpression(value: Function) {
        this._setOption('calculateFilterExpression', value);
    }

    @Input()
    get calculateSortValue(): Function | string {
        return this._getOption('calculateSortValue');
    }
    set calculateSortValue(value: Function | string) {
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
    get cellTemplate(): any {
        return this._getOption('cellTemplate');
    }
    set cellTemplate(value: any) {
        this._setOption('cellTemplate', value);
    }

    @Input()
    get columns(): Array<dxTreeListColumn | string> {
        return this._getOption('columns');
    }
    set columns(value: Array<dxTreeListColumn | string>) {
        this._setOption('columns', value);
    }

    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get customizeText(): Function {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function) {
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
    get editCellTemplate(): any {
        return this._getOption('editCellTemplate');
    }
    set editCellTemplate(value: any) {
        this._setOption('editCellTemplate', value);
    }

    @Input()
    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
        this._setOption('editorOptions', value);
    }

    @Input()
    get encodeHtml(): boolean {
        return this._getOption('encodeHtml');
    }
    set encodeHtml(value: boolean) {
        this._setOption('encodeHtml', value);
    }

    @Input()
    get falseText(): string {
        return this._getOption('falseText');
    }
    set falseText(value: string) {
        this._setOption('falseText', value);
    }

    @Input()
    get filterOperations(): Array<FilterOperation | string> {
        return this._getOption('filterOperations');
    }
    set filterOperations(value: Array<FilterOperation | string>) {
        this._setOption('filterOperations', value);
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
    get fixed(): boolean {
        return this._getOption('fixed');
    }
    set fixed(value: boolean) {
        this._setOption('fixed', value);
    }

    @Input()
    get fixedPosition(): FixedPosition | undefined {
        return this._getOption('fixedPosition');
    }
    set fixedPosition(value: FixedPosition | undefined) {
        this._setOption('fixedPosition', value);
    }

    @Input()
    get format(): Format | string {
        return this._getOption('format');
    }
    set format(value: Format | string) {
        this._setOption('format', value);
    }

    @Input()
    get formItem(): SimpleItem {
        return this._getOption('formItem');
    }
    set formItem(value: SimpleItem) {
        this._setOption('formItem', value);
    }

    @Input()
    get headerCellTemplate(): any {
        return this._getOption('headerCellTemplate');
    }
    set headerCellTemplate(value: any) {
        this._setOption('headerCellTemplate', value);
    }

    @Input()
    get headerFilter(): { allowSearch?: boolean, allowSelectAll?: boolean, dataSource?: Store | DataSourceOptions | Function | null | undefined | Array<any>, groupInterval?: HeaderFilterGroupInterval | number | undefined, height?: number | string | undefined, search?: ColumnHeaderFilterSearchConfig, searchMode?: SearchMode, width?: number | string | undefined } {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: { allowSearch?: boolean, allowSelectAll?: boolean, dataSource?: Store | DataSourceOptions | Function | null | undefined | Array<any>, groupInterval?: HeaderFilterGroupInterval | number | undefined, height?: number | string | undefined, search?: ColumnHeaderFilterSearchConfig, searchMode?: SearchMode, width?: number | string | undefined }) {
        this._setOption('headerFilter', value);
    }

    @Input()
    get hidingPriority(): number | undefined {
        return this._getOption('hidingPriority');
    }
    set hidingPriority(value: number | undefined) {
        this._setOption('hidingPriority', value);
    }

    @Input()
    get isBand(): boolean | undefined {
        return this._getOption('isBand');
    }
    set isBand(value: boolean | undefined) {
        this._setOption('isBand', value);
    }

    @Input()
    get lookup(): { allowClearing?: boolean, calculateCellValue?: Function, dataSource?: Store | DataSourceOptions | Function | null | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: string | undefined } {
        return this._getOption('lookup');
    }
    set lookup(value: { allowClearing?: boolean, calculateCellValue?: Function, dataSource?: Store | DataSourceOptions | Function | null | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: string | undefined }) {
        this._setOption('lookup', value);
    }

    @Input()
    get minWidth(): number | undefined {
        return this._getOption('minWidth');
    }
    set minWidth(value: number | undefined) {
        this._setOption('minWidth', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    @Input()
    get ownerBand(): number | undefined {
        return this._getOption('ownerBand');
    }
    set ownerBand(value: number | undefined) {
        this._setOption('ownerBand', value);
    }

    @Input()
    get renderAsync(): boolean {
        return this._getOption('renderAsync');
    }
    set renderAsync(value: boolean) {
        this._setOption('renderAsync', value);
    }

    @Input()
    get selectedFilterOperation(): SelectedFilterOperation | undefined {
        return this._getOption('selectedFilterOperation');
    }
    set selectedFilterOperation(value: SelectedFilterOperation | undefined) {
        this._setOption('selectedFilterOperation', value);
    }

    @Input()
    get setCellValue(): Function {
        return this._getOption('setCellValue');
    }
    set setCellValue(value: Function) {
        this._setOption('setCellValue', value);
    }

    @Input()
    get showEditorAlways(): boolean {
        return this._getOption('showEditorAlways');
    }
    set showEditorAlways(value: boolean) {
        this._setOption('showEditorAlways', value);
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
    get sortingMethod(): Function | undefined {
        return this._getOption('sortingMethod');
    }
    set sortingMethod(value: Function | undefined) {
        this._setOption('sortingMethod', value);
    }

    @Input()
    get sortOrder(): SortOrder | string | undefined {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: SortOrder | string | undefined) {
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
    get type(): TreeListCommandColumnType {
        return this._getOption('type');
    }
    set type(value: TreeListCommandColumnType) {
        this._setOption('type', value);
    }

    @Input()
    get validationRules(): Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>) {
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

    @Input()
    get width(): number | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | string | undefined) {
        this._setOption('width', value);
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
    @Output() selectedFilterOperationChange: EventEmitter<SelectedFilterOperation | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortIndexChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortOrderChange: EventEmitter<SortOrder | string | undefined>;

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


    @ContentChildren(forwardRef(() => DxiTreeListButtonComponent))
    get buttonsChildren(): QueryList<DxiTreeListButtonComponent> {
        return this._getOption('buttons');
    }
    set buttonsChildren(value) {
        this.setChildren('buttons', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListColumnComponent))
    get columnsChildren(): QueryList<DxiTreeListColumnComponent> {
        return this._getOption('columns');
    }
    set columnsChildren(value) {
        this.setChildren('columns', value);
    }

    @ContentChildren(forwardRef(() => DxiTreeListValidationRuleComponent))
    get validationRulesChildren(): QueryList<DxiTreeListValidationRuleComponent> {
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
            { emit: 'selectedFilterOperationChange' },
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
    DxiTreeListColumnComponent
  ],
  exports: [
    DxiTreeListColumnComponent
  ],
})
export class DxiTreeListColumnModule { }

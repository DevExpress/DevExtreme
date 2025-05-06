/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { AsyncRule, CompareRule, CustomRule, DataType, EmailRule, HorizontalAlignment, NumericRule, PatternRule, RangeRule, RequiredRule, SearchMode, SortOrder, StringLengthRule } from 'devextreme/common';
import { Format } from 'devextreme/common/core/localization';
import { ColumnHeaderFilterSearchConfig, FilterOperation, FilterType, FixedPosition, HeaderFilterGroupInterval, SelectedFilterOperation } from 'devextreme/common/grids';
import { Store } from 'devextreme/data';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { DataGridCommandColumnType, DataGridPredefinedColumnButton, dxDataGridColumn, dxDataGridColumnButton } from 'devextreme/ui/data_grid';
import { SimpleItem } from 'devextreme/ui/form';
import { dxTreeListColumn, dxTreeListColumnButton, TreeListCommandColumnType, TreeListPredefinedColumnButton } from 'devextreme/ui/tree_list';

@Component({
    template: ''
})
export abstract class DxiDataGridColumn extends CollectionNestedOption {
    get alignment(): HorizontalAlignment | string | undefined {
        return this._getOption('alignment');
    }
    set alignment(value: HorizontalAlignment | string | undefined) {
        this._setOption('alignment', value);
    }

    get allowEditing(): boolean {
        return this._getOption('allowEditing');
    }
    set allowEditing(value: boolean) {
        this._setOption('allowEditing', value);
    }

    get allowExporting(): boolean {
        return this._getOption('allowExporting');
    }
    set allowExporting(value: boolean) {
        this._setOption('allowExporting', value);
    }

    get allowFiltering(): boolean {
        return this._getOption('allowFiltering');
    }
    set allowFiltering(value: boolean) {
        this._setOption('allowFiltering', value);
    }

    get allowFixing(): boolean {
        return this._getOption('allowFixing');
    }
    set allowFixing(value: boolean) {
        this._setOption('allowFixing', value);
    }

    get allowGrouping(): boolean {
        return this._getOption('allowGrouping');
    }
    set allowGrouping(value: boolean) {
        this._setOption('allowGrouping', value);
    }

    get allowHeaderFiltering(): boolean {
        return this._getOption('allowHeaderFiltering');
    }
    set allowHeaderFiltering(value: boolean) {
        this._setOption('allowHeaderFiltering', value);
    }

    get allowHiding(): boolean {
        return this._getOption('allowHiding');
    }
    set allowHiding(value: boolean) {
        this._setOption('allowHiding', value);
    }

    get allowReordering(): boolean {
        return this._getOption('allowReordering');
    }
    set allowReordering(value: boolean) {
        this._setOption('allowReordering', value);
    }

    get allowResizing(): boolean {
        return this._getOption('allowResizing');
    }
    set allowResizing(value: boolean) {
        this._setOption('allowResizing', value);
    }

    get allowSearch(): boolean {
        return this._getOption('allowSearch');
    }
    set allowSearch(value: boolean) {
        this._setOption('allowSearch', value);
    }

    get allowSorting(): boolean {
        return this._getOption('allowSorting');
    }
    set allowSorting(value: boolean) {
        this._setOption('allowSorting', value);
    }

    get autoExpandGroup(): boolean {
        return this._getOption('autoExpandGroup');
    }
    set autoExpandGroup(value: boolean) {
        this._setOption('autoExpandGroup', value);
    }

    get buttons(): Array<DataGridPredefinedColumnButton | dxDataGridColumnButton | TreeListPredefinedColumnButton | dxTreeListColumnButton> {
        return this._getOption('buttons');
    }
    set buttons(value: Array<DataGridPredefinedColumnButton | dxDataGridColumnButton | TreeListPredefinedColumnButton | dxTreeListColumnButton>) {
        this._setOption('buttons', value);
    }

    get calculateCellValue(): Function {
        return this._getOption('calculateCellValue');
    }
    set calculateCellValue(value: Function) {
        this._setOption('calculateCellValue', value);
    }

    get calculateDisplayValue(): Function | string {
        return this._getOption('calculateDisplayValue');
    }
    set calculateDisplayValue(value: Function | string) {
        this._setOption('calculateDisplayValue', value);
    }

    get calculateFilterExpression(): Function {
        return this._getOption('calculateFilterExpression');
    }
    set calculateFilterExpression(value: Function) {
        this._setOption('calculateFilterExpression', value);
    }

    get calculateGroupValue(): Function | string {
        return this._getOption('calculateGroupValue');
    }
    set calculateGroupValue(value: Function | string) {
        this._setOption('calculateGroupValue', value);
    }

    get calculateSortValue(): Function | string {
        return this._getOption('calculateSortValue');
    }
    set calculateSortValue(value: Function | string) {
        this._setOption('calculateSortValue', value);
    }

    get caption(): string | undefined {
        return this._getOption('caption');
    }
    set caption(value: string | undefined) {
        this._setOption('caption', value);
    }

    get cellTemplate(): any {
        return this._getOption('cellTemplate');
    }
    set cellTemplate(value: any) {
        this._setOption('cellTemplate', value);
    }

    get columns(): Array<dxDataGridColumn | string | dxTreeListColumn> {
        return this._getOption('columns');
    }
    set columns(value: Array<dxDataGridColumn | string | dxTreeListColumn>) {
        this._setOption('columns', value);
    }

    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    get customizeText(): Function {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function) {
        this._setOption('customizeText', value);
    }

    get dataField(): string | undefined {
        return this._getOption('dataField');
    }
    set dataField(value: string | undefined) {
        this._setOption('dataField', value);
    }

    get dataType(): DataType | undefined {
        return this._getOption('dataType');
    }
    set dataType(value: DataType | undefined) {
        this._setOption('dataType', value);
    }

    get editCellTemplate(): any {
        return this._getOption('editCellTemplate');
    }
    set editCellTemplate(value: any) {
        this._setOption('editCellTemplate', value);
    }

    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
        this._setOption('editorOptions', value);
    }

    get encodeHtml(): boolean {
        return this._getOption('encodeHtml');
    }
    set encodeHtml(value: boolean) {
        this._setOption('encodeHtml', value);
    }

    get falseText(): string {
        return this._getOption('falseText');
    }
    set falseText(value: string) {
        this._setOption('falseText', value);
    }

    get filterOperations(): Array<FilterOperation | string> {
        return this._getOption('filterOperations');
    }
    set filterOperations(value: Array<FilterOperation | string>) {
        this._setOption('filterOperations', value);
    }

    get filterType(): FilterType {
        return this._getOption('filterType');
    }
    set filterType(value: FilterType) {
        this._setOption('filterType', value);
    }

    get filterValue(): any | undefined {
        return this._getOption('filterValue');
    }
    set filterValue(value: any | undefined) {
        this._setOption('filterValue', value);
    }

    get filterValues(): Array<any> {
        return this._getOption('filterValues');
    }
    set filterValues(value: Array<any>) {
        this._setOption('filterValues', value);
    }

    get fixed(): boolean {
        return this._getOption('fixed');
    }
    set fixed(value: boolean) {
        this._setOption('fixed', value);
    }

    get fixedPosition(): FixedPosition | undefined {
        return this._getOption('fixedPosition');
    }
    set fixedPosition(value: FixedPosition | undefined) {
        this._setOption('fixedPosition', value);
    }

    get format(): Format | string {
        return this._getOption('format');
    }
    set format(value: Format | string) {
        this._setOption('format', value);
    }

    get formItem(): SimpleItem {
        return this._getOption('formItem');
    }
    set formItem(value: SimpleItem) {
        this._setOption('formItem', value);
    }

    get groupCellTemplate(): any {
        return this._getOption('groupCellTemplate');
    }
    set groupCellTemplate(value: any) {
        this._setOption('groupCellTemplate', value);
    }

    get groupIndex(): number | undefined {
        return this._getOption('groupIndex');
    }
    set groupIndex(value: number | undefined) {
        this._setOption('groupIndex', value);
    }

    get headerCellTemplate(): any {
        return this._getOption('headerCellTemplate');
    }
    set headerCellTemplate(value: any) {
        this._setOption('headerCellTemplate', value);
    }

    get headerFilter(): { allowSearch?: boolean, allowSelectAll?: boolean, dataSource?: Store | DataSourceOptions | Function | null | undefined | Array<any>, groupInterval?: HeaderFilterGroupInterval | number | undefined, height?: number | string | undefined, search?: ColumnHeaderFilterSearchConfig, searchMode?: SearchMode, width?: number | string | undefined } {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: { allowSearch?: boolean, allowSelectAll?: boolean, dataSource?: Store | DataSourceOptions | Function | null | undefined | Array<any>, groupInterval?: HeaderFilterGroupInterval | number | undefined, height?: number | string | undefined, search?: ColumnHeaderFilterSearchConfig, searchMode?: SearchMode, width?: number | string | undefined }) {
        this._setOption('headerFilter', value);
    }

    get hidingPriority(): number | undefined {
        return this._getOption('hidingPriority');
    }
    set hidingPriority(value: number | undefined) {
        this._setOption('hidingPriority', value);
    }

    get isBand(): boolean | undefined {
        return this._getOption('isBand');
    }
    set isBand(value: boolean | undefined) {
        this._setOption('isBand', value);
    }

    get lookup(): { allowClearing?: boolean, calculateCellValue?: Function, dataSource?: Store | DataSourceOptions | Function | null | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: string | undefined } {
        return this._getOption('lookup');
    }
    set lookup(value: { allowClearing?: boolean, calculateCellValue?: Function, dataSource?: Store | DataSourceOptions | Function | null | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: string | undefined }) {
        this._setOption('lookup', value);
    }

    get minWidth(): number | undefined {
        return this._getOption('minWidth');
    }
    set minWidth(value: number | undefined) {
        this._setOption('minWidth', value);
    }

    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    get ownerBand(): number | undefined {
        return this._getOption('ownerBand');
    }
    set ownerBand(value: number | undefined) {
        this._setOption('ownerBand', value);
    }

    get renderAsync(): boolean {
        return this._getOption('renderAsync');
    }
    set renderAsync(value: boolean) {
        this._setOption('renderAsync', value);
    }

    get selectedFilterOperation(): SelectedFilterOperation | undefined {
        return this._getOption('selectedFilterOperation');
    }
    set selectedFilterOperation(value: SelectedFilterOperation | undefined) {
        this._setOption('selectedFilterOperation', value);
    }

    get setCellValue(): Function {
        return this._getOption('setCellValue');
    }
    set setCellValue(value: Function) {
        this._setOption('setCellValue', value);
    }

    get showEditorAlways(): boolean {
        return this._getOption('showEditorAlways');
    }
    set showEditorAlways(value: boolean) {
        this._setOption('showEditorAlways', value);
    }

    get showInColumnChooser(): boolean {
        return this._getOption('showInColumnChooser');
    }
    set showInColumnChooser(value: boolean) {
        this._setOption('showInColumnChooser', value);
    }

    get showWhenGrouped(): boolean {
        return this._getOption('showWhenGrouped');
    }
    set showWhenGrouped(value: boolean) {
        this._setOption('showWhenGrouped', value);
    }

    get sortIndex(): number | undefined {
        return this._getOption('sortIndex');
    }
    set sortIndex(value: number | undefined) {
        this._setOption('sortIndex', value);
    }

    get sortingMethod(): Function | undefined {
        return this._getOption('sortingMethod');
    }
    set sortingMethod(value: Function | undefined) {
        this._setOption('sortingMethod', value);
    }

    get sortOrder(): SortOrder | string | undefined {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: SortOrder | string | undefined) {
        this._setOption('sortOrder', value);
    }

    get trueText(): string {
        return this._getOption('trueText');
    }
    set trueText(value: string) {
        this._setOption('trueText', value);
    }

    get type(): DataGridCommandColumnType | TreeListCommandColumnType {
        return this._getOption('type');
    }
    set type(value: DataGridCommandColumnType | TreeListCommandColumnType) {
        this._setOption('type', value);
    }

    get validationRules(): Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>) {
        this._setOption('validationRules', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get visibleIndex(): number | undefined {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number | undefined) {
        this._setOption('visibleIndex', value);
    }

    get width(): number | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | string | undefined) {
        this._setOption('width', value);
    }
}

/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { ColumnHeaderFilterSearchConfig } from 'devextreme/common/grids';
import { Store } from 'devextreme/data';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { Format } from 'devextreme/localization';
import { dxFormSimpleItem } from 'devextreme/ui/form';

@Component({
    template: ''
})
export abstract class DxiDataGridColumn extends CollectionNestedOption {
    get alignment(): string | undefined {
        return this._getOption('alignment');
    }
    set alignment(value: string | undefined) {
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

    get buttons(): Array<string | DevExpress.ui.dxDataGridColumnButton | DevExpress.ui.dxTreeListColumnButton> {
        return this._getOption('buttons');
    }
    set buttons(value: Array<string | DevExpress.ui.dxDataGridColumnButton | DevExpress.ui.dxTreeListColumnButton>) {
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

    get columns(): Array<DevExpress.ui.dxDataGridColumn | string | DevExpress.ui.dxTreeListColumn> {
        return this._getOption('columns');
    }
    set columns(value: Array<DevExpress.ui.dxDataGridColumn | string | DevExpress.ui.dxTreeListColumn>) {
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

    get dataType(): string | undefined {
        return this._getOption('dataType');
    }
    set dataType(value: string | undefined) {
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

    get filterOperations(): Array<string> {
        return this._getOption('filterOperations');
    }
    set filterOperations(value: Array<string>) {
        this._setOption('filterOperations', value);
    }

    get filterType(): string {
        return this._getOption('filterType');
    }
    set filterType(value: string) {
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

    get fixedPosition(): string | undefined {
        return this._getOption('fixedPosition');
    }
    set fixedPosition(value: string | undefined) {
        this._setOption('fixedPosition', value);
    }

    get format(): Format | string {
        return this._getOption('format');
    }
    set format(value: Format | string) {
        this._setOption('format', value);
    }

    get formItem(): dxFormSimpleItem {
        return this._getOption('formItem');
    }
    set formItem(value: dxFormSimpleItem) {
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

    get headerFilter(): { allowSearch?: boolean, allowSelectAll?: boolean, dataSource?: DataSourceOptions | Store | Function | null | undefined | Array<any>, groupInterval?: number | string | undefined, height?: number | undefined, search?: ColumnHeaderFilterSearchConfig, searchMode?: string, width?: number | undefined } {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: { allowSearch?: boolean, allowSelectAll?: boolean, dataSource?: DataSourceOptions | Store | Function | null | undefined | Array<any>, groupInterval?: number | string | undefined, height?: number | undefined, search?: ColumnHeaderFilterSearchConfig, searchMode?: string, width?: number | undefined }) {
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

    get lookup(): { allowClearing?: boolean, calculateCellValue?: Function, dataSource?: DataSourceOptions | Store | Function | null | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: string | undefined } {
        return this._getOption('lookup');
    }
    set lookup(value: { allowClearing?: boolean, calculateCellValue?: Function, dataSource?: DataSourceOptions | Store | Function | null | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: string | undefined }) {
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

    get selectedFilterOperation(): string | undefined {
        return this._getOption('selectedFilterOperation');
    }
    set selectedFilterOperation(value: string | undefined) {
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

    get sortOrder(): string | undefined {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: string | undefined) {
        this._setOption('sortOrder', value);
    }

    get trueText(): string {
        return this._getOption('trueText');
    }
    set trueText(value: string) {
        this._setOption('trueText', value);
    }

    get type(): string {
        return this._getOption('type');
    }
    set type(value: string) {
        this._setOption('type', value);
    }

    get validationRules(): Array<DevExpress.common.RequiredRule | DevExpress.common.NumericRule | DevExpress.common.RangeRule | DevExpress.common.StringLengthRule | DevExpress.common.CustomRule | DevExpress.common.CompareRule | DevExpress.common.PatternRule | DevExpress.common.EmailRule | DevExpress.common.AsyncRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<DevExpress.common.RequiredRule | DevExpress.common.NumericRule | DevExpress.common.RangeRule | DevExpress.common.StringLengthRule | DevExpress.common.CustomRule | DevExpress.common.CompareRule | DevExpress.common.PatternRule | DevExpress.common.EmailRule | DevExpress.common.AsyncRule>) {
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

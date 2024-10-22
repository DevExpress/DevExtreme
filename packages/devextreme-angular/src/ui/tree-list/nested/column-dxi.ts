/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import * as LocalizationTypes from 'devextreme/localization';
import * as CommonTypes from 'devextreme/common';
import { dxTreeListColumnButton, dxTreeListColumn } from 'devextreme/ui/tree_list';
import { dxFormSimpleItem } from 'devextreme/ui/form';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-tree-list-column',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiTreeListColumnComponent extends CollectionNestedOption {
    @Input()
    get alignment(): "center" | "left" | "right" {
        return this._getOption('alignment');
    }
    set alignment(value: "center" | "left" | "right") {
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
    get buttons(): Array<dxTreeListColumnButton | "add" | "cancel" | "delete" | "edit" | "save" | "undelete"> {
        return this._getOption('buttons');
    }
    set buttons(value: Array<dxTreeListColumnButton | "add" | "cancel" | "delete" | "edit" | "save" | "undelete">) {
        this._setOption('buttons', value);
    }

    @Input()
    get calculateCellValue(): ((rowData: any) => any) {
        return this._getOption('calculateCellValue');
    }
    set calculateCellValue(value: ((rowData: any) => any)) {
        this._setOption('calculateCellValue', value);
    }

    @Input()
    get calculateDisplayValue(): ((rowData: any) => any) | string {
        return this._getOption('calculateDisplayValue');
    }
    set calculateDisplayValue(value: ((rowData: any) => any) | string) {
        this._setOption('calculateDisplayValue', value);
    }

    @Input()
    get calculateFilterExpression(): ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | (() => any) | Array<any>) {
        return this._getOption('calculateFilterExpression');
    }
    set calculateFilterExpression(value: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | (() => any) | Array<any>)) {
        this._setOption('calculateFilterExpression', value);
    }

    @Input()
    get calculateSortValue(): ((rowData: any) => any) | string {
        return this._getOption('calculateSortValue');
    }
    set calculateSortValue(value: ((rowData: any) => any) | string) {
        this._setOption('calculateSortValue', value);
    }

    @Input()
    get caption(): string {
        return this._getOption('caption');
    }
    set caption(value: string) {
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
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    @Input()
    get customizeText(): ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get dataField(): string {
        return this._getOption('dataField');
    }
    set dataField(value: string) {
        this._setOption('dataField', value);
    }

    @Input()
    get dataType(): "string" | "number" | "date" | "boolean" | "object" | "datetime" {
        return this._getOption('dataType');
    }
    set dataType(value: "string" | "number" | "date" | "boolean" | "object" | "datetime") {
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
    get filterOperations(): Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | "anyof" | "noneof" | string> {
        return this._getOption('filterOperations');
    }
    set filterOperations(value: Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | "anyof" | "noneof" | string>) {
        this._setOption('filterOperations', value);
    }

    @Input()
    get filterType(): "exclude" | "include" {
        return this._getOption('filterType');
    }
    set filterType(value: "exclude" | "include") {
        this._setOption('filterType', value);
    }

    @Input()
    get filterValue(): any {
        return this._getOption('filterValue');
    }
    set filterValue(value: any) {
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
    get fixedPosition(): "left" | "right" | "sticky" {
        return this._getOption('fixedPosition');
    }
    set fixedPosition(value: "left" | "right" | "sticky") {
        this._setOption('fixedPosition', value);
    }

    @Input()
    get format(): LocalizationTypes.Format {
        return this._getOption('format');
    }
    set format(value: LocalizationTypes.Format) {
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
    get headerCellTemplate(): any {
        return this._getOption('headerCellTemplate');
    }
    set headerCellTemplate(value: any) {
        this._setOption('headerCellTemplate', value);
    }

    @Input()
    get headerFilter(): Record<string, any> {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: Record<string, any>) {
        this._setOption('headerFilter', value);
    }

    @Input()
    get hidingPriority(): number {
        return this._getOption('hidingPriority');
    }
    set hidingPriority(value: number) {
        this._setOption('hidingPriority', value);
    }

    @Input()
    get isBand(): boolean {
        return this._getOption('isBand');
    }
    set isBand(value: boolean) {
        this._setOption('isBand', value);
    }

    @Input()
    get lookup(): Record<string, any> {
        return this._getOption('lookup');
    }
    set lookup(value: Record<string, any>) {
        this._setOption('lookup', value);
    }

    @Input()
    get minWidth(): number {
        return this._getOption('minWidth');
    }
    set minWidth(value: number) {
        this._setOption('minWidth', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get ownerBand(): number {
        return this._getOption('ownerBand');
    }
    set ownerBand(value: number) {
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
    get selectedFilterOperation(): "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith" {
        return this._getOption('selectedFilterOperation');
    }
    set selectedFilterOperation(value: "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith") {
        this._setOption('selectedFilterOperation', value);
    }

    @Input()
    get setCellValue(): ((newData: any, value: any, currentRowData: any) => any) {
        return this._getOption('setCellValue');
    }
    set setCellValue(value: ((newData: any, value: any, currentRowData: any) => any)) {
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
    get sortIndex(): number {
        return this._getOption('sortIndex');
    }
    set sortIndex(value: number) {
        this._setOption('sortIndex', value);
    }

    @Input()
    get sortingMethod(): ((value1: any, value2: any) => number) {
        return this._getOption('sortingMethod');
    }
    set sortingMethod(value: ((value1: any, value2: any) => number)) {
        this._setOption('sortingMethod', value);
    }

    @Input()
    get sortOrder(): "asc" | "desc" {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: "asc" | "desc") {
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
    get type(): "adaptive" | "buttons" | "drag" {
        return this._getOption('type');
    }
    set type(value: "adaptive" | "buttons" | "drag") {
        this._setOption('type', value);
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
    get visibleIndex(): number {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number) {
        this._setOption('visibleIndex', value);
    }

    @Input()
    get width(): number | string {
        return this._getOption('width');
    }
    set width(value: number | string) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'columns';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
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

/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    ElementRef,
    Renderer2,
    Inject,
    AfterViewInit,
    SkipSelf,
    Input
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import dxTreeList from 'devextreme/ui/tree_list';
import * as LocalizationTypes from 'devextreme/localization';
import { dxTreeListColumn, dxTreeListRowObject } from 'devextreme/ui/tree_list';
import { template } from 'devextreme/core/templates/template';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-gantt-column',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiGanttColumnComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get alignment(): "center" | "left" | "right" {
        return this._getOption('alignment');
    }
    set alignment(value: "center" | "left" | "right") {
        this._setOption('alignment', value);
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
    get allowSorting(): boolean {
        return this._getOption('allowSorting');
    }
    set allowSorting(value: boolean) {
        this._setOption('allowSorting', value);
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
    get cellTemplate(): ((cellElement: any, cellInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList, data: Record<string, any>, displayValue: any, oldValue: any, row: dxTreeListRowObject, rowIndex: number, rowType: string, text: string, value: any, watch: (() => void) }) => any) | template {
        return this._getOption('cellTemplate');
    }
    set cellTemplate(value: ((cellElement: any, cellInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList, data: Record<string, any>, displayValue: any, oldValue: any, row: dxTreeListRowObject, rowIndex: number, rowType: string, text: string, value: any, watch: (() => void) }) => any) | template) {
        this._setOption('cellTemplate', value);
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
    get format(): LocalizationTypes.Format {
        return this._getOption('format');
    }
    set format(value: LocalizationTypes.Format) {
        this._setOption('format', value);
    }

    @Input()
    get headerCellTemplate(): ((columnHeader: any, headerInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList }) => any) | template {
        return this._getOption('headerCellTemplate');
    }
    set headerCellTemplate(value: ((columnHeader: any, headerInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList }) => any) | template) {
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
    get minWidth(): number {
        return this._getOption('minWidth');
    }
    set minWidth(value: number) {
        this._setOption('minWidth', value);
    }

    @Input()
    get selectedFilterOperation(): "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith" {
        return this._getOption('selectedFilterOperation');
    }
    set selectedFilterOperation(value: "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith") {
        this._setOption('selectedFilterOperation', value);
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
            @Host() optionHost: NestedOptionHost,
            private renderer: Renderer2,
            @Inject(DOCUMENT) private document: any,
            @Host() templateHost: DxTemplateHost,
            private element: ElementRef) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
        templateHost.setHost(this);
    }

    setTemplate(template: DxTemplateDirective) {
        this.template = template;
    }
    ngAfterViewInit() {
        extractTemplate(this, this.element, this.renderer, this.document);
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiGanttColumnComponent
  ],
  exports: [
    DxiGanttColumnComponent
  ],
})
export class DxiGanttColumnModule { }

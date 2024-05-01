/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { DataType } from 'devextreme/common';
import { Store } from 'devextreme/data';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { Format } from 'devextreme/localization';
import { FilterBuilderOperation } from 'devextreme/ui/filter_builder';
import { format } from 'devextreme/ui/widget/ui.widget';

@Component({
    template: ''
})
export abstract class DxiFilterBuilderField extends CollectionNestedOption {
    get calculateFilterExpression(): Function {
        return this._getOption('calculateFilterExpression');
    }
    set calculateFilterExpression(value: Function) {
        this._setOption('calculateFilterExpression', value);
    }

    get caption(): string | undefined {
        return this._getOption('caption');
    }
    set caption(value: string | undefined) {
        this._setOption('caption', value);
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

    get dataType(): DataType | string {
        return this._getOption('dataType');
    }
    set dataType(value: DataType | string) {
        this._setOption('dataType', value);
    }

    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
        this._setOption('editorOptions', value);
    }

    get editorTemplate(): any {
        return this._getOption('editorTemplate');
    }
    set editorTemplate(value: any) {
        this._setOption('editorTemplate', value);
    }

    get falseText(): string {
        return this._getOption('falseText');
    }
    set falseText(value: string) {
        this._setOption('falseText', value);
    }

    get filterOperations(): Array<FilterBuilderOperation | string> {
        return this._getOption('filterOperations');
    }
    set filterOperations(value: Array<FilterBuilderOperation | string>) {
        this._setOption('filterOperations', value);
    }

    get format(): Format | string | format {
        return this._getOption('format');
    }
    set format(value: Format | string | format) {
        this._setOption('format', value);
    }

    get lookup(): { allowClearing?: boolean, dataSource?: DataSourceOptions | Store | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: Function | string | undefined } {
        return this._getOption('lookup');
    }
    set lookup(value: { allowClearing?: boolean, dataSource?: DataSourceOptions | Store | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: Function | string | undefined }) {
        this._setOption('lookup', value);
    }

    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    get trueText(): string {
        return this._getOption('trueText');
    }
    set trueText(value: string) {
        this._setOption('trueText', value);
    }

    get allowCrossGroupCalculation(): boolean {
        return this._getOption('allowCrossGroupCalculation');
    }
    set allowCrossGroupCalculation(value: boolean) {
        this._setOption('allowCrossGroupCalculation', value);
    }

    get allowExpandAll(): boolean {
        return this._getOption('allowExpandAll');
    }
    set allowExpandAll(value: boolean) {
        this._setOption('allowExpandAll', value);
    }

    get allowFiltering(): boolean {
        return this._getOption('allowFiltering');
    }
    set allowFiltering(value: boolean) {
        this._setOption('allowFiltering', value);
    }

    get allowSorting(): boolean {
        return this._getOption('allowSorting');
    }
    set allowSorting(value: boolean) {
        this._setOption('allowSorting', value);
    }

    get allowSortingBySummary(): boolean {
        return this._getOption('allowSortingBySummary');
    }
    set allowSortingBySummary(value: boolean) {
        this._setOption('allowSortingBySummary', value);
    }

    get area(): string {
        return this._getOption('area');
    }
    set area(value: string) {
        this._setOption('area', value);
    }

    get areaIndex(): number {
        return this._getOption('areaIndex');
    }
    set areaIndex(value: number) {
        this._setOption('areaIndex', value);
    }

    get calculateCustomSummary(): Function {
        return this._getOption('calculateCustomSummary');
    }
    set calculateCustomSummary(value: Function) {
        this._setOption('calculateCustomSummary', value);
    }

    get calculateSummaryValue(): Function {
        return this._getOption('calculateSummaryValue');
    }
    set calculateSummaryValue(value: Function) {
        this._setOption('calculateSummaryValue', value);
    }

    get displayFolder(): string {
        return this._getOption('displayFolder');
    }
    set displayFolder(value: string) {
        this._setOption('displayFolder', value);
    }

    get expanded(): boolean {
        return this._getOption('expanded');
    }
    set expanded(value: boolean) {
        this._setOption('expanded', value);
    }

    get filterType(): string {
        return this._getOption('filterType');
    }
    set filterType(value: string) {
        this._setOption('filterType', value);
    }

    get filterValues(): Array<any> {
        return this._getOption('filterValues');
    }
    set filterValues(value: Array<any>) {
        this._setOption('filterValues', value);
    }

    get groupIndex(): number {
        return this._getOption('groupIndex');
    }
    set groupIndex(value: number) {
        this._setOption('groupIndex', value);
    }

    get groupInterval(): number | string {
        return this._getOption('groupInterval');
    }
    set groupInterval(value: number | string) {
        this._setOption('groupInterval', value);
    }

    get groupName(): string {
        return this._getOption('groupName');
    }
    set groupName(value: string) {
        this._setOption('groupName', value);
    }

    get headerFilter(): { allowSearch?: boolean, height?: number, width?: number } {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: { allowSearch?: boolean, height?: number, width?: number }) {
        this._setOption('headerFilter', value);
    }

    get isMeasure(): boolean {
        return this._getOption('isMeasure');
    }
    set isMeasure(value: boolean) {
        this._setOption('isMeasure', value);
    }

    get precision(): number {
        return this._getOption('precision');
    }
    set precision(value: number) {
        this._setOption('precision', value);
    }

    get runningTotal(): string {
        return this._getOption('runningTotal');
    }
    set runningTotal(value: string) {
        this._setOption('runningTotal', value);
    }

    get selector(): Function {
        return this._getOption('selector');
    }
    set selector(value: Function) {
        this._setOption('selector', value);
    }

    get showGrandTotals(): boolean {
        return this._getOption('showGrandTotals');
    }
    set showGrandTotals(value: boolean) {
        this._setOption('showGrandTotals', value);
    }

    get showTotals(): boolean {
        return this._getOption('showTotals');
    }
    set showTotals(value: boolean) {
        this._setOption('showTotals', value);
    }

    get showValues(): boolean {
        return this._getOption('showValues');
    }
    set showValues(value: boolean) {
        this._setOption('showValues', value);
    }

    get sortBy(): string {
        return this._getOption('sortBy');
    }
    set sortBy(value: string) {
        this._setOption('sortBy', value);
    }

    get sortBySummaryField(): string {
        return this._getOption('sortBySummaryField');
    }
    set sortBySummaryField(value: string) {
        this._setOption('sortBySummaryField', value);
    }

    get sortBySummaryPath(): Array<number | string> {
        return this._getOption('sortBySummaryPath');
    }
    set sortBySummaryPath(value: Array<number | string>) {
        this._setOption('sortBySummaryPath', value);
    }

    get sortingMethod(): Function {
        return this._getOption('sortingMethod');
    }
    set sortingMethod(value: Function) {
        this._setOption('sortingMethod', value);
    }

    get sortOrder(): string {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: string) {
        this._setOption('sortOrder', value);
    }

    get summaryDisplayMode(): string {
        return this._getOption('summaryDisplayMode');
    }
    set summaryDisplayMode(value: string) {
        this._setOption('summaryDisplayMode', value);
    }

    get summaryType(): string {
        return this._getOption('summaryType');
    }
    set summaryType(value: string) {
        this._setOption('summaryType', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }

    get wordWrapEnabled(): boolean {
        return this._getOption('wordWrapEnabled');
    }
    set wordWrapEnabled(value: boolean) {
        this._setOption('wordWrapEnabled', value);
    }
}

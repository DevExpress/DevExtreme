/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { format } from 'devextreme/ui/widget/ui.widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-field-pivot-grid',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiFieldPivotGridComponent extends CollectionNestedOption {
    @Input()
    get allowCrossGroupCalculation(): boolean {
        return this._getOption('allowCrossGroupCalculation');
    }
    set allowCrossGroupCalculation(value: boolean) {
        this._setOption('allowCrossGroupCalculation', value);
    }

    @Input()
    get allowExpandAll(): boolean {
        return this._getOption('allowExpandAll');
    }
    set allowExpandAll(value: boolean) {
        this._setOption('allowExpandAll', value);
    }

    @Input()
    get allowFiltering(): boolean {
        return this._getOption('allowFiltering');
    }
    set allowFiltering(value: boolean) {
        this._setOption('allowFiltering', value);
    }

    @Input()
    get allowSorting(): boolean {
        return this._getOption('allowSorting');
    }
    set allowSorting(value: boolean) {
        this._setOption('allowSorting', value);
    }

    @Input()
    get allowSortingBySummary(): boolean {
        return this._getOption('allowSortingBySummary');
    }
    set allowSortingBySummary(value: boolean) {
        this._setOption('allowSortingBySummary', value);
    }

    @Input()
    get area(): string {
        return this._getOption('area');
    }
    set area(value: string) {
        this._setOption('area', value);
    }

    @Input()
    get areaIndex(): number {
        return this._getOption('areaIndex');
    }
    set areaIndex(value: number) {
        this._setOption('areaIndex', value);
    }

    @Input()
    get calculateCustomSummary(): Function {
        return this._getOption('calculateCustomSummary');
    }
    set calculateCustomSummary(value: Function) {
        this._setOption('calculateCustomSummary', value);
    }

    @Input()
    get calculateSummaryValue(): Function {
        return this._getOption('calculateSummaryValue');
    }
    set calculateSummaryValue(value: Function) {
        this._setOption('calculateSummaryValue', value);
    }

    @Input()
    get caption(): string {
        return this._getOption('caption');
    }
    set caption(value: string) {
        this._setOption('caption', value);
    }

    @Input()
    get customizeText(): Function {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function) {
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
    get dataType(): string {
        return this._getOption('dataType');
    }
    set dataType(value: string) {
        this._setOption('dataType', value);
    }

    @Input()
    get displayFolder(): string {
        return this._getOption('displayFolder');
    }
    set displayFolder(value: string) {
        this._setOption('displayFolder', value);
    }

    @Input()
    get expanded(): boolean {
        return this._getOption('expanded');
    }
    set expanded(value: boolean) {
        this._setOption('expanded', value);
    }

    @Input()
    get filterType(): string {
        return this._getOption('filterType');
    }
    set filterType(value: string) {
        this._setOption('filterType', value);
    }

    @Input()
    get filterValues(): Array<any> {
        return this._getOption('filterValues');
    }
    set filterValues(value: Array<any>) {
        this._setOption('filterValues', value);
    }

    @Input()
    get format(): format | string {
        return this._getOption('format');
    }
    set format(value: format | string) {
        this._setOption('format', value);
    }

    @Input()
    get groupIndex(): number {
        return this._getOption('groupIndex');
    }
    set groupIndex(value: number) {
        this._setOption('groupIndex', value);
    }

    @Input()
    get groupInterval(): number | string {
        return this._getOption('groupInterval');
    }
    set groupInterval(value: number | string) {
        this._setOption('groupInterval', value);
    }

    @Input()
    get groupName(): string {
        return this._getOption('groupName');
    }
    set groupName(value: string) {
        this._setOption('groupName', value);
    }

    @Input()
    get headerFilter(): { allowSearch?: boolean, height?: number, width?: number } {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: { allowSearch?: boolean, height?: number, width?: number }) {
        this._setOption('headerFilter', value);
    }

    @Input()
    get isMeasure(): boolean {
        return this._getOption('isMeasure');
    }
    set isMeasure(value: boolean) {
        this._setOption('isMeasure', value);
    }

    @Input()
    get precision(): number {
        return this._getOption('precision');
    }
    set precision(value: number) {
        this._setOption('precision', value);
    }

    @Input()
    get runningTotal(): string {
        return this._getOption('runningTotal');
    }
    set runningTotal(value: string) {
        this._setOption('runningTotal', value);
    }

    @Input()
    get selector(): Function {
        return this._getOption('selector');
    }
    set selector(value: Function) {
        this._setOption('selector', value);
    }

    @Input()
    get showGrandTotals(): boolean {
        return this._getOption('showGrandTotals');
    }
    set showGrandTotals(value: boolean) {
        this._setOption('showGrandTotals', value);
    }

    @Input()
    get showTotals(): boolean {
        return this._getOption('showTotals');
    }
    set showTotals(value: boolean) {
        this._setOption('showTotals', value);
    }

    @Input()
    get showValues(): boolean {
        return this._getOption('showValues');
    }
    set showValues(value: boolean) {
        this._setOption('showValues', value);
    }

    @Input()
    get sortBy(): string {
        return this._getOption('sortBy');
    }
    set sortBy(value: string) {
        this._setOption('sortBy', value);
    }

    @Input()
    get sortBySummaryField(): string {
        return this._getOption('sortBySummaryField');
    }
    set sortBySummaryField(value: string) {
        this._setOption('sortBySummaryField', value);
    }

    @Input()
    get sortBySummaryPath(): Array<number | string> {
        return this._getOption('sortBySummaryPath');
    }
    set sortBySummaryPath(value: Array<number | string>) {
        this._setOption('sortBySummaryPath', value);
    }

    @Input()
    get sortingMethod(): Function {
        return this._getOption('sortingMethod');
    }
    set sortingMethod(value: Function) {
        this._setOption('sortingMethod', value);
    }

    @Input()
    get sortOrder(): string {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: string) {
        this._setOption('sortOrder', value);
    }

    @Input()
    get summaryDisplayMode(): string {
        return this._getOption('summaryDisplayMode');
    }
    set summaryDisplayMode(value: string) {
        this._setOption('summaryDisplayMode', value);
    }

    @Input()
    get summaryType(): string {
        return this._getOption('summaryType');
    }
    set summaryType(value: string) {
        this._setOption('summaryType', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }

    @Input()
    get wordWrapEnabled(): boolean {
        return this._getOption('wordWrapEnabled');
    }
    set wordWrapEnabled(value: boolean) {
        this._setOption('wordWrapEnabled', value);
    }


    protected get _optionPath() {
        return 'fields';
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
    DxiFieldPivotGridComponent
  ],
  exports: [
    DxiFieldPivotGridComponent
  ],
})
export class DxiFieldPivotGridModule { }

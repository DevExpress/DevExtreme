/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import * as CommonChartTypes from 'devextreme/common/charts';
import { ScaleBreak } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-chart-value-axis',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiChartValueAxisComponent extends CollectionNestedOption {
    @Input()
    get aggregatedPointsPosition(): "betweenTicks" | "crossTicks" {
        return this._getOption('aggregatedPointsPosition');
    }
    set aggregatedPointsPosition(value: "betweenTicks" | "crossTicks") {
        this._setOption('aggregatedPointsPosition', value);
    }

    @Input()
    get allowDecimals(): boolean {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean) {
        this._setOption('allowDecimals', value);
    }

    @Input()
    get autoBreaksEnabled(): boolean {
        return this._getOption('autoBreaksEnabled');
    }
    set autoBreaksEnabled(value: boolean) {
        this._setOption('autoBreaksEnabled', value);
    }

    @Input()
    get axisDivisionFactor(): number {
        return this._getOption('axisDivisionFactor');
    }
    set axisDivisionFactor(value: number) {
        this._setOption('axisDivisionFactor', value);
    }

    @Input()
    get breaks(): Array<ScaleBreak> {
        return this._getOption('breaks');
    }
    set breaks(value: Array<ScaleBreak>) {
        this._setOption('breaks', value);
    }

    @Input()
    get breakStyle(): Record<string, any> {
        return this._getOption('breakStyle');
    }
    set breakStyle(value: Record<string, any>) {
        this._setOption('breakStyle', value);
    }

    @Input()
    get categories(): Array<Date | number | string> {
        return this._getOption('categories');
    }
    set categories(value: Array<Date | number | string>) {
        this._setOption('categories', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get constantLines(): Array<Record<string, any>> {
        return this._getOption('constantLines');
    }
    set constantLines(value: Array<Record<string, any>>) {
        this._setOption('constantLines', value);
    }

    @Input()
    get constantLineStyle(): Record<string, any> {
        return this._getOption('constantLineStyle');
    }
    set constantLineStyle(value: Record<string, any>) {
        this._setOption('constantLineStyle', value);
    }

    @Input()
    get customPosition(): Date | number | string {
        return this._getOption('customPosition');
    }
    set customPosition(value: Date | number | string) {
        this._setOption('customPosition', value);
    }

    @Input()
    get discreteAxisDivisionMode(): "betweenLabels" | "crossLabels" {
        return this._getOption('discreteAxisDivisionMode');
    }
    set discreteAxisDivisionMode(value: "betweenLabels" | "crossLabels") {
        this._setOption('discreteAxisDivisionMode', value);
    }

    @Input()
    get endOnTick(): boolean {
        return this._getOption('endOnTick');
    }
    set endOnTick(value: boolean) {
        this._setOption('endOnTick', value);
    }

    @Input()
    get grid(): Record<string, any> {
        return this._getOption('grid');
    }
    set grid(value: Record<string, any>) {
        this._setOption('grid', value);
    }

    @Input()
    get inverted(): boolean {
        return this._getOption('inverted');
    }
    set inverted(value: boolean) {
        this._setOption('inverted', value);
    }

    @Input()
    get label(): Record<string, any> {
        return this._getOption('label');
    }
    set label(value: Record<string, any>) {
        this._setOption('label', value);
    }

    @Input()
    get linearThreshold(): number {
        return this._getOption('linearThreshold');
    }
    set linearThreshold(value: number) {
        this._setOption('linearThreshold', value);
    }

    @Input()
    get logarithmBase(): number {
        return this._getOption('logarithmBase');
    }
    set logarithmBase(value: number) {
        this._setOption('logarithmBase', value);
    }

    @Input()
    get maxAutoBreakCount(): number {
        return this._getOption('maxAutoBreakCount');
    }
    set maxAutoBreakCount(value: number) {
        this._setOption('maxAutoBreakCount', value);
    }

    @Input()
    get maxValueMargin(): number {
        return this._getOption('maxValueMargin');
    }
    set maxValueMargin(value: number) {
        this._setOption('maxValueMargin', value);
    }

    @Input()
    get minorGrid(): Record<string, any> {
        return this._getOption('minorGrid');
    }
    set minorGrid(value: Record<string, any>) {
        this._setOption('minorGrid', value);
    }

    @Input()
    get minorTick(): Record<string, any> {
        return this._getOption('minorTick');
    }
    set minorTick(value: Record<string, any>) {
        this._setOption('minorTick', value);
    }

    @Input()
    get minorTickCount(): number {
        return this._getOption('minorTickCount');
    }
    set minorTickCount(value: number) {
        this._setOption('minorTickCount', value);
    }

    @Input()
    get minorTickInterval(): number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" {
        return this._getOption('minorTickInterval');
    }
    set minorTickInterval(value: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year") {
        this._setOption('minorTickInterval', value);
    }

    @Input()
    get minValueMargin(): number {
        return this._getOption('minValueMargin');
    }
    set minValueMargin(value: number) {
        this._setOption('minValueMargin', value);
    }

    @Input()
    get minVisualRangeLength(): number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" {
        return this._getOption('minVisualRangeLength');
    }
    set minVisualRangeLength(value: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year") {
        this._setOption('minVisualRangeLength', value);
    }

    @Input()
    get multipleAxesSpacing(): number {
        return this._getOption('multipleAxesSpacing');
    }
    set multipleAxesSpacing(value: number) {
        this._setOption('multipleAxesSpacing', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get offset(): number {
        return this._getOption('offset');
    }
    set offset(value: number) {
        this._setOption('offset', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get pane(): string {
        return this._getOption('pane');
    }
    set pane(value: string) {
        this._setOption('pane', value);
    }

    @Input()
    get placeholderSize(): number {
        return this._getOption('placeholderSize');
    }
    set placeholderSize(value: number) {
        this._setOption('placeholderSize', value);
    }

    @Input()
    get position(): "bottom" | "left" | "right" | "top" {
        return this._getOption('position');
    }
    set position(value: "bottom" | "left" | "right" | "top") {
        this._setOption('position', value);
    }

    @Input()
    get showZero(): boolean {
        return this._getOption('showZero');
    }
    set showZero(value: boolean) {
        this._setOption('showZero', value);
    }

    @Input()
    get strips(): Array<Record<string, any>> {
        return this._getOption('strips');
    }
    set strips(value: Array<Record<string, any>>) {
        this._setOption('strips', value);
    }

    @Input()
    get stripStyle(): Record<string, any> {
        return this._getOption('stripStyle');
    }
    set stripStyle(value: Record<string, any>) {
        this._setOption('stripStyle', value);
    }

    @Input()
    get synchronizedValue(): number {
        return this._getOption('synchronizedValue');
    }
    set synchronizedValue(value: number) {
        this._setOption('synchronizedValue', value);
    }

    @Input()
    get tick(): Record<string, any> {
        return this._getOption('tick');
    }
    set tick(value: Record<string, any>) {
        this._setOption('tick', value);
    }

    @Input()
    get tickInterval(): number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" {
        return this._getOption('tickInterval');
    }
    set tickInterval(value: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year") {
        this._setOption('tickInterval', value);
    }

    @Input()
    get title(): Record<string, any> | string {
        return this._getOption('title');
    }
    set title(value: Record<string, any> | string) {
        this._setOption('title', value);
    }

    @Input()
    get type(): "continuous" | "discrete" | "logarithmic" {
        return this._getOption('type');
    }
    set type(value: "continuous" | "discrete" | "logarithmic") {
        this._setOption('type', value);
    }

    @Input()
    get valueMarginsEnabled(): boolean {
        return this._getOption('valueMarginsEnabled');
    }
    set valueMarginsEnabled(value: boolean) {
        this._setOption('valueMarginsEnabled', value);
    }

    @Input()
    get valueType(): "datetime" | "numeric" | "string" {
        return this._getOption('valueType');
    }
    set valueType(value: "datetime" | "numeric" | "string") {
        this._setOption('valueType', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get visualRange(): Array<Date | number | string> | CommonChartTypes.VisualRange {
        return this._getOption('visualRange');
    }
    set visualRange(value: Array<Date | number | string> | CommonChartTypes.VisualRange) {
        this._setOption('visualRange', value);
    }

    @Input()
    get visualRangeUpdateMode(): "auto" | "keep" | "reset" | "shift" {
        return this._getOption('visualRangeUpdateMode');
    }
    set visualRangeUpdateMode(value: "auto" | "keep" | "reset" | "shift") {
        this._setOption('visualRangeUpdateMode', value);
    }

    @Input()
    get wholeRange(): Array<Date | number | string> | CommonChartTypes.VisualRange {
        return this._getOption('wholeRange');
    }
    set wholeRange(value: Array<Date | number | string> | CommonChartTypes.VisualRange) {
        this._setOption('wholeRange', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'valueAxis';
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
    DxiChartValueAxisComponent
  ],
  exports: [
    DxiChartValueAxisComponent
  ],
})
export class DxiChartValueAxisModule { }

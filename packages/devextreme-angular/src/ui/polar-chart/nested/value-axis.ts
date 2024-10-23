/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import * as LocalizationTypes from 'devextreme/localization';
import * as CommonChartTypes from 'devextreme/common/charts';
import { Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-polar-chart-value-axis',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartValueAxisComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDecimals(): boolean {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean) {
        this._setOption('allowDecimals', value);
    }

    @Input()
    get axisDivisionFactor(): number {
        return this._getOption('axisDivisionFactor');
    }
    set axisDivisionFactor(value: number) {
        this._setOption('axisDivisionFactor', value);
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
    get constantLines(): Array<Record<string, any>> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", displayBehindSeries?: boolean, extendAxis?: boolean, label?: Record<string, any> | { font?: Font, text?: string, visible?: boolean }, value?: Date | number | string, width?: number }[] {
        return this._getOption('constantLines');
    }
    set constantLines(value: Array<Record<string, any>> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", displayBehindSeries?: boolean, extendAxis?: boolean, label?: Record<string, any> | { font?: Font, text?: string, visible?: boolean }, value?: Date | number | string, width?: number }[]) {
        this._setOption('constantLines', value);
    }

    @Input()
    get constantLineStyle(): Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", label?: Record<string, any> | { font?: Font, visible?: boolean }, width?: number } {
        return this._getOption('constantLineStyle');
    }
    set constantLineStyle(value: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", label?: Record<string, any> | { font?: Font, visible?: boolean }, width?: number }) {
        this._setOption('constantLineStyle', value);
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
    get grid(): Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('grid');
    }
    set grid(value: Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number }) {
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
    get label(): Record<string, any> | { customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string), customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, indentFromAxis?: number, overlappingBehavior?: "hide" | "none", visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { customizeHint?: ((axisValue: { value: Date | number | string, valueText: string }) => string), customizeText?: ((axisValue: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, indentFromAxis?: number, overlappingBehavior?: "hide" | "none", visible?: boolean }) {
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
    get maxValueMargin(): number {
        return this._getOption('maxValueMargin');
    }
    set maxValueMargin(value: number) {
        this._setOption('maxValueMargin', value);
    }

    @Input()
    get minorGrid(): Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('minorGrid');
    }
    set minorGrid(value: Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('minorGrid', value);
    }

    @Input()
    get minorTick(): Record<string, any> | { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('minorTick');
    }
    set minorTick(value: Record<string, any> | { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }) {
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
    get minorTickInterval(): number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minorTickInterval');
    }
    set minorTickInterval(value: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
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
    get minVisualRangeLength(): number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minVisualRangeLength');
    }
    set minVisualRangeLength(value: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('minVisualRangeLength', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get showZero(): boolean {
        return this._getOption('showZero');
    }
    set showZero(value: boolean) {
        this._setOption('showZero', value);
    }

    @Input()
    get strips(): Array<Record<string, any>> | { color?: string, endValue?: Date | number | string, label?: Record<string, any> | { font?: Font, text?: string }, startValue?: Date | number | string }[] {
        return this._getOption('strips');
    }
    set strips(value: Array<Record<string, any>> | { color?: string, endValue?: Date | number | string, label?: Record<string, any> | { font?: Font, text?: string }, startValue?: Date | number | string }[]) {
        this._setOption('strips', value);
    }

    @Input()
    get stripStyle(): Record<string, any> | { label?: Record<string, any> | { font?: Font } } {
        return this._getOption('stripStyle');
    }
    set stripStyle(value: Record<string, any> | { label?: Record<string, any> | { font?: Font } }) {
        this._setOption('stripStyle', value);
    }

    @Input()
    get tick(): Record<string, any> | { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('tick');
    }
    set tick(value: Record<string, any> | { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('tick', value);
    }

    @Input()
    get tickInterval(): number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('tickInterval');
    }
    set tickInterval(value: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('tickInterval', value);
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
    get visualRangeUpdateMode(): "auto" | "keep" | "reset" {
        return this._getOption('visualRangeUpdateMode');
    }
    set visualRangeUpdateMode(value: "auto" | "keep" | "reset") {
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


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoPolarChartValueAxisComponent
  ],
  exports: [
    DxoPolarChartValueAxisComponent
  ],
})
export class DxoPolarChartValueAxisModule { }

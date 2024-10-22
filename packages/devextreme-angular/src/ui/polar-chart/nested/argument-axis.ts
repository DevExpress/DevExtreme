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
import { Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-polar-chart-argument-axis',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartArgumentAxisComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDecimals(): boolean {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean) {
        this._setOption('allowDecimals', value);
    }

    @Input()
    get argumentType(): "datetime" | "numeric" | "string" {
        return this._getOption('argumentType');
    }
    set argumentType(value: "datetime" | "numeric" | "string") {
        this._setOption('argumentType', value);
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
    get constantLines(): Array<Record<string, any>> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", displayBehindSeries?: boolean, extendAxis?: boolean, label?: Record<string, any>, value?: Date | number | string, width?: number }[] {
        return this._getOption('constantLines');
    }
    set constantLines(value: Array<Record<string, any>> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", displayBehindSeries?: boolean, extendAxis?: boolean, label?: Record<string, any>, value?: Date | number | string, width?: number }[]) {
        this._setOption('constantLines', value);
    }

    @Input()
    get constantLineStyle(): Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", label?: Record<string, any>, width?: number } {
        return this._getOption('constantLineStyle');
    }
    set constantLineStyle(value: Record<string, any> | { color?: string, dashStyle?: "dash" | "dot" | "longDash" | "solid", label?: Record<string, any>, width?: number }) {
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
    get firstPointOnStartAngle(): boolean {
        return this._getOption('firstPointOnStartAngle');
    }
    set firstPointOnStartAngle(value: boolean) {
        this._setOption('firstPointOnStartAngle', value);
    }

    @Input()
    get grid(): Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('grid');
    }
    set grid(value: Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('grid', value);
    }

    @Input()
    get hoverMode(): "allArgumentPoints" | "none" {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: "allArgumentPoints" | "none") {
        this._setOption('hoverMode', value);
    }

    @Input()
    get inverted(): boolean {
        return this._getOption('inverted');
    }
    set inverted(value: boolean) {
        this._setOption('inverted', value);
    }

    @Input()
    get label(): Record<string, any> | { customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, indentFromAxis?: number, overlappingBehavior?: "hide" | "none", visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, indentFromAxis?: number, overlappingBehavior?: "hide" | "none", visible?: boolean }) {
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
    get minorGrid(): Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('minorGrid');
    }
    set minorGrid(value: Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('minorGrid', value);
    }

    @Input()
    get minorTick(): Record<string, any> | { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number } {
        return this._getOption('minorTick');
    }
    set minorTick(value: Record<string, any> | { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }) {
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
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get originValue(): number {
        return this._getOption('originValue');
    }
    set originValue(value: number) {
        this._setOption('originValue', value);
    }

    @Input()
    get period(): number {
        return this._getOption('period');
    }
    set period(value: number) {
        this._setOption('period', value);
    }

    @Input()
    get startAngle(): number {
        return this._getOption('startAngle');
    }
    set startAngle(value: number) {
        this._setOption('startAngle', value);
    }

    @Input()
    get strips(): Array<Record<string, any>> | { color?: string, endValue?: Date | number | string, label?: Record<string, any>, startValue?: Date | number | string }[] {
        return this._getOption('strips');
    }
    set strips(value: Array<Record<string, any>> | { color?: string, endValue?: Date | number | string, label?: Record<string, any>, startValue?: Date | number | string }[]) {
        this._setOption('strips', value);
    }

    @Input()
    get stripStyle(): Record<string, any> | { label?: Record<string, any> } {
        return this._getOption('stripStyle');
    }
    set stripStyle(value: Record<string, any> | { label?: Record<string, any> }) {
        this._setOption('stripStyle', value);
    }

    @Input()
    get tick(): Record<string, any> | { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number } {
        return this._getOption('tick');
    }
    set tick(value: Record<string, any> | { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }) {
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


    protected get _optionPath() {
        return 'argumentAxis';
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
    DxoPolarChartArgumentAxisComponent
  ],
  exports: [
    DxoPolarChartArgumentAxisComponent
  ],
})
export class DxoPolarChartArgumentAxisModule { }

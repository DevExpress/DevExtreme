/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { ChartsDataType, DashStyle, Font, DiscreteAxisDivisionMode, ArgumentAxisHoverMode, LabelOverlap, TimeInterval, AxisScaleType } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiPolarChartConstantLineComponent } from './constant-line-dxi';
import { DxiPolarChartStripComponent } from './strip-dxi';


@Component({
    selector: 'dxo-polar-chart-argument-axis',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartArgumentAxisComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDecimals(): boolean | undefined {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean | undefined) {
        this._setOption('allowDecimals', value);
    }

    @Input()
    get argumentType(): ChartsDataType | undefined {
        return this._getOption('argumentType');
    }
    set argumentType(value: ChartsDataType | undefined) {
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
    get constantLines(): { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }[] {
        return this._getOption('constantLines');
    }
    set constantLines(value: { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }[]) {
        this._setOption('constantLines', value);
    }

    @Input()
    get constantLineStyle(): { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number } {
        return this._getOption('constantLineStyle');
    }
    set constantLineStyle(value: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }) {
        this._setOption('constantLineStyle', value);
    }

    @Input()
    get discreteAxisDivisionMode(): DiscreteAxisDivisionMode {
        return this._getOption('discreteAxisDivisionMode');
    }
    set discreteAxisDivisionMode(value: DiscreteAxisDivisionMode) {
        this._setOption('discreteAxisDivisionMode', value);
    }

    @Input()
    get endOnTick(): boolean | undefined {
        return this._getOption('endOnTick');
    }
    set endOnTick(value: boolean | undefined) {
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
    get grid(): { color?: string, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('grid');
    }
    set grid(value: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }) {
        this._setOption('grid', value);
    }

    @Input()
    get hoverMode(): ArgumentAxisHoverMode {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: ArgumentAxisHoverMode) {
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
    get label(): { customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { customizeHint?: ((argument: { value: Date | number | string, valueText: string }) => string), customizeText?: ((argument: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: Format | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get linearThreshold(): number | undefined {
        return this._getOption('linearThreshold');
    }
    set linearThreshold(value: number | undefined) {
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
    get minorGrid(): { color?: string, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('minorGrid');
    }
    set minorGrid(value: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }) {
        this._setOption('minorGrid', value);
    }

    @Input()
    get minorTick(): { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number } {
        return this._getOption('minorTick');
    }
    set minorTick(value: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number }) {
        this._setOption('minorTick', value);
    }

    @Input()
    get minorTickCount(): number | undefined {
        return this._getOption('minorTickCount');
    }
    set minorTickCount(value: number | undefined) {
        this._setOption('minorTickCount', value);
    }

    @Input()
    get minorTickInterval(): number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minorTickInterval');
    }
    set minorTickInterval(value: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('minorTickInterval', value);
    }

    @Input()
    get opacity(): number | undefined {
        return this._getOption('opacity');
    }
    set opacity(value: number | undefined) {
        this._setOption('opacity', value);
    }

    @Input()
    get originValue(): number | undefined {
        return this._getOption('originValue');
    }
    set originValue(value: number | undefined) {
        this._setOption('originValue', value);
    }

    @Input()
    get period(): number | undefined {
        return this._getOption('period');
    }
    set period(value: number | undefined) {
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
    get strips(): { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }[] {
        return this._getOption('strips');
    }
    set strips(value: { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }[]) {
        this._setOption('strips', value);
    }

    @Input()
    get stripStyle(): { label?: { font?: Font } } {
        return this._getOption('stripStyle');
    }
    set stripStyle(value: { label?: { font?: Font } }) {
        this._setOption('stripStyle', value);
    }

    @Input()
    get tick(): { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number } {
        return this._getOption('tick');
    }
    set tick(value: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }) {
        this._setOption('tick', value);
    }

    @Input()
    get tickInterval(): number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('tickInterval');
    }
    set tickInterval(value: number | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('tickInterval', value);
    }

    @Input()
    get type(): AxisScaleType | undefined {
        return this._getOption('type');
    }
    set type(value: AxisScaleType | undefined) {
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


    @ContentChildren(forwardRef(() => DxiPolarChartConstantLineComponent))
    get constantLinesChildren(): QueryList<DxiPolarChartConstantLineComponent> {
        return this._getOption('constantLines');
    }
    set constantLinesChildren(value) {
        this.setChildren('constantLines', value);
    }

    @ContentChildren(forwardRef(() => DxiPolarChartStripComponent))
    get stripsChildren(): QueryList<DxiPolarChartStripComponent> {
        return this._getOption('strips');
    }
    set stripsChildren(value) {
        this.setChildren('strips', value);
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

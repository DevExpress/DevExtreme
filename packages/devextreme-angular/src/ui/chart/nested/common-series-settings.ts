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
import { chartPointAggregationInfoObject, chartSeriesObject } from 'devextreme/viz/chart';
import { ChartsColor, Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-common-series-settings',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartCommonSeriesSettingsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get aggregation(): Record<string, any> | { calculate: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>), enabled: boolean, method: "avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom" } {
        return this._getOption('aggregation');
    }
    set aggregation(value: Record<string, any> | { calculate: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>), enabled: boolean, method: "avg" | "count" | "max" | "min" | "ohlc" | "range" | "sum" | "custom" }) {
        this._setOption('aggregation', value);
    }

    @Input()
    get area(): any {
        return this._getOption('area');
    }
    set area(value: any) {
        this._setOption('area', value);
    }

    @Input()
    get argumentField(): string {
        return this._getOption('argumentField');
    }
    set argumentField(value: string) {
        this._setOption('argumentField', value);
    }

    @Input()
    get axis(): string {
        return this._getOption('axis');
    }
    set axis(value: string) {
        this._setOption('axis', value);
    }

    @Input()
    get bar(): any {
        return this._getOption('bar');
    }
    set bar(value: any) {
        this._setOption('bar', value);
    }

    @Input()
    get barOverlapGroup(): string {
        return this._getOption('barOverlapGroup');
    }
    set barOverlapGroup(value: string) {
        this._setOption('barOverlapGroup', value);
    }

    @Input()
    get barPadding(): number {
        return this._getOption('barPadding');
    }
    set barPadding(value: number) {
        this._setOption('barPadding', value);
    }

    @Input()
    get barWidth(): number {
        return this._getOption('barWidth');
    }
    set barWidth(value: number) {
        this._setOption('barWidth', value);
    }

    @Input()
    get border(): Record<string, any> | { color: string, dashStyle: "dash" | "dot" | "longDash" | "solid", visible: boolean, width: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color: string, dashStyle: "dash" | "dot" | "longDash" | "solid", visible: boolean, width: number }) {
        this._setOption('border', value);
    }

    @Input()
    get bubble(): any {
        return this._getOption('bubble');
    }
    set bubble(value: any) {
        this._setOption('bubble', value);
    }

    @Input()
    get candlestick(): any {
        return this._getOption('candlestick');
    }
    set candlestick(value: any) {
        this._setOption('candlestick', value);
    }

    @Input()
    get closeValueField(): string {
        return this._getOption('closeValueField');
    }
    set closeValueField(value: string) {
        this._setOption('closeValueField', value);
    }

    @Input()
    get color(): ChartsColor | string {
        return this._getOption('color');
    }
    set color(value: ChartsColor | string) {
        this._setOption('color', value);
    }

    @Input()
    get cornerRadius(): number {
        return this._getOption('cornerRadius');
    }
    set cornerRadius(value: number) {
        this._setOption('cornerRadius', value);
    }

    @Input()
    get dashStyle(): "dash" | "dot" | "longDash" | "solid" {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: "dash" | "dot" | "longDash" | "solid") {
        this._setOption('dashStyle', value);
    }

    @Input()
    get fullstackedarea(): any {
        return this._getOption('fullstackedarea');
    }
    set fullstackedarea(value: any) {
        this._setOption('fullstackedarea', value);
    }

    @Input()
    get fullstackedbar(): any {
        return this._getOption('fullstackedbar');
    }
    set fullstackedbar(value: any) {
        this._setOption('fullstackedbar', value);
    }

    @Input()
    get fullstackedline(): any {
        return this._getOption('fullstackedline');
    }
    set fullstackedline(value: any) {
        this._setOption('fullstackedline', value);
    }

    @Input()
    get fullstackedspline(): any {
        return this._getOption('fullstackedspline');
    }
    set fullstackedspline(value: any) {
        this._setOption('fullstackedspline', value);
    }

    @Input()
    get fullstackedsplinearea(): any {
        return this._getOption('fullstackedsplinearea');
    }
    set fullstackedsplinearea(value: any) {
        this._setOption('fullstackedsplinearea', value);
    }

    @Input()
    get highValueField(): string {
        return this._getOption('highValueField');
    }
    set highValueField(value: string) {
        this._setOption('highValueField', value);
    }

    @Input()
    get hoverMode(): "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "nearestPoint" | "none" | "onlyPoint" {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "nearestPoint" | "none" | "onlyPoint") {
        this._setOption('hoverMode', value);
    }

    @Input()
    get hoverStyle(): Record<string, any> | { border: Record<string, any>, color: ChartsColor | string, dashStyle: "dash" | "dot" | "longDash" | "solid", hatching: Record<string, any>, highlight: boolean, width: number } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: Record<string, any> | { border: Record<string, any>, color: ChartsColor | string, dashStyle: "dash" | "dot" | "longDash" | "solid", hatching: Record<string, any>, highlight: boolean, width: number }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get ignoreEmptyPoints(): boolean {
        return this._getOption('ignoreEmptyPoints');
    }
    set ignoreEmptyPoints(value: boolean) {
        this._setOption('ignoreEmptyPoints', value);
    }

    @Input()
    get innerColor(): string {
        return this._getOption('innerColor');
    }
    set innerColor(value: string) {
        this._setOption('innerColor', value);
    }

    @Input()
    get label(): Record<string, any> | { alignment: "center" | "left" | "right", argumentFormat: LocalizationTypes.Format, backgroundColor: string, border: Record<string, any>, connector: Record<string, any>, customizeText: ((pointInfo: any) => string), displayFormat: string, font: Font, format: LocalizationTypes.Format, horizontalOffset: number, position: "inside" | "outside", rotationAngle: number, showForZeroValues: boolean, verticalOffset: number, visible: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { alignment: "center" | "left" | "right", argumentFormat: LocalizationTypes.Format, backgroundColor: string, border: Record<string, any>, connector: Record<string, any>, customizeText: ((pointInfo: any) => string), displayFormat: string, font: Font, format: LocalizationTypes.Format, horizontalOffset: number, position: "inside" | "outside", rotationAngle: number, showForZeroValues: boolean, verticalOffset: number, visible: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get line(): any {
        return this._getOption('line');
    }
    set line(value: any) {
        this._setOption('line', value);
    }

    @Input()
    get lowValueField(): string {
        return this._getOption('lowValueField');
    }
    set lowValueField(value: string) {
        this._setOption('lowValueField', value);
    }

    @Input()
    get maxLabelCount(): number {
        return this._getOption('maxLabelCount');
    }
    set maxLabelCount(value: number) {
        this._setOption('maxLabelCount', value);
    }

    @Input()
    get minBarSize(): number {
        return this._getOption('minBarSize');
    }
    set minBarSize(value: number) {
        this._setOption('minBarSize', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get openValueField(): string {
        return this._getOption('openValueField');
    }
    set openValueField(value: string) {
        this._setOption('openValueField', value);
    }

    @Input()
    get pane(): string {
        return this._getOption('pane');
    }
    set pane(value: string) {
        this._setOption('pane', value);
    }

    @Input()
    get point(): Record<string, any> | { border: Record<string, any>, color: ChartsColor | string, hoverMode: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint", hoverStyle: Record<string, any>, image: Record<string, any> | string, selectionMode: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint", selectionStyle: Record<string, any>, size: number, symbol: "circle" | "cross" | "polygon" | "square" | "triangle" | "triangleDown" | "triangleUp", visible: boolean } {
        return this._getOption('point');
    }
    set point(value: Record<string, any> | { border: Record<string, any>, color: ChartsColor | string, hoverMode: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint", hoverStyle: Record<string, any>, image: Record<string, any> | string, selectionMode: "allArgumentPoints" | "allSeriesPoints" | "none" | "onlyPoint", selectionStyle: Record<string, any>, size: number, symbol: "circle" | "cross" | "polygon" | "square" | "triangle" | "triangleDown" | "triangleUp", visible: boolean }) {
        this._setOption('point', value);
    }

    @Input()
    get rangearea(): any {
        return this._getOption('rangearea');
    }
    set rangearea(value: any) {
        this._setOption('rangearea', value);
    }

    @Input()
    get rangebar(): any {
        return this._getOption('rangebar');
    }
    set rangebar(value: any) {
        this._setOption('rangebar', value);
    }

    @Input()
    get rangeValue1Field(): string {
        return this._getOption('rangeValue1Field');
    }
    set rangeValue1Field(value: string) {
        this._setOption('rangeValue1Field', value);
    }

    @Input()
    get rangeValue2Field(): string {
        return this._getOption('rangeValue2Field');
    }
    set rangeValue2Field(value: string) {
        this._setOption('rangeValue2Field', value);
    }

    @Input()
    get reduction(): Record<string, any> | { color: string, level: "close" | "high" | "low" | "open" } {
        return this._getOption('reduction');
    }
    set reduction(value: Record<string, any> | { color: string, level: "close" | "high" | "low" | "open" }) {
        this._setOption('reduction', value);
    }

    @Input()
    get scatter(): any {
        return this._getOption('scatter');
    }
    set scatter(value: any) {
        this._setOption('scatter', value);
    }

    @Input()
    get selectionMode(): "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "none" | "onlyPoint" {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: "allArgumentPoints" | "allSeriesPoints" | "excludePoints" | "includePoints" | "none" | "onlyPoint") {
        this._setOption('selectionMode', value);
    }

    @Input()
    get selectionStyle(): Record<string, any> | { border: Record<string, any>, color: ChartsColor | string, dashStyle: "dash" | "dot" | "longDash" | "solid", hatching: Record<string, any>, highlight: boolean, width: number } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: Record<string, any> | { border: Record<string, any>, color: ChartsColor | string, dashStyle: "dash" | "dot" | "longDash" | "solid", hatching: Record<string, any>, highlight: boolean, width: number }) {
        this._setOption('selectionStyle', value);
    }

    @Input()
    get showInLegend(): boolean {
        return this._getOption('showInLegend');
    }
    set showInLegend(value: boolean) {
        this._setOption('showInLegend', value);
    }

    @Input()
    get sizeField(): string {
        return this._getOption('sizeField');
    }
    set sizeField(value: string) {
        this._setOption('sizeField', value);
    }

    @Input()
    get spline(): any {
        return this._getOption('spline');
    }
    set spline(value: any) {
        this._setOption('spline', value);
    }

    @Input()
    get splinearea(): any {
        return this._getOption('splinearea');
    }
    set splinearea(value: any) {
        this._setOption('splinearea', value);
    }

    @Input()
    get stack(): string {
        return this._getOption('stack');
    }
    set stack(value: string) {
        this._setOption('stack', value);
    }

    @Input()
    get stackedarea(): any {
        return this._getOption('stackedarea');
    }
    set stackedarea(value: any) {
        this._setOption('stackedarea', value);
    }

    @Input()
    get stackedbar(): any {
        return this._getOption('stackedbar');
    }
    set stackedbar(value: any) {
        this._setOption('stackedbar', value);
    }

    @Input()
    get stackedline(): any {
        return this._getOption('stackedline');
    }
    set stackedline(value: any) {
        this._setOption('stackedline', value);
    }

    @Input()
    get stackedspline(): any {
        return this._getOption('stackedspline');
    }
    set stackedspline(value: any) {
        this._setOption('stackedspline', value);
    }

    @Input()
    get stackedsplinearea(): any {
        return this._getOption('stackedsplinearea');
    }
    set stackedsplinearea(value: any) {
        this._setOption('stackedsplinearea', value);
    }

    @Input()
    get steparea(): any {
        return this._getOption('steparea');
    }
    set steparea(value: any) {
        this._setOption('steparea', value);
    }

    @Input()
    get stepline(): any {
        return this._getOption('stepline');
    }
    set stepline(value: any) {
        this._setOption('stepline', value);
    }

    @Input()
    get stock(): any {
        return this._getOption('stock');
    }
    set stock(value: any) {
        this._setOption('stock', value);
    }

    @Input()
    get tagField(): string {
        return this._getOption('tagField');
    }
    set tagField(value: string) {
        this._setOption('tagField', value);
    }

    @Input()
    get type(): "area" | "bar" | "bubble" | "candlestick" | "fullstackedarea" | "fullstackedbar" | "fullstackedline" | "fullstackedspline" | "fullstackedsplinearea" | "line" | "rangearea" | "rangebar" | "scatter" | "spline" | "splinearea" | "stackedarea" | "stackedbar" | "stackedline" | "stackedspline" | "stackedsplinearea" | "steparea" | "stepline" | "stock" {
        return this._getOption('type');
    }
    set type(value: "area" | "bar" | "bubble" | "candlestick" | "fullstackedarea" | "fullstackedbar" | "fullstackedline" | "fullstackedspline" | "fullstackedsplinearea" | "line" | "rangearea" | "rangebar" | "scatter" | "spline" | "splinearea" | "stackedarea" | "stackedbar" | "stackedline" | "stackedspline" | "stackedsplinearea" | "steparea" | "stepline" | "stock") {
        this._setOption('type', value);
    }

    @Input()
    get valueErrorBar(): Record<string, any> | { color: string, displayMode: "auto" | "high" | "low" | "none", edgeLength: number, highValueField: string, lineWidth: number, lowValueField: string, opacity: number, type: "fixed" | "percent" | "stdDeviation" | "stdError" | "variance", value: number } {
        return this._getOption('valueErrorBar');
    }
    set valueErrorBar(value: Record<string, any> | { color: string, displayMode: "auto" | "high" | "low" | "none", edgeLength: number, highValueField: string, lineWidth: number, lowValueField: string, opacity: number, type: "fixed" | "percent" | "stdDeviation" | "stdError" | "variance", value: number }) {
        this._setOption('valueErrorBar', value);
    }

    @Input()
    get valueField(): string {
        return this._getOption('valueField');
    }
    set valueField(value: string) {
        this._setOption('valueField', value);
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
        return 'commonSeriesSettings';
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
    DxoChartCommonSeriesSettingsComponent
  ],
  exports: [
    DxoChartCommonSeriesSettingsComponent
  ],
})
export class DxoChartCommonSeriesSettingsModule { }

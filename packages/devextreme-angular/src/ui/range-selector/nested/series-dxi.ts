/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { chartPointAggregationInfoObject, chartSeriesObject, ChartSeriesAggregationMethod, FinancialChartReductionLevel } from 'devextreme/viz/chart';
import { DashStyle, ChartsColor, SeriesHoverMode, HatchDirection, Font, RelativePosition, PointInteractionMode, PointSymbol, SeriesSelectionMode, SeriesType, ValueErrorBarDisplayMode, ValueErrorBarType } from 'devextreme/common/charts';
import { HorizontalAlignment } from 'devextreme/common';
import { Format } from 'devextreme/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-range-selector-series',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiRangeSelectorSeriesComponent extends CollectionNestedOption {
    @Input()
    get aggregation(): Record<string, any> | { calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>), enabled?: boolean, method?: ChartSeriesAggregationMethod } {
        return this._getOption('aggregation');
    }
    set aggregation(value: Record<string, any> | { calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => Record<string, any> | Array<Record<string, any>>), enabled?: boolean, method?: ChartSeriesAggregationMethod }) {
        this._setOption('aggregation', value);
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
    get border(): Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }) {
        this._setOption('border', value);
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
    get dashStyle(): DashStyle {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: DashStyle) {
        this._setOption('dashStyle', value);
    }

    @Input()
    get highValueField(): string {
        return this._getOption('highValueField');
    }
    set highValueField(value: string) {
        this._setOption('highValueField', value);
    }

    @Input()
    get hoverMode(): SeriesHoverMode {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: SeriesHoverMode) {
        this._setOption('hoverMode', value);
    }

    @Input()
    get hoverStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, color?: ChartsColor | string, dashStyle?: DashStyle, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, color?: ChartsColor | string, dashStyle?: DashStyle, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }) {
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
    get label(): Record<string, any> | { alignment?: HorizontalAlignment, argumentFormat?: Format, backgroundColor?: string, border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string, font?: Font, format?: Format, horizontalOffset?: number, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, verticalOffset?: number, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { alignment?: HorizontalAlignment, argumentFormat?: Format, backgroundColor?: string, border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string, font?: Font, format?: Format, horizontalOffset?: number, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, verticalOffset?: number, visible?: boolean }) {
        this._setOption('label', value);
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
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
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
    get point(): Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, hoverMode?: PointInteractionMode, hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, size?: number }, image?: Record<string, any> | string | { height?: number | Record<string, any> | { rangeMaxPoint?: number, rangeMinPoint?: number }, url?: Record<string, any> | string | { rangeMaxPoint?: string, rangeMinPoint?: string }, width?: number | Record<string, any> | { rangeMaxPoint?: number, rangeMinPoint?: number } }, selectionMode?: PointInteractionMode, selectionStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean } {
        return this._getOption('point');
    }
    set point(value: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, hoverMode?: PointInteractionMode, hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, size?: number }, image?: Record<string, any> | string | { height?: number | Record<string, any> | { rangeMaxPoint?: number, rangeMinPoint?: number }, url?: Record<string, any> | string | { rangeMaxPoint?: string, rangeMinPoint?: string }, width?: number | Record<string, any> | { rangeMaxPoint?: number, rangeMinPoint?: number } }, selectionMode?: PointInteractionMode, selectionStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean }) {
        this._setOption('point', value);
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
    get reduction(): Record<string, any> | { color?: string, level?: FinancialChartReductionLevel } {
        return this._getOption('reduction');
    }
    set reduction(value: Record<string, any> | { color?: string, level?: FinancialChartReductionLevel }) {
        this._setOption('reduction', value);
    }

    @Input()
    get selectionMode(): SeriesSelectionMode {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: SeriesSelectionMode) {
        this._setOption('selectionMode', value);
    }

    @Input()
    get selectionStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, color?: ChartsColor | string, dashStyle?: DashStyle, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, color?: ChartsColor | string, dashStyle?: DashStyle, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }) {
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
    get stack(): string {
        return this._getOption('stack');
    }
    set stack(value: string) {
        this._setOption('stack', value);
    }

    @Input()
    get tag(): any {
        return this._getOption('tag');
    }
    set tag(value: any) {
        this._setOption('tag', value);
    }

    @Input()
    get tagField(): string {
        return this._getOption('tagField');
    }
    set tagField(value: string) {
        this._setOption('tagField', value);
    }

    @Input()
    get type(): SeriesType {
        return this._getOption('type');
    }
    set type(value: SeriesType) {
        this._setOption('type', value);
    }

    @Input()
    get valueErrorBar(): Record<string, any> | { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: ValueErrorBarType, value?: number } {
        return this._getOption('valueErrorBar');
    }
    set valueErrorBar(value: Record<string, any> | { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: ValueErrorBarType, value?: number }) {
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
        return 'series';
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
    DxiRangeSelectorSeriesComponent
  ],
  exports: [
    DxiRangeSelectorSeriesComponent
  ],
})
export class DxiRangeSelectorSeriesModule { }

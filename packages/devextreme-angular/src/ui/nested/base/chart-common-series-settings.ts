/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { HorizontalAlignment } from 'devextreme/common';
import { ChartsColor, ChartsDataType, DashStyle, Font, HatchDirection, LabelPosition, PointInteractionMode, PointSymbol, RelativePosition, SeriesHoverMode, SeriesSelectionMode, SeriesType, TextOverflow, ValueErrorBarDisplayMode, ValueErrorBarType, WordWrap } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';
import { ChartSeriesAggregationMethod, FinancialChartReductionLevel } from 'devextreme/viz/chart';
import { PieChartSeriesInteractionMode, SmallValuesGroupingMode } from 'devextreme/viz/pie_chart';
import { PolarChartSeriesType } from 'devextreme/viz/polar_chart';

@Component({
    template: ''
})
export abstract class DxoChartCommonSeriesSettings extends NestedOption {
    get aggregation(): { calculate?: Function | undefined, enabled?: boolean, method?: ChartSeriesAggregationMethod } {
        return this._getOption('aggregation');
    }
    set aggregation(value: { calculate?: Function | undefined, enabled?: boolean, method?: ChartSeriesAggregationMethod }) {
        this._setOption('aggregation', value);
    }

    get area(): any {
        return this._getOption('area');
    }
    set area(value: any) {
        this._setOption('area', value);
    }

    get argumentField(): string {
        return this._getOption('argumentField');
    }
    set argumentField(value: string) {
        this._setOption('argumentField', value);
    }

    get axis(): string | undefined {
        return this._getOption('axis');
    }
    set axis(value: string | undefined) {
        this._setOption('axis', value);
    }

    get bar(): any {
        return this._getOption('bar');
    }
    set bar(value: any) {
        this._setOption('bar', value);
    }

    get barOverlapGroup(): string | undefined {
        return this._getOption('barOverlapGroup');
    }
    set barOverlapGroup(value: string | undefined) {
        this._setOption('barOverlapGroup', value);
    }

    get barPadding(): number | undefined {
        return this._getOption('barPadding');
    }
    set barPadding(value: number | undefined) {
        this._setOption('barPadding', value);
    }

    get barWidth(): number | undefined {
        return this._getOption('barWidth');
    }
    set barWidth(value: number | undefined) {
        this._setOption('barWidth', value);
    }

    get border(): { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    get bubble(): any {
        return this._getOption('bubble');
    }
    set bubble(value: any) {
        this._setOption('bubble', value);
    }

    get candlestick(): any {
        return this._getOption('candlestick');
    }
    set candlestick(value: any) {
        this._setOption('candlestick', value);
    }

    get closeValueField(): string {
        return this._getOption('closeValueField');
    }
    set closeValueField(value: string) {
        this._setOption('closeValueField', value);
    }

    get color(): ChartsColor | string | undefined {
        return this._getOption('color');
    }
    set color(value: ChartsColor | string | undefined) {
        this._setOption('color', value);
    }

    get cornerRadius(): number {
        return this._getOption('cornerRadius');
    }
    set cornerRadius(value: number) {
        this._setOption('cornerRadius', value);
    }

    get dashStyle(): DashStyle {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: DashStyle) {
        this._setOption('dashStyle', value);
    }

    get fullstackedarea(): any {
        return this._getOption('fullstackedarea');
    }
    set fullstackedarea(value: any) {
        this._setOption('fullstackedarea', value);
    }

    get fullstackedbar(): any {
        return this._getOption('fullstackedbar');
    }
    set fullstackedbar(value: any) {
        this._setOption('fullstackedbar', value);
    }

    get fullstackedline(): any {
        return this._getOption('fullstackedline');
    }
    set fullstackedline(value: any) {
        this._setOption('fullstackedline', value);
    }

    get fullstackedspline(): any {
        return this._getOption('fullstackedspline');
    }
    set fullstackedspline(value: any) {
        this._setOption('fullstackedspline', value);
    }

    get fullstackedsplinearea(): any {
        return this._getOption('fullstackedsplinearea');
    }
    set fullstackedsplinearea(value: any) {
        this._setOption('fullstackedsplinearea', value);
    }

    get highValueField(): string {
        return this._getOption('highValueField');
    }
    set highValueField(value: string) {
        this._setOption('highValueField', value);
    }

    get hoverMode(): SeriesHoverMode | PieChartSeriesInteractionMode {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: SeriesHoverMode | PieChartSeriesInteractionMode) {
        this._setOption('hoverMode', value);
    }

    get hoverStyle(): { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } | { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } | { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('hoverStyle', value);
    }

    get ignoreEmptyPoints(): boolean {
        return this._getOption('ignoreEmptyPoints');
    }
    set ignoreEmptyPoints(value: boolean) {
        this._setOption('ignoreEmptyPoints', value);
    }

    get innerColor(): string {
        return this._getOption('innerColor');
    }
    set innerColor(value: string) {
        this._setOption('innerColor', value);
    }

    get label(): { alignment?: HorizontalAlignment, argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, horizontalOffset?: number, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, verticalOffset?: number, visible?: boolean } | { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: LabelPosition, radialOffset?: number, rotationAngle?: number, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap } | { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { alignment?: HorizontalAlignment, argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, horizontalOffset?: number, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, verticalOffset?: number, visible?: boolean } | { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: LabelPosition, radialOffset?: number, rotationAngle?: number, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap } | { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean }) {
        this._setOption('label', value);
    }

    get line(): any {
        return this._getOption('line');
    }
    set line(value: any) {
        this._setOption('line', value);
    }

    get lowValueField(): string {
        return this._getOption('lowValueField');
    }
    set lowValueField(value: string) {
        this._setOption('lowValueField', value);
    }

    get maxLabelCount(): number | undefined {
        return this._getOption('maxLabelCount');
    }
    set maxLabelCount(value: number | undefined) {
        this._setOption('maxLabelCount', value);
    }

    get minBarSize(): number | undefined {
        return this._getOption('minBarSize');
    }
    set minBarSize(value: number | undefined) {
        this._setOption('minBarSize', value);
    }

    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    get openValueField(): string {
        return this._getOption('openValueField');
    }
    set openValueField(value: string) {
        this._setOption('openValueField', value);
    }

    get pane(): string {
        return this._getOption('pane');
    }
    set pane(value: string) {
        this._setOption('pane', value);
    }

    get point(): { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, image?: string | undefined | { height?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, size?: number, symbol?: PointSymbol, visible?: boolean } | { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, image?: string | undefined | { height?: number, url?: string | undefined, width?: number }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean } {
        return this._getOption('point');
    }
    set point(value: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, image?: string | undefined | { height?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }, size?: number, symbol?: PointSymbol, visible?: boolean } | { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, image?: string | undefined | { height?: number, url?: string | undefined, width?: number }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean }) {
        this._setOption('point', value);
    }

    get rangearea(): any {
        return this._getOption('rangearea');
    }
    set rangearea(value: any) {
        this._setOption('rangearea', value);
    }

    get rangebar(): any {
        return this._getOption('rangebar');
    }
    set rangebar(value: any) {
        this._setOption('rangebar', value);
    }

    get rangeValue1Field(): string {
        return this._getOption('rangeValue1Field');
    }
    set rangeValue1Field(value: string) {
        this._setOption('rangeValue1Field', value);
    }

    get rangeValue2Field(): string {
        return this._getOption('rangeValue2Field');
    }
    set rangeValue2Field(value: string) {
        this._setOption('rangeValue2Field', value);
    }

    get reduction(): { color?: string, level?: FinancialChartReductionLevel } {
        return this._getOption('reduction');
    }
    set reduction(value: { color?: string, level?: FinancialChartReductionLevel }) {
        this._setOption('reduction', value);
    }

    get scatter(): any {
        return this._getOption('scatter');
    }
    set scatter(value: any) {
        this._setOption('scatter', value);
    }

    get selectionMode(): SeriesSelectionMode | PieChartSeriesInteractionMode {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: SeriesSelectionMode | PieChartSeriesInteractionMode) {
        this._setOption('selectionMode', value);
    }

    get selectionStyle(): { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } | { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } | { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('selectionStyle', value);
    }

    get showInLegend(): boolean {
        return this._getOption('showInLegend');
    }
    set showInLegend(value: boolean) {
        this._setOption('showInLegend', value);
    }

    get sizeField(): string {
        return this._getOption('sizeField');
    }
    set sizeField(value: string) {
        this._setOption('sizeField', value);
    }

    get spline(): any {
        return this._getOption('spline');
    }
    set spline(value: any) {
        this._setOption('spline', value);
    }

    get splinearea(): any {
        return this._getOption('splinearea');
    }
    set splinearea(value: any) {
        this._setOption('splinearea', value);
    }

    get stack(): string {
        return this._getOption('stack');
    }
    set stack(value: string) {
        this._setOption('stack', value);
    }

    get stackedarea(): any {
        return this._getOption('stackedarea');
    }
    set stackedarea(value: any) {
        this._setOption('stackedarea', value);
    }

    get stackedbar(): any {
        return this._getOption('stackedbar');
    }
    set stackedbar(value: any) {
        this._setOption('stackedbar', value);
    }

    get stackedline(): any {
        return this._getOption('stackedline');
    }
    set stackedline(value: any) {
        this._setOption('stackedline', value);
    }

    get stackedspline(): any {
        return this._getOption('stackedspline');
    }
    set stackedspline(value: any) {
        this._setOption('stackedspline', value);
    }

    get stackedsplinearea(): any {
        return this._getOption('stackedsplinearea');
    }
    set stackedsplinearea(value: any) {
        this._setOption('stackedsplinearea', value);
    }

    get steparea(): any {
        return this._getOption('steparea');
    }
    set steparea(value: any) {
        this._setOption('steparea', value);
    }

    get stepline(): any {
        return this._getOption('stepline');
    }
    set stepline(value: any) {
        this._setOption('stepline', value);
    }

    get stock(): any {
        return this._getOption('stock');
    }
    set stock(value: any) {
        this._setOption('stock', value);
    }

    get tagField(): string {
        return this._getOption('tagField');
    }
    set tagField(value: string) {
        this._setOption('tagField', value);
    }

    get type(): SeriesType | PolarChartSeriesType {
        return this._getOption('type');
    }
    set type(value: SeriesType | PolarChartSeriesType) {
        this._setOption('type', value);
    }

    get valueErrorBar(): { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: ValueErrorBarType | undefined, value?: number } {
        return this._getOption('valueErrorBar');
    }
    set valueErrorBar(value: { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: ValueErrorBarType | undefined, value?: number }) {
        this._setOption('valueErrorBar', value);
    }

    get valueField(): string {
        return this._getOption('valueField');
    }
    set valueField(value: string) {
        this._setOption('valueField', value);
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

    get argumentType(): ChartsDataType | undefined {
        return this._getOption('argumentType');
    }
    set argumentType(value: ChartsDataType | undefined) {
        this._setOption('argumentType', value);
    }

    get minSegmentSize(): number | undefined {
        return this._getOption('minSegmentSize');
    }
    set minSegmentSize(value: number | undefined) {
        this._setOption('minSegmentSize', value);
    }

    get smallValuesGrouping(): { groupName?: string, mode?: SmallValuesGroupingMode, threshold?: number | undefined, topCount?: number | undefined } {
        return this._getOption('smallValuesGrouping');
    }
    set smallValuesGrouping(value: { groupName?: string, mode?: SmallValuesGroupingMode, threshold?: number | undefined, topCount?: number | undefined }) {
        this._setOption('smallValuesGrouping', value);
    }

    get closed(): boolean {
        return this._getOption('closed');
    }
    set closed(value: boolean) {
        this._setOption('closed', value);
    }
}

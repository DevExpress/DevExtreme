/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    Output,
    EventEmitter,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { HorizontalAlignment, Position, VerticalAlignment } from 'devextreme/common';
import { ArgumentAxisHoverMode, AxisScaleType, ChartsAxisLabelOverlap, ChartsDataType, DashStyle, DiscreteAxisDivisionMode, Font, LabelOverlap, RelativePosition, ScaleBreak, ScaleBreakLineStyle, TextOverflow, TimeInterval, VisualRange, VisualRangeUpdateMode, WordWrap } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';
import { AggregatedPointsPosition, ChartLabelDisplayMode } from 'devextreme/viz/chart';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiBreakComponent } from './break-dxi';
import { DxiConstantLineComponent } from './constant-line-dxi';
import { DxiStripComponent } from './strip-dxi';


@Component({
    selector: 'dxo-argument-axis',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoArgumentAxisComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get aggregateByCategory(): boolean {
        return this._getOption('aggregateByCategory');
    }
    set aggregateByCategory(value: boolean) {
        this._setOption('aggregateByCategory', value);
    }

    @Input()
    get aggregatedPointsPosition(): AggregatedPointsPosition {
        return this._getOption('aggregatedPointsPosition');
    }
    set aggregatedPointsPosition(value: AggregatedPointsPosition) {
        this._setOption('aggregatedPointsPosition', value);
    }

    @Input()
    get aggregationGroupWidth(): number | undefined {
        return this._getOption('aggregationGroupWidth');
    }
    set aggregationGroupWidth(value: number | undefined) {
        this._setOption('aggregationGroupWidth', value);
    }

    @Input()
    get aggregationInterval(): TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('aggregationInterval');
    }
    set aggregationInterval(value: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('aggregationInterval', value);
    }

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
    get breaks(): Array<ScaleBreak> {
        return this._getOption('breaks');
    }
    set breaks(value: Array<ScaleBreak>) {
        this._setOption('breaks', value);
    }

    @Input()
    get breakStyle(): { color?: string, line?: ScaleBreakLineStyle, width?: number } {
        return this._getOption('breakStyle');
    }
    set breakStyle(value: { color?: string, line?: ScaleBreakLineStyle, width?: number }) {
        this._setOption('breakStyle', value);
    }

    @Input()
    get categories(): Array<number | string | Date> {
        return this._getOption('categories');
    }
    set categories(value: Array<number | string | Date>) {
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
    get constantLines(): Array<any | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, text?: string | undefined, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number } | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }> {
        return this._getOption('constantLines');
    }
    set constantLines(value: Array<any | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, text?: string | undefined, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number } | { color?: string, dashStyle?: DashStyle, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }>) {
        this._setOption('constantLines', value);
    }

    @Input()
    get constantLineStyle(): { color?: string, dashStyle?: DashStyle, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number } | { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number } {
        return this._getOption('constantLineStyle');
    }
    set constantLineStyle(value: { color?: string, dashStyle?: DashStyle, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, position?: RelativePosition, verticalAlignment?: VerticalAlignment, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number } | { color?: string, dashStyle?: DashStyle, label?: { font?: Font, visible?: boolean }, width?: number }) {
        this._setOption('constantLineStyle', value);
    }

    @Input()
    get customPosition(): Date | number | string | undefined {
        return this._getOption('customPosition');
    }
    set customPosition(value: Date | number | string | undefined) {
        this._setOption('customPosition', value);
    }

    @Input()
    get customPositionAxis(): string | undefined {
        return this._getOption('customPositionAxis');
    }
    set customPositionAxis(value: string | undefined) {
        this._setOption('customPositionAxis', value);
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
    get grid(): { color?: string, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('grid');
    }
    set grid(value: { color?: string, opacity?: number | undefined, visible?: boolean, width?: number }) {
        this._setOption('grid', value);
    }

    @Input()
    get holidays(): Array<Date | string | number> {
        return this._getOption('holidays');
    }
    set holidays(value: Array<Date | string | number>) {
        this._setOption('holidays', value);
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
    get label(): { alignment?: HorizontalAlignment | undefined, customizeHint?: Function, customizeText?: Function, displayMode?: ChartLabelDisplayMode, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: RelativePosition | Position, rotationAngle?: number, staggeringSpacing?: number, template?: any | undefined, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap } | { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { alignment?: HorizontalAlignment | undefined, customizeHint?: Function, customizeText?: Function, displayMode?: ChartLabelDisplayMode, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: ChartsAxisLabelOverlap, position?: RelativePosition | Position, rotationAngle?: number, staggeringSpacing?: number, template?: any | undefined, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap } | { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: LabelOverlap, visible?: boolean }) {
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
    get maxValueMargin(): number | undefined {
        return this._getOption('maxValueMargin');
    }
    set maxValueMargin(value: number | undefined) {
        this._setOption('maxValueMargin', value);
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
    get minorTickInterval(): TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minorTickInterval');
    }
    set minorTickInterval(value: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('minorTickInterval', value);
    }

    @Input()
    get minValueMargin(): number | undefined {
        return this._getOption('minValueMargin');
    }
    set minValueMargin(value: number | undefined) {
        this._setOption('minValueMargin', value);
    }

    @Input()
    get minVisualRangeLength(): TimeInterval | number | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minVisualRangeLength');
    }
    set minVisualRangeLength(value: TimeInterval | number | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('minVisualRangeLength', value);
    }

    @Input()
    get offset(): number | undefined {
        return this._getOption('offset');
    }
    set offset(value: number | undefined) {
        this._setOption('offset', value);
    }

    @Input()
    get opacity(): number | undefined {
        return this._getOption('opacity');
    }
    set opacity(value: number | undefined) {
        this._setOption('opacity', value);
    }

    @Input()
    get placeholderSize(): number {
        return this._getOption('placeholderSize');
    }
    set placeholderSize(value: number) {
        this._setOption('placeholderSize', value);
    }

    @Input()
    get position(): Position {
        return this._getOption('position');
    }
    set position(value: Position) {
        this._setOption('position', value);
    }

    @Input()
    get singleWorkdays(): Array<Date | string | number> {
        return this._getOption('singleWorkdays');
    }
    set singleWorkdays(value: Array<Date | string | number>) {
        this._setOption('singleWorkdays', value);
    }

    @Input()
    get strips(): Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, text?: string | undefined, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined } | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }> {
        return this._getOption('strips');
    }
    set strips(value: Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, text?: string | undefined, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined } | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }>) {
        this._setOption('strips', value);
    }

    @Input()
    get stripStyle(): { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number } | { label?: { font?: Font } } {
        return this._getOption('stripStyle');
    }
    set stripStyle(value: { label?: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment }, paddingLeftRight?: number, paddingTopBottom?: number } | { label?: { font?: Font } }) {
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
    get tickInterval(): TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('tickInterval');
    }
    set tickInterval(value: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('tickInterval', value);
    }

    @Input()
    get title(): string | { alignment?: HorizontalAlignment, font?: Font, margin?: number, text?: string | undefined, textOverflow?: TextOverflow, wordWrap?: WordWrap } {
        return this._getOption('title');
    }
    set title(value: string | { alignment?: HorizontalAlignment, font?: Font, margin?: number, text?: string | undefined, textOverflow?: TextOverflow, wordWrap?: WordWrap }) {
        this._setOption('title', value);
    }

    @Input()
    get type(): AxisScaleType | undefined {
        return this._getOption('type');
    }
    set type(value: AxisScaleType | undefined) {
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
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get visualRange(): VisualRange | Array<number | string | Date> {
        return this._getOption('visualRange');
    }
    set visualRange(value: VisualRange | Array<number | string | Date>) {
        this._setOption('visualRange', value);
    }

    @Input()
    get visualRangeUpdateMode(): VisualRangeUpdateMode {
        return this._getOption('visualRangeUpdateMode');
    }
    set visualRangeUpdateMode(value: VisualRangeUpdateMode) {
        this._setOption('visualRangeUpdateMode', value);
    }

    @Input()
    get wholeRange(): VisualRange | undefined | Array<number | string | Date> {
        return this._getOption('wholeRange');
    }
    set wholeRange(value: VisualRange | undefined | Array<number | string | Date>) {
        this._setOption('wholeRange', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }

    @Input()
    get workdaysOnly(): boolean {
        return this._getOption('workdaysOnly');
    }
    set workdaysOnly(value: boolean) {
        this._setOption('workdaysOnly', value);
    }

    @Input()
    get workWeek(): Array<number> {
        return this._getOption('workWeek');
    }
    set workWeek(value: Array<number>) {
        this._setOption('workWeek', value);
    }

    @Input()
    get firstPointOnStartAngle(): boolean {
        return this._getOption('firstPointOnStartAngle');
    }
    set firstPointOnStartAngle(value: boolean) {
        this._setOption('firstPointOnStartAngle', value);
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


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() categoriesChange: EventEmitter<Array<number | string | Date>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visualRangeChange: EventEmitter<VisualRange | Array<number | string | Date>>;
    protected get _optionPath() {
        return 'argumentAxis';
    }


    @ContentChildren(forwardRef(() => DxiBreakComponent))
    get breaksChildren(): QueryList<DxiBreakComponent> {
        return this._getOption('breaks');
    }
    set breaksChildren(value) {
        this.setChildren('breaks', value);
    }

    @ContentChildren(forwardRef(() => DxiConstantLineComponent))
    get constantLinesChildren(): QueryList<DxiConstantLineComponent> {
        return this._getOption('constantLines');
    }
    set constantLinesChildren(value) {
        this.setChildren('constantLines', value);
    }

    @ContentChildren(forwardRef(() => DxiStripComponent))
    get stripsChildren(): QueryList<DxiStripComponent> {
        return this._getOption('strips');
    }
    set stripsChildren(value) {
        this.setChildren('strips', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'categoriesChange' },
            { emit: 'visualRangeChange' }
        ]);

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
    DxoArgumentAxisComponent
  ],
  exports: [
    DxoArgumentAxisComponent
  ],
})
export class DxoArgumentAxisModule { }

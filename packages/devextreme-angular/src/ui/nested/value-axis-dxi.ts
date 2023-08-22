/* tslint:disable:max-line-length */


import {
    Component,
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




import DevExpress from 'devextreme/bundles/dx.all';
import { Format } from 'devextreme/localization';
import { Font } from 'devextreme/viz/core/base_widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiBreakComponent } from './break-dxi';
import { DxiConstantLineComponent } from './constant-line-dxi';
import { DxiStripComponent } from './strip-dxi';


@Component({
    selector: 'dxi-value-axis',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiValueAxisComponent extends CollectionNestedOption {
    @Input()
    get aggregatedPointsPosition(): string {
        return this._getOption('aggregatedPointsPosition');
    }
    set aggregatedPointsPosition(value: string) {
        this._setOption('aggregatedPointsPosition', value);
    }

    @Input()
    get allowDecimals(): boolean | undefined {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean | undefined) {
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
    get breaks(): Array<DevExpress.common.charts.ScaleBreak> {
        return this._getOption('breaks');
    }
    set breaks(value: Array<DevExpress.common.charts.ScaleBreak>) {
        this._setOption('breaks', value);
    }

    @Input()
    get breakStyle(): { color?: string, line?: string, width?: number } {
        return this._getOption('breakStyle');
    }
    set breakStyle(value: { color?: string, line?: string, width?: number }) {
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
    get constantLines(): Array<any | { color?: string, dashStyle?: string, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: string, position?: string, text?: string | undefined, verticalAlignment?: string, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number }> {
        return this._getOption('constantLines');
    }
    set constantLines(value: Array<any | { color?: string, dashStyle?: string, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, horizontalAlignment?: string, position?: string, text?: string | undefined, verticalAlignment?: string, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, value?: Date | number | string | undefined, width?: number }>) {
        this._setOption('constantLines', value);
    }

    @Input()
    get constantLineStyle(): { color?: string, dashStyle?: string, label?: { font?: Font, horizontalAlignment?: string, position?: string, verticalAlignment?: string, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number } {
        return this._getOption('constantLineStyle');
    }
    set constantLineStyle(value: { color?: string, dashStyle?: string, label?: { font?: Font, horizontalAlignment?: string, position?: string, verticalAlignment?: string, visible?: boolean }, paddingLeftRight?: number, paddingTopBottom?: number, width?: number }) {
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
    get discreteAxisDivisionMode(): string {
        return this._getOption('discreteAxisDivisionMode');
    }
    set discreteAxisDivisionMode(value: string) {
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
    get inverted(): boolean {
        return this._getOption('inverted');
    }
    set inverted(value: boolean) {
        this._setOption('inverted', value);
    }

    @Input()
    get label(): { alignment?: string | undefined, customizeHint?: Function, customizeText?: Function, displayMode?: string, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: string, position?: string, rotationAngle?: number, staggeringSpacing?: number, template?: any | undefined, textOverflow?: string, visible?: boolean, wordWrap?: string } {
        return this._getOption('label');
    }
    set label(value: { alignment?: string | undefined, customizeHint?: Function, customizeText?: Function, displayMode?: string, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: string, position?: string, rotationAngle?: number, staggeringSpacing?: number, template?: any | undefined, textOverflow?: string, visible?: boolean, wordWrap?: string }) {
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
    get maxAutoBreakCount(): number {
        return this._getOption('maxAutoBreakCount');
    }
    set maxAutoBreakCount(value: number) {
        this._setOption('maxAutoBreakCount', value);
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
    get minorTickInterval(): number | string | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minorTickInterval');
    }
    set minorTickInterval(value: number | string | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
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
    get minVisualRangeLength(): number | string | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minVisualRangeLength');
    }
    set minVisualRangeLength(value: number | string | undefined | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
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
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
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
    get pane(): string | undefined {
        return this._getOption('pane');
    }
    set pane(value: string | undefined) {
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
    get position(): string {
        return this._getOption('position');
    }
    set position(value: string) {
        this._setOption('position', value);
    }

    @Input()
    get showZero(): boolean | undefined {
        return this._getOption('showZero');
    }
    set showZero(value: boolean | undefined) {
        this._setOption('showZero', value);
    }

    @Input()
    get strips(): Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: string, text?: string | undefined, verticalAlignment?: string }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined }> {
        return this._getOption('strips');
    }
    set strips(value: Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, horizontalAlignment?: string, text?: string | undefined, verticalAlignment?: string }, paddingLeftRight?: number, paddingTopBottom?: number, startValue?: Date | number | string | undefined }>) {
        this._setOption('strips', value);
    }

    @Input()
    get stripStyle(): { label?: { font?: Font, horizontalAlignment?: string, verticalAlignment?: string }, paddingLeftRight?: number, paddingTopBottom?: number } {
        return this._getOption('stripStyle');
    }
    set stripStyle(value: { label?: { font?: Font, horizontalAlignment?: string, verticalAlignment?: string }, paddingLeftRight?: number, paddingTopBottom?: number }) {
        this._setOption('stripStyle', value);
    }

    @Input()
    get synchronizedValue(): number | undefined {
        return this._getOption('synchronizedValue');
    }
    set synchronizedValue(value: number | undefined) {
        this._setOption('synchronizedValue', value);
    }

    @Input()
    get tick(): { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number } {
        return this._getOption('tick');
    }
    set tick(value: { color?: string, length?: number, opacity?: number | undefined, shift?: number, visible?: boolean, width?: number }) {
        this._setOption('tick', value);
    }

    @Input()
    get tickInterval(): number | string | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('tickInterval');
    }
    set tickInterval(value: number | string | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('tickInterval', value);
    }

    @Input()
    get title(): string | { alignment?: string, font?: Font, margin?: number, text?: string | undefined, textOverflow?: string, wordWrap?: string } {
        return this._getOption('title');
    }
    set title(value: string | { alignment?: string, font?: Font, margin?: number, text?: string | undefined, textOverflow?: string, wordWrap?: string }) {
        this._setOption('title', value);
    }

    @Input()
    get type(): string | undefined {
        return this._getOption('type');
    }
    set type(value: string | undefined) {
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
    get valueType(): string | undefined {
        return this._getOption('valueType');
    }
    set valueType(value: string | undefined) {
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
    get visualRange(): DevExpress.common.charts.VisualRange | Array<number | string | Date> {
        return this._getOption('visualRange');
    }
    set visualRange(value: DevExpress.common.charts.VisualRange | Array<number | string | Date>) {
        this._setOption('visualRange', value);
    }

    @Input()
    get visualRangeUpdateMode(): string {
        return this._getOption('visualRangeUpdateMode');
    }
    set visualRangeUpdateMode(value: string) {
        this._setOption('visualRangeUpdateMode', value);
    }

    @Input()
    get wholeRange(): DevExpress.common.charts.VisualRange | undefined | Array<number | string | Date> {
        return this._getOption('wholeRange');
    }
    set wholeRange(value: DevExpress.common.charts.VisualRange | undefined | Array<number | string | Date>) {
        this._setOption('wholeRange', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() categoriesChange: EventEmitter<Array<number | string | Date>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visualRangeChange: EventEmitter<DevExpress.common.charts.VisualRange | Array<number | string | Date>>;
    protected get _optionPath() {
        return 'valueAxis';
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



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiValueAxisComponent
  ],
  exports: [
    DxiValueAxisComponent
  ],
})
export class DxiValueAxisModule { }

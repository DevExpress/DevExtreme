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




import DevExpress from 'devextreme/bundles/dx.all';
import { Format } from 'devextreme/localization';
import { Font } from 'devextreme/viz/core/base_widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiConstantLineComponent } from './constant-line-dxi';
import { DxiStripComponent } from './strip-dxi';


@Component({
    selector: 'dxo-value-axis',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoValueAxisComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDecimals(): boolean | undefined {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean | undefined) {
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
    get constantLines(): Array<any | { color?: string, dashStyle?: string, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }> {
        return this._getOption('constantLines');
    }
    set constantLines(value: Array<any | { color?: string, dashStyle?: string, displayBehindSeries?: boolean, extendAxis?: boolean, label?: { font?: Font, text?: string | undefined, visible?: boolean }, value?: Date | number | string | undefined, width?: number }>) {
        this._setOption('constantLines', value);
    }

    @Input()
    get constantLineStyle(): { color?: string, dashStyle?: string, label?: { font?: Font, visible?: boolean }, width?: number } {
        return this._getOption('constantLineStyle');
    }
    set constantLineStyle(value: { color?: string, dashStyle?: string, label?: { font?: Font, visible?: boolean }, width?: number }) {
        this._setOption('constantLineStyle', value);
    }

    @Input()
    get discreteAxisDivisionMode(): string {
        return this._getOption('discreteAxisDivisionMode');
    }
    set discreteAxisDivisionMode(value: string) {
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
    get label(): { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: string, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { customizeHint?: Function, customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromAxis?: number, overlappingBehavior?: string, visible?: boolean }) {
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
    get minorTick(): { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('minorTick');
    }
    set minorTick(value: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number }) {
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
    get opacity(): number | undefined {
        return this._getOption('opacity');
    }
    set opacity(value: number | undefined) {
        this._setOption('opacity', value);
    }

    @Input()
    get showZero(): boolean | undefined {
        return this._getOption('showZero');
    }
    set showZero(value: boolean | undefined) {
        this._setOption('showZero', value);
    }

    @Input()
    get strips(): Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }> {
        return this._getOption('strips');
    }
    set strips(value: Array<any | { color?: string | undefined, endValue?: Date | number | string | undefined, label?: { font?: Font, text?: string | undefined }, startValue?: Date | number | string | undefined }>) {
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
    get tick(): { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number } {
        return this._getOption('tick');
    }
    set tick(value: { color?: string, length?: number, opacity?: number | undefined, visible?: boolean, width?: number }) {
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

    @Input()
    get max(): number | undefined {
        return this._getOption('max');
    }
    set max(value: number | undefined) {
        this._setOption('max', value);
    }

    @Input()
    get min(): number | undefined {
        return this._getOption('min');
    }
    set min(value: number | undefined) {
        this._setOption('min', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visualRangeChange: EventEmitter<DevExpress.common.charts.VisualRange | Array<number | string | Date>>;
    protected get _optionPath() {
        return 'valueAxis';
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
    DxoValueAxisComponent
  ],
  exports: [
    DxoValueAxisComponent
  ],
})
export class DxoValueAxisModule { }

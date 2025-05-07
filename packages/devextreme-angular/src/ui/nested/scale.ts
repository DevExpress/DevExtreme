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




import { HorizontalAlignment, VerticalAlignment } from 'devextreme/common';
import { ChartsDataType, DiscreteAxisDivisionMode, Font, LabelOverlap, ScaleBreak, ScaleBreakLineStyle, TimeInterval } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';
import { CircularGaugeElementOrientation, CircularGaugeLabelOverlap } from 'devextreme/viz/circular_gauge';
import { AxisScale } from 'devextreme/viz/range_selector';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiBreakComponent } from './break-dxi';


@Component({
    selector: 'dxo-scale',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoScaleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDecimals(): boolean | undefined {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean | undefined) {
        this._setOption('allowDecimals', value);
    }

    @Input()
    get customMinorTicks(): Array<number> {
        return this._getOption('customMinorTicks');
    }
    set customMinorTicks(value: Array<number>) {
        this._setOption('customMinorTicks', value);
    }

    @Input()
    get customTicks(): Array<number> {
        return this._getOption('customTicks');
    }
    set customTicks(value: Array<number>) {
        this._setOption('customTicks', value);
    }

    @Input()
    get endValue(): number | Date | string | undefined {
        return this._getOption('endValue');
    }
    set endValue(value: number | Date | string | undefined) {
        this._setOption('endValue', value);
    }

    @Input()
    get label(): { customizeText?: Function, font?: Font, format?: Format | string | undefined, hideFirstOrLast?: CircularGaugeLabelOverlap, indentFromTick?: number, overlappingBehavior?: LabelOverlap, useRangeColors?: boolean, visible?: boolean } | { customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromTick?: number, overlappingBehavior?: LabelOverlap, useRangeColors?: boolean, visible?: boolean } | { customizeText?: Function, font?: Font, format?: Format | string | undefined, overlappingBehavior?: LabelOverlap, topIndent?: number, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { customizeText?: Function, font?: Font, format?: Format | string | undefined, hideFirstOrLast?: CircularGaugeLabelOverlap, indentFromTick?: number, overlappingBehavior?: LabelOverlap, useRangeColors?: boolean, visible?: boolean } | { customizeText?: Function, font?: Font, format?: Format | string | undefined, indentFromTick?: number, overlappingBehavior?: LabelOverlap, useRangeColors?: boolean, visible?: boolean } | { customizeText?: Function, font?: Font, format?: Format | string | undefined, overlappingBehavior?: LabelOverlap, topIndent?: number, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get minorTick(): { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } | { color?: string, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('minorTick');
    }
    set minorTick(value: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } | { color?: string, opacity?: number, visible?: boolean, width?: number }) {
        this._setOption('minorTick', value);
    }

    @Input()
    get minorTickInterval(): number | undefined | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minorTickInterval');
    }
    set minorTickInterval(value: number | undefined | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('minorTickInterval', value);
    }

    @Input()
    get orientation(): CircularGaugeElementOrientation {
        return this._getOption('orientation');
    }
    set orientation(value: CircularGaugeElementOrientation) {
        this._setOption('orientation', value);
    }

    @Input()
    get scaleDivisionFactor(): number {
        return this._getOption('scaleDivisionFactor');
    }
    set scaleDivisionFactor(value: number) {
        this._setOption('scaleDivisionFactor', value);
    }

    @Input()
    get startValue(): number | Date | string | undefined {
        return this._getOption('startValue');
    }
    set startValue(value: number | Date | string | undefined) {
        this._setOption('startValue', value);
    }

    @Input()
    get tick(): { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } | { color?: string, opacity?: number, width?: number } {
        return this._getOption('tick');
    }
    set tick(value: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number } | { color?: string, opacity?: number, width?: number }) {
        this._setOption('tick', value);
    }

    @Input()
    get tickInterval(): number | undefined | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('tickInterval');
    }
    set tickInterval(value: number | undefined | TimeInterval | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('tickInterval', value);
    }

    @Input()
    get horizontalOrientation(): HorizontalAlignment {
        return this._getOption('horizontalOrientation');
    }
    set horizontalOrientation(value: HorizontalAlignment) {
        this._setOption('horizontalOrientation', value);
    }

    @Input()
    get verticalOrientation(): VerticalAlignment {
        return this._getOption('verticalOrientation');
    }
    set verticalOrientation(value: VerticalAlignment) {
        this._setOption('verticalOrientation', value);
    }

    @Input()
    get aggregateByCategory(): boolean {
        return this._getOption('aggregateByCategory');
    }
    set aggregateByCategory(value: boolean) {
        this._setOption('aggregateByCategory', value);
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
    get discreteAxisDivisionMode(): DiscreteAxisDivisionMode {
        return this._getOption('discreteAxisDivisionMode');
    }
    set discreteAxisDivisionMode(value: DiscreteAxisDivisionMode) {
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
    get holidays(): Array<Date | string | number> {
        return this._getOption('holidays');
    }
    set holidays(value: Array<Date | string | number>) {
        this._setOption('holidays', value);
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
    get marker(): { label?: { customizeText?: Function, format?: Format | string | undefined }, separatorHeight?: number, textLeftIndent?: number, textTopIndent?: number, topIndent?: number, visible?: boolean } {
        return this._getOption('marker');
    }
    set marker(value: { label?: { customizeText?: Function, format?: Format | string | undefined }, separatorHeight?: number, textLeftIndent?: number, textTopIndent?: number, topIndent?: number, visible?: boolean }) {
        this._setOption('marker', value);
    }

    @Input()
    get maxRange(): TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('maxRange');
    }
    set maxRange(value: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('maxRange', value);
    }

    @Input()
    get minorTickCount(): number | undefined {
        return this._getOption('minorTickCount');
    }
    set minorTickCount(value: number | undefined) {
        this._setOption('minorTickCount', value);
    }

    @Input()
    get minRange(): TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minRange');
    }
    set minRange(value: TimeInterval | number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('minRange', value);
    }

    @Input()
    get placeholderHeight(): number | undefined {
        return this._getOption('placeholderHeight');
    }
    set placeholderHeight(value: number | undefined) {
        this._setOption('placeholderHeight', value);
    }

    @Input()
    get showCustomBoundaryTicks(): boolean {
        return this._getOption('showCustomBoundaryTicks');
    }
    set showCustomBoundaryTicks(value: boolean) {
        this._setOption('showCustomBoundaryTicks', value);
    }

    @Input()
    get singleWorkdays(): Array<Date | string | number> {
        return this._getOption('singleWorkdays');
    }
    set singleWorkdays(value: Array<Date | string | number>) {
        this._setOption('singleWorkdays', value);
    }

    @Input()
    get type(): AxisScale | undefined {
        return this._getOption('type');
    }
    set type(value: AxisScale | undefined) {
        this._setOption('type', value);
    }

    @Input()
    get valueType(): ChartsDataType | undefined {
        return this._getOption('valueType');
    }
    set valueType(value: ChartsDataType | undefined) {
        this._setOption('valueType', value);
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


    protected get _optionPath() {
        return 'scale';
    }


    @ContentChildren(forwardRef(() => DxiBreakComponent))
    get breaksChildren(): QueryList<DxiBreakComponent> {
        return this._getOption('breaks');
    }
    set breaksChildren(value) {
        this.setChildren('breaks', value);
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
    DxoScaleComponent
  ],
  exports: [
    DxoScaleComponent
  ],
})
export class DxoScaleModule { }

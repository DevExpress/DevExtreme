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
import { ScaleBreak, Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-range-selector-scale',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorScaleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get aggregateByCategory(): boolean {
        return this._getOption('aggregateByCategory');
    }
    set aggregateByCategory(value: boolean) {
        this._setOption('aggregateByCategory', value);
    }

    @Input()
    get aggregationGroupWidth(): number {
        return this._getOption('aggregationGroupWidth');
    }
    set aggregationGroupWidth(value: number) {
        this._setOption('aggregationGroupWidth', value);
    }

    @Input()
    get aggregationInterval(): number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('aggregationInterval');
    }
    set aggregationInterval(value: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('aggregationInterval', value);
    }

    @Input()
    get allowDecimals(): boolean {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean) {
        this._setOption('allowDecimals', value);
    }

    @Input()
    get breaks(): Array<ScaleBreak> | { endValue?: Date | number | string, startValue?: Date | number | string }[] {
        return this._getOption('breaks');
    }
    set breaks(value: Array<ScaleBreak> | { endValue?: Date | number | string, startValue?: Date | number | string }[]) {
        this._setOption('breaks', value);
    }

    @Input()
    get breakStyle(): Record<string, any> | { color?: string, line?: "straight" | "waved", width?: number } {
        return this._getOption('breakStyle');
    }
    set breakStyle(value: Record<string, any> | { color?: string, line?: "straight" | "waved", width?: number }) {
        this._setOption('breakStyle', value);
    }

    @Input()
    get categories(): Array<Date | number | string> {
        return this._getOption('categories');
    }
    set categories(value: Array<Date | number | string>) {
        this._setOption('categories', value);
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
    get endValue(): Date | number | string {
        return this._getOption('endValue');
    }
    set endValue(value: Date | number | string) {
        this._setOption('endValue', value);
    }

    @Input()
    get holidays(): Array<Date | string> | Array<number> {
        return this._getOption('holidays');
    }
    set holidays(value: Array<Date | string> | Array<number>) {
        this._setOption('holidays', value);
    }

    @Input()
    get label(): Record<string, any> | { customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, overlappingBehavior?: "hide" | "none", topIndent?: number, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { customizeText?: ((scaleValue: { value: Date | number | string, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, overlappingBehavior?: "hide" | "none", topIndent?: number, visible?: boolean }) {
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
    get marker(): Record<string, any> | { label?: Record<string, any>, separatorHeight?: number, textLeftIndent?: number, textTopIndent?: number, topIndent?: number, visible?: boolean } {
        return this._getOption('marker');
    }
    set marker(value: Record<string, any> | { label?: Record<string, any>, separatorHeight?: number, textLeftIndent?: number, textTopIndent?: number, topIndent?: number, visible?: boolean }) {
        this._setOption('marker', value);
    }

    @Input()
    get maxRange(): number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('maxRange');
    }
    set maxRange(value: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('maxRange', value);
    }

    @Input()
    get minorTick(): Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number } {
        return this._getOption('minorTick');
    }
    set minorTick(value: Record<string, any> | { color?: string, opacity?: number, visible?: boolean, width?: number }) {
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
    get minRange(): number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } {
        return this._getOption('minRange');
    }
    set minRange(value: number | Record<string, any> | "day" | "hour" | "millisecond" | "minute" | "month" | "quarter" | "second" | "week" | "year" | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number }) {
        this._setOption('minRange', value);
    }

    @Input()
    get placeholderHeight(): number {
        return this._getOption('placeholderHeight');
    }
    set placeholderHeight(value: number) {
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
    get singleWorkdays(): Array<Date | string> | Array<number> {
        return this._getOption('singleWorkdays');
    }
    set singleWorkdays(value: Array<Date | string> | Array<number>) {
        this._setOption('singleWorkdays', value);
    }

    @Input()
    get startValue(): Date | number | string {
        return this._getOption('startValue');
    }
    set startValue(value: Date | number | string) {
        this._setOption('startValue', value);
    }

    @Input()
    get tick(): Record<string, any> | { color?: string, opacity?: number, width?: number } {
        return this._getOption('tick');
    }
    set tick(value: Record<string, any> | { color?: string, opacity?: number, width?: number }) {
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
    get type(): "continuous" | "discrete" | "logarithmic" | "semidiscrete" {
        return this._getOption('type');
    }
    set type(value: "continuous" | "discrete" | "logarithmic" | "semidiscrete") {
        this._setOption('type', value);
    }

    @Input()
    get valueType(): "datetime" | "numeric" | "string" {
        return this._getOption('valueType');
    }
    set valueType(value: "datetime" | "numeric" | "string") {
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
    DxoRangeSelectorScaleComponent
  ],
  exports: [
    DxoRangeSelectorScaleComponent
  ],
})
export class DxoRangeSelectorScaleModule { }

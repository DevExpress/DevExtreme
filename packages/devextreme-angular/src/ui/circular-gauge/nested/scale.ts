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
    selector: 'dxo-circular-gauge-scale',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCircularGaugeScaleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowDecimals(): boolean {
        return this._getOption('allowDecimals');
    }
    set allowDecimals(value: boolean) {
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
    get endValue(): number {
        return this._getOption('endValue');
    }
    set endValue(value: number) {
        this._setOption('endValue', value);
    }

    @Input()
    get label(): Record<string, any> | { customizeText: ((scaleValue: { value: number, valueText: string }) => string), font: Font, format: LocalizationTypes.Format, hideFirstOrLast: "first" | "last", indentFromTick: number, overlappingBehavior: "hide" | "none", useRangeColors: boolean, visible: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { customizeText: ((scaleValue: { value: number, valueText: string }) => string), font: Font, format: LocalizationTypes.Format, hideFirstOrLast: "first" | "last", indentFromTick: number, overlappingBehavior: "hide" | "none", useRangeColors: boolean, visible: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get minorTick(): Record<string, any> | { color: string, length: number, opacity: number, visible: boolean, width: number } {
        return this._getOption('minorTick');
    }
    set minorTick(value: Record<string, any> | { color: string, length: number, opacity: number, visible: boolean, width: number }) {
        this._setOption('minorTick', value);
    }

    @Input()
    get minorTickInterval(): number {
        return this._getOption('minorTickInterval');
    }
    set minorTickInterval(value: number) {
        this._setOption('minorTickInterval', value);
    }

    @Input()
    get orientation(): "center" | "inside" | "outside" {
        return this._getOption('orientation');
    }
    set orientation(value: "center" | "inside" | "outside") {
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
    get startValue(): number {
        return this._getOption('startValue');
    }
    set startValue(value: number) {
        this._setOption('startValue', value);
    }

    @Input()
    get tick(): Record<string, any> | { color: string, length: number, opacity: number, visible: boolean, width: number } {
        return this._getOption('tick');
    }
    set tick(value: Record<string, any> | { color: string, length: number, opacity: number, visible: boolean, width: number }) {
        this._setOption('tick', value);
    }

    @Input()
    get tickInterval(): number {
        return this._getOption('tickInterval');
    }
    set tickInterval(value: number) {
        this._setOption('tickInterval', value);
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
    DxoCircularGaugeScaleComponent
  ],
  exports: [
    DxoCircularGaugeScaleComponent
  ],
})
export class DxoCircularGaugeScaleModule { }

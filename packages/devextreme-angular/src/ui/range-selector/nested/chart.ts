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




import { dxChartCommonSeriesSettings } from 'devextreme/viz/chart';
import { ChartSeries } from 'devextreme/viz/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-range-selector-chart',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorChartComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get barGroupPadding(): number {
        return this._getOption('barGroupPadding');
    }
    set barGroupPadding(value: number) {
        this._setOption('barGroupPadding', value);
    }

    @Input()
    get barGroupWidth(): number {
        return this._getOption('barGroupWidth');
    }
    set barGroupWidth(value: number) {
        this._setOption('barGroupWidth', value);
    }

    @Input()
    get bottomIndent(): number {
        return this._getOption('bottomIndent');
    }
    set bottomIndent(value: number) {
        this._setOption('bottomIndent', value);
    }

    @Input()
    get commonSeriesSettings(): dxChartCommonSeriesSettings {
        return this._getOption('commonSeriesSettings');
    }
    set commonSeriesSettings(value: dxChartCommonSeriesSettings) {
        this._setOption('commonSeriesSettings', value);
    }

    @Input()
    get dataPrepareSettings(): Record<string, any> | { checkTypeForAllData: boolean, convertToAxisDataType: boolean, sortingMethod: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number) } {
        return this._getOption('dataPrepareSettings');
    }
    set dataPrepareSettings(value: Record<string, any> | { checkTypeForAllData: boolean, convertToAxisDataType: boolean, sortingMethod: boolean | ((a: { arg: Date | number | string, val: Date | number | string }, b: { arg: Date | number | string, val: Date | number | string }) => number) }) {
        this._setOption('dataPrepareSettings', value);
    }

    @Input()
    get maxBubbleSize(): number {
        return this._getOption('maxBubbleSize');
    }
    set maxBubbleSize(value: number) {
        this._setOption('maxBubbleSize', value);
    }

    @Input()
    get minBubbleSize(): number {
        return this._getOption('minBubbleSize');
    }
    set minBubbleSize(value: number) {
        this._setOption('minBubbleSize', value);
    }

    @Input()
    get negativesAsZeroes(): boolean {
        return this._getOption('negativesAsZeroes');
    }
    set negativesAsZeroes(value: boolean) {
        this._setOption('negativesAsZeroes', value);
    }

    @Input()
    get palette(): Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office" {
        return this._getOption('palette');
    }
    set palette(value: Array<string> | "Bright" | "Harmony Light" | "Ocean" | "Pastel" | "Soft" | "Soft Pastel" | "Vintage" | "Violet" | "Carmine" | "Dark Moon" | "Dark Violet" | "Green Mist" | "Soft Blue" | "Material" | "Office") {
        this._setOption('palette', value);
    }

    @Input()
    get paletteExtensionMode(): "alternate" | "blend" | "extrapolate" {
        return this._getOption('paletteExtensionMode');
    }
    set paletteExtensionMode(value: "alternate" | "blend" | "extrapolate") {
        this._setOption('paletteExtensionMode', value);
    }

    @Input()
    get series(): Array<ChartSeries> | ChartSeries {
        return this._getOption('series');
    }
    set series(value: Array<ChartSeries> | ChartSeries) {
        this._setOption('series', value);
    }

    @Input()
    get seriesTemplate(): any {
        return this._getOption('seriesTemplate');
    }
    set seriesTemplate(value: any) {
        this._setOption('seriesTemplate', value);
    }

    @Input()
    get topIndent(): number {
        return this._getOption('topIndent');
    }
    set topIndent(value: number) {
        this._setOption('topIndent', value);
    }

    @Input()
    get valueAxis(): Record<string, any> | { inverted: boolean, logarithmBase: number, max: number, min: number, type: "continuous" | "logarithmic", valueType: "datetime" | "numeric" | "string" } {
        return this._getOption('valueAxis');
    }
    set valueAxis(value: Record<string, any> | { inverted: boolean, logarithmBase: number, max: number, min: number, type: "continuous" | "logarithmic", valueType: "datetime" | "numeric" | "string" }) {
        this._setOption('valueAxis', value);
    }


    protected get _optionPath() {
        return 'chart';
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
    DxoRangeSelectorChartComponent
  ],
  exports: [
    DxoRangeSelectorChartComponent
  ],
})
export class DxoRangeSelectorChartModule { }

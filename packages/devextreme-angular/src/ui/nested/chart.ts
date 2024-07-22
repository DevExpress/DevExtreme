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




import { ChartsDataType, Palette, PaletteExtensionMode } from 'devextreme/common/charts';
import { ChartSeries } from 'devextreme/viz/common';
import { ChartAxisScale } from 'devextreme/viz/range_selector';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiSeriesComponent } from './series-dxi';


@Component({
    selector: 'dxo-chart',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get barGroupPadding(): number {
        return this._getOption('barGroupPadding');
    }
    set barGroupPadding(value: number) {
        this._setOption('barGroupPadding', value);
    }

    @Input()
    get barGroupWidth(): number | undefined {
        return this._getOption('barGroupWidth');
    }
    set barGroupWidth(value: number | undefined) {
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
    get commonSeriesSettings(): any {
        return this._getOption('commonSeriesSettings');
    }
    set commonSeriesSettings(value: any) {
        this._setOption('commonSeriesSettings', value);
    }

    @Input()
    get dataPrepareSettings(): { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | Function } {
        return this._getOption('dataPrepareSettings');
    }
    set dataPrepareSettings(value: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | Function }) {
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
    get palette(): Palette | string | Array<string> {
        return this._getOption('palette');
    }
    set palette(value: Palette | string | Array<string>) {
        this._setOption('palette', value);
    }

    @Input()
    get paletteExtensionMode(): PaletteExtensionMode {
        return this._getOption('paletteExtensionMode');
    }
    set paletteExtensionMode(value: PaletteExtensionMode) {
        this._setOption('paletteExtensionMode', value);
    }

    @Input()
    get series(): ChartSeries | any | undefined | Array<ChartSeries | any> {
        return this._getOption('series');
    }
    set series(value: ChartSeries | any | undefined | Array<ChartSeries | any>) {
        this._setOption('series', value);
    }

    @Input()
    get seriesTemplate(): { customizeSeries?: Function, nameField?: string } {
        return this._getOption('seriesTemplate');
    }
    set seriesTemplate(value: { customizeSeries?: Function, nameField?: string }) {
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
    get valueAxis(): { inverted?: boolean, logarithmBase?: number, max?: number | undefined, min?: number | undefined, type?: ChartAxisScale | undefined, valueType?: ChartsDataType | undefined } {
        return this._getOption('valueAxis');
    }
    set valueAxis(value: { inverted?: boolean, logarithmBase?: number, max?: number | undefined, min?: number | undefined, type?: ChartAxisScale | undefined, valueType?: ChartsDataType | undefined }) {
        this._setOption('valueAxis', value);
    }


    protected get _optionPath() {
        return 'chart';
    }


    @ContentChildren(forwardRef(() => DxiSeriesComponent))
    get seriesChildren(): QueryList<DxiSeriesComponent> {
        return this._getOption('series');
    }
    set seriesChildren(value) {
        this.setChildren('series', value);
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
    DxoChartComponent
  ],
  exports: [
    DxoChartComponent
  ],
})
export class DxoChartModule { }

/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { DashStyle, ChartsColor, SeriesHoverMode, HatchDirection, Font, RelativePosition, PointInteractionMode, PointSymbol, SeriesSelectionMode, ValueErrorBarDisplayMode, ValueErrorBarType } from 'devextreme/common/charts';
import { Format } from 'devextreme/localization';
import { PolarChartSeriesType } from 'devextreme/viz/polar_chart';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-polar-chart-series',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiPolarChartSeriesComponent extends CollectionNestedOption {
    @Input()
    get argumentField(): string {
        return this._getOption('argumentField');
    }
    set argumentField(value: string) {
        this._setOption('argumentField', value);
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
    get closed(): boolean {
        return this._getOption('closed');
    }
    set closed(value: boolean) {
        this._setOption('closed', value);
    }

    @Input()
    get color(): ChartsColor | string {
        return this._getOption('color');
    }
    set color(value: ChartsColor | string) {
        this._setOption('color', value);
    }

    @Input()
    get dashStyle(): DashStyle {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: DashStyle) {
        this._setOption('dashStyle', value);
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
    get label(): Record<string, any> | { argumentFormat?: Format, backgroundColor?: string, border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string, font?: Font, format?: Format, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { argumentFormat?: Format, backgroundColor?: string, border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string, font?: Font, format?: Format, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean }) {
        this._setOption('label', value);
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
    get point(): Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, hoverMode?: PointInteractionMode, hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, size?: number }, image?: Record<string, any> | string | { height?: number, url?: string, width?: number }, selectionMode?: PointInteractionMode, selectionStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean } {
        return this._getOption('point');
    }
    set point(value: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, hoverMode?: PointInteractionMode, hoverStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, size?: number }, image?: Record<string, any> | string | { height?: number, url?: string, width?: number }, selectionMode?: PointInteractionMode, selectionStyle?: Record<string, any> | { border?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, color?: ChartsColor | string, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean }) {
        this._setOption('point', value);
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
    get type(): PolarChartSeriesType {
        return this._getOption('type');
    }
    set type(value: PolarChartSeriesType) {
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
    DxiPolarChartSeriesComponent
  ],
  exports: [
    DxiPolarChartSeriesComponent
  ],
})
export class DxiPolarChartSeriesModule { }

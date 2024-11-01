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




import { DashStyle, ChartsColor, SeriesHoverMode, HatchDirection, Font, RelativePosition, PointInteractionMode, PointSymbol, SeriesSelectionMode, ValueErrorBarDisplayMode, ValueErrorBarType } from 'devextreme/common/charts';
import { Format } from 'devextreme/common/core/localization';
import { PolarChartSeriesType } from 'devextreme/viz/polar_chart';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-polar-chart-common-series-settings',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartCommonSeriesSettingsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get area(): any {
        return this._getOption('area');
    }
    set area(value: any) {
        this._setOption('area', value);
    }

    @Input()
    get argumentField(): string {
        return this._getOption('argumentField');
    }
    set argumentField(value: string) {
        this._setOption('argumentField', value);
    }

    @Input()
    get bar(): any {
        return this._getOption('bar');
    }
    set bar(value: any) {
        this._setOption('bar', value);
    }

    @Input()
    get barPadding(): number | undefined {
        return this._getOption('barPadding');
    }
    set barPadding(value: number | undefined) {
        this._setOption('barPadding', value);
    }

    @Input()
    get barWidth(): number | undefined {
        return this._getOption('barWidth');
    }
    set barWidth(value: number | undefined) {
        this._setOption('barWidth', value);
    }

    @Input()
    get border(): { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }) {
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
    get color(): ChartsColor | string | undefined {
        return this._getOption('color');
    }
    set color(value: ChartsColor | string | undefined) {
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
    get hoverStyle(): { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }) {
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
    get label(): { argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, position?: RelativePosition, rotationAngle?: number, showForZeroValues?: boolean, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get line(): any {
        return this._getOption('line');
    }
    set line(value: any) {
        this._setOption('line', value);
    }

    @Input()
    get maxLabelCount(): number | undefined {
        return this._getOption('maxLabelCount');
    }
    set maxLabelCount(value: number | undefined) {
        this._setOption('maxLabelCount', value);
    }

    @Input()
    get minBarSize(): number | undefined {
        return this._getOption('minBarSize');
    }
    set minBarSize(value: number | undefined) {
        this._setOption('minBarSize', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get point(): { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, image?: string | undefined | { height?: number, url?: string | undefined, width?: number }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean } {
        return this._getOption('point');
    }
    set point(value: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hoverMode?: PointInteractionMode, hoverStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, image?: string | undefined | { height?: number, url?: string | undefined, width?: number }, selectionMode?: PointInteractionMode, selectionStyle?: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number }, size?: number, symbol?: PointSymbol, visible?: boolean }) {
        this._setOption('point', value);
    }

    @Input()
    get scatter(): any {
        return this._getOption('scatter');
    }
    set scatter(value: any) {
        this._setOption('scatter', value);
    }

    @Input()
    get selectionMode(): SeriesSelectionMode {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: SeriesSelectionMode) {
        this._setOption('selectionMode', value);
    }

    @Input()
    get selectionStyle(): { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, dashStyle?: DashStyle, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean, width?: number }) {
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
    get stackedbar(): any {
        return this._getOption('stackedbar');
    }
    set stackedbar(value: any) {
        this._setOption('stackedbar', value);
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
    get valueErrorBar(): { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: undefined | ValueErrorBarType, value?: number } {
        return this._getOption('valueErrorBar');
    }
    set valueErrorBar(value: { color?: string, displayMode?: ValueErrorBarDisplayMode, edgeLength?: number, highValueField?: string | undefined, lineWidth?: number, lowValueField?: string | undefined, opacity?: number | undefined, type?: undefined | ValueErrorBarType, value?: number }) {
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
        return 'commonSeriesSettings';
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
    DxoPolarChartCommonSeriesSettingsComponent
  ],
  exports: [
    DxoPolarChartCommonSeriesSettingsComponent
  ],
})
export class DxoPolarChartCommonSeriesSettingsModule { }

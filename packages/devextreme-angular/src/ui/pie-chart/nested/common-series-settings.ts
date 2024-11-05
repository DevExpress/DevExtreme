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




import { ChartsDataType, DashStyle, ChartsColor, HatchDirection, Font, LabelPosition, TextOverflow, WordWrap } from 'devextreme/common/charts';
import { PieChartSeriesInteractionMode, SmallValuesGroupingMode } from 'devextreme/viz/pie_chart';
import { Format } from 'devextreme/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-pie-chart-common-series-settings',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPieChartCommonSeriesSettingsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get argumentField(): string {
        return this._getOption('argumentField');
    }
    set argumentField(value: string) {
        this._setOption('argumentField', value);
    }

    @Input()
    get argumentType(): ChartsDataType {
        return this._getOption('argumentType');
    }
    set argumentType(value: ChartsDataType) {
        this._setOption('argumentType', value);
    }

    @Input()
    get border(): Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    @Input()
    get color(): ChartsColor | string {
        return this._getOption('color');
    }
    set color(value: ChartsColor | string) {
        this._setOption('color', value);
    }

    @Input()
    get hoverMode(): PieChartSeriesInteractionMode {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: PieChartSeriesInteractionMode) {
        this._setOption('hoverMode', value);
    }

    @Input()
    get hoverStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get label(): Record<string, any> | { argumentFormat?: Format, backgroundColor?: string, border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string, font?: Font, format?: Format, position?: LabelPosition, radialOffset?: number, rotationAngle?: number, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { argumentFormat?: Format, backgroundColor?: string, border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string, font?: Font, format?: Format, position?: LabelPosition, radialOffset?: number, rotationAngle?: number, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }) {
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
    get minSegmentSize(): number {
        return this._getOption('minSegmentSize');
    }
    set minSegmentSize(value: number) {
        this._setOption('minSegmentSize', value);
    }

    @Input()
    get selectionMode(): PieChartSeriesInteractionMode {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: PieChartSeriesInteractionMode) {
        this._setOption('selectionMode', value);
    }

    @Input()
    get selectionStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, color?: ChartsColor | string, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('selectionStyle', value);
    }

    @Input()
    get smallValuesGrouping(): Record<string, any> | { groupName?: string, mode?: SmallValuesGroupingMode, threshold?: number, topCount?: number } {
        return this._getOption('smallValuesGrouping');
    }
    set smallValuesGrouping(value: Record<string, any> | { groupName?: string, mode?: SmallValuesGroupingMode, threshold?: number, topCount?: number }) {
        this._setOption('smallValuesGrouping', value);
    }

    @Input()
    get tagField(): string {
        return this._getOption('tagField');
    }
    set tagField(value: string) {
        this._setOption('tagField', value);
    }

    @Input()
    get valueField(): string {
        return this._getOption('valueField');
    }
    set valueField(value: string) {
        this._setOption('valueField', value);
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
    DxoPieChartCommonSeriesSettingsComponent
  ],
  exports: [
    DxoPieChartCommonSeriesSettingsComponent
  ],
})
export class DxoPieChartCommonSeriesSettingsModule { }

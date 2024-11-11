/* tslint:disable:max-line-length */


import {
    Component,
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
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-pie-chart-series',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiPieChartSeriesComponent extends CollectionNestedOption {
    @Input()
    get argumentField(): string {
        return this._getOption('argumentField');
    }
    set argumentField(value: string) {
        this._setOption('argumentField', value);
    }

    @Input()
    get argumentType(): ChartsDataType | undefined {
        return this._getOption('argumentType');
    }
    set argumentType(value: ChartsDataType | undefined) {
        this._setOption('argumentType', value);
    }

    @Input()
    get border(): Record<string, any> | { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    @Input()
    get color(): ChartsColor | string | undefined {
        return this._getOption('color');
    }
    set color(value: ChartsColor | string | undefined) {
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
    get hoverStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get label(): Record<string, any> | { argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: Record<string, any> | { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, position?: LabelPosition, radialOffset?: number, rotationAngle?: number, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { argumentFormat?: Format | undefined, backgroundColor?: string | undefined, border?: Record<string, any> | { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, connector?: Record<string, any> | { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), displayFormat?: string | undefined, font?: Font, format?: Format | undefined, position?: LabelPosition, radialOffset?: number, rotationAngle?: number, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }) {
        this._setOption('label', value);
    }

    @Input()
    get maxLabelCount(): number | undefined {
        return this._getOption('maxLabelCount');
    }
    set maxLabelCount(value: number | undefined) {
        this._setOption('maxLabelCount', value);
    }

    @Input()
    get minSegmentSize(): number | undefined {
        return this._getOption('minSegmentSize');
    }
    set minSegmentSize(value: number | undefined) {
        this._setOption('minSegmentSize', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    @Input()
    get selectionMode(): PieChartSeriesInteractionMode {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: PieChartSeriesInteractionMode) {
        this._setOption('selectionMode', value);
    }

    @Input()
    get selectionStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: Record<string, any> | { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('selectionStyle', value);
    }

    @Input()
    get smallValuesGrouping(): Record<string, any> | { groupName?: string, mode?: SmallValuesGroupingMode, threshold?: number | undefined, topCount?: number | undefined } {
        return this._getOption('smallValuesGrouping');
    }
    set smallValuesGrouping(value: Record<string, any> | { groupName?: string, mode?: SmallValuesGroupingMode, threshold?: number | undefined, topCount?: number | undefined }) {
        this._setOption('smallValuesGrouping', value);
    }

    @Input()
    get tag(): any | undefined {
        return this._getOption('tag');
    }
    set tag(value: any | undefined) {
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
    get valueField(): string {
        return this._getOption('valueField');
    }
    set valueField(value: string) {
        this._setOption('valueField', value);
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
    DxiPieChartSeriesComponent
  ],
  exports: [
    DxiPieChartSeriesComponent
  ],
})
export class DxiPieChartSeriesModule { }

/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { ChartsColor, ChartsDataType, DashStyle, Font, HatchDirection, LabelPosition, TextOverflow, WordWrap } from 'devextreme/common/charts';
import { Format } from 'devextreme/localization';
import { PieChartSeriesInteractionMode, SmallValuesGroupingMode } from 'devextreme/viz/pie_chart';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-series-pie-chart',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiSeriesPieChartComponent extends CollectionNestedOption {
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
    get border(): { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }) {
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
    get hoverStyle(): { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get label(): { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: LabelPosition, radialOffset?: number, rotationAngle?: number, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap } {
        return this._getOption('label');
    }
    set label(value: { argumentFormat?: Format | string | undefined, backgroundColor?: string | undefined, border?: { color?: string, dashStyle?: DashStyle, visible?: boolean, width?: number }, connector?: { color?: string | undefined, visible?: boolean, width?: number }, customizeText?: Function, displayFormat?: string | undefined, font?: Font, format?: Format | string | undefined, position?: LabelPosition, radialOffset?: number, rotationAngle?: number, textOverflow?: TextOverflow, visible?: boolean, wordWrap?: WordWrap }) {
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
    get selectionStyle(): { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: { border?: { color?: string | undefined, dashStyle?: DashStyle | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, hatching?: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }, highlight?: boolean }) {
        this._setOption('selectionStyle', value);
    }

    @Input()
    get smallValuesGrouping(): { groupName?: string, mode?: SmallValuesGroupingMode, threshold?: number | undefined, topCount?: number | undefined } {
        return this._getOption('smallValuesGrouping');
    }
    set smallValuesGrouping(value: { groupName?: string, mode?: SmallValuesGroupingMode, threshold?: number | undefined, topCount?: number | undefined }) {
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
    DxiSeriesPieChartComponent
  ],
  exports: [
    DxiSeriesPieChartComponent
  ],
})
export class DxiSeriesPieChartModule { }

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




import { ChartsColor } from 'devextreme/common/charts';

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
    get argumentType(): "datetime" | "numeric" | "string" {
        return this._getOption('argumentType');
    }
    set argumentType(value: "datetime" | "numeric" | "string") {
        this._setOption('argumentType', value);
    }

    @Input()
    get border(): Record<string, any> {
        return this._getOption('border');
    }
    set border(value: Record<string, any>) {
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
    get hoverMode(): "none" | "onlyPoint" {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: "none" | "onlyPoint") {
        this._setOption('hoverMode', value);
    }

    @Input()
    get hoverStyle(): Record<string, any> {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: Record<string, any>) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get label(): Record<string, any> {
        return this._getOption('label');
    }
    set label(value: Record<string, any>) {
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
    get selectionMode(): "none" | "onlyPoint" {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: "none" | "onlyPoint") {
        this._setOption('selectionMode', value);
    }

    @Input()
    get selectionStyle(): Record<string, any> {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: Record<string, any>) {
        this._setOption('selectionStyle', value);
    }

    @Input()
    get smallValuesGrouping(): Record<string, any> {
        return this._getOption('smallValuesGrouping');
    }
    set smallValuesGrouping(value: Record<string, any>) {
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

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
import { chartPointObject } from 'devextreme/viz/chart';
import { Font } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-vertical-line',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartVerticalLineComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get dashStyle(): "dash" | "dot" | "longDash" | "solid" {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: "dash" | "dot" | "longDash" | "solid") {
        this._setOption('dashStyle', value);
    }

    @Input()
    get label(): Record<string, any> | { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { backgroundColor?: string, customizeText?: ((info: { point: chartPointObject, value: Date | number | string, valueText: string }) => string), font?: Font, format?: LocalizationTypes.Format, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
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
        return 'verticalLine';
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
    DxoChartVerticalLineComponent
  ],
  exports: [
    DxoChartVerticalLineComponent
  ],
})
export class DxoChartVerticalLineModule { }

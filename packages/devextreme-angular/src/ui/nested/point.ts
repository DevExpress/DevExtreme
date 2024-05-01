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




import DevExpress from 'devextreme/bundles/dx.all';
import { PointInteractionMode, PointSymbol } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-point',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPointComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): { color?: string | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    @Input()
    get color(): DevExpress.common.charts.ChartsColor | string | undefined {
        return this._getOption('color');
    }
    set color(value: DevExpress.common.charts.ChartsColor | string | undefined) {
        this._setOption('color', value);
    }

    @Input()
    get hoverMode(): PointInteractionMode {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: PointInteractionMode) {
        this._setOption('hoverMode', value);
    }

    @Input()
    get hoverStyle(): { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number | undefined } | { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number | undefined } | { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get image(): string | undefined | { height?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } } | { height?: number, url?: string | undefined, width?: number } {
        return this._getOption('image');
    }
    set image(value: string | undefined | { height?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } } | { height?: number, url?: string | undefined, width?: number }) {
        this._setOption('image', value);
    }

    @Input()
    get selectionMode(): PointInteractionMode {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: PointInteractionMode) {
        this._setOption('selectionMode', value);
    }

    @Input()
    get selectionStyle(): { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number | undefined } | { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number | undefined } | { border?: { color?: string | undefined, visible?: boolean, width?: number }, color?: DevExpress.common.charts.ChartsColor | string | undefined, size?: number }) {
        this._setOption('selectionStyle', value);
    }

    @Input()
    get size(): number {
        return this._getOption('size');
    }
    set size(value: number) {
        this._setOption('size', value);
    }

    @Input()
    get symbol(): PointSymbol {
        return this._getOption('symbol');
    }
    set symbol(value: PointSymbol) {
        this._setOption('symbol', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'point';
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
    DxoPointComponent
  ],
  exports: [
    DxoPointComponent
  ],
})
export class DxoPointModule { }

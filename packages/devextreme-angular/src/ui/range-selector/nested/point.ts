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




import { ChartsColor, PointInteractionMode, PointSymbol } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-range-selector-point',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorPointComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): Record<string, any> | { color?: string | undefined, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color?: string | undefined, visible?: boolean, width?: number }) {
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
    get hoverMode(): PointInteractionMode {
        return this._getOption('hoverMode');
    }
    set hoverMode(value: PointInteractionMode) {
        this._setOption('hoverMode', value);
    }

    @Input()
    get hoverStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get image(): Record<string, any> | string | undefined | { height?: number | Record<string, any> | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: Record<string, any> | string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | Record<string, any> | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } } {
        return this._getOption('image');
    }
    set image(value: Record<string, any> | string | undefined | { height?: number | Record<string, any> | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined }, url?: Record<string, any> | string | undefined | { rangeMaxPoint?: string | undefined, rangeMinPoint?: string | undefined }, width?: number | Record<string, any> | { rangeMaxPoint?: number | undefined, rangeMinPoint?: number | undefined } }) {
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
    get selectionStyle(): Record<string, any> | { border?: Record<string, any> | { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: Record<string, any> | { border?: Record<string, any> | { color?: string | undefined, visible?: boolean, width?: number }, color?: ChartsColor | string | undefined, size?: number | undefined }) {
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
    DxoRangeSelectorPointComponent
  ],
  exports: [
    DxoRangeSelectorPointComponent
  ],
})
export class DxoRangeSelectorPointModule { }

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




import { HorizontalAlignment, VerticalAlignment } from 'devextreme/common';
import { ChartsColor, Palette, PaletteExtensionMode } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiRangeLinearGaugeComponent } from './range-dxi';


@Component({
    selector: 'dxo-range-container-linear-gauge',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeContainerLinearGaugeComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get backgroundColor(): ChartsColor | string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: ChartsColor | string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get horizontalOrientation(): HorizontalAlignment {
        return this._getOption('horizontalOrientation');
    }
    set horizontalOrientation(value: HorizontalAlignment) {
        this._setOption('horizontalOrientation', value);
    }

    @Input()
    get offset(): number {
        return this._getOption('offset');
    }
    set offset(value: number) {
        this._setOption('offset', value);
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
    get ranges(): Array<any | { color?: ChartsColor | string, endValue?: number, startValue?: number }> {
        return this._getOption('ranges');
    }
    set ranges(value: Array<any | { color?: ChartsColor | string, endValue?: number, startValue?: number }>) {
        this._setOption('ranges', value);
    }

    @Input()
    get verticalOrientation(): VerticalAlignment {
        return this._getOption('verticalOrientation');
    }
    set verticalOrientation(value: VerticalAlignment) {
        this._setOption('verticalOrientation', value);
    }

    @Input()
    get width(): number | { end?: number, start?: number } {
        return this._getOption('width');
    }
    set width(value: number | { end?: number, start?: number }) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'rangeContainer';
    }


    @ContentChildren(forwardRef(() => DxiRangeLinearGaugeComponent))
    get rangesChildren(): QueryList<DxiRangeLinearGaugeComponent> {
        return this._getOption('ranges');
    }
    set rangesChildren(value) {
        this.setChildren('ranges', value);
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
    DxoRangeContainerLinearGaugeComponent
  ],
  exports: [
    DxoRangeContainerLinearGaugeComponent
  ],
})
export class DxoRangeContainerLinearGaugeModule { }

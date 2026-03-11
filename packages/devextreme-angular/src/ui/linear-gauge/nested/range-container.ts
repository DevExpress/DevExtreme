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
    QueryList
} from '@angular/core';




import type { ChartsColor, Palette, PaletteExtensionMode } from 'devextreme/common/charts';
import type { HorizontalAlignment, VerticalAlignment } from 'devextreme/common';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

import {
    PROPERTY_TOKEN_ranges,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-linear-gauge-range-container',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoLinearGaugeRangeContainerComponent extends NestedOption implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_ranges)
    set _rangesContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('ranges', value);
    }
    
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
    get palette(): Array<string> | Palette {
        return this._getOption('palette');
    }
    set palette(value: Array<string> | Palette) {
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
    get ranges(): { color?: ChartsColor | string, endValue?: number, startValue?: number }[] {
        return this._getOption('ranges');
    }
    set ranges(value: { color?: ChartsColor | string, endValue?: number, startValue?: number }[]) {
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
  imports: [
    DxoLinearGaugeRangeContainerComponent
  ],
  exports: [
    DxoLinearGaugeRangeContainerComponent
  ],
})
export class DxoLinearGaugeRangeContainerModule { }

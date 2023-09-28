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

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-selection-style',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSelectionStyleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): { color?: string | undefined, visible?: boolean, width?: number } | { color?: string | undefined, dashStyle?: string, visible?: boolean, width?: number } | { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined } | { color?: string | undefined, dashStyle?: string | undefined, visible?: boolean, width?: number } | { color?: string, width?: number | undefined } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, visible?: boolean, width?: number } | { color?: string | undefined, dashStyle?: string, visible?: boolean, width?: number } | { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined } | { color?: string | undefined, dashStyle?: string | undefined, visible?: boolean, width?: number } | { color?: string, width?: number | undefined }) {
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
    get size(): number | undefined {
        return this._getOption('size');
    }
    set size(value: number | undefined) {
        this._setOption('size', value);
    }

    @Input()
    get dashStyle(): string {
        return this._getOption('dashStyle');
    }
    set dashStyle(value: string) {
        this._setOption('dashStyle', value);
    }

    @Input()
    get hatching(): { direction?: string, opacity?: number, step?: number, width?: number } {
        return this._getOption('hatching');
    }
    set hatching(value: { direction?: string, opacity?: number, step?: number, width?: number }) {
        this._setOption('hatching', value);
    }

    @Input()
    get highlight(): boolean {
        return this._getOption('highlight');
    }
    set highlight(value: boolean) {
        this._setOption('highlight', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'selectionStyle';
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
    DxoSelectionStyleComponent
  ],
  exports: [
    DxoSelectionStyleComponent
  ],
})
export class DxoSelectionStyleModule { }

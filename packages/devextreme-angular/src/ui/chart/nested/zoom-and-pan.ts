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





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chart-zoom-and-pan',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoChartZoomAndPanComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowMouseWheel(): boolean {
        return this._getOption('allowMouseWheel');
    }
    set allowMouseWheel(value: boolean) {
        this._setOption('allowMouseWheel', value);
    }

    @Input()
    get allowTouchGestures(): boolean {
        return this._getOption('allowTouchGestures');
    }
    set allowTouchGestures(value: boolean) {
        this._setOption('allowTouchGestures', value);
    }

    @Input()
    get argumentAxis(): "both" | "none" | "pan" | "zoom" {
        return this._getOption('argumentAxis');
    }
    set argumentAxis(value: "both" | "none" | "pan" | "zoom") {
        this._setOption('argumentAxis', value);
    }

    @Input()
    get dragBoxStyle(): Record<string, any> | { color: string, opacity: number } {
        return this._getOption('dragBoxStyle');
    }
    set dragBoxStyle(value: Record<string, any> | { color: string, opacity: number }) {
        this._setOption('dragBoxStyle', value);
    }

    @Input()
    get dragToZoom(): boolean {
        return this._getOption('dragToZoom');
    }
    set dragToZoom(value: boolean) {
        this._setOption('dragToZoom', value);
    }

    @Input()
    get panKey(): "alt" | "ctrl" | "meta" | "shift" {
        return this._getOption('panKey');
    }
    set panKey(value: "alt" | "ctrl" | "meta" | "shift") {
        this._setOption('panKey', value);
    }

    @Input()
    get valueAxis(): "both" | "none" | "pan" | "zoom" {
        return this._getOption('valueAxis');
    }
    set valueAxis(value: "both" | "none" | "pan" | "zoom") {
        this._setOption('valueAxis', value);
    }


    protected get _optionPath() {
        return 'zoomAndPan';
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
    DxoChartZoomAndPanComponent
  ],
  exports: [
    DxoChartZoomAndPanComponent
  ],
})
export class DxoChartZoomAndPanModule { }

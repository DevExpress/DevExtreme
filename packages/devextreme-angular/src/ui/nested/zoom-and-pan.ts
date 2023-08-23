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
    selector: 'dxo-zoom-and-pan',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoZoomAndPanComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get argumentAxis(): string {
        return this._getOption('argumentAxis');
    }
    set argumentAxis(value: string) {
        this._setOption('argumentAxis', value);
    }

    @Input()
    get dragBoxStyle(): { color?: string | undefined, opacity?: number | undefined } {
        return this._getOption('dragBoxStyle');
    }
    set dragBoxStyle(value: { color?: string | undefined, opacity?: number | undefined }) {
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
    get panKey(): string {
        return this._getOption('panKey');
    }
    set panKey(value: string) {
        this._setOption('panKey', value);
    }

    @Input()
    get valueAxis(): string {
        return this._getOption('valueAxis');
    }
    set valueAxis(value: string) {
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
    DxoZoomAndPanComponent
  ],
  exports: [
    DxoZoomAndPanComponent
  ],
})
export class DxoZoomAndPanModule { }

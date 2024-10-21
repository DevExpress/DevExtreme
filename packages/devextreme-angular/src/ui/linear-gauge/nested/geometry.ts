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
    selector: 'dxo-linear-gauge-geometry',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoLinearGaugeGeometryComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get orientation(): "horizontal" | "vertical" {
        return this._getOption('orientation');
    }
    set orientation(value: "horizontal" | "vertical") {
        this._setOption('orientation', value);
    }


    protected get _optionPath() {
        return 'geometry';
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
    DxoLinearGaugeGeometryComponent
  ],
  exports: [
    DxoLinearGaugeGeometryComponent
  ],
})
export class DxoLinearGaugeGeometryModule { }

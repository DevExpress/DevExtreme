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
    selector: 'dxo-bar-gauge-geometry',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoBarGaugeGeometryComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get endAngle(): number {
        return this._getOption('endAngle');
    }
    set endAngle(value: number) {
        this._setOption('endAngle', value);
    }

    @Input()
    get startAngle(): number {
        return this._getOption('startAngle');
    }
    set startAngle(value: number) {
        this._setOption('startAngle', value);
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
    DxoBarGaugeGeometryComponent
  ],
  exports: [
    DxoBarGaugeGeometryComponent
  ],
})
export class DxoBarGaugeGeometryModule { }

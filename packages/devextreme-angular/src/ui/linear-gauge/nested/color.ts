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
    selector: 'dxo-linear-gauge-color',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoLinearGaugeColorComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get base(): string {
        return this._getOption('base');
    }
    set base(value: string) {
        this._setOption('base', value);
    }

    @Input()
    get fillId(): string {
        return this._getOption('fillId');
    }
    set fillId(value: string) {
        this._setOption('fillId', value);
    }


    protected get _optionPath() {
        return 'color';
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
    DxoLinearGaugeColorComponent
  ],
  exports: [
    DxoLinearGaugeColorComponent
  ],
})
export class DxoLinearGaugeColorModule { }

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
    selector: 'dxo-map-center',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoMapCenterComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get lat(): number {
        return this._getOption('lat');
    }
    set lat(value: number) {
        this._setOption('lat', value);
    }

    @Input()
    get lng(): number {
        return this._getOption('lng');
    }
    set lng(value: number) {
        this._setOption('lng', value);
    }


    protected get _optionPath() {
        return 'center';
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
    DxoMapCenterComponent
  ],
  exports: [
    DxoMapCenterComponent
  ],
})
export class DxoMapCenterModule { }

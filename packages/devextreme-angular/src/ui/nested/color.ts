/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoChartsColor } from './base/charts-color';


@Component({
    selector: 'dxo-color',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'base',
        'fillId'
    ]
})
export class DxoColorComponent extends DxoChartsColor implements OnDestroy, OnInit  {

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
    DxoColorComponent
  ],
  exports: [
    DxoColorComponent
  ],
})
export class DxoColorModule { }

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
    selector: 'dxo-background-color',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'base',
        'fillId'
    ]
})
export class DxoBackgroundColorComponent extends DxoChartsColor implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'backgroundColor';
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
    DxoBackgroundColorComponent
  ],
  exports: [
    DxoBackgroundColorComponent
  ],
})
export class DxoBackgroundColorModule { }

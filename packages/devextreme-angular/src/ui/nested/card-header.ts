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
import { DxoCardHeader } from './base/card-header';


@Component({
    selector: 'dxo-card-header',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'visible'
    ]
})
export class DxoCardHeaderComponent extends DxoCardHeader implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'cardHeader';
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
    DxoCardHeaderComponent
  ],
  exports: [
    DxoCardHeaderComponent
  ],
})
export class DxoCardHeaderModule { }

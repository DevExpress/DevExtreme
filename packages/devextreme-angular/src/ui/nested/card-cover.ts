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
import { DxoCardCover } from './base/card-cover';


@Component({
    selector: 'dxo-card-cover',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'altExpr',
        'aspectRatio',
        'imageExpr',
        'maxHeight'
    ]
})
export class DxoCardCoverComponent extends DxoCardCover implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'cardCover';
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
    DxoCardCoverComponent
  ],
  exports: [
    DxoCardCoverComponent
  ],
})
export class DxoCardCoverModule { }

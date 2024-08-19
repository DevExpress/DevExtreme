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
import { DxoUser } from './base/user';


@Component({
    selector: 'dxo-user',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'avatarUrl',
        'id',
        'name'
    ]
})
export class DxoUserComponent extends DxoUser implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'user';
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
    DxoUserComponent
  ],
  exports: [
    DxoUserComponent
  ],
})
export class DxoUserModule { }

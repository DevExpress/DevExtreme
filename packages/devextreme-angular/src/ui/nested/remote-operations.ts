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
import { DxoRemoteOperations } from './base/remote-operations';


@Component({
    selector: 'dxo-remote-operations',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'filtering',
        'grouping',
        'paging',
        'sorting',
        'groupPaging',
        'summary'
    ]
})
export class DxoRemoteOperationsComponent extends DxoRemoteOperations implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'remoteOperations';
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
    DxoRemoteOperationsComponent
  ],
  exports: [
    DxoRemoteOperationsComponent
  ],
})
export class DxoRemoteOperationsModule { }

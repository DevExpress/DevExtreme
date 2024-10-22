/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiChatError } from './base/chat-error-dxi';


@Component({
    selector: 'dxi-error',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'id',
        'message'
    ]
})
export class DxiErrorComponent extends DxiChatError {

    protected get _optionPath() {
        return 'errors';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiErrorComponent
  ],
  exports: [
    DxiErrorComponent
  ],
})
export class DxiErrorModule { }

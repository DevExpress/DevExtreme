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
import { DxiAlert } from './base/alert-dxi';


@Component({
    selector: 'dxi-alert',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'id',
        'message'
    ]
})
export class DxiAlertComponent extends DxiAlert {

    protected get _optionPath() {
        return 'alerts';
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
    DxiAlertComponent
  ],
  exports: [
    DxiAlertComponent
  ],
})
export class DxiAlertModule { }

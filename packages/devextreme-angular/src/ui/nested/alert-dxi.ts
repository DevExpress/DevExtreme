/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiAlert } from './base/alert-dxi';

import { PROPERTY_TOKEN_alerts } from 'devextreme-angular/core/tokens';


@Component({
    selector: 'dxi-alert',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_alerts,
           useExisting: DxiAlertComponent,
        }
    ],
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
  imports: [
    DxiAlertComponent
  ],
  exports: [
    DxiAlertComponent
  ],
})
export class DxiAlertModule { }

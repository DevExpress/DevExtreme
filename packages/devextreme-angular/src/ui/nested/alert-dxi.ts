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
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { DxiAlert } from './base/alert-dxi';

@Component({
    selector: 'dxi-alert',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: СOLLECTION_NESTED_OPTION_TOKEN,
            useFactory: (component: DxiAlertComponent) => ({
               propertyName: 'alerts',
               component
            }),
            deps: [DxiAlertComponent],
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

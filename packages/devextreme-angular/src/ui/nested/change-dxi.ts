/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiDataChange } from './base/data-change-dxi';

import { PROPERTY_TOKEN_changes } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-change',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_changes,
           useExisting: DxiChangeComponent,
        }
    ],
    inputs: [
        'data',
        'insertAfterKey',
        'insertBeforeKey',
        'key',
        'type'
    ]
})
export class DxiChangeComponent extends DxiDataChange {

    protected get _optionPath() {
        return 'changes';
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
    DxiChangeComponent
  ],
  exports: [
    DxiChangeComponent
  ],
})
export class DxiChangeModule { }

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
import { DxiDataChange } from './base/data-change-dxi';


@Component({
    selector: 'dxi-change',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
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
  declarations: [
    DxiChangeComponent
  ],
  exports: [
    DxiChangeComponent
  ],
})
export class DxiChangeModule { }

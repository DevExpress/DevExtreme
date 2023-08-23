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
import { DxiFilterBuilderCustomOperation } from './base/filter-builder-custom-operation-dxi';


@Component({
    selector: 'dxi-custom-operation',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'calculateFilterExpression',
        'caption',
        'customizeText',
        'dataTypes',
        'editorTemplate',
        'hasValue',
        'icon',
        'name'
    ]
})
export class DxiCustomOperationComponent extends DxiFilterBuilderCustomOperation {

    protected get _optionPath() {
        return 'customOperations';
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
    DxiCustomOperationComponent
  ],
  exports: [
    DxiCustomOperationComponent
  ],
})
export class DxiCustomOperationModule { }

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
import { DxiFilterBuilderField } from './base/filter-builder-field-dxi';


@Component({
    selector: 'dxi-field',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'calculateFilterExpression',
        'caption',
        'customizeText',
        'dataField',
        'dataType',
        'editorOptions',
        'editorTemplate',
        'falseText',
        'filterOperations',
        'format',
        'lookup',
        'name',
        'trueText'
    ]
})
export class DxiFieldComponent extends DxiFilterBuilderField {

    protected get _optionPath() {
        return 'fields';
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
    DxiFieldComponent
  ],
  exports: [
    DxiFieldComponent
  ],
})
export class DxiFieldModule { }

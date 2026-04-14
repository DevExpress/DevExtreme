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
import { DxiFilterBuilderField } from './base/filter-builder-field-dxi';

import { PROPERTY_TOKEN_fields } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-field',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_fields,
           useExisting: DxiFieldComponent,
        }
    ],
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
  imports: [
    DxiFieldComponent
  ],
  exports: [
    DxiFieldComponent
  ],
})
export class DxiFieldModule { }

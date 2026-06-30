/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    ContentChildren,
    QueryList
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { DxoFormSimpleItem } from './base/form-simple-item';

import {
    PROPERTY_TOKEN_validationRules,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-form-item',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'colSpan',
        'cssClass',
        'dataField',
        'editorOptions',
        'editorType',
        'helpText',
        'isRequired',
        'itemType',
        'label',
        'name',
        'template',
        'validationRules',
        'visible',
        'visibleIndex'
    ]
})
export class DxoFormItemComponent extends DxoFormSimpleItem implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_validationRules)
    set _validationRulesContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('validationRules', value);
    }
    

    protected get _optionPath() {
        return 'formItem';
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
  imports: [
    DxoFormItemComponent
  ],
  exports: [
    DxoFormItemComponent
  ],
})
export class DxoFormItemModule { }

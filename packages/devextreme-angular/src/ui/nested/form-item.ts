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
    forwardRef,
    QueryList
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoFormSimpleItem } from './base/form-simple-item';
import { DxiValidationRuleComponent } from './validation-rule-dxi';


@Component({
    selector: 'dxo-form-item',
    template: '',
    styles: [''],
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

    protected get _optionPath() {
        return 'formItem';
    }


    @ContentChildren(forwardRef(() => DxiValidationRuleComponent))
    get validationRulesChildren(): QueryList<DxiValidationRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setChildren('validationRules', value);
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
  declarations: [
    DxoFormItemComponent
  ],
  exports: [
    DxoFormItemComponent
  ],
})
export class DxoFormItemModule { }

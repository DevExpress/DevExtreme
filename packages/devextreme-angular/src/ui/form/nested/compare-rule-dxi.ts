/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import type { ComparisonOperator, ValidationRuleType } from 'devextreme/common';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_validationRules } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-form-compare-rule',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_validationRules,
           useExisting: DxiFormCompareRuleComponent,
        }
    ]
})
export class DxiFormCompareRuleComponent extends CollectionNestedOption {
    @Input()
    get comparisonTarget(): Function {
        return this._getOption('comparisonTarget');
    }
    set comparisonTarget(value: Function) {
        this._setOption('comparisonTarget', value);
    }

    @Input()
    get comparisonType(): ComparisonOperator {
        return this._getOption('comparisonType');
    }
    set comparisonType(value: ComparisonOperator) {
        this._setOption('comparisonType', value);
    }

    @Input()
    get ignoreEmptyValue(): boolean {
        return this._getOption('ignoreEmptyValue');
    }
    set ignoreEmptyValue(value: boolean) {
        this._setOption('ignoreEmptyValue', value);
    }

    @Input()
    get message(): string {
        return this._getOption('message');
    }
    set message(value: string) {
        this._setOption('message', value);
    }

    @Input()
    get type(): ValidationRuleType {
        return this._getOption('type');
    }
    set type(value: ValidationRuleType) {
        this._setOption('type', value);
    }


    protected get _optionPath() {
        return 'validationRules';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
        this.type = 'compare';
    
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  imports: [
    DxiFormCompareRuleComponent
  ],
  exports: [
    DxiFormCompareRuleComponent
  ],
})
export class DxiFormCompareRuleModule { }

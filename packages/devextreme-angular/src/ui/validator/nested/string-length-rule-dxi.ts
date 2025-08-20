/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
} from '@angular/core';




import { ValidationRuleType } from 'devextreme/common';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_validationRules } from 'devextreme-angular/core/tokens';


@Component({
    selector: 'dxi-validator-string-length-rule',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_validationRules,
           useExisting: DxiValidatorStringLengthRuleComponent,
        }
    ],
})
export class DxiValidatorStringLengthRuleComponent extends CollectionNestedOption {

    
    @Input()
    get ignoreEmptyValue(): boolean {
        return this._getOption('ignoreEmptyValue');
    }
    set ignoreEmptyValue(value: boolean) {
        this._setOption('ignoreEmptyValue', value);
    }

    @Input()
    get max(): number {
        return this._getOption('max');
    }
    set max(value: number) {
        this._setOption('max', value);
    }

    @Input()
    get message(): string {
        return this._getOption('message');
    }
    set message(value: string) {
        this._setOption('message', value);
    }

    @Input()
    get min(): number {
        return this._getOption('min');
    }
    set min(value: number) {
        this._setOption('min', value);
    }

    @Input()
    get trim(): boolean {
        return this._getOption('trim');
    }
    set trim(value: boolean) {
        this._setOption('trim', value);
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
        this.type = 'stringLength';
    
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  imports: [
    DxiValidatorStringLengthRuleComponent
  ],
  exports: [
    DxiValidatorStringLengthRuleComponent
  ],
})
export class DxiValidatorStringLengthRuleModule { }

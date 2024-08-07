/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { ValidationRuleType } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-validation-rule',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiValidationRuleComponent extends CollectionNestedOption {
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
    get reevaluate(): boolean {
        return this._getOption('reevaluate');
    }
    set reevaluate(value: boolean) {
        this._setOption('reevaluate', value);
    }

    @Input()
    get type(): ValidationRuleType {
        return this._getOption('type');
    }
    set type(value: ValidationRuleType) {
        this._setOption('type', value);
    }

    @Input()
    get validationCallback(): Function {
        return this._getOption('validationCallback');
    }
    set validationCallback(value: Function) {
        this._setOption('validationCallback', value);
    }


    protected get _optionPath() {
        return 'validationRules';
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
    DxiValidationRuleComponent
  ],
  exports: [
    DxiValidationRuleComponent
  ],
})
export class DxiValidationRuleModule { }

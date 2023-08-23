/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





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
    get message(): string {
        return this._getOption('message');
    }
    set message(value: string) {
        this._setOption('message', value);
    }

    @Input()
    get trim(): boolean {
        return this._getOption('trim');
    }
    set trim(value: boolean) {
        this._setOption('trim', value);
    }

    @Input()
    get type(): string {
        return this._getOption('type');
    }
    set type(value: string) {
        this._setOption('type', value);
    }

    @Input()
    get ignoreEmptyValue(): boolean {
        return this._getOption('ignoreEmptyValue');
    }
    set ignoreEmptyValue(value: boolean) {
        this._setOption('ignoreEmptyValue', value);
    }

    @Input()
    get max(): Date | number {
        return this._getOption('max');
    }
    set max(value: Date | number) {
        this._setOption('max', value);
    }

    @Input()
    get min(): Date | number {
        return this._getOption('min');
    }
    set min(value: Date | number) {
        this._setOption('min', value);
    }

    @Input()
    get reevaluate(): boolean {
        return this._getOption('reevaluate');
    }
    set reevaluate(value: boolean) {
        this._setOption('reevaluate', value);
    }

    @Input()
    get validationCallback(): Function {
        return this._getOption('validationCallback');
    }
    set validationCallback(value: Function) {
        this._setOption('validationCallback', value);
    }

    @Input()
    get comparisonTarget(): Function {
        return this._getOption('comparisonTarget');
    }
    set comparisonTarget(value: Function) {
        this._setOption('comparisonTarget', value);
    }

    @Input()
    get comparisonType(): string {
        return this._getOption('comparisonType');
    }
    set comparisonType(value: string) {
        this._setOption('comparisonType', value);
    }

    @Input()
    get pattern(): RegExp | string {
        return this._getOption('pattern');
    }
    set pattern(value: RegExp | string) {
        this._setOption('pattern', value);
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

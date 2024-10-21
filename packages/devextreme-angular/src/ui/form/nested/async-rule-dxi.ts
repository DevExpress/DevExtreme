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
    selector: 'dxi-form-async-rule',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiFormAsyncRuleComponent extends CollectionNestedOption {
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
    get type(): "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async" {
        return this._getOption('type');
    }
    set type(value: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async") {
        this._setOption('type', value);
    }

    @Input()
    get validationCallback(): ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any) {
        return this._getOption('validationCallback');
    }
    set validationCallback(value: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any)) {
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
    DxiFormAsyncRuleComponent
  ],
  exports: [
    DxiFormAsyncRuleComponent
  ],
})
export class DxiFormAsyncRuleModule { }

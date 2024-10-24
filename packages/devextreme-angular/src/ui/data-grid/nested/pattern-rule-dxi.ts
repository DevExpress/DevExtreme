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
    selector: 'dxi-data-grid-pattern-rule',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiDataGridPatternRuleComponent extends CollectionNestedOption {
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
    get pattern(): RegExp | string {
        return this._getOption('pattern');
    }
    set pattern(value: RegExp | string) {
        this._setOption('pattern', value);
    }

    @Input()
    get type(): "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async" {
        return this._getOption('type');
    }
    set type(value: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async") {
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
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiDataGridPatternRuleComponent
  ],
  exports: [
    DxiDataGridPatternRuleComponent
  ],
})
export class DxiDataGridPatternRuleModule { }

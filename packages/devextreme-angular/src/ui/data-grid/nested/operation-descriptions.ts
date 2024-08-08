/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-operation-descriptions',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridOperationDescriptionsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get between(): string {
        return this._getOption('between');
    }
    set between(value: string) {
        this._setOption('between', value);
    }

    @Input()
    get contains(): string {
        return this._getOption('contains');
    }
    set contains(value: string) {
        this._setOption('contains', value);
    }

    @Input()
    get endsWith(): string {
        return this._getOption('endsWith');
    }
    set endsWith(value: string) {
        this._setOption('endsWith', value);
    }

    @Input()
    get equal(): string {
        return this._getOption('equal');
    }
    set equal(value: string) {
        this._setOption('equal', value);
    }

    @Input()
    get greaterThan(): string {
        return this._getOption('greaterThan');
    }
    set greaterThan(value: string) {
        this._setOption('greaterThan', value);
    }

    @Input()
    get greaterThanOrEqual(): string {
        return this._getOption('greaterThanOrEqual');
    }
    set greaterThanOrEqual(value: string) {
        this._setOption('greaterThanOrEqual', value);
    }

    @Input()
    get lessThan(): string {
        return this._getOption('lessThan');
    }
    set lessThan(value: string) {
        this._setOption('lessThan', value);
    }

    @Input()
    get lessThanOrEqual(): string {
        return this._getOption('lessThanOrEqual');
    }
    set lessThanOrEqual(value: string) {
        this._setOption('lessThanOrEqual', value);
    }

    @Input()
    get notContains(): string {
        return this._getOption('notContains');
    }
    set notContains(value: string) {
        this._setOption('notContains', value);
    }

    @Input()
    get notEqual(): string {
        return this._getOption('notEqual');
    }
    set notEqual(value: string) {
        this._setOption('notEqual', value);
    }

    @Input()
    get startsWith(): string {
        return this._getOption('startsWith');
    }
    set startsWith(value: string) {
        this._setOption('startsWith', value);
    }


    protected get _optionPath() {
        return 'operationDescriptions';
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
    DxoDataGridOperationDescriptionsComponent
  ],
  exports: [
    DxoDataGridOperationDescriptionsComponent
  ],
})
export class DxoDataGridOperationDescriptionsModule { }

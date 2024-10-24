/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { dxFilterBuilderField } from 'devextreme/ui/filter_builder';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-data-grid-custom-operation',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiDataGridCustomOperationComponent extends CollectionNestedOption {
    @Input()
    get calculateFilterExpression(): ((filterValue: any, field: dxFilterBuilderField) => string | (() => any) | Array<any>) {
        return this._getOption('calculateFilterExpression');
    }
    set calculateFilterExpression(value: ((filterValue: any, field: dxFilterBuilderField) => string | (() => any) | Array<any>)) {
        this._setOption('calculateFilterExpression', value);
    }

    @Input()
    get caption(): string {
        return this._getOption('caption');
    }
    set caption(value: string) {
        this._setOption('caption', value);
    }

    @Input()
    get customizeText(): ((fieldInfo: { field: dxFilterBuilderField, value: string | number | Date, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((fieldInfo: { field: dxFilterBuilderField, value: string | number | Date, valueText: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get dataTypes(): Array<"string" | "number" | "date" | "boolean" | "object" | "datetime"> {
        return this._getOption('dataTypes');
    }
    set dataTypes(value: Array<"string" | "number" | "date" | "boolean" | "object" | "datetime">) {
        this._setOption('dataTypes', value);
    }

    @Input()
    get editorTemplate(): any {
        return this._getOption('editorTemplate');
    }
    set editorTemplate(value: any) {
        this._setOption('editorTemplate', value);
    }

    @Input()
    get hasValue(): boolean {
        return this._getOption('hasValue');
    }
    set hasValue(value: boolean) {
        this._setOption('hasValue', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }


    protected get _optionPath() {
        return 'customOperations';
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
    DxiDataGridCustomOperationComponent
  ],
  exports: [
    DxiDataGridCustomOperationComponent
  ],
})
export class DxiDataGridCustomOperationModule { }

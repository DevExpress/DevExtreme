/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { DataType } from 'devextreme/common';
import { Store } from 'devextreme/data';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { Format } from 'devextreme/localization';
import { FilterBuilderOperation } from 'devextreme/ui/filter_builder';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-tree-list-field',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiTreeListFieldComponent extends CollectionNestedOption {
    @Input()
    get calculateFilterExpression(): Function {
        return this._getOption('calculateFilterExpression');
    }
    set calculateFilterExpression(value: Function) {
        this._setOption('calculateFilterExpression', value);
    }

    @Input()
    get caption(): string | undefined {
        return this._getOption('caption');
    }
    set caption(value: string | undefined) {
        this._setOption('caption', value);
    }

    @Input()
    get customizeText(): Function {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function) {
        this._setOption('customizeText', value);
    }

    @Input()
    get dataField(): string | undefined {
        return this._getOption('dataField');
    }
    set dataField(value: string | undefined) {
        this._setOption('dataField', value);
    }

    @Input()
    get dataType(): DataType {
        return this._getOption('dataType');
    }
    set dataType(value: DataType) {
        this._setOption('dataType', value);
    }

    @Input()
    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
        this._setOption('editorOptions', value);
    }

    @Input()
    get editorTemplate(): any {
        return this._getOption('editorTemplate');
    }
    set editorTemplate(value: any) {
        this._setOption('editorTemplate', value);
    }

    @Input()
    get falseText(): string {
        return this._getOption('falseText');
    }
    set falseText(value: string) {
        this._setOption('falseText', value);
    }

    @Input()
    get filterOperations(): Array<FilterBuilderOperation | string> {
        return this._getOption('filterOperations');
    }
    set filterOperations(value: Array<FilterBuilderOperation | string>) {
        this._setOption('filterOperations', value);
    }

    @Input()
    get format(): Format | string {
        return this._getOption('format');
    }
    set format(value: Format | string) {
        this._setOption('format', value);
    }

    @Input()
    get lookup(): { allowClearing?: boolean, dataSource?: Store | DataSourceOptions | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: Function | string | undefined } {
        return this._getOption('lookup');
    }
    set lookup(value: { allowClearing?: boolean, dataSource?: Store | DataSourceOptions | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: Function | string | undefined }) {
        this._setOption('lookup', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    @Input()
    get trueText(): string {
        return this._getOption('trueText');
    }
    set trueText(value: string) {
        this._setOption('trueText', value);
    }


    protected get _optionPath() {
        return 'fields';
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
    DxiTreeListFieldComponent
  ],
  exports: [
    DxiTreeListFieldComponent
  ],
})
export class DxiTreeListFieldModule { }

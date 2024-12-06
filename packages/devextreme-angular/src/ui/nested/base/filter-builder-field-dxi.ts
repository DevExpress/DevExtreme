/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { DataType } from 'devextreme/common';
import { Format } from 'devextreme/common/core/localization';
import { Store } from 'devextreme/data';
import { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { FilterBuilderOperation } from 'devextreme/ui/filter_builder';

@Component({
    template: ''
})
export abstract class DxiFilterBuilderField extends CollectionNestedOption {
    get calculateFilterExpression(): Function {
        return this._getOption('calculateFilterExpression');
    }
    set calculateFilterExpression(value: Function) {
        this._setOption('calculateFilterExpression', value);
    }

    get caption(): string | undefined {
        return this._getOption('caption');
    }
    set caption(value: string | undefined) {
        this._setOption('caption', value);
    }

    get customizeText(): Function {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function) {
        this._setOption('customizeText', value);
    }

    get dataField(): string | undefined {
        return this._getOption('dataField');
    }
    set dataField(value: string | undefined) {
        this._setOption('dataField', value);
    }

    get dataType(): DataType {
        return this._getOption('dataType');
    }
    set dataType(value: DataType) {
        this._setOption('dataType', value);
    }

    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
        this._setOption('editorOptions', value);
    }

    get editorTemplate(): any {
        return this._getOption('editorTemplate');
    }
    set editorTemplate(value: any) {
        this._setOption('editorTemplate', value);
    }

    get falseText(): string {
        return this._getOption('falseText');
    }
    set falseText(value: string) {
        this._setOption('falseText', value);
    }

    get filterOperations(): Array<FilterBuilderOperation | string> {
        return this._getOption('filterOperations');
    }
    set filterOperations(value: Array<FilterBuilderOperation | string>) {
        this._setOption('filterOperations', value);
    }

    get format(): Format | string {
        return this._getOption('format');
    }
    set format(value: Format | string) {
        this._setOption('format', value);
    }

    get lookup(): { allowClearing?: boolean, dataSource?: Store | DataSourceOptions | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: Function | string | undefined } {
        return this._getOption('lookup');
    }
    set lookup(value: { allowClearing?: boolean, dataSource?: Store | DataSourceOptions | undefined | Array<any>, displayExpr?: Function | string | undefined, valueExpr?: Function | string | undefined }) {
        this._setOption('lookup', value);
    }

    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    get trueText(): string {
        return this._getOption('trueText');
    }
    set trueText(value: string) {
        this._setOption('trueText', value);
    }
}

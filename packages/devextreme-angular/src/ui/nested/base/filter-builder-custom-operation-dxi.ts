/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { DataType } from 'devextreme/common';

@Component({
    template: ''
})
export abstract class DxiFilterBuilderCustomOperation extends CollectionNestedOption {
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

    get dataTypes(): any | undefined | Array<DataType> {
        return this._getOption('dataTypes');
    }
    set dataTypes(value: any | undefined | Array<DataType>) {
        this._setOption('dataTypes', value);
    }

    get editorTemplate(): any {
        return this._getOption('editorTemplate');
    }
    set editorTemplate(value: any) {
        this._setOption('editorTemplate', value);
    }

    get hasValue(): boolean {
        return this._getOption('hasValue');
    }
    set hasValue(value: boolean) {
        this._setOption('hasValue', value);
    }

    get icon(): string | undefined {
        return this._getOption('icon');
    }
    set icon(value: string | undefined) {
        this._setOption('icon', value);
    }

    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }
}

/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';

@Component({
    template: ''
})
export abstract class DxiHtmlEditorMention extends CollectionNestedOption {
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<any>) {
        this._setOption('dataSource', value);
    }

    get displayExpr(): Function | string {
        return this._getOption('displayExpr');
    }
    set displayExpr(value: Function | string) {
        this._setOption('displayExpr', value);
    }

    get itemTemplate(): any {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: any) {
        this._setOption('itemTemplate', value);
    }

    get marker(): string {
        return this._getOption('marker');
    }
    set marker(value: string) {
        this._setOption('marker', value);
    }

    get minSearchLength(): number {
        return this._getOption('minSearchLength');
    }
    set minSearchLength(value: number) {
        this._setOption('minSearchLength', value);
    }

    get searchExpr(): Function | string | Array<Function | string> {
        return this._getOption('searchExpr');
    }
    set searchExpr(value: Function | string | Array<Function | string>) {
        this._setOption('searchExpr', value);
    }

    get searchTimeout(): number {
        return this._getOption('searchTimeout');
    }
    set searchTimeout(value: number) {
        this._setOption('searchTimeout', value);
    }

    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    get valueExpr(): Function | string {
        return this._getOption('valueExpr');
    }
    set valueExpr(value: Function | string) {
        this._setOption('valueExpr', value);
    }
}

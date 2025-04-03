/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoRemoteOperations extends NestedOption {
    get filtering(): boolean {
        return this._getOption('filtering');
    }
    set filtering(value: boolean) {
        this._setOption('filtering', value);
    }

    get paging(): boolean {
        return this._getOption('paging');
    }
    set paging(value: boolean) {
        this._setOption('paging', value);
    }

    get sorting(): boolean {
        return this._getOption('sorting');
    }
    set sorting(value: boolean) {
        this._setOption('sorting', value);
    }

    get summary(): boolean {
        return this._getOption('summary');
    }
    set summary(value: boolean) {
        this._setOption('summary', value);
    }

    get grouping(): boolean {
        return this._getOption('grouping');
    }
    set grouping(value: boolean) {
        this._setOption('grouping', value);
    }

    get groupPaging(): boolean {
        return this._getOption('groupPaging');
    }
    set groupPaging(value: boolean) {
        this._setOption('groupPaging', value);
    }
}

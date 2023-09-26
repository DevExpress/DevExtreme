/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Format } from 'devextreme/common';

@Component({
    template: ''
})
export abstract class DxoFormat extends NestedOption {
    get currency(): string {
        return this._getOption('currency');
    }
    set currency(value: string) {
        this._setOption('currency', value);
    }

    get formatter(): Function {
        return this._getOption('formatter');
    }
    set formatter(value: Function) {
        this._setOption('formatter', value);
    }

    get parser(): Function {
        return this._getOption('parser');
    }
    set parser(value: Function) {
        this._setOption('parser', value);
    }

    get precision(): number {
        return this._getOption('precision');
    }
    set precision(value: number) {
        this._setOption('precision', value);
    }

    get type(): Format | string {
        return this._getOption('type');
    }
    set type(value: Format | string) {
        this._setOption('type', value);
    }

    get useCurrencyAccountingStyle(): boolean {
        return this._getOption('useCurrencyAccountingStyle');
    }
    set useCurrencyAccountingStyle(value: boolean) {
        this._setOption('useCurrencyAccountingStyle', value);
    }
}

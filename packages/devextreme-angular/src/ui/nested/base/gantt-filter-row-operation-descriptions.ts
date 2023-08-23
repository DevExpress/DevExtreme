/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoGanttFilterRowOperationDescriptions extends NestedOption {
    get between(): string {
        return this._getOption('between');
    }
    set between(value: string) {
        this._setOption('between', value);
    }

    get contains(): string {
        return this._getOption('contains');
    }
    set contains(value: string) {
        this._setOption('contains', value);
    }

    get endsWith(): string {
        return this._getOption('endsWith');
    }
    set endsWith(value: string) {
        this._setOption('endsWith', value);
    }

    get equal(): string {
        return this._getOption('equal');
    }
    set equal(value: string) {
        this._setOption('equal', value);
    }

    get greaterThan(): string {
        return this._getOption('greaterThan');
    }
    set greaterThan(value: string) {
        this._setOption('greaterThan', value);
    }

    get greaterThanOrEqual(): string {
        return this._getOption('greaterThanOrEqual');
    }
    set greaterThanOrEqual(value: string) {
        this._setOption('greaterThanOrEqual', value);
    }

    get lessThan(): string {
        return this._getOption('lessThan');
    }
    set lessThan(value: string) {
        this._setOption('lessThan', value);
    }

    get lessThanOrEqual(): string {
        return this._getOption('lessThanOrEqual');
    }
    set lessThanOrEqual(value: string) {
        this._setOption('lessThanOrEqual', value);
    }

    get notContains(): string {
        return this._getOption('notContains');
    }
    set notContains(value: string) {
        this._setOption('notContains', value);
    }

    get notEqual(): string {
        return this._getOption('notEqual');
    }
    set notEqual(value: string) {
        this._setOption('notEqual', value);
    }

    get startsWith(): string {
        return this._getOption('startsWith');
    }
    set startsWith(value: string) {
        this._setOption('startsWith', value);
    }
}

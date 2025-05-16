/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoSearchPanel extends NestedOption {
    get highlightCaseSensitive(): boolean {
        return this._getOption('highlightCaseSensitive');
    }
    set highlightCaseSensitive(value: boolean) {
        this._setOption('highlightCaseSensitive', value);
    }

    get highlightSearchText(): boolean {
        return this._getOption('highlightSearchText');
    }
    set highlightSearchText(value: boolean) {
        this._setOption('highlightSearchText', value);
    }

    get placeholder(): string {
        return this._getOption('placeholder');
    }
    set placeholder(value: string) {
        this._setOption('placeholder', value);
    }

    get searchVisibleColumnsOnly(): boolean {
        return this._getOption('searchVisibleColumnsOnly');
    }
    set searchVisibleColumnsOnly(value: boolean) {
        this._setOption('searchVisibleColumnsOnly', value);
    }

    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get width(): number | string {
        return this._getOption('width');
    }
    set width(value: number | string) {
        this._setOption('width', value);
    }
}

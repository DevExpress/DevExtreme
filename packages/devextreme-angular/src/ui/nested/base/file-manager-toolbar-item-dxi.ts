/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxiFileManagerToolbarItem extends CollectionNestedOption {
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    get locateInMenu(): string {
        return this._getOption('locateInMenu');
    }
    set locateInMenu(value: string) {
        this._setOption('locateInMenu', value);
    }

    get location(): string {
        return this._getOption('location');
    }
    set location(value: string) {
        this._setOption('location', value);
    }

    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    get options(): any {
        return this._getOption('options');
    }
    set options(value: any) {
        this._setOption('options', value);
    }

    get showText(): string {
        return this._getOption('showText');
    }
    set showText(value: string) {
        this._setOption('showText', value);
    }

    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    get visible(): boolean | undefined {
        return this._getOption('visible');
    }
    set visible(value: boolean | undefined) {
        this._setOption('visible', value);
    }

    get widget(): string {
        return this._getOption('widget');
    }
    set widget(value: string) {
        this._setOption('widget', value);
    }
}

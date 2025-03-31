/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoHeaderPanel extends NestedOption {
    get dragging(): any {
        return this._getOption('dragging');
    }
    set dragging(value: any) {
        this._setOption('dragging', value);
    }

    get itemCssClass(): string {
        return this._getOption('itemCssClass');
    }
    set itemCssClass(value: string) {
        this._setOption('itemCssClass', value);
    }

    get itemTemplate(): any {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: any) {
        this._setOption('itemTemplate', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }
}

/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoHtmlEditorTableResizing extends NestedOption {
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    get minColumnWidth(): number {
        return this._getOption('minColumnWidth');
    }
    set minColumnWidth(value: number) {
        this._setOption('minColumnWidth', value);
    }

    get minRowHeight(): number {
        return this._getOption('minRowHeight');
    }
    set minRowHeight(value: number) {
        this._setOption('minRowHeight', value);
    }
}

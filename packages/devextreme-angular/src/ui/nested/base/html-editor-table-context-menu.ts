/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoHtmlEditorTableContextMenu extends NestedOption {
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    get items(): Array<any | string | { beginGroup?: boolean, closeMenuOnClick?: boolean, disabled?: boolean, icon?: string, items?: Array<any | string>, name?: string | undefined, selectable?: boolean, selected?: boolean, template?: any, text?: string, visible?: boolean }> {
        return this._getOption('items');
    }
    set items(value: Array<any | string | { beginGroup?: boolean, closeMenuOnClick?: boolean, disabled?: boolean, icon?: string, items?: Array<any | string>, name?: string | undefined, selectable?: boolean, selected?: boolean, template?: any, text?: string, visible?: boolean }>) {
        this._setOption('items', value);
    }
}

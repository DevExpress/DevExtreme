/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';

@Component({
    template: ''
})
export abstract class DxoFileManagerContextMenu extends NestedOption {
    get commands(): Array<DevExpress.ui.dxDiagramCustomCommand | string> {
        return this._getOption('commands');
    }
    set commands(value: Array<DevExpress.ui.dxDiagramCustomCommand | string>) {
        this._setOption('commands', value);
    }

    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    get items(): Array<DevExpress.ui.dxFileManagerContextMenuItem | string | any | { beginGroup?: boolean, closeMenuOnClick?: boolean, disabled?: boolean, icon?: string, items?: Array<DevExpress.ui.dxContextMenuItem>, name?: string, selectable?: boolean, selected?: boolean, template?: any, text?: string, visible?: boolean }> {
        return this._getOption('items');
    }
    set items(value: Array<DevExpress.ui.dxFileManagerContextMenuItem | string | any | { beginGroup?: boolean, closeMenuOnClick?: boolean, disabled?: boolean, icon?: string, items?: Array<DevExpress.ui.dxContextMenuItem>, name?: string, selectable?: boolean, selected?: boolean, template?: any, text?: string, visible?: boolean }>) {
        this._setOption('items', value);
    }
}

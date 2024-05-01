/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { DiagramCommand } from 'devextreme/ui/diagram';
import { FileManagerPredefinedContextMenuItem } from 'devextreme/ui/file_manager';
import { GanttPredefinedContextMenuItem } from 'devextreme/ui/gantt';

@Component({
    template: ''
})
export abstract class DxoFileManagerContextMenu extends NestedOption {
    get commands(): Array<DiagramCommand | DevExpress.ui.dxDiagramCustomCommand> {
        return this._getOption('commands');
    }
    set commands(value: Array<DiagramCommand | DevExpress.ui.dxDiagramCustomCommand>) {
        this._setOption('commands', value);
    }

    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    get items(): Array<FileManagerPredefinedContextMenuItem | DevExpress.ui.dxFileManagerContextMenuItem | GanttPredefinedContextMenuItem | any | { beginGroup?: boolean, closeMenuOnClick?: boolean, disabled?: boolean, icon?: string, items?: Array<DevExpress.ui.dxContextMenuItem>, name?: GanttPredefinedContextMenuItem | string, selectable?: boolean, selected?: boolean, template?: any, text?: string, visible?: boolean }> {
        return this._getOption('items');
    }
    set items(value: Array<FileManagerPredefinedContextMenuItem | DevExpress.ui.dxFileManagerContextMenuItem | GanttPredefinedContextMenuItem | any | { beginGroup?: boolean, closeMenuOnClick?: boolean, disabled?: boolean, icon?: string, items?: Array<DevExpress.ui.dxContextMenuItem>, name?: GanttPredefinedContextMenuItem | string, selectable?: boolean, selected?: boolean, template?: any, text?: string, visible?: boolean }>) {
        this._setOption('items', value);
    }
}

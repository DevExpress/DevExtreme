/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { ToolbarItemComponent, ToolbarItemLocation } from 'devextreme/common';
import { UserDefinedElement } from 'devextreme/core/element';
import { PredefinedToolbarItem } from 'devextreme/ui/card_view';
import { DataGridPredefinedToolbarItem, dxDataGridToolbarItem } from 'devextreme/ui/data_grid';
import { dxFileManagerToolbarItem, FileManagerPredefinedToolbarItem } from 'devextreme/ui/file_manager';
import { dxGanttToolbarItem, GanttPredefinedToolbarItem } from 'devextreme/ui/gantt';
import { dxHtmlEditorToolbarItem, HtmlEditorPredefinedToolbarItem } from 'devextreme/ui/html_editor';
import { LocateInMenuMode, ShowTextMode } from 'devextreme/ui/toolbar';
import { dxTreeListToolbarItem, TreeListPredefinedToolbarItem } from 'devextreme/ui/tree_list';

@Component({
    template: ''
})
export abstract class DxoDataGridToolbar extends NestedOption {
    get items(): Array<PredefinedToolbarItem | any | { cssClass?: string | undefined, disabled?: boolean, html?: string, locateInMenu?: LocateInMenuMode, location?: ToolbarItemLocation, menuItemTemplate?: any, name?: PredefinedToolbarItem | string, options?: any, showText?: ShowTextMode, template?: any, text?: string, visible?: boolean, widget?: ToolbarItemComponent } | dxDataGridToolbarItem | DataGridPredefinedToolbarItem | dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem | dxGanttToolbarItem | GanttPredefinedToolbarItem | dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem | dxTreeListToolbarItem | TreeListPredefinedToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<PredefinedToolbarItem | any | { cssClass?: string | undefined, disabled?: boolean, html?: string, locateInMenu?: LocateInMenuMode, location?: ToolbarItemLocation, menuItemTemplate?: any, name?: PredefinedToolbarItem | string, options?: any, showText?: ShowTextMode, template?: any, text?: string, visible?: boolean, widget?: ToolbarItemComponent } | dxDataGridToolbarItem | DataGridPredefinedToolbarItem | dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem | dxGanttToolbarItem | GanttPredefinedToolbarItem | dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem | dxTreeListToolbarItem | TreeListPredefinedToolbarItem>) {
        this._setOption('items', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get visible(): boolean | undefined {
        return this._getOption('visible');
    }
    set visible(value: boolean | undefined) {
        this._setOption('visible', value);
    }

    get fileSelectionItems(): Array<dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem> {
        return this._getOption('fileSelectionItems');
    }
    set fileSelectionItems(value: Array<dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem>) {
        this._setOption('fileSelectionItems', value);
    }

    get container(): UserDefinedElement | string {
        return this._getOption('container');
    }
    set container(value: UserDefinedElement | string) {
        this._setOption('container', value);
    }

    get multiline(): boolean {
        return this._getOption('multiline');
    }
    set multiline(value: boolean) {
        this._setOption('multiline', value);
    }
}

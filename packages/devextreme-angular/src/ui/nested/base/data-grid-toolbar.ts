/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { UserDefinedElement } from 'devextreme/core/element';
import { DataGridPredefinedToolbarItem, dxDataGridToolbarItem } from 'devextreme/ui/data_grid';
import { dxFileManagerToolbarItem, FileManagerPredefinedToolbarItem } from 'devextreme/ui/file_manager';
import { dxGanttToolbarItem, GanttPredefinedToolbarItem } from 'devextreme/ui/gantt';
import { dxHtmlEditorToolbarItem, HtmlEditorPredefinedToolbarItem } from 'devextreme/ui/html_editor';
import { dxTreeListToolbarItem, TreeListPredefinedToolbarItem } from 'devextreme/ui/tree_list';

@Component({
    template: ''
})
export abstract class DxoDataGridToolbar extends NestedOption {
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get items(): Array<dxDataGridToolbarItem | DataGridPredefinedToolbarItem | dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem | dxGanttToolbarItem | GanttPredefinedToolbarItem | dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem | dxTreeListToolbarItem | TreeListPredefinedToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxDataGridToolbarItem | DataGridPredefinedToolbarItem | dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem | dxGanttToolbarItem | GanttPredefinedToolbarItem | dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem | dxTreeListToolbarItem | TreeListPredefinedToolbarItem>) {
        this._setOption('items', value);
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

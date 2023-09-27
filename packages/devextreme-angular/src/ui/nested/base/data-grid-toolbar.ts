/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { UserDefinedElement } from 'devextreme/core/element';
import { DataGridPredefinedToolbarItem } from 'devextreme/ui/data_grid';
import { FileManagerPredefinedToolbarItem } from 'devextreme/ui/file_manager';
import { GanttPredefinedToolbarItem } from 'devextreme/ui/gantt';
import { HtmlEditorPredefinedToolbarItem } from 'devextreme/ui/html_editor';
import { TreeListPredefinedToolbarItem } from 'devextreme/ui/tree_list';

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

    get items(): Array<DataGridPredefinedToolbarItem | DevExpress.ui.dxDataGrid.dxDataGridToolbarItem | FileManagerPredefinedToolbarItem | DevExpress.ui.dxFileManagerToolbarItem | GanttPredefinedToolbarItem | DevExpress.ui.dxGanttToolbarItem | HtmlEditorPredefinedToolbarItem | DevExpress.ui.dxHtmlEditorToolbarItem | TreeListPredefinedToolbarItem | DevExpress.ui.dxTreeList.dxTreeListToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<DataGridPredefinedToolbarItem | DevExpress.ui.dxDataGrid.dxDataGridToolbarItem | FileManagerPredefinedToolbarItem | DevExpress.ui.dxFileManagerToolbarItem | GanttPredefinedToolbarItem | DevExpress.ui.dxGanttToolbarItem | HtmlEditorPredefinedToolbarItem | DevExpress.ui.dxHtmlEditorToolbarItem | TreeListPredefinedToolbarItem | DevExpress.ui.dxTreeList.dxTreeListToolbarItem>) {
        this._setOption('items', value);
    }

    get visible(): boolean | undefined {
        return this._getOption('visible');
    }
    set visible(value: boolean | undefined) {
        this._setOption('visible', value);
    }

    get fileSelectionItems(): Array<FileManagerPredefinedToolbarItem | DevExpress.ui.dxFileManagerToolbarItem> {
        return this._getOption('fileSelectionItems');
    }
    set fileSelectionItems(value: Array<FileManagerPredefinedToolbarItem | DevExpress.ui.dxFileManagerToolbarItem>) {
        this._setOption('fileSelectionItems', value);
    }

    get container(): string | UserDefinedElement {
        return this._getOption('container');
    }
    set container(value: string | UserDefinedElement) {
        this._setOption('container', value);
    }

    get multiline(): boolean {
        return this._getOption('multiline');
    }
    set multiline(value: boolean) {
        this._setOption('multiline', value);
    }
}

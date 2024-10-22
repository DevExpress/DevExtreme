/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import dxTreeList from 'devextreme/ui/tree_list';
import { dxTreeListRowObject } from 'devextreme/ui/tree_list';
import { DataChange } from 'devextreme/common/grids';
import { dxFormOptions } from 'devextreme/ui/form';
import { dxPopupOptions } from 'devextreme/ui/popup';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tree-list-editing',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListEditingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowAdding(): boolean | ((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean) {
        return this._getOption('allowAdding');
    }
    set allowAdding(value: boolean | ((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean)) {
        this._setOption('allowAdding', value);
    }

    @Input()
    get allowDeleting(): boolean | ((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean) {
        return this._getOption('allowDeleting');
    }
    set allowDeleting(value: boolean | ((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean)) {
        this._setOption('allowDeleting', value);
    }

    @Input()
    get allowUpdating(): boolean | ((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean) {
        return this._getOption('allowUpdating');
    }
    set allowUpdating(value: boolean | ((options: { component: dxTreeList, row: dxTreeListRowObject }) => boolean)) {
        this._setOption('allowUpdating', value);
    }

    @Input()
    get changes(): Array<DataChange> {
        return this._getOption('changes');
    }
    set changes(value: Array<DataChange>) {
        this._setOption('changes', value);
    }

    @Input()
    get confirmDelete(): boolean {
        return this._getOption('confirmDelete');
    }
    set confirmDelete(value: boolean) {
        this._setOption('confirmDelete', value);
    }

    @Input()
    get editColumnName(): string {
        return this._getOption('editColumnName');
    }
    set editColumnName(value: string) {
        this._setOption('editColumnName', value);
    }

    @Input()
    get editRowKey(): any {
        return this._getOption('editRowKey');
    }
    set editRowKey(value: any) {
        this._setOption('editRowKey', value);
    }

    @Input()
    get form(): dxFormOptions {
        return this._getOption('form');
    }
    set form(value: dxFormOptions) {
        this._setOption('form', value);
    }

    @Input()
    get mode(): "batch" | "cell" | "row" | "form" | "popup" {
        return this._getOption('mode');
    }
    set mode(value: "batch" | "cell" | "row" | "form" | "popup") {
        this._setOption('mode', value);
    }

    @Input()
    get popup(): dxPopupOptions<any> {
        return this._getOption('popup');
    }
    set popup(value: dxPopupOptions<any>) {
        this._setOption('popup', value);
    }

    @Input()
    get refreshMode(): "full" | "reshape" | "repaint" {
        return this._getOption('refreshMode');
    }
    set refreshMode(value: "full" | "reshape" | "repaint") {
        this._setOption('refreshMode', value);
    }

    @Input()
    get selectTextOnEditStart(): boolean {
        return this._getOption('selectTextOnEditStart');
    }
    set selectTextOnEditStart(value: boolean) {
        this._setOption('selectTextOnEditStart', value);
    }

    @Input()
    get startEditAction(): "click" | "dblClick" {
        return this._getOption('startEditAction');
    }
    set startEditAction(value: "click" | "dblClick") {
        this._setOption('startEditAction', value);
    }

    @Input()
    get texts(): Record<string, any> | { addRow: string, addRowToNode: string, cancelAllChanges: string, cancelRowChanges: string, confirmDeleteMessage: string, confirmDeleteTitle: string, deleteRow: string, editRow: string, saveAllChanges: string, saveRowChanges: string, undeleteRow: string, validationCancelChanges: string } {
        return this._getOption('texts');
    }
    set texts(value: Record<string, any> | { addRow: string, addRowToNode: string, cancelAllChanges: string, cancelRowChanges: string, confirmDeleteMessage: string, confirmDeleteTitle: string, deleteRow: string, editRow: string, saveAllChanges: string, saveRowChanges: string, undeleteRow: string, validationCancelChanges: string }) {
        this._setOption('texts', value);
    }

    @Input()
    get useIcons(): boolean {
        return this._getOption('useIcons');
    }
    set useIcons(value: boolean) {
        this._setOption('useIcons', value);
    }


    protected get _optionPath() {
        return 'editing';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoTreeListEditingComponent
  ],
  exports: [
    DxoTreeListEditingComponent
  ],
})
export class DxoTreeListEditingModule { }

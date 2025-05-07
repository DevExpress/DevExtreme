/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    Output,
    EventEmitter,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import dxTreeList from 'devextreme/ui/tree_list';
import { dxTreeListRowObject } from 'devextreme/ui/tree_list';
import { DataChange, GridsEditMode, GridsEditRefreshMode, StartEditAction } from 'devextreme/common/grids';
import { dxFormOptions } from 'devextreme/ui/form';
import { dxPopupOptions } from 'devextreme/ui/popup';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiTreeListChangeComponent } from './change-dxi';


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
    get mode(): GridsEditMode {
        return this._getOption('mode');
    }
    set mode(value: GridsEditMode) {
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
    get refreshMode(): GridsEditRefreshMode {
        return this._getOption('refreshMode');
    }
    set refreshMode(value: GridsEditRefreshMode) {
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
    get startEditAction(): StartEditAction {
        return this._getOption('startEditAction');
    }
    set startEditAction(value: StartEditAction) {
        this._setOption('startEditAction', value);
    }

    @Input()
    get texts(): { addRow?: string, addRowToNode?: string, cancelAllChanges?: string, cancelRowChanges?: string, confirmDeleteMessage?: string, confirmDeleteTitle?: string, deleteRow?: string, editRow?: string, saveAllChanges?: string, saveRowChanges?: string, undeleteRow?: string, validationCancelChanges?: string } {
        return this._getOption('texts');
    }
    set texts(value: { addRow?: string, addRowToNode?: string, cancelAllChanges?: string, cancelRowChanges?: string, confirmDeleteMessage?: string, confirmDeleteTitle?: string, deleteRow?: string, editRow?: string, saveAllChanges?: string, saveRowChanges?: string, undeleteRow?: string, validationCancelChanges?: string }) {
        this._setOption('texts', value);
    }

    @Input()
    get useIcons(): boolean {
        return this._getOption('useIcons');
    }
    set useIcons(value: boolean) {
        this._setOption('useIcons', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() changesChange: EventEmitter<Array<DataChange>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() editColumnNameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() editRowKeyChange: EventEmitter<any>;
    protected get _optionPath() {
        return 'editing';
    }


    @ContentChildren(forwardRef(() => DxiTreeListChangeComponent))
    get changesChildren(): QueryList<DxiTreeListChangeComponent> {
        return this._getOption('changes');
    }
    set changesChildren(value) {
        this.setChildren('changes', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'changesChange' },
            { emit: 'editColumnNameChange' },
            { emit: 'editRowKeyChange' }
        ]);

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

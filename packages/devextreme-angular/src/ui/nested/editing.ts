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




import DevExpress from 'devextreme/bundles/dx.all';
import { GridsEditMode, GridsEditRefreshMode, NewRowPosition, StartEditAction } from 'devextreme/common/grids';
import { dxFormOptions } from 'devextreme/ui/form';
import { Properties as dxPopupOptions } from 'devextreme/ui/popup';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiChangeComponent } from './change-dxi';


@Component({
    selector: 'dxo-editing',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoEditingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowAdding(): boolean | Function {
        return this._getOption('allowAdding');
    }
    set allowAdding(value: boolean | Function) {
        this._setOption('allowAdding', value);
    }

    @Input()
    get allowDeleting(): boolean | Function {
        return this._getOption('allowDeleting');
    }
    set allowDeleting(value: boolean | Function) {
        this._setOption('allowDeleting', value);
    }

    @Input()
    get allowUpdating(): boolean | Function {
        return this._getOption('allowUpdating');
    }
    set allowUpdating(value: boolean | Function) {
        this._setOption('allowUpdating', value);
    }

    @Input()
    get changes(): Array<DevExpress.common.grids.DataChange> {
        return this._getOption('changes');
    }
    set changes(value: Array<DevExpress.common.grids.DataChange>) {
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
    get newRowPosition(): NewRowPosition {
        return this._getOption('newRowPosition');
    }
    set newRowPosition(value: NewRowPosition) {
        this._setOption('newRowPosition', value);
    }

    @Input()
    get popup(): dxPopupOptions {
        return this._getOption('popup');
    }
    set popup(value: dxPopupOptions) {
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
    get texts(): { addRow?: string, cancelAllChanges?: string, cancelRowChanges?: string, confirmDeleteMessage?: string, confirmDeleteTitle?: string, deleteRow?: string, editRow?: string, saveAllChanges?: string, saveRowChanges?: string, undeleteRow?: string, validationCancelChanges?: string } | { addRow?: string, addRowToNode?: string, cancelAllChanges?: string, cancelRowChanges?: string, confirmDeleteMessage?: string, confirmDeleteTitle?: string, deleteRow?: string, editRow?: string, saveAllChanges?: string, saveRowChanges?: string, undeleteRow?: string, validationCancelChanges?: string } {
        return this._getOption('texts');
    }
    set texts(value: { addRow?: string, cancelAllChanges?: string, cancelRowChanges?: string, confirmDeleteMessage?: string, confirmDeleteTitle?: string, deleteRow?: string, editRow?: string, saveAllChanges?: string, saveRowChanges?: string, undeleteRow?: string, validationCancelChanges?: string } | { addRow?: string, addRowToNode?: string, cancelAllChanges?: string, cancelRowChanges?: string, confirmDeleteMessage?: string, confirmDeleteTitle?: string, deleteRow?: string, editRow?: string, saveAllChanges?: string, saveRowChanges?: string, undeleteRow?: string, validationCancelChanges?: string }) {
        this._setOption('texts', value);
    }

    @Input()
    get useIcons(): boolean {
        return this._getOption('useIcons');
    }
    set useIcons(value: boolean) {
        this._setOption('useIcons', value);
    }

    @Input()
    get allowAddShape(): boolean {
        return this._getOption('allowAddShape');
    }
    set allowAddShape(value: boolean) {
        this._setOption('allowAddShape', value);
    }

    @Input()
    get allowChangeConnection(): boolean {
        return this._getOption('allowChangeConnection');
    }
    set allowChangeConnection(value: boolean) {
        this._setOption('allowChangeConnection', value);
    }

    @Input()
    get allowChangeConnectorPoints(): boolean {
        return this._getOption('allowChangeConnectorPoints');
    }
    set allowChangeConnectorPoints(value: boolean) {
        this._setOption('allowChangeConnectorPoints', value);
    }

    @Input()
    get allowChangeConnectorText(): boolean {
        return this._getOption('allowChangeConnectorText');
    }
    set allowChangeConnectorText(value: boolean) {
        this._setOption('allowChangeConnectorText', value);
    }

    @Input()
    get allowChangeShapeText(): boolean {
        return this._getOption('allowChangeShapeText');
    }
    set allowChangeShapeText(value: boolean) {
        this._setOption('allowChangeShapeText', value);
    }

    @Input()
    get allowDeleteConnector(): boolean {
        return this._getOption('allowDeleteConnector');
    }
    set allowDeleteConnector(value: boolean) {
        this._setOption('allowDeleteConnector', value);
    }

    @Input()
    get allowDeleteShape(): boolean {
        return this._getOption('allowDeleteShape');
    }
    set allowDeleteShape(value: boolean) {
        this._setOption('allowDeleteShape', value);
    }

    @Input()
    get allowMoveShape(): boolean {
        return this._getOption('allowMoveShape');
    }
    set allowMoveShape(value: boolean) {
        this._setOption('allowMoveShape', value);
    }

    @Input()
    get allowResizeShape(): boolean {
        return this._getOption('allowResizeShape');
    }
    set allowResizeShape(value: boolean) {
        this._setOption('allowResizeShape', value);
    }

    @Input()
    get allowDependencyAdding(): boolean {
        return this._getOption('allowDependencyAdding');
    }
    set allowDependencyAdding(value: boolean) {
        this._setOption('allowDependencyAdding', value);
    }

    @Input()
    get allowDependencyDeleting(): boolean {
        return this._getOption('allowDependencyDeleting');
    }
    set allowDependencyDeleting(value: boolean) {
        this._setOption('allowDependencyDeleting', value);
    }

    @Input()
    get allowResourceAdding(): boolean {
        return this._getOption('allowResourceAdding');
    }
    set allowResourceAdding(value: boolean) {
        this._setOption('allowResourceAdding', value);
    }

    @Input()
    get allowResourceDeleting(): boolean {
        return this._getOption('allowResourceDeleting');
    }
    set allowResourceDeleting(value: boolean) {
        this._setOption('allowResourceDeleting', value);
    }

    @Input()
    get allowResourceUpdating(): boolean {
        return this._getOption('allowResourceUpdating');
    }
    set allowResourceUpdating(value: boolean) {
        this._setOption('allowResourceUpdating', value);
    }

    @Input()
    get allowTaskAdding(): boolean {
        return this._getOption('allowTaskAdding');
    }
    set allowTaskAdding(value: boolean) {
        this._setOption('allowTaskAdding', value);
    }

    @Input()
    get allowTaskDeleting(): boolean {
        return this._getOption('allowTaskDeleting');
    }
    set allowTaskDeleting(value: boolean) {
        this._setOption('allowTaskDeleting', value);
    }

    @Input()
    get allowTaskResourceUpdating(): boolean {
        return this._getOption('allowTaskResourceUpdating');
    }
    set allowTaskResourceUpdating(value: boolean) {
        this._setOption('allowTaskResourceUpdating', value);
    }

    @Input()
    get allowTaskUpdating(): boolean {
        return this._getOption('allowTaskUpdating');
    }
    set allowTaskUpdating(value: boolean) {
        this._setOption('allowTaskUpdating', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get allowDragging(): boolean {
        return this._getOption('allowDragging');
    }
    set allowDragging(value: boolean) {
        this._setOption('allowDragging', value);
    }

    @Input()
    get allowResizing(): boolean {
        return this._getOption('allowResizing');
    }
    set allowResizing(value: boolean) {
        this._setOption('allowResizing', value);
    }

    @Input()
    get allowTimeZoneEditing(): boolean {
        return this._getOption('allowTimeZoneEditing');
    }
    set allowTimeZoneEditing(value: boolean) {
        this._setOption('allowTimeZoneEditing', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() changesChange: EventEmitter<Array<DevExpress.common.grids.DataChange>>;

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


    @ContentChildren(forwardRef(() => DxiChangeComponent))
    get changesChildren(): QueryList<DxiChangeComponent> {
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
    DxoEditingComponent
  ],
  exports: [
    DxoEditingComponent
  ],
})
export class DxoEditingModule { }

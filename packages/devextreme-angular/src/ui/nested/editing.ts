/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Output,
    EventEmitter,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { DataChange } from 'devextreme/common/grids';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoEditing } from './base/editing';
import { DxiChangeComponent } from './change-dxi';


@Component({
    selector: 'dxo-editing',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'allowDeleting',
        'allowUpdating',
        'allowAdding',
        'changes',
        'confirmDelete',
        'editColumnName',
        'editRowKey',
        'form',
        'mode',
        'newRowPosition',
        'popup',
        'refreshMode',
        'selectTextOnEditStart',
        'startEditAction',
        'texts',
        'useIcons',
        'allowAddShape',
        'allowChangeConnection',
        'allowChangeConnectorPoints',
        'allowChangeConnectorText',
        'allowChangeShapeText',
        'allowDeleteConnector',
        'allowDeleteShape',
        'allowMoveShape',
        'allowResizeShape',
        'allowDependencyAdding',
        'allowDependencyDeleting',
        'allowResourceAdding',
        'allowResourceDeleting',
        'allowResourceUpdating',
        'allowTaskAdding',
        'allowTaskDeleting',
        'allowTaskResourceUpdating',
        'allowTaskUpdating',
        'enabled',
        'allowDragging',
        'allowResizing',
        'allowTimeZoneEditing'
    ]
})
export class DxoEditingComponent extends DxoEditing implements OnDestroy, OnInit  {

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
  imports: [
    DxoEditingComponent
  ],
  exports: [
    DxoEditingComponent
  ],
})
export class DxoEditingModule { }

/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList,
    AfterContentInit
} from '@angular/core';




import { dxFileManagerContextMenuItem, FileManagerPredefinedContextMenuItem } from 'devextreme/ui/file_manager';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiFileManagerContextMenuItemComponent } from './context-menu-item-dxi';
import { DxiFileManagerItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-file-manager-context-menu',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoFileManagerContextMenuComponent extends NestedOption implements OnDestroy, OnInit, AfterContentInit   {
    @Input()
    get items(): Array<dxFileManagerContextMenuItem | FileManagerPredefinedContextMenuItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxFileManagerContextMenuItem | FileManagerPredefinedContextMenuItem>) {
        this._setOption('items', value);
    }


    protected get _optionPath() {
        return 'contextMenu';
    }


    @ContentChildren(forwardRef(() => DxiFileManagerContextMenuItemComponent)) contextMenuItemsChildren!: QueryList<DxiFileManagerContextMenuItemComponent>
    
    @ContentChildren(forwardRef(() => DxiFileManagerItemComponent)) itemsChildren!: QueryList<DxiFileManagerItemComponent>
    
    setItems() {
        const q: QueryList<any> = new QueryList();
        q.reset([...this.contextMenuItemsChildren.toArray(),...this.itemsChildren.toArray(),]);
        this.setChildren('items', q);
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


    ngAfterContentInit() {
        this.setItems();
        
        this.contextMenuItemsChildren.changes.subscribe(() => { this.setItems() });
        this.itemsChildren.changes.subscribe(() => { this.setItems() });
    }
}

@NgModule({
  imports: [
    DxoFileManagerContextMenuComponent
  ],
  exports: [
    DxoFileManagerContextMenuComponent
  ],
})
export class DxoFileManagerContextMenuModule { }

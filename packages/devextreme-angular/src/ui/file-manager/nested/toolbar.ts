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




import { dxFileManagerToolbarItem, FileManagerPredefinedToolbarItem } from 'devextreme/ui/file_manager';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiFileManagerFileSelectionItemComponent } from './file-selection-item-dxi';
import { DxiFileManagerItemComponent } from './item-dxi';
import { DxiFileManagerToolbarItemComponent } from './toolbar-item-dxi';


@Component({
    selector: 'dxo-file-manager-toolbar',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoFileManagerToolbarComponent extends NestedOption implements OnDestroy, OnInit, AfterContentInit  {
    @Input()
    get fileSelectionItems(): Array<dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem> {
        return this._getOption('fileSelectionItems');
    }
    set fileSelectionItems(value: Array<dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem>) {
        this._setOption('fileSelectionItems', value);
    }

    @Input()
    get items(): Array<dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem>) {
        this._setOption('items', value);
    }


    protected get _optionPath() {
        return 'toolbar';
    }


    @ContentChildren(forwardRef(() => DxiFileManagerItemComponent)) itemsChildren!: QueryList<DxiFileManagerItemComponent>
    
    @ContentChildren(forwardRef(() => DxiFileManagerToolbarItemComponent)) toolbarItemsChildren!: QueryList<DxiFileManagerToolbarItemComponent>
    
    setItems() {
        const q: QueryList<any> = new QueryList();
        q.reset([
            ...this.itemsChildren.toArray(),
            ...this.toolbarItemsChildren.toArray(),
        ]);
        this.setChildren('items', q);
    }


    @ContentChildren(forwardRef(() => DxiFileManagerFileSelectionItemComponent))
    get fileSelectionItemsChildren(): QueryList<DxiFileManagerFileSelectionItemComponent> {
        return this._getOption('fileSelectionItems');
    }
    set fileSelectionItemsChildren(value) {
        this.setChildren('fileSelectionItems', value);
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
        
        this.itemsChildren.changes.subscribe(() => { this.setItems() });
        this.toolbarItemsChildren.changes.subscribe(() => { this.setItems() });
    }
}

@NgModule({
  imports: [
    DxoFileManagerToolbarComponent
  ],
  exports: [
    DxoFileManagerToolbarComponent
  ],
})
export class DxoFileManagerToolbarModule { }

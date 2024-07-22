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
    QueryList
} from '@angular/core';




import { dxFileManagerToolbarItem, FileManagerPredefinedToolbarItem } from 'devextreme/ui/file_manager';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiFileSelectionItemFileManagerComponent } from './file-selection-item-dxi';
import { DxiItemFileManagerComponent } from './item-dxi';


@Component({
    selector: 'dxo-toolbar-file-manager',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoToolbarFileManagerComponent extends NestedOption implements OnDestroy, OnInit  {
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


    @ContentChildren(forwardRef(() => DxiFileSelectionItemFileManagerComponent))
    get fileSelectionItemsChildren(): QueryList<DxiFileSelectionItemFileManagerComponent> {
        return this._getOption('fileSelectionItems');
    }
    set fileSelectionItemsChildren(value) {
        this.setChildren('fileSelectionItems', value);
    }

    @ContentChildren(forwardRef(() => DxiItemFileManagerComponent))
    get itemsChildren(): QueryList<DxiItemFileManagerComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
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
    DxoToolbarFileManagerComponent
  ],
  exports: [
    DxoToolbarFileManagerComponent
  ],
})
export class DxoToolbarFileManagerModule { }

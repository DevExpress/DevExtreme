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
    QueryList,
} from '@angular/core';




import { dxFileManagerToolbarItem, FileManagerPredefinedToolbarItem } from 'devextreme/ui/file_manager';

import {
    DxIntegrationModule,
    NestedOptionHost,
    ICollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


import {
    PROPERTY_TOKEN_fileSelectionItems,
    PROPERTY_TOKEN_items,
} from 'devextreme-angular/ui/nested/tokens';

@Component({
    selector: 'dxo-file-manager-toolbar',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
})
export class DxoFileManagerToolbarComponent extends NestedOption implements OnDestroy, OnInit { 
    protected _dxClassName = 'DxoFileManagerToolbarComponent';

    @ContentChildren(PROPERTY_TOKEN_fileSelectionItems)
    set _fileSelectionItemsNestedItems(value: QueryList<ICollectionNestedOption>) {
        this._setChildren('fileSelectionItems', value);
    }
    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsNestedItems(value: QueryList<ICollectionNestedOption>) {
        this._setChildren('items', value);
    }
    
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
  imports: [
    DxoFileManagerToolbarComponent
  ],
  exports: [
    DxoFileManagerToolbarComponent
  ],
})
export class DxoFileManagerToolbarModule { }
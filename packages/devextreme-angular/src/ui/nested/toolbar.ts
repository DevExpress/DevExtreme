/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    ContentChildren,
    QueryList,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
    ICollectionNestedOption,
} from 'devextreme-angular/core';
import { DxoDataGridToolbar } from './base/data-grid-toolbar';


import {
    PROPERTY_TOKEN_items,
    PROPERTY_TOKEN_fileSelectionItems,
} from 'devextreme-angular/tokens';

@Component({
    selector: 'dxo-toolbar',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
    inputs: [
        'disabled',
        'items',
        'visible',
        'fileSelectionItems',
        'container',
        'multiline'
    ]
})
export class DxoToolbarComponent extends DxoDataGridToolbar implements OnDestroy, OnInit { 
    protected _dxClassName = 'DxoToolbarComponent';

    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsNestedItems(value: QueryList<ICollectionNestedOption>) {
        this._setChildren('items', value);
    }
    @ContentChildren(PROPERTY_TOKEN_fileSelectionItems)
    set _fileSelectionItemsNestedItems(value: QueryList<ICollectionNestedOption>) {
        this._setChildren('fileSelectionItems', value);
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
    DxoToolbarComponent
  ],
  exports: [
    DxoToolbarComponent
  ],
})
export class DxoToolbarModule { }
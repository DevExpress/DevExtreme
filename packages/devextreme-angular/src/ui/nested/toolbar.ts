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
    forwardRef,
    QueryList
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoDataGridToolbar } from './base/data-grid-toolbar';
import { DxiItemComponent } from './item-dxi';
import { DxiFileSelectionItemComponent } from './file-selection-item-dxi';


@Component({
    selector: 'dxo-toolbar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'disabled',
        'items',
        'visible',
        'fileSelectionItems',
        'container',
        'multiline'
    ]
})
export class DxoToolbarComponent extends DxoDataGridToolbar implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'toolbar';
    }


    @ContentChildren(forwardRef(() => DxiItemComponent))
    get itemsChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    @ContentChildren(forwardRef(() => DxiFileSelectionItemComponent))
    get fileSelectionItemsChildren(): QueryList<DxiFileSelectionItemComponent> {
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


}

@NgModule({
  declarations: [
    DxoToolbarComponent
  ],
  exports: [
    DxoToolbarComponent
  ],
})
export class DxoToolbarModule { }

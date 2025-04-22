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




import { PredefinedToolbarItem, ToolbarItem } from 'devextreme/ui/card_view';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiCardViewItemComponent } from './item-dxi';
import { DxiCardViewToolbarItemComponent } from './toolbar-item-dxi';


@Component({
    selector: 'dxo-card-view-toolbar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCardViewToolbarComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get items(): Array<PredefinedToolbarItem | ToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<PredefinedToolbarItem | ToolbarItem>) {
        this._setOption('items', value);
    }


    protected get _optionPath() {
        return 'toolbar';
    }


    @ContentChildren(forwardRef(() => DxiCardViewItemComponent))
    get itemsChildren(): QueryList<DxiCardViewItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewToolbarItemComponent))
    get toolbarItemsChildren(): QueryList<DxiCardViewToolbarItemComponent> {
        return this._getOption('items');
    }
    set toolbarItemsChildren(value) {
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
    DxoCardViewToolbarComponent
  ],
  exports: [
    DxoCardViewToolbarComponent
  ],
})
export class DxoCardViewToolbarModule { }

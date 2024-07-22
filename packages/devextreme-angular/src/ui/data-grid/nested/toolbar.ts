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




import { DataGridPredefinedToolbarItem, dxDataGridToolbarItem } from 'devextreme/ui/data_grid';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiItemDataGridComponent } from './item-dxi';


@Component({
    selector: 'dxo-toolbar-data-grid',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoToolbarDataGridComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get items(): Array<dxDataGridToolbarItem | DataGridPredefinedToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxDataGridToolbarItem | DataGridPredefinedToolbarItem>) {
        this._setOption('items', value);
    }

    @Input()
    get visible(): boolean | undefined {
        return this._getOption('visible');
    }
    set visible(value: boolean | undefined) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'toolbar';
    }


    @ContentChildren(forwardRef(() => DxiItemDataGridComponent))
    get itemsChildren(): QueryList<DxiItemDataGridComponent> {
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
    DxoToolbarDataGridComponent
  ],
  exports: [
    DxoToolbarDataGridComponent
  ],
})
export class DxoToolbarDataGridModule { }

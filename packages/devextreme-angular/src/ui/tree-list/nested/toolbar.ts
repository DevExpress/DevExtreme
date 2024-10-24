/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { dxTreeListToolbarItem } from 'devextreme/ui/tree_list';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tree-list-toolbar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListToolbarComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get items(): Array<dxTreeListToolbarItem | "addRowButton" | "applyFilterButton" | "columnChooserButton" | "revertButton" | "saveButton" | "searchPanel"> {
        return this._getOption('items');
    }
    set items(value: Array<dxTreeListToolbarItem | "addRowButton" | "applyFilterButton" | "columnChooserButton" | "revertButton" | "saveButton" | "searchPanel">) {
        this._setOption('items', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
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
  declarations: [
    DxoTreeListToolbarComponent
  ],
  exports: [
    DxoTreeListToolbarComponent
  ],
})
export class DxoTreeListToolbarModule { }

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




import { dxDataGridToolbarItem } from 'devextreme/ui/data_grid';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-toolbar',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridToolbarComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get items(): Array<dxDataGridToolbarItem | "addRowButton" | "applyFilterButton" | "columnChooserButton" | "exportButton" | "groupPanel" | "revertButton" | "saveButton" | "searchPanel"> {
        return this._getOption('items');
    }
    set items(value: Array<dxDataGridToolbarItem | "addRowButton" | "applyFilterButton" | "columnChooserButton" | "exportButton" | "groupPanel" | "revertButton" | "saveButton" | "searchPanel">) {
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
    DxoDataGridToolbarComponent
  ],
  exports: [
    DxoDataGridToolbarComponent
  ],
})
export class DxoDataGridToolbarModule { }

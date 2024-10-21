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




import { dxFileManagerContextMenuItem } from 'devextreme/ui/file_manager';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-file-manager-context-menu',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFileManagerContextMenuComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get items(): Array<dxFileManagerContextMenuItem | "create" | "upload" | "refresh" | "download" | "move" | "copy" | "rename" | "delete"> {
        return this._getOption('items');
    }
    set items(value: Array<dxFileManagerContextMenuItem | "create" | "upload" | "refresh" | "download" | "move" | "copy" | "rename" | "delete">) {
        this._setOption('items', value);
    }


    protected get _optionPath() {
        return 'contextMenu';
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
    DxoFileManagerContextMenuComponent
  ],
  exports: [
    DxoFileManagerContextMenuComponent
  ],
})
export class DxoFileManagerContextMenuModule { }

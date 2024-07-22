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




import { dxFileManagerContextMenuItem, FileManagerPredefinedContextMenuItem } from 'devextreme/ui/file_manager';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiItemFileManagerComponent } from './item-dxi';


@Component({
    selector: 'dxo-context-menu-file-manager',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoContextMenuFileManagerComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get items(): Array<dxFileManagerContextMenuItem | FileManagerPredefinedContextMenuItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxFileManagerContextMenuItem | FileManagerPredefinedContextMenuItem>) {
        this._setOption('items', value);
    }


    protected get _optionPath() {
        return 'contextMenu';
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
    DxoContextMenuFileManagerComponent
  ],
  exports: [
    DxoContextMenuFileManagerComponent
  ],
})
export class DxoContextMenuFileManagerModule { }

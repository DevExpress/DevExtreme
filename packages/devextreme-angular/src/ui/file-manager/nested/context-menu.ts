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




import { dxFileManagerContextMenuItem, FileManagerPredefinedContextMenuItem } from 'devextreme/ui/file_manager';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-file-manager-context-menu',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
})
export class DxoFileManagerContextMenuComponent extends NestedOption implements OnDestroy, OnInit {

    @ContentChildren(СOLLECTION_NESTED_OPTION_TOKEN)
    set _CollectionOptionChildren(value: QueryList<{ propertyName: string, component: CollectionNestedOption }>) {
        this._setCollectionOptionChildren(value);
    }
    
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
    DxoFileManagerContextMenuComponent
  ],
  exports: [
    DxoFileManagerContextMenuComponent
  ],
})
export class DxoFileManagerContextMenuModule { }

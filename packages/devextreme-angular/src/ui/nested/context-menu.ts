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
import { DxoFileManagerContextMenu } from './base/file-manager-context-menu';


import {
    PROPERTY_TOKEN_commands,
    PROPERTY_TOKEN_items,
} from 'devextreme-angular/ui/nested/tokens';

@Component({
    selector: 'dxo-context-menu',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
    inputs: [
        'commands',
        'enabled',
        'items'
    ]
})
export class DxoContextMenuComponent extends DxoFileManagerContextMenu implements OnDestroy, OnInit { 
    protected _dxClassName = 'DxoContextMenuComponent';

    @ContentChildren(PROPERTY_TOKEN_commands)
    set _commandsNestedItems(value: QueryList<ICollectionNestedOption>) {
        this._setChildren('commands', value);
    }
    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsNestedItems(value: QueryList<ICollectionNestedOption>) {
        this._setChildren('items', value);
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
    DxoContextMenuComponent
  ],
  exports: [
    DxoContextMenuComponent
  ],
})
export class DxoContextMenuModule { }
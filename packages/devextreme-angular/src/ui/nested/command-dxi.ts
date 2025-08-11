/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
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
import { DxiDiagramCustomCommand } from './base/diagram-custom-command-dxi';

import { PROPERTY_TOKEN_commands } from 'devextreme-angular/tokens';

import {
    PROPERTY_TOKEN_items,
} from 'devextreme-angular/tokens';

@Component({
    selector: 'dxi-command',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: PROPERTY_TOKEN_commands,
            useExisting: DxiCommandComponent,
         }
    ],
    inputs: [
        'icon',
        'items',
        'location',
        'name',
        'text',
        'options',
        'prompt'
    ]
})
export class DxiCommandComponent extends DxiDiagramCustomCommand { 
    protected _dxClassName = 'DxiCommandComponent';

    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsNestedItems(value: QueryList<ICollectionNestedOption>) {
        this._setChildren('items', value);
    }
    

    protected get _optionPath() {
        return 'commands';
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  imports: [
    DxiCommandComponent
  ],
  exports: [
    DxiCommandComponent
  ],
})
export class DxiCommandModule { }
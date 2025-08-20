/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiPopupToolbarItem } from './base/popup-toolbar-item-dxi';

import { PROPERTY_TOKEN_toolbarItems } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-toolbar-item',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_toolbarItems,
           useExisting: DxiToolbarItemComponent,
        }
    ],
    inputs: [
        'cssClass',
        'disabled',
        'html',
        'locateInMenu',
        'location',
        'menuItemTemplate',
        'options',
        'showText',
        'template',
        'text',
        'toolbar',
        'visible',
        'widget'
    ]
})
export class DxiToolbarItemComponent extends DxiPopupToolbarItem {

    

    protected get _optionPath() {
        return 'toolbarItems';
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
    DxiToolbarItemComponent
  ],
  exports: [
    DxiToolbarItemComponent
  ],
})
export class DxiToolbarItemModule { }

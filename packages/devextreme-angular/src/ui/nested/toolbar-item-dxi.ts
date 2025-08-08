/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiPopupToolbarItem } from './base/popup-toolbar-item-dxi';

@Component({
    selector: 'dxi-toolbar-item',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxiToolbarItemComponent) => ({
                propertyName: 'toolbarItems',
                className: 'DxiToolbarItemComponent',
                component
            }),
            deps: [DxiToolbarItemComponent],
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

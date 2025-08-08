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
import { DxiFileManagerToolbarItem } from './base/file-manager-toolbar-item-dxi';

@Component({
    selector: 'dxi-file-selection-item',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxiFileSelectionItemComponent) => ({
                propertyName: 'fileSelectionItems',
                className: 'DxiFileSelectionItemComponent',
                component
            }),
            deps: [DxiFileSelectionItemComponent],
         }
    ],
    inputs: [
        'cssClass',
        'disabled',
        'icon',
        'locateInMenu',
        'location',
        'name',
        'options',
        'showText',
        'text',
        'visible',
        'widget'
    ]
})
export class DxiFileSelectionItemComponent extends DxiFileManagerToolbarItem {

    protected get _optionPath() {
        return 'fileSelectionItems';
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
    DxiFileSelectionItemComponent
  ],
  exports: [
    DxiFileSelectionItemComponent
  ],
})
export class DxiFileSelectionItemModule { }

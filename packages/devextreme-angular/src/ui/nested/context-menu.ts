/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoFileManagerContextMenu } from './base/file-manager-context-menu';

@Component({
    selector: 'dxo-context-menu',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoContextMenuComponent) => ({
                propertyName: 'contextMenu',
                className: 'DxoContextMenuComponent',
                component
            }),
            deps: [DxoContextMenuComponent],
         }
         ],
    inputs: [
        'commands',
        'enabled',
        'items'
    ]
})
export class DxoContextMenuComponent extends DxoFileManagerContextMenu implements OnDestroy, OnInit {

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

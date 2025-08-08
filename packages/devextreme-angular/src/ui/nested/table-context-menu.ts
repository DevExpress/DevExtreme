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
import { DxoHtmlEditorTableContextMenu } from './base/html-editor-table-context-menu';

@Component({
    selector: 'dxo-table-context-menu',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoTableContextMenuComponent) => ({
                propertyName: 'tableContextMenu',
                className: 'DxoTableContextMenuComponent',
                component
            }),
            deps: [DxoTableContextMenuComponent],
         }
         ],
    inputs: [
        'enabled',
        'items'
    ]
})
export class DxoTableContextMenuComponent extends DxoHtmlEditorTableContextMenu implements OnDestroy, OnInit {

    protected get _optionPath() {
        return 'tableContextMenu';
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
    DxoTableContextMenuComponent
  ],
  exports: [
    DxoTableContextMenuComponent
  ],
})
export class DxoTableContextMenuModule { }

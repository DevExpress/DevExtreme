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




import { dxFileManagerContextMenuItem, FileManagerPredefinedContextMenuItem } from 'devextreme/ui/file_manager';

import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
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
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoFileManagerContextMenuComponent) => ({
                propertyName: 'contextMenu',
                className: 'DxoFileManagerContextMenuComponent',
                component
            }),
            deps: [DxoFileManagerContextMenuComponent],
         }
         ]
})
export class DxoFileManagerContextMenuComponent extends NestedOption implements OnDestroy, OnInit {
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

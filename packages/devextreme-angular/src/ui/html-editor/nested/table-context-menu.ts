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




import { dxHtmlEditorTableContextMenuItem, HtmlEditorPredefinedContextMenuItem } from 'devextreme/ui/html_editor';

import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-html-editor-table-context-menu',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoHtmlEditorTableContextMenuComponent) => ({
                propertyName: 'tableContextMenu',
                className: 'DxoHtmlEditorTableContextMenuComponent',
                component
            }),
            deps: [DxoHtmlEditorTableContextMenuComponent],
         }
         ]
})
export class DxoHtmlEditorTableContextMenuComponent extends NestedOption implements OnDestroy, OnInit {
    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get items(): Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem>) {
        this._setOption('items', value);
    }


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
    DxoHtmlEditorTableContextMenuComponent
  ],
  exports: [
    DxoHtmlEditorTableContextMenuComponent
  ],
})
export class DxoHtmlEditorTableContextMenuModule { }

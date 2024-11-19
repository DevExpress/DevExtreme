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
    forwardRef,
    QueryList
} from '@angular/core';




import { dxHtmlEditorTableContextMenuItem, HtmlEditorPredefinedContextMenuItem } from 'devextreme/ui/html_editor';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiHtmlEditorItemComponent } from './item-dxi';
import { DxiHtmlEditorTableContextMenuItemComponent } from './table-context-menu-item-dxi';


@Component({
    selector: 'dxo-html-editor-table-context-menu',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoHtmlEditorTableContextMenuComponent extends NestedOption implements OnDestroy, OnInit  {
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


    @ContentChildren(forwardRef(() => DxiHtmlEditorItemComponent))
    get itemsChildren(): QueryList<DxiHtmlEditorItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    @ContentChildren(forwardRef(() => DxiHtmlEditorTableContextMenuItemComponent))
    get tableContextMenuItemsChildren(): QueryList<DxiHtmlEditorTableContextMenuItemComponent> {
        return this._getOption('items');
    }
    set tableContextMenuItemsChildren(value) {
        this.setChildren('items', value);
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
  declarations: [
    DxoHtmlEditorTableContextMenuComponent
  ],
  exports: [
    DxoHtmlEditorTableContextMenuComponent
  ],
})
export class DxoHtmlEditorTableContextMenuModule { }

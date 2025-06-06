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
    QueryList,
    AfterContentInit
} from '@angular/core';




import { dxHtmlEditorTableContextMenuItem, HtmlEditorPredefinedContextMenuItem } from 'devextreme/ui/html_editor';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiHtmlEditorItemComponent } from './item-dxi';
import { DxiHtmlEditorTableContextMenuItemComponent } from './table-context-menu-item-dxi';


@Component({
    selector: 'dxo-html-editor-table-context-menu',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoHtmlEditorTableContextMenuComponent extends NestedOption implements OnDestroy, OnInit, AfterContentInit  {
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


    @ContentChildren(forwardRef(() => DxiHtmlEditorItemComponent)) itemsChildren!: QueryList<DxiHtmlEditorItemComponent>
    
    @ContentChildren(forwardRef(() => DxiHtmlEditorTableContextMenuItemComponent)) tableContextMenuItemsChildren!: QueryList<DxiHtmlEditorTableContextMenuItemComponent>
    
    setItems() {
        const q: QueryList<any> = new QueryList();
        q.reset([
            ...this.itemsChildren.toArray(),
            ...this.tableContextMenuItemsChildren.toArray(),
        ]);
        this.setChildren('items', q);
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


    ngAfterContentInit() {
        this.setItems();
        
        this.itemsChildren.changes.subscribe(() => { this.setItems() });
        this.tableContextMenuItemsChildren.changes.subscribe(() => { this.setItems() });
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

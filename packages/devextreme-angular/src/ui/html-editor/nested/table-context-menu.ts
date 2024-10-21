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




import { dxHtmlEditorTableContextMenuItem } from 'devextreme/ui/html_editor';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


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
    get items(): Array<dxHtmlEditorTableContextMenuItem | "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties"> {
        return this._getOption('items');
    }
    set items(value: Array<dxHtmlEditorTableContextMenuItem | "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties">) {
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
  declarations: [
    DxoHtmlEditorTableContextMenuComponent
  ],
  exports: [
    DxoHtmlEditorTableContextMenuComponent
  ],
})
export class DxoHtmlEditorTableContextMenuModule { }

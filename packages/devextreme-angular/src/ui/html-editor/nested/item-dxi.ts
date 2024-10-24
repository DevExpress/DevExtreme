/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    ElementRef,
    Renderer2,
    Inject,
    AfterViewInit,
    SkipSelf,
    Input
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import { dxHtmlEditorTableContextMenuItem } from 'devextreme/ui/html_editor';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-html-editor-item',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiHtmlEditorItemComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get beginGroup(): boolean {
        return this._getOption('beginGroup');
    }
    set beginGroup(value: boolean) {
        this._setOption('beginGroup', value);
    }

    @Input()
    get closeMenuOnClick(): boolean {
        return this._getOption('closeMenuOnClick');
    }
    set closeMenuOnClick(value: boolean) {
        this._setOption('closeMenuOnClick', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get items(): Array<dxHtmlEditorTableContextMenuItem | "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties"> {
        return this._getOption('items');
    }
    set items(value: Array<dxHtmlEditorTableContextMenuItem | "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties">) {
        this._setOption('items', value);
    }

    @Input()
    get name(): "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties" | "size" | "header" | "separator" {
        return this._getOption('name');
    }
    set name(value: "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties" | "size" | "header" | "separator") {
        this._setOption('name', value);
    }

    @Input()
    get selectable(): boolean {
        return this._getOption('selectable');
    }
    set selectable(value: boolean) {
        this._setOption('selectable', value);
    }

    @Input()
    get selected(): boolean {
        return this._getOption('selected');
    }
    set selected(value: boolean) {
        this._setOption('selected', value);
    }

    @Input()
    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get acceptedValues(): Array<boolean | number | string> {
        return this._getOption('acceptedValues');
    }
    set acceptedValues(value: Array<boolean | number | string>) {
        this._setOption('acceptedValues', value);
    }

    @Input()
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    @Input()
    get formatName(): "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" {
        return this._getOption('formatName');
    }
    set formatName(value: "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable") {
        this._setOption('formatName', value);
    }

    @Input()
    get formatValues(): Array<boolean | number | string> {
        return this._getOption('formatValues');
    }
    set formatValues(value: Array<boolean | number | string>) {
        this._setOption('formatValues', value);
    }

    @Input()
    get html(): string {
        return this._getOption('html');
    }
    set html(value: string) {
        this._setOption('html', value);
    }

    @Input()
    get locateInMenu(): "always" | "auto" | "never" {
        return this._getOption('locateInMenu');
    }
    set locateInMenu(value: "always" | "auto" | "never") {
        this._setOption('locateInMenu', value);
    }

    @Input()
    get location(): "after" | "before" | "center" {
        return this._getOption('location');
    }
    set location(value: "after" | "before" | "center") {
        this._setOption('location', value);
    }

    @Input()
    get menuItemTemplate(): any {
        return this._getOption('menuItemTemplate');
    }
    set menuItemTemplate(value: any) {
        this._setOption('menuItemTemplate', value);
    }

    @Input()
    get options(): any {
        return this._getOption('options');
    }
    set options(value: any) {
        this._setOption('options', value);
    }

    @Input()
    get showText(): "always" | "inMenu" {
        return this._getOption('showText');
    }
    set showText(value: "always" | "inMenu") {
        this._setOption('showText', value);
    }

    @Input()
    get widget(): "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox" {
        return this._getOption('widget');
    }
    set widget(value: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox") {
        this._setOption('widget', value);
    }


    protected get _optionPath() {
        return 'items';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost,
            private renderer: Renderer2,
            @Inject(DOCUMENT) private document: any,
            @Host() templateHost: DxTemplateHost,
            private element: ElementRef) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
        templateHost.setHost(this);
    }

    setTemplate(template: DxTemplateDirective) {
        this.template = template;
    }
    ngAfterViewInit() {
        extractTemplate(this, this.element, this.renderer, this.document);
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiHtmlEditorItemComponent
  ],
  exports: [
    DxiHtmlEditorItemComponent
  ],
})
export class DxiHtmlEditorItemModule { }

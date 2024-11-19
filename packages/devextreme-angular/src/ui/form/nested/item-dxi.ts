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


import * as CommonTypes from 'devextreme/common';
import { FormItemComponent, FormItemType, LabelLocation, dxFormButtonItem, dxFormEmptyItem, dxFormGroupItem, dxFormSimpleItem, dxFormTabbedItem } from 'devextreme/ui/form';
import { HorizontalAlignment, VerticalAlignment } from 'devextreme/common';
import { dxTabPanelOptions } from 'devextreme/ui/tab_panel';
import { dxButtonOptions } from 'devextreme/ui/button';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-form-item',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiFormItemComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get badge(): string {
        return this._getOption('badge');
    }
    set badge(value: string) {
        this._setOption('badge', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get html(): string {
        return this._getOption('html');
    }
    set html(value: string) {
        this._setOption('html', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get tabTemplate(): any {
        return this._getOption('tabTemplate');
    }
    set tabTemplate(value: any) {
        this._setOption('tabTemplate', value);
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
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get colSpan(): number | undefined {
        return this._getOption('colSpan');
    }
    set colSpan(value: number | undefined) {
        this._setOption('colSpan', value);
    }

    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get dataField(): string | undefined {
        return this._getOption('dataField');
    }
    set dataField(value: string | undefined) {
        this._setOption('dataField', value);
    }

    @Input()
    get editorOptions(): any | undefined {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any | undefined) {
        this._setOption('editorOptions', value);
    }

    @Input()
    get editorType(): FormItemComponent {
        return this._getOption('editorType');
    }
    set editorType(value: FormItemComponent) {
        this._setOption('editorType', value);
    }

    @Input()
    get helpText(): string | undefined {
        return this._getOption('helpText');
    }
    set helpText(value: string | undefined) {
        this._setOption('helpText', value);
    }

    @Input()
    get isRequired(): boolean | undefined {
        return this._getOption('isRequired');
    }
    set isRequired(value: boolean | undefined) {
        this._setOption('isRequired', value);
    }

    @Input()
    get itemType(): FormItemType {
        return this._getOption('itemType');
    }
    set itemType(value: FormItemType) {
        this._setOption('itemType', value);
    }

    @Input()
    get label(): { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean } {
        return this._getOption('label');
    }
    set label(value: { alignment?: HorizontalAlignment, location?: LabelLocation, showColon?: boolean, template?: any, text?: string | undefined, visible?: boolean }) {
        this._setOption('label', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    @Input()
    get validationRules(): Array<CommonTypes.ValidationRule> {
        return this._getOption('validationRules');
    }
    set validationRules(value: Array<CommonTypes.ValidationRule>) {
        this._setOption('validationRules', value);
    }

    @Input()
    get visibleIndex(): number | undefined {
        return this._getOption('visibleIndex');
    }
    set visibleIndex(value: number | undefined) {
        this._setOption('visibleIndex', value);
    }

    @Input()
    get alignItemLabels(): boolean {
        return this._getOption('alignItemLabels');
    }
    set alignItemLabels(value: boolean) {
        this._setOption('alignItemLabels', value);
    }

    @Input()
    get caption(): string | undefined {
        return this._getOption('caption');
    }
    set caption(value: string | undefined) {
        this._setOption('caption', value);
    }

    @Input()
    get captionTemplate(): any {
        return this._getOption('captionTemplate');
    }
    set captionTemplate(value: any) {
        this._setOption('captionTemplate', value);
    }

    @Input()
    get colCount(): number {
        return this._getOption('colCount');
    }
    set colCount(value: number) {
        this._setOption('colCount', value);
    }

    @Input()
    get colCountByScreen(): { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined } {
        return this._getOption('colCountByScreen');
    }
    set colCountByScreen(value: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }) {
        this._setOption('colCountByScreen', value);
    }

    @Input()
    get items(): Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem> {
        return this._getOption('items');
    }
    set items(value: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>) {
        this._setOption('items', value);
    }

    @Input()
    get tabPanelOptions(): dxTabPanelOptions | undefined {
        return this._getOption('tabPanelOptions');
    }
    set tabPanelOptions(value: dxTabPanelOptions | undefined) {
        this._setOption('tabPanelOptions', value);
    }

    @Input()
    get tabs(): { alignItemLabels?: boolean, badge?: string | undefined, colCount?: number, colCountByScreen?: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }, disabled?: boolean, icon?: string | undefined, items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>, tabTemplate?: any, template?: any, title?: string | undefined }[] {
        return this._getOption('tabs');
    }
    set tabs(value: { alignItemLabels?: boolean, badge?: string | undefined, colCount?: number, colCountByScreen?: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }, disabled?: boolean, icon?: string | undefined, items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>, tabTemplate?: any, template?: any, title?: string | undefined }[]) {
        this._setOption('tabs', value);
    }

    @Input()
    get buttonOptions(): dxButtonOptions | undefined {
        return this._getOption('buttonOptions');
    }
    set buttonOptions(value: dxButtonOptions | undefined) {
        this._setOption('buttonOptions', value);
    }

    @Input()
    get horizontalAlignment(): HorizontalAlignment {
        return this._getOption('horizontalAlignment');
    }
    set horizontalAlignment(value: HorizontalAlignment) {
        this._setOption('horizontalAlignment', value);
    }

    @Input()
    get verticalAlignment(): VerticalAlignment {
        return this._getOption('verticalAlignment');
    }
    set verticalAlignment(value: VerticalAlignment) {
        this._setOption('verticalAlignment', value);
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
    DxiFormItemComponent
  ],
  exports: [
    DxiFormItemComponent
  ],
})
export class DxiFormItemModule { }

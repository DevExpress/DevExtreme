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


import * as LocalizationTypes from 'devextreme/localization';
import { dxFilterBuilderField } from 'devextreme/ui/filter_builder';
import { template } from 'devextreme/core/templates/template';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-data-grid-field',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiDataGridFieldComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get calculateFilterExpression(): ((filterValue: any, selectedFilterOperation: string) => string | (() => any) | Array<any>) {
        return this._getOption('calculateFilterExpression');
    }
    set calculateFilterExpression(value: ((filterValue: any, selectedFilterOperation: string) => string | (() => any) | Array<any>)) {
        this._setOption('calculateFilterExpression', value);
    }

    @Input()
    get caption(): string {
        return this._getOption('caption');
    }
    set caption(value: string) {
        this._setOption('caption', value);
    }

    @Input()
    get customizeText(): ((fieldInfo: { value: string | number | Date, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((fieldInfo: { value: string | number | Date, valueText: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get dataField(): string {
        return this._getOption('dataField');
    }
    set dataField(value: string) {
        this._setOption('dataField', value);
    }

    @Input()
    get dataType(): "string" | "number" | "date" | "boolean" | "object" | "datetime" {
        return this._getOption('dataType');
    }
    set dataType(value: "string" | "number" | "date" | "boolean" | "object" | "datetime") {
        this._setOption('dataType', value);
    }

    @Input()
    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
        this._setOption('editorOptions', value);
    }

    @Input()
    get editorTemplate(): ((conditionInfo: { field: dxFilterBuilderField, filterOperation: string, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template {
        return this._getOption('editorTemplate');
    }
    set editorTemplate(value: ((conditionInfo: { field: dxFilterBuilderField, filterOperation: string, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template) {
        this._setOption('editorTemplate', value);
    }

    @Input()
    get falseText(): string {
        return this._getOption('falseText');
    }
    set falseText(value: string) {
        this._setOption('falseText', value);
    }

    @Input()
    get filterOperations(): Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | string> {
        return this._getOption('filterOperations');
    }
    set filterOperations(value: Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | string>) {
        this._setOption('filterOperations', value);
    }

    @Input()
    get format(): LocalizationTypes.Format {
        return this._getOption('format');
    }
    set format(value: LocalizationTypes.Format) {
        this._setOption('format', value);
    }

    @Input()
    get lookup(): Record<string, any> {
        return this._getOption('lookup');
    }
    set lookup(value: Record<string, any>) {
        this._setOption('lookup', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get trueText(): string {
        return this._getOption('trueText');
    }
    set trueText(value: string) {
        this._setOption('trueText', value);
    }


    protected get _optionPath() {
        return 'fields';
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
    DxiDataGridFieldComponent
  ],
  exports: [
    DxiDataGridFieldComponent
  ],
})
export class DxiDataGridFieldModule { }

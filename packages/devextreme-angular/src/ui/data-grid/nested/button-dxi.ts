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


import dxDataGrid from 'devextreme/ui/data_grid';
import { dxDataGridColumn, dxDataGridRowObject, DataGridPredefinedColumnButton, ColumnButtonClickEvent } from 'devextreme/ui/data_grid';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-data-grid-button',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiDataGridButtonComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    @Input()
    get disabled(): boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean) {
        return this._getOption('disabled');
    }
    set disabled(value: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean)) {
        this._setOption('disabled', value);
    }

    @Input()
    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
        this._setOption('hint', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get name(): DataGridPredefinedColumnButton | string {
        return this._getOption('name');
    }
    set name(value: DataGridPredefinedColumnButton | string) {
        this._setOption('name', value);
    }

    @Input()
    get onClick(): ((e: ColumnButtonClickEvent) => void) {
        return this._getOption('onClick');
    }
    set onClick(value: ((e: ColumnButtonClickEvent) => void)) {
        this._setOption('onClick', value);
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
    get visible(): boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean) {
        return this._getOption('visible');
    }
    set visible(value: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean)) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'buttons';
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
    DxiDataGridButtonComponent
  ],
  exports: [
    DxiDataGridButtonComponent
  ],
})
export class DxiDataGridButtonModule { }

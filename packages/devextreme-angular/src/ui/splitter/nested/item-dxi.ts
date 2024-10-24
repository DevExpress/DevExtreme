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


import { dxSplitterOptions } from 'devextreme/ui/splitter';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-splitter-item',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiSplitterItemComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get collapsed(): boolean {
        return this._getOption('collapsed');
    }
    set collapsed(value: boolean) {
        this._setOption('collapsed', value);
    }

    @Input()
    get collapsedSize(): number | string {
        return this._getOption('collapsedSize');
    }
    set collapsedSize(value: number | string) {
        this._setOption('collapsedSize', value);
    }

    @Input()
    get collapsible(): boolean {
        return this._getOption('collapsible');
    }
    set collapsible(value: boolean) {
        this._setOption('collapsible', value);
    }

    @Input()
    get maxSize(): number | string {
        return this._getOption('maxSize');
    }
    set maxSize(value: number | string) {
        this._setOption('maxSize', value);
    }

    @Input()
    get minSize(): number | string {
        return this._getOption('minSize');
    }
    set minSize(value: number | string) {
        this._setOption('minSize', value);
    }

    @Input()
    get resizable(): boolean {
        return this._getOption('resizable');
    }
    set resizable(value: boolean) {
        this._setOption('resizable', value);
    }

    @Input()
    get size(): number | string {
        return this._getOption('size');
    }
    set size(value: number | string) {
        this._setOption('size', value);
    }

    @Input()
    get splitter(): dxSplitterOptions {
        return this._getOption('splitter');
    }
    set splitter(value: dxSplitterOptions) {
        this._setOption('splitter', value);
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
    DxiSplitterItemComponent
  ],
  exports: [
    DxiSplitterItemComponent
  ],
})
export class DxiSplitterItemModule { }

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
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import { ButtonItem, EmptyItem, GroupItem, SimpleItem, TabbedItem } from 'devextreme/ui/form';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiDataGridItemComponent } from './item-dxi';


@Component({
    selector: 'dxi-data-grid-tab',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiDataGridTabComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get alignItemLabels(): boolean {
        return this._getOption('alignItemLabels');
    }
    set alignItemLabels(value: boolean) {
        this._setOption('alignItemLabels', value);
    }

    @Input()
    get badge(): string | undefined {
        return this._getOption('badge');
    }
    set badge(value: string | undefined) {
        this._setOption('badge', value);
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
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get icon(): string | undefined {
        return this._getOption('icon');
    }
    set icon(value: string | undefined) {
        this._setOption('icon', value);
    }

    @Input()
    get items(): Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem> {
        return this._getOption('items');
    }
    set items(value: Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem>) {
        this._setOption('items', value);
    }

    @Input()
    get tabTemplate(): any | undefined {
        return this._getOption('tabTemplate');
    }
    set tabTemplate(value: any | undefined) {
        this._setOption('tabTemplate', value);
    }

    @Input()
    get template(): any | undefined {
        return this._getOption('template');
    }
    set template(value: any | undefined) {
        this._setOption('template', value);
    }

    @Input()
    get title(): string | undefined {
        return this._getOption('title');
    }
    set title(value: string | undefined) {
        this._setOption('title', value);
    }


    protected get _optionPath() {
        return 'tabs';
    }


    @ContentChildren(forwardRef(() => DxiDataGridItemComponent))
    get itemsChildren(): QueryList<DxiDataGridItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
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
    DxiDataGridTabComponent
  ],
  exports: [
    DxiDataGridTabComponent
  ],
})
export class DxiDataGridTabModule { }

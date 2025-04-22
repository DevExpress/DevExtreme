/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
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


import { CardHeaderPredefinedToolbarItem, CardHeaderToolbarItem } from 'devextreme/ui/card_view';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiCardViewCardHeaderItemComponent } from './card-header-item-dxi';
import { DxiCardViewItemComponent } from './item-dxi';


@Component({
    selector: 'dxo-card-view-card-header',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoCardViewCardHeaderComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost {
    @Input()
    get items(): Array<CardHeaderPredefinedToolbarItem | CardHeaderToolbarItem> {
        return this._getOption('items');
    }
    set items(value: Array<CardHeaderPredefinedToolbarItem | CardHeaderToolbarItem>) {
        this._setOption('items', value);
    }

    @Input()
    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'cardHeader';
    }


    @ContentChildren(forwardRef(() => DxiCardViewCardHeaderItemComponent))
    get cardHeaderItemsChildren(): QueryList<DxiCardViewCardHeaderItemComponent> {
        return this._getOption('items');
    }
    set cardHeaderItemsChildren(value) {
        this.setChildren('items', value);
    }

    @ContentChildren(forwardRef(() => DxiCardViewItemComponent))
    get itemsChildren(): QueryList<DxiCardViewItemComponent> {
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


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoCardViewCardHeaderComponent
  ],
  exports: [
    DxoCardViewCardHeaderComponent
  ],
})
export class DxoCardViewCardHeaderModule { }

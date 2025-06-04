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
    QueryList,
    AfterContentInit
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import { CardHeaderItem, CardHeaderPredefinedItem } from 'devextreme/ui/card_view';

import {
    DxIntegrationModule,
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
    standalone: true,
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxoCardViewCardHeaderComponent extends NestedOption implements AfterViewInit, OnDestroy, OnInit,
    IDxTemplateHost, AfterContentInit  {
    @Input()
    get items(): Array<CardHeaderItem | CardHeaderPredefinedItem> {
        return this._getOption('items');
    }
    set items(value: Array<CardHeaderItem | CardHeaderPredefinedItem>) {
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


    @ContentChildren(forwardRef(() => DxiCardViewCardHeaderItemComponent)) cardHeaderItemsChildren!: QueryList<DxiCardViewCardHeaderItemComponent>
    
    @ContentChildren(forwardRef(() => DxiCardViewItemComponent)) itemsChildren!: QueryList<DxiCardViewItemComponent>
    
    setItems() {
        const q: QueryList<any> = new QueryList();
        q.reset([...this.cardHeaderItemsChildren.toArray(),...this.itemsChildren.toArray(),]);
        this.setChildren('items', q);
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


    ngAfterContentInit() {
        this.setItems();
        
        this.cardHeaderItemsChildren.changes.subscribe(() => { this.setItems() });
        this.itemsChildren.changes.subscribe(() => { this.setItems() });
    }
}

@NgModule({
  imports: [
    DxoCardViewCardHeaderComponent
  ],
  exports: [
    DxoCardViewCardHeaderComponent
  ],
})
export class DxoCardViewCardHeaderModule { }

/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    ElementRef,
    Renderer2,
    Inject,
    AfterViewInit,
    SkipSelf,
    ContentChildren,
    QueryList,
} from '@angular/core';

import { DOCUMENT } from '@angular/common';



import {
    DxIntegrationModule,
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { DxiHtmlEditorImageUploadTabItem } from './base/html-editor-image-upload-tab-item-dxi';

import { PROPERTY_TOKEN_tabs } from 'devextreme-angular/core/tokens';

import {
    PROPERTY_TOKEN_items,
    PROPERTY_TOKEN_commands,
    PROPERTY_TOKEN_groups,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-tab',
    standalone: true,
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        DxTemplateHost,
        {
           provide: PROPERTY_TOKEN_tabs,
           useExisting: DxiTabComponent,
        }
    ],
    inputs: [
        'alignItemLabels',
        'badge',
        'colCount',
        'colCountByScreen',
        'disabled',
        'icon',
        'items',
        'tabTemplate',
        'template',
        'title',
        'commands',
        'groups',
        'name'
    ]
})
export class DxiTabComponent extends DxiHtmlEditorImageUploadTabItem implements AfterViewInit,
    IDxTemplateHost {

    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }
    @ContentChildren(PROPERTY_TOKEN_commands)
    set _commandsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('commands', value);
    }
    @ContentChildren(PROPERTY_TOKEN_groups)
    set _groupsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('groups', value);
    }
    

    protected get _optionPath() {
        return 'tabs';
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
  imports: [
    DxiTabComponent
  ],
  exports: [
    DxiTabComponent
  ],
})
export class DxiTabModule { }

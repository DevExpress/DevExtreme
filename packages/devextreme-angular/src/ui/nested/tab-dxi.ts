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
    forwardRef,
    QueryList
} from '@angular/core';

import { DOCUMENT } from '@angular/common';



import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { DxiHtmlEditorImageUploadTabItem } from './base/html-editor-image-upload-tab-item-dxi';
import { DxiItemComponent } from './item-dxi';
import { DxiCommandComponent } from './command-dxi';
import { DxiGroupComponent } from './group-dxi';


@Component({
    selector: 'dxi-tab',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost],
    
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

    protected get _optionPath() {
        return 'tabs';
    }


    @ContentChildren(forwardRef(() => DxiItemComponent))
    get itemsChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    @ContentChildren(forwardRef(() => DxiCommandComponent))
    get commandsChildren(): QueryList<DxiCommandComponent> {
        return this._getOption('commands');
    }
    set commandsChildren(value) {
        this.setChildren('commands', value);
    }

    @ContentChildren(forwardRef(() => DxiGroupComponent))
    get groupsChildren(): QueryList<DxiGroupComponent> {
        return this._getOption('groups');
    }
    set groupsChildren(value) {
        this.setChildren('groups', value);
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
    DxiTabComponent
  ],
  exports: [
    DxiTabComponent
  ],
})
export class DxiTabModule { }

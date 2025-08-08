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
    SkipSelf
} from '@angular/core';

import { DOCUMENT } from '@angular/common';



import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { DxiHtmlEditorImageUploadTabItem } from './base/html-editor-image-upload-tab-item-dxi';

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
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxiTabComponent) => ({
                propertyName: 'tabs',
                className: 'DxiTabComponent',
                component
            }),
            deps: [DxiTabComponent],
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

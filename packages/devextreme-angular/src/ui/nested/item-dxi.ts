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
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { DxiButtonGroupItem } from './base/button-group-item-dxi';

@Component({
    selector: 'dxi-item',
    standalone: true,
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        DxTemplateHost,
         {
            provide: СOLLECTION_NESTED_OPTION_TOKEN,
            useFactory: (component: DxiItemComponent) => ({
               propertyName: 'items',
               component
            }),
            deps: [DxiItemComponent],
         }
    ],
    inputs: [
        'disabled',
        'html',
        'icon',
        'template',
        'text',
        'title',
        'titleTemplate',
        'visible',
        'onClick',
        'stylingMode',
        'type',
        'baseSize',
        'box',
        'ratio',
        'shrink',
        'elementAttr',
        'hint',
        'alt',
        'author',
        'id',
        'isDeleted',
        'isEdited',
        'src',
        'timestamp',
        'beginGroup',
        'closeMenuOnClick',
        'items',
        'selectable',
        'selected',
        'colSpan',
        'cssClass',
        'dataField',
        'editorOptions',
        'editorType',
        'helpText',
        'isRequired',
        'itemType',
        'label',
        'name',
        'validationRules',
        'visibleIndex',
        'alignItemLabels',
        'caption',
        'captionTemplate',
        'colCount',
        'colCountByScreen',
        'tabPanelOptions',
        'tabs',
        'badge',
        'tabTemplate',
        'buttonOptions',
        'horizontalAlignment',
        'verticalAlignment',
        'locateInMenu',
        'location',
        'menuItemTemplate',
        'options',
        'showText',
        'widget',
        'height',
        'width',
        'imageAlt',
        'imageSrc',
        'acceptedValues',
        'commands',
        'key',
        'showChevron',
        'linkAttr',
        'url',
        'collapsed',
        'collapsedSize',
        'collapsible',
        'maxSize',
        'minSize',
        'resizable',
        'size',
        'splitter',
        'heightRatio',
        'widthRatio',
        'expanded',
        'hasItems',
        'parentId'
    ]
})
export class DxiItemComponent extends DxiButtonGroupItem implements AfterViewInit,
    IDxTemplateHost {

    @ContentChildren(СOLLECTION_NESTED_OPTION_TOKEN)
    set _CollectionOptionChildren(value: QueryList<{ propertyName: string, component: CollectionNestedOption }>) {
        this._setCollectionOptionChildren(value);
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
  imports: [
    DxiItemComponent
  ],
  exports: [
    DxiItemComponent
  ],
})
export class DxiItemModule { }

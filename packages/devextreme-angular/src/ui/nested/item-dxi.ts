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
    QueryList
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
import { DxiButtonGroupItem } from './base/button-group-item-dxi';

import {
    PROPERTY_TOKEN_attachments,
    PROPERTY_TOKEN_items,
    PROPERTY_TOKEN_validationRules,
    PROPERTY_TOKEN_tabs,
    PROPERTY_TOKEN_commands,
    PROPERTY_TOKEN_location,
} from 'devextreme-angular/core/tokens';

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
           provide: PROPERTY_TOKEN_items,
           useExisting: DxiItemComponent,
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
        'attachments',
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
    @ContentChildren(PROPERTY_TOKEN_attachments)
    set _attachmentsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('attachments', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_validationRules)
    set _validationRulesContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('validationRules', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_tabs)
    set _tabsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('tabs', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_commands)
    set _commandsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('commands', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_location)
    set _locationContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('location', value);
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

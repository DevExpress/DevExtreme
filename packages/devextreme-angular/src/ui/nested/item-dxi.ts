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
import { DxiButtonGroupItem } from './base/button-group-item-dxi';
import { DxiValidationRuleComponent } from './validation-rule-dxi';
import { DxiTabComponent } from './tab-dxi';
import { DxiLocationComponent } from './location-dxi';


@Component({
    selector: 'dxi-item',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost],
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
        'formatName',
        'formatValues',
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
        'id',
        'parentId'
    ]
})
export class DxiItemComponent extends DxiButtonGroupItem implements AfterViewInit,
    IDxTemplateHost {

    protected get _optionPath() {
        return 'items';
    }


    @ContentChildren(forwardRef(() => DxiItemComponent))
    get itemsChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    @ContentChildren(forwardRef(() => DxiValidationRuleComponent))
    get validationRulesChildren(): QueryList<DxiValidationRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiTabComponent))
    get tabsChildren(): QueryList<DxiTabComponent> {
        return this._getOption('tabs');
    }
    set tabsChildren(value) {
        this.setChildren('tabs', value);
    }

    @ContentChildren(forwardRef(() => DxiLocationComponent))
    get locationChildren(): QueryList<DxiLocationComponent> {
        return this._getOption('location');
    }
    set locationChildren(value) {
        this.setChildren('location', value);
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
    DxiItemComponent
  ],
  exports: [
    DxiItemComponent
  ],
})
export class DxiItemModule { }

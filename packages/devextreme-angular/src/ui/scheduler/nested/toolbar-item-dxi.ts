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


import { LocateInMenuMode, ShowTextMode } from 'devextreme/ui/toolbar';
import { ToolbarItemLocation, ToolbarItemComponent } from 'devextreme/common';
import { SchedulerPredefinedToolbarItem, DateNavigatorItemProperties } from 'devextreme/ui/scheduler';

import {
    DxIntegrationModule,
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_items } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-scheduler-toolbar-item',
    standalone: true,
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        DxTemplateHost,
        {
           provide: PROPERTY_TOKEN_items,
           useExisting: DxiSchedulerToolbarItemComponent,
        }
    ]
})
export class DxiSchedulerToolbarItemComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {

    
    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get html(): string {
        return this._getOption('html');
    }
    set html(value: string) {
        this._setOption('html', value);
    }

    @Input()
    get locateInMenu(): LocateInMenuMode {
        return this._getOption('locateInMenu');
    }
    set locateInMenu(value: LocateInMenuMode) {
        this._setOption('locateInMenu', value);
    }

    @Input()
    get location(): ToolbarItemLocation {
        return this._getOption('location');
    }
    set location(value: ToolbarItemLocation) {
        this._setOption('location', value);
    }

    @Input()
    get menuItemTemplate(): any {
        return this._getOption('menuItemTemplate');
    }
    set menuItemTemplate(value: any) {
        this._setOption('menuItemTemplate', value);
    }

    @Input()
    get name(): SchedulerPredefinedToolbarItem {
        return this._getOption('name');
    }
    set name(value: SchedulerPredefinedToolbarItem) {
        this._setOption('name', value);
    }

    @Input()
    get options(): DateNavigatorItemProperties | Record<string, any> {
        return this._getOption('options');
    }
    set options(value: DateNavigatorItemProperties | Record<string, any>) {
        this._setOption('options', value);
    }

    @Input()
    get showText(): ShowTextMode {
        return this._getOption('showText');
    }
    set showText(value: ShowTextMode) {
        this._setOption('showText', value);
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

    @Input()
    get widget(): ToolbarItemComponent {
        return this._getOption('widget');
    }
    set widget(value: ToolbarItemComponent) {
        this._setOption('widget', value);
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
    DxiSchedulerToolbarItemComponent
  ],
  exports: [
    DxiSchedulerToolbarItemComponent
  ],
})
export class DxiSchedulerToolbarItemModule { }

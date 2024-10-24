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


import { NativeEventInfo } from 'devextreme/events/index';
import { CollectionWidgetItem } from 'devextreme/ui/collection/ui.collection_widget.base';
import { template } from 'devextreme/core/templates/template';

import {
    NestedOptionHost,
    extractTemplate,
    DxTemplateDirective,
    IDxTemplateHost,
    DxTemplateHost
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-action-sheet-item',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    providers: [NestedOptionHost, DxTemplateHost]
})
export class DxiActionSheetItemComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get onClick(): ((e: NativeEventInfo<any>) => void) {
        return this._getOption('onClick');
    }
    set onClick(value: ((e: NativeEventInfo<any>) => void)) {
        this._setOption('onClick', value);
    }

    @Input()
    get stylingMode(): "text" | "outlined" | "contained" {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: "text" | "outlined" | "contained") {
        this._setOption('stylingMode', value);
    }

    @Input()
    get template(): ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template {
        return this._getOption('template');
    }
    set template(value: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template) {
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
    get type(): "danger" | "default" | "normal" | "success" {
        return this._getOption('type');
    }
    set type(value: "danger" | "default" | "normal" | "success") {
        this._setOption('type', value);
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
  declarations: [
    DxiActionSheetItemComponent
  ],
  exports: [
    DxiActionSheetItemComponent
  ],
})
export class DxiActionSheetItemModule { }

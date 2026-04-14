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
    Input,
    ContentChildren,
    QueryList
} from '@angular/core';

import { DOCUMENT } from '@angular/common';


import type { Attachment, User } from 'devextreme/ui/chat';
import type { ButtonType } from 'devextreme/common';

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
import {
    PROPERTY_TOKEN_attachments,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-chat-item',
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }'],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        DxTemplateHost,
        {
           provide: PROPERTY_TOKEN_items,
           useExisting: DxiChatItemComponent,
        }
    ]
})
export class DxiChatItemComponent extends CollectionNestedOption implements AfterViewInit,
    IDxTemplateHost {
    @ContentChildren(PROPERTY_TOKEN_attachments)
    set _attachmentsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('attachments', value);
    }
    
    @Input()
    get alt(): string {
        return this._getOption('alt');
    }
    set alt(value: string) {
        this._setOption('alt', value);
    }

    @Input()
    get attachments(): Array<Attachment> {
        return this._getOption('attachments');
    }
    set attachments(value: Array<Attachment>) {
        this._setOption('attachments', value);
    }

    @Input()
    get author(): User {
        return this._getOption('author');
    }
    set author(value: User) {
        this._setOption('author', value);
    }

    @Input()
    get id(): number | string {
        return this._getOption('id');
    }
    set id(value: number | string) {
        this._setOption('id', value);
    }

    @Input()
    get isDeleted(): boolean {
        return this._getOption('isDeleted');
    }
    set isDeleted(value: boolean) {
        this._setOption('isDeleted', value);
    }

    @Input()
    get isEdited(): boolean {
        return this._getOption('isEdited');
    }
    set isEdited(value: boolean) {
        this._setOption('isEdited', value);
    }

    @Input()
    get src(): string {
        return this._getOption('src');
    }
    set src(value: string) {
        this._setOption('src', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get timestamp(): Date | number | string {
        return this._getOption('timestamp');
    }
    set timestamp(value: Date | number | string) {
        this._setOption('timestamp', value);
    }

    @Input()
    get type(): string | undefined | ButtonType {
        return this._getOption('type');
    }
    set type(value: string | undefined | ButtonType) {
        this._setOption('type', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }

    @Input()
    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
        this._setOption('hint', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
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
    DxiChatItemComponent
  ],
  exports: [
    DxiChatItemComponent
  ],
})
export class DxiChatItemModule { }

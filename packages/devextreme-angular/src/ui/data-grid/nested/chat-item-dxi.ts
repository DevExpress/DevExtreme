/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    QueryList
} from '@angular/core';




import type { Attachment, User } from 'devextreme/ui/chat';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_items } from 'devextreme-angular/core/tokens';
import {
    PROPERTY_TOKEN_attachments,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-data-grid-chat-item',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_items,
           useExisting: DxiDataGridChatItemComponent,
        }
    ]
})
export class DxiDataGridChatItemComponent extends CollectionNestedOption {
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
    get type(): string | undefined {
        return this._getOption('type');
    }
    set type(value: string | undefined) {
        this._setOption('type', value);
    }


    protected get _optionPath() {
        return 'items';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  imports: [
    DxiDataGridChatItemComponent
  ],
  exports: [
    DxiDataGridChatItemComponent
  ],
})
export class DxiDataGridChatItemModule { }

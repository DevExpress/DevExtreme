/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-chat-typing-user',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiChatTypingUserComponent extends CollectionNestedOption {
    @Input()
    get avatarAlt(): string | undefined {
        return this._getOption('avatarAlt');
    }
    set avatarAlt(value: string | undefined) {
        this._setOption('avatarAlt', value);
    }

    @Input()
    get avatarUrl(): string {
        return this._getOption('avatarUrl');
    }
    set avatarUrl(value: string) {
        this._setOption('avatarUrl', value);
    }

    @Input()
    get id(): number | string {
        return this._getOption('id');
    }
    set id(value: number | string) {
        this._setOption('id', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }


    protected get _optionPath() {
        return 'typingUsers';
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
  declarations: [
    DxiChatTypingUserComponent
  ],
  exports: [
    DxiChatTypingUserComponent
  ],
})
export class DxiChatTypingUserModule { }

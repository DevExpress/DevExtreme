/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { User } from 'devextreme/ui/chat';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-chat-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiChatItemComponent extends CollectionNestedOption {
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
  declarations: [
    DxiChatItemComponent
  ],
  exports: [
    DxiChatItemComponent
  ],
})
export class DxiChatItemModule { }

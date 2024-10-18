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
    selector: 'dxi-chat-error',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiChatErrorComponent extends CollectionNestedOption {
    @Input()
    get id(): number | string {
        return this._getOption('id');
    }
    set id(value: number | string) {
        this._setOption('id', value);
    }

    @Input()
    get message(): string {
        return this._getOption('message');
    }
    set message(value: string) {
        this._setOption('message', value);
    }


    protected get _optionPath() {
        return 'errors';
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
    DxiChatErrorComponent
  ],
  exports: [
    DxiChatErrorComponent
  ],
})
export class DxiChatErrorModule { }

/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiUser } from './base/user-dxi';

import { PROPERTY_TOKEN_typingUsers } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-typing-user',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_typingUsers,
           useExisting: DxiTypingUserComponent,
        }
    ],
    inputs: [
        'avatarAlt',
        'avatarUrl',
        'id',
        'name'
    ]
})
export class DxiTypingUserComponent extends DxiUser {

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
  imports: [
    DxiTypingUserComponent
  ],
  exports: [
    DxiTypingUserComponent
  ],
})
export class DxiTypingUserModule { }

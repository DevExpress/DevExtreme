/* tslint:disable:max-line-length */
/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { DxiUser } from './base/user-dxi';

@Component({
    selector: 'dxi-typing-user',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: СOLLECTION_NESTED_OPTION_TOKEN,
            useFactory: (component: DxiTypingUserComponent) => ({
               propertyName: 'typingUsers',
               component
            }),
            deps: [DxiTypingUserComponent],
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

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
import { DxiAttachment } from './base/attachment-dxi';

import { PROPERTY_TOKEN_attachments } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-attachment',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_attachments,
           useExisting: DxiAttachmentComponent,
        }
    ],
    inputs: [
        'name',
        'size'
    ]
})
export class DxiAttachmentComponent extends DxiAttachment {

    protected get _optionPath() {
        return 'attachments';
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
    DxiAttachmentComponent
  ],
  exports: [
    DxiAttachmentComponent
  ],
})
export class DxiAttachmentModule { }

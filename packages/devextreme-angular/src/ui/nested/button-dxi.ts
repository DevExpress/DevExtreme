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
import { DxiTextEditorButton } from './base/text-editor-button-dxi';

import { PROPERTY_TOKEN_buttons } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-button',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_buttons,
           useExisting: DxiButtonComponent,
        }
    ],
    inputs: [
        'location',
        'name',
        'options',
        'cssClass',
        'disabled',
        'hint',
        'icon',
        'onClick',
        'template',
        'text',
        'visible'
    ]
})
export class DxiButtonComponent extends DxiTextEditorButton {

    protected get _optionPath() {
        return 'buttons';
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
    DxiButtonComponent
  ],
  exports: [
    DxiButtonComponent
  ],
})
export class DxiButtonModule { }

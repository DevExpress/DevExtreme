/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiTextEditorButton } from './base/text-editor-button-dxi';


@Component({
    selector: 'dxi-button',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
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
  declarations: [
    DxiButtonComponent
  ],
  exports: [
    DxiButtonComponent
  ],
})
export class DxiButtonModule { }

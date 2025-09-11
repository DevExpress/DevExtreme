/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoWebSpeechApiConfig } from './base/web-speech-api-config';


@Component({
    selector: 'dxo-web-speech-api-config',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'continuous',
        'grammars',
        'interimResults',
        'lang',
        'maxAlternatives'
    ]
})
export class DxoWebSpeechApiConfigComponent extends DxoWebSpeechApiConfig implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'webSpeechApiConfig';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  imports: [
    DxoWebSpeechApiConfigComponent
  ],
  exports: [
    DxoWebSpeechApiConfigComponent
  ],
})
export class DxoWebSpeechApiConfigModule { }

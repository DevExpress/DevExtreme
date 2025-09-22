/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-speech-to-text-web-speech-api-config',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoSpeechToTextWebSpeechApiConfigComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get continuous(): boolean {
        return this._getOption('continuous');
    }
    set continuous(value: boolean) {
        this._setOption('continuous', value);
    }

    @Input()
    get grammars(): Array<string> {
        return this._getOption('grammars');
    }
    set grammars(value: Array<string>) {
        this._setOption('grammars', value);
    }

    @Input()
    get interimResults(): boolean {
        return this._getOption('interimResults');
    }
    set interimResults(value: boolean) {
        this._setOption('interimResults', value);
    }

    @Input()
    get lang(): string {
        return this._getOption('lang');
    }
    set lang(value: string) {
        this._setOption('lang', value);
    }

    @Input()
    get maxAlternatives(): number {
        return this._getOption('maxAlternatives');
    }
    set maxAlternatives(value: number) {
        this._setOption('maxAlternatives', value);
    }


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
    DxoSpeechToTextWebSpeechApiConfigComponent
  ],
  exports: [
    DxoSpeechToTextWebSpeechApiConfigComponent
  ],
})
export class DxoSpeechToTextWebSpeechApiConfigModule { }

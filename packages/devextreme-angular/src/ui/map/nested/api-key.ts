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
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-map-api-key',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoMapApiKeyComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get azure(): string {
        return this._getOption('azure');
    }
    set azure(value: string) {
        this._setOption('azure', value);
    }

    @Input()
    get bing(): string {
        return this._getOption('bing');
    }
    set bing(value: string) {
        this._setOption('bing', value);
    }

    @Input()
    get google(): string {
        return this._getOption('google');
    }
    set google(value: string) {
        this._setOption('google', value);
    }

    @Input()
    get googleStatic(): string {
        return this._getOption('googleStatic');
    }
    set googleStatic(value: string) {
        this._setOption('googleStatic', value);
    }


    protected get _optionPath() {
        return 'apiKey';
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
  declarations: [
    DxoMapApiKeyComponent
  ],
  exports: [
    DxoMapApiKeyComponent
  ],
})
export class DxoMapApiKeyModule { }

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
    selector: 'dxo-map-provider-config',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoMapProviderConfigComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get mapId(): string {
        return this._getOption('mapId');
    }
    set mapId(value: string) {
        this._setOption('mapId', value);
    }

    @Input()
    get useAdvancedMarkers(): boolean {
        return this._getOption('useAdvancedMarkers');
    }
    set useAdvancedMarkers(value: boolean) {
        this._setOption('useAdvancedMarkers', value);
    }


    protected get _optionPath() {
        return 'providerConfig';
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
    DxoMapProviderConfigComponent
  ],
  exports: [
    DxoMapProviderConfigComponent
  ],
})
export class DxoMapProviderConfigModule { }

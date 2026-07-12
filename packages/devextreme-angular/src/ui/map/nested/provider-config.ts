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




import type { OsmGetRouteParams, OsmTileServer } from 'devextreme/ui/map';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-map-provider-config',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoMapProviderConfigComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get geocodeLocation(): ((query: string) => any) | undefined {
        return this._getOption('geocodeLocation');
    }
    set geocodeLocation(value: ((query: string) => any) | undefined) {
        this._setOption('geocodeLocation', value);
    }

    @Input()
    get getRoute(): ((params: OsmGetRouteParams) => any) | undefined {
        return this._getOption('getRoute');
    }
    set getRoute(value: ((params: OsmGetRouteParams) => any) | undefined) {
        this._setOption('getRoute', value);
    }

    @Input()
    get mapEngine(): Record<string, any> | undefined {
        return this._getOption('mapEngine');
    }
    set mapEngine(value: Record<string, any> | undefined) {
        this._setOption('mapEngine', value);
    }

    @Input()
    get mapId(): string {
        return this._getOption('mapId');
    }
    set mapId(value: string) {
        this._setOption('mapId', value);
    }

    @Input()
    get tileServer(): OsmTileServer | undefined {
        return this._getOption('tileServer');
    }
    set tileServer(value: OsmTileServer | undefined) {
        this._setOption('tileServer', value);
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
  imports: [
    DxoMapProviderConfigComponent
  ],
  exports: [
    DxoMapProviderConfigComponent
  ],
})
export class DxoMapProviderConfigModule { }

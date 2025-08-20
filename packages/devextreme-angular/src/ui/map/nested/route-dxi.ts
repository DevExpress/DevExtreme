/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    QueryList
} from '@angular/core';




import { RouteMode } from 'devextreme/ui/map';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_routes } from 'devextreme-angular/core/tokens';
import {
    PROPERTY_TOKEN_locations,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-map-route',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_routes,
           useExisting: DxiMapRouteComponent,
        }
    ]
})
export class DxiMapRouteComponent extends CollectionNestedOption {

    @ContentChildren(PROPERTY_TOKEN_locations)
    set _locationsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('locations', value);
    }
    
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get locations(): { lat?: number, lng?: number }[] {
        return this._getOption('locations');
    }
    set locations(value: { lat?: number, lng?: number }[]) {
        this._setOption('locations', value);
    }

    @Input()
    get mode(): RouteMode | string {
        return this._getOption('mode');
    }
    set mode(value: RouteMode | string) {
        this._setOption('mode', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }

    @Input()
    get weight(): number {
        return this._getOption('weight');
    }
    set weight(value: number) {
        this._setOption('weight', value);
    }


    protected get _optionPath() {
        return 'routes';
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
    DxiMapRouteComponent
  ],
  exports: [
    DxiMapRouteComponent
  ],
})
export class DxiMapRouteModule { }

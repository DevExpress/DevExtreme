/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_locations } from 'devextreme-angular/core/tokens';


@Component({
    selector: 'dxi-map-location',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_locations,
           useExisting: DxiMapLocationComponent,
        }
    ],
})
export class DxiMapLocationComponent extends CollectionNestedOption {

    
    @Input()
    get lat(): number {
        return this._getOption('lat');
    }
    set lat(value: number) {
        this._setOption('lat', value);
    }

    @Input()
    get lng(): number {
        return this._getOption('lng');
    }
    set lng(value: number) {
        this._setOption('lng', value);
    }


    protected get _optionPath() {
        return 'locations';
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
    DxiMapLocationComponent
  ],
  exports: [
    DxiMapLocationComponent
  ],
})
export class DxiMapLocationModule { }

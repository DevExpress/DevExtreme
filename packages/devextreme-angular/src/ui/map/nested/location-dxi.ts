/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-map-location',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
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
  declarations: [
    DxiMapLocationComponent
  ],
  exports: [
    DxiMapLocationComponent
  ],
})
export class DxiMapLocationModule { }

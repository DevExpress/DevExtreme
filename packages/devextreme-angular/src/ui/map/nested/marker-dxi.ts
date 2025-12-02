/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_markers } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-map-marker',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_markers,
           useExisting: DxiMapMarkerComponent,
        }
    ]
})
export class DxiMapMarkerComponent extends CollectionNestedOption {
    @Input()
    get iconSrc(): string {
        return this._getOption('iconSrc');
    }
    set iconSrc(value: string) {
        this._setOption('iconSrc', value);
    }

    @Input()
    get location(): Array<number> | string | { lat?: number, lng?: number }[] {
        return this._getOption('location');
    }
    set location(value: Array<number> | string | { lat?: number, lng?: number }[]) {
        this._setOption('location', value);
    }

    @Input()
    get onClick(): Function {
        return this._getOption('onClick');
    }
    set onClick(value: Function) {
        this._setOption('onClick', value);
    }

    @Input()
    get tooltip(): string | { isShown?: boolean, text?: string } {
        return this._getOption('tooltip');
    }
    set tooltip(value: string | { isShown?: boolean, text?: string }) {
        this._setOption('tooltip', value);
    }


    protected get _optionPath() {
        return 'markers';
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
    DxiMapMarkerComponent
  ],
  exports: [
    DxiMapMarkerComponent
  ],
})
export class DxiMapMarkerModule { }

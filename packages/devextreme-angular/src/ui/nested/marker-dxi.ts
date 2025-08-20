/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    QueryList,
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_markers } from 'devextreme-angular/core/tokens';

import {
    PROPERTY_TOKEN_location,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-marker',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_markers,
           useExisting: DxiMarkerComponent,
        }
    ],
})
export class DxiMarkerComponent extends CollectionNestedOption {

    @ContentChildren(PROPERTY_TOKEN_location)
    set _locationContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('location', value);
    }
    
    @Input()
    get iconSrc(): string {
        return this._getOption('iconSrc');
    }
    set iconSrc(value: string) {
        this._setOption('iconSrc', value);
    }

    @Input()
    get location(): string | Array<number | { lat?: number, lng?: number }> {
        return this._getOption('location');
    }
    set location(value: string | Array<number | { lat?: number, lng?: number }>) {
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
    DxiMarkerComponent
  ],
  exports: [
    DxiMarkerComponent
  ],
})
export class DxiMarkerModule { }

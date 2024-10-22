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
    selector: 'dxi-map-marker',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
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
    get location(): Array<number> | Record<string, any> | string | { lat: number, lng: number }[] {
        return this._getOption('location');
    }
    set location(value: Array<number> | Record<string, any> | string | { lat: number, lng: number }[]) {
        this._setOption('location', value);
    }

    @Input()
    get onClick(): (() => void) {
        return this._getOption('onClick');
    }
    set onClick(value: (() => void)) {
        this._setOption('onClick', value);
    }

    @Input()
    get tooltip(): Record<string, any> | string | { isShown: boolean, text: string } {
        return this._getOption('tooltip');
    }
    set tooltip(value: Record<string, any> | string | { isShown: boolean, text: string }) {
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
  declarations: [
    DxiMapMarkerComponent
  ],
  exports: [
    DxiMapMarkerComponent
  ],
})
export class DxiMapMarkerModule { }

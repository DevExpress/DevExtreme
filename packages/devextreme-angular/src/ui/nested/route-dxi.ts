/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';
import { DxiLocationComponent } from './location-dxi';


@Component({
    selector: 'dxi-route',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiRouteComponent extends CollectionNestedOption {
    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get locations(): Array<any | { lat?: number, lng?: number }> {
        return this._getOption('locations');
    }
    set locations(value: Array<any | { lat?: number, lng?: number }>) {
        this._setOption('locations', value);
    }

    @Input()
    get mode(): string {
        return this._getOption('mode');
    }
    set mode(value: string) {
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


    @ContentChildren(forwardRef(() => DxiLocationComponent))
    get locationsChildren(): QueryList<DxiLocationComponent> {
        return this._getOption('locations');
    }
    set locationsChildren(value) {
        this.setChildren('locations', value);
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
    DxiRouteComponent
  ],
  exports: [
    DxiRouteComponent
  ],
})
export class DxiRouteModule { }

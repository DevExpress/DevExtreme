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
    selector: 'dxi-marker',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiMarkerComponent extends CollectionNestedOption {
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


    @ContentChildren(forwardRef(() => DxiLocationComponent))
    get locationChildren(): QueryList<DxiLocationComponent> {
        return this._getOption('location');
    }
    set locationChildren(value) {
        this.setChildren('location', value);
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
    DxiMarkerComponent
  ],
  exports: [
    DxiMarkerComponent
  ],
})
export class DxiMarkerModule { }

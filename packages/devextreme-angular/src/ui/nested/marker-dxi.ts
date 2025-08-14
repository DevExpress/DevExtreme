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
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxi-marker',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: СOLLECTION_NESTED_OPTION_TOKEN,
            useFactory: (component: DxiMarkerComponent) => ({
               propertyName: 'markers',
               component
            }),
            deps: [DxiMarkerComponent],
         }
    ],
})
export class DxiMarkerComponent extends CollectionNestedOption {

    @ContentChildren(СOLLECTION_NESTED_OPTION_TOKEN)
    set _CollectionOptionChildren(value: QueryList<{ propertyName: string, component: CollectionNestedOption }>) {
        this._setCollectionOptionChildren(value);
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

/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { dxButtonOptions } from 'devextreme/ui/button';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-color-box-button',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiColorBoxButtonComponent extends CollectionNestedOption {
    @Input()
    get location(): "after" | "before" {
        return this._getOption('location');
    }
    set location(value: "after" | "before") {
        this._setOption('location', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    @Input()
    get options(): dxButtonOptions {
        return this._getOption('options');
    }
    set options(value: dxButtonOptions) {
        this._setOption('options', value);
    }


    protected get _optionPath() {
        return 'buttons';
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
    DxiColorBoxButtonComponent
  ],
  exports: [
    DxiColorBoxButtonComponent
  ],
})
export class DxiColorBoxButtonModule { }

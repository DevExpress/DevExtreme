/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import type { TextEditorButtonLocation } from 'devextreme/common';
import type { dxButtonOptions } from 'devextreme/ui/button';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';

import { PROPERTY_TOKEN_buttons } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-color-box-button',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_buttons,
           useExisting: DxiColorBoxButtonComponent,
        }
    ]
})
export class DxiColorBoxButtonComponent extends CollectionNestedOption {
    @Input()
    get location(): TextEditorButtonLocation {
        return this._getOption('location');
    }
    set location(value: TextEditorButtonLocation) {
        this._setOption('location', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
        this._setOption('name', value);
    }

    @Input()
    get options(): dxButtonOptions | undefined {
        return this._getOption('options');
    }
    set options(value: dxButtonOptions | undefined) {
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
  imports: [
    DxiColorBoxButtonComponent
  ],
  exports: [
    DxiColorBoxButtonComponent
  ],
})
export class DxiColorBoxButtonModule { }

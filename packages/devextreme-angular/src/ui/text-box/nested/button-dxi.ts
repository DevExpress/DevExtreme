/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { TextEditorButtonLocation } from 'devextreme/common';
import { Properties as dxButtonOptions } from 'devextreme/ui/button';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-button-text-box',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiButtonTextBoxComponent extends CollectionNestedOption {
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
  declarations: [
    DxiButtonTextBoxComponent
  ],
  exports: [
    DxiButtonTextBoxComponent
  ],
})
export class DxiButtonTextBoxModule { }

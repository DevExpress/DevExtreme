/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { HatchDirection } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-selection-style',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSelectionStyleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined } {
        return this._getOption('border');
    }
    set border(value: { color?: string | undefined, visible?: boolean | undefined, width?: number | undefined }) {
        this._setOption('border', value);
    }

    @Input()
    get hatching(): { direction?: HatchDirection, opacity?: number, step?: number, width?: number } {
        return this._getOption('hatching');
    }
    set hatching(value: { direction?: HatchDirection, opacity?: number, step?: number, width?: number }) {
        this._setOption('hatching', value);
    }


    protected get _optionPath() {
        return 'selectionStyle';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoSelectionStyleComponent
  ],
  exports: [
    DxoSelectionStyleComponent
  ],
})
export class DxoSelectionStyleModule { }

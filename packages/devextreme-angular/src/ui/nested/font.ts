/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoVizFont } from './base/viz-font';


@Component({
    selector: 'dxo-font',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'color',
        'family',
        'opacity',
        'size',
        'weight'
    ]
})
export class DxoFontComponent extends DxoVizFont implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'font';
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
    DxoFontComponent
  ],
  exports: [
    DxoFontComponent
  ],
})
export class DxoFontModule { }

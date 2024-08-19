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
import { DxoVectorMapProjectionConfig } from './base/vector-map-projection-config';


@Component({
    selector: 'dxo-projection',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'aspectRatio',
        'from',
        'to'
    ]
})
export class DxoProjectionComponent extends DxoVectorMapProjectionConfig implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'projection';
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
    DxoProjectionComponent
  ],
  exports: [
    DxoProjectionComponent
  ],
})
export class DxoProjectionModule { }

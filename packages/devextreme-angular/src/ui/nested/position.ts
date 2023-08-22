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
import { DxoPositionConfig } from './base/position-config';


@Component({
    selector: 'dxo-position',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'at',
        'boundary',
        'boundaryOffset',
        'collision',
        'my',
        'of',
        'offset'
    ]
})
export class DxoPositionComponent extends DxoPositionConfig implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'position';
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
    DxoPositionComponent
  ],
  exports: [
    DxoPositionComponent
  ],
})
export class DxoPositionModule { }

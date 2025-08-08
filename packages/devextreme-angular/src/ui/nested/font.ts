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
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoVizFont } from './base/viz-font';

@Component({
    selector: 'dxo-font',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoFontComponent) => ({
                propertyName: 'font',
                className: 'DxoFontComponent',
                component
            }),
            deps: [DxoFontComponent],
         }
         ],
    inputs: [
        'color',
        'family',
        'opacity',
        'size',
        'weight'
    ]
})
export class DxoFontComponent extends DxoVizFont implements OnDestroy, OnInit {

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
  imports: [
    DxoFontComponent
  ],
  exports: [
    DxoFontComponent
  ],
})
export class DxoFontModule { }

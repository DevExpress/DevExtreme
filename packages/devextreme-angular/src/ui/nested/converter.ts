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
import { DxoConverter } from './base/converter';


@Component({
    selector: 'dxo-converter',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'fromHtml',
        'toHtml'
    ]
})
export class DxoConverterComponent extends DxoConverter implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'converter';
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
    DxoConverterComponent
  ],
  exports: [
    DxoConverterComponent
  ],
})
export class DxoConverterModule { }

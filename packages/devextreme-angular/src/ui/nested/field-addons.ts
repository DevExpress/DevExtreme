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
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoFieldAddons } from './base/field-addons';


@Component({
    selector: 'dxo-field-addons',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'afterTemplate',
        'beforeTemplate'
    ]
})
export class DxoFieldAddonsComponent extends DxoFieldAddons implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'fieldAddons';
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
    DxoFieldAddonsComponent
  ],
  exports: [
    DxoFieldAddonsComponent
  ],
})
export class DxoFieldAddonsModule { }

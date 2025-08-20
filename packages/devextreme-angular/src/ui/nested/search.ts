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
import { DxoColumnChooserSearchConfig } from './base/column-chooser-search-config';


@Component({
    selector: 'dxo-search',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'editorOptions',
        'enabled',
        'timeout',
        'mode',
        'searchExpr'
    ]
})
export class DxoSearchComponent extends DxoColumnChooserSearchConfig implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'search';
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
    DxoSearchComponent
  ],
  exports: [
    DxoSearchComponent
  ],
})
export class DxoSearchModule { }

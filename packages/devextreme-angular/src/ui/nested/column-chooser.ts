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
import { DxoColumnChooser } from './base/column-chooser';


@Component({
    selector: 'dxo-column-chooser',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'allowSearch',
        'container',
        'emptyPanelText',
        'enabled',
        'height',
        'mode',
        'position',
        'search',
        'searchTimeout',
        'selection',
        'sortOrder',
        'title',
        'width'
    ]
})
export class DxoColumnChooserComponent extends DxoColumnChooser implements OnDestroy, OnInit  {

    

    protected get _optionPath() {
        return 'columnChooser';
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
    DxoColumnChooserComponent
  ],
  exports: [
    DxoColumnChooserComponent
  ],
})
export class DxoColumnChooserModule { }

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
import { DxoColumnChooserSelectionConfig } from './base/column-chooser-selection-config';


@Component({
    selector: 'dxo-selection',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'allowSelectAll',
        'recursive',
        'selectByClick',
        'deferred',
        'mode',
        'selectAllMode',
        'showCheckBoxesMode'
    ]
})
export class DxoSelectionComponent extends DxoColumnChooserSelectionConfig implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'selection';
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
    DxoSelectionComponent
  ],
  exports: [
    DxoSelectionComponent
  ],
})
export class DxoSelectionModule { }

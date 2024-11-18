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




import { Format } from 'devextreme/common/core/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-range-selector-marker-label',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorMarkerLabelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customizeText(): ((markerValue: { value: Date | number, valueText: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((markerValue: { value: Date | number, valueText: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get format(): Format | undefined {
        return this._getOption('format');
    }
    set format(value: Format | undefined) {
        this._setOption('format', value);
    }


    protected get _optionPath() {
        return 'label';
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
    DxoRangeSelectorMarkerLabelComponent
  ],
  exports: [
    DxoRangeSelectorMarkerLabelComponent
  ],
})
export class DxoRangeSelectorMarkerLabelModule { }

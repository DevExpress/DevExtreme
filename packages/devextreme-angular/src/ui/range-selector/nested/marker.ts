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




import * as LocalizationTypes from 'devextreme/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-range-selector-marker',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorMarkerComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get label(): Record<string, any> | { customizeText: ((markerValue: { value: Date | number, valueText: string }) => string), format: LocalizationTypes.Format } {
        return this._getOption('label');
    }
    set label(value: Record<string, any> | { customizeText: ((markerValue: { value: Date | number, valueText: string }) => string), format: LocalizationTypes.Format }) {
        this._setOption('label', value);
    }

    @Input()
    get separatorHeight(): number {
        return this._getOption('separatorHeight');
    }
    set separatorHeight(value: number) {
        this._setOption('separatorHeight', value);
    }

    @Input()
    get textLeftIndent(): number {
        return this._getOption('textLeftIndent');
    }
    set textLeftIndent(value: number) {
        this._setOption('textLeftIndent', value);
    }

    @Input()
    get textTopIndent(): number {
        return this._getOption('textTopIndent');
    }
    set textTopIndent(value: number) {
        this._setOption('textTopIndent', value);
    }

    @Input()
    get topIndent(): number {
        return this._getOption('topIndent');
    }
    set topIndent(value: number) {
        this._setOption('topIndent', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'marker';
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
    DxoRangeSelectorMarkerComponent
  ],
  exports: [
    DxoRangeSelectorMarkerComponent
  ],
})
export class DxoRangeSelectorMarkerModule { }

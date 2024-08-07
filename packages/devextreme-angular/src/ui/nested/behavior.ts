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




import { SliderValueChangeMode } from 'devextreme/common';
import { ValueChangedCallMode } from 'devextreme/viz/range_selector';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-behavior',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoBehaviorComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowSlidersSwap(): boolean {
        return this._getOption('allowSlidersSwap');
    }
    set allowSlidersSwap(value: boolean) {
        this._setOption('allowSlidersSwap', value);
    }

    @Input()
    get animationEnabled(): boolean {
        return this._getOption('animationEnabled');
    }
    set animationEnabled(value: boolean) {
        this._setOption('animationEnabled', value);
    }

    @Input()
    get callValueChanged(): ValueChangedCallMode {
        return this._getOption('callValueChanged');
    }
    set callValueChanged(value: ValueChangedCallMode) {
        this._setOption('callValueChanged', value);
    }

    @Input()
    get manualRangeSelectionEnabled(): boolean {
        return this._getOption('manualRangeSelectionEnabled');
    }
    set manualRangeSelectionEnabled(value: boolean) {
        this._setOption('manualRangeSelectionEnabled', value);
    }

    @Input()
    get moveSelectedRangeByClick(): boolean {
        return this._getOption('moveSelectedRangeByClick');
    }
    set moveSelectedRangeByClick(value: boolean) {
        this._setOption('moveSelectedRangeByClick', value);
    }

    @Input()
    get snapToTicks(): boolean {
        return this._getOption('snapToTicks');
    }
    set snapToTicks(value: boolean) {
        this._setOption('snapToTicks', value);
    }

    @Input()
    get valueChangeMode(): SliderValueChangeMode {
        return this._getOption('valueChangeMode');
    }
    set valueChangeMode(value: SliderValueChangeMode) {
        this._setOption('valueChangeMode', value);
    }


    protected get _optionPath() {
        return 'behavior';
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
    DxoBehaviorComponent
  ],
  exports: [
    DxoBehaviorComponent
  ],
})
export class DxoBehaviorModule { }

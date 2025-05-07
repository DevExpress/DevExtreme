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
import { VerticalEdge, TooltipShowMode } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-slider-tooltip',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSliderTooltipComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get format(): Format {
        return this._getOption('format');
    }
    set format(value: Format) {
        this._setOption('format', value);
    }

    @Input()
    get position(): VerticalEdge {
        return this._getOption('position');
    }
    set position(value: VerticalEdge) {
        this._setOption('position', value);
    }

    @Input()
    get showMode(): TooltipShowMode {
        return this._getOption('showMode');
    }
    set showMode(value: TooltipShowMode) {
        this._setOption('showMode', value);
    }


    protected get _optionPath() {
        return 'tooltip';
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
    DxoSliderTooltipComponent
  ],
  exports: [
    DxoSliderTooltipComponent
  ],
})
export class DxoSliderTooltipModule { }

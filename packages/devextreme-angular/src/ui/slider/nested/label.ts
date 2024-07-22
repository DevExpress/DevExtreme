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




import { VerticalEdge } from 'devextreme/common';
import { Format } from 'devextreme/localization';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-label-slider',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoLabelSliderComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get format(): Format | string {
        return this._getOption('format');
    }
    set format(value: Format | string) {
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
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
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
    DxoLabelSliderComponent
  ],
  exports: [
    DxoLabelSliderComponent
  ],
})
export class DxoLabelSliderModule { }

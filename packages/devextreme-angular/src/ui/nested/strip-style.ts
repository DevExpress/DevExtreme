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




import { HorizontalAlignment, VerticalAlignment } from 'devextreme/common';
import { Font } from 'devextreme/viz/core/base_widget';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-strip-style',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoStripStyleComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get label(): { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment } | { font?: Font } {
        return this._getOption('label');
    }
    set label(value: { font?: Font, horizontalAlignment?: HorizontalAlignment, verticalAlignment?: VerticalAlignment } | { font?: Font }) {
        this._setOption('label', value);
    }

    @Input()
    get paddingLeftRight(): number {
        return this._getOption('paddingLeftRight');
    }
    set paddingLeftRight(value: number) {
        this._setOption('paddingLeftRight', value);
    }

    @Input()
    get paddingTopBottom(): number {
        return this._getOption('paddingTopBottom');
    }
    set paddingTopBottom(value: number) {
        this._setOption('paddingTopBottom', value);
    }


    protected get _optionPath() {
        return 'stripStyle';
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
    DxoStripStyleComponent
  ],
  exports: [
    DxoStripStyleComponent
  ],
})
export class DxoStripStyleModule { }

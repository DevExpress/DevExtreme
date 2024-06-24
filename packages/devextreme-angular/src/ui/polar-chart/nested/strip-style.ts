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




import { Font } from 'devextreme/common/charts';

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
    get label(): { font?: Font } {
        return this._getOption('label');
    }
    set label(value: { font?: Font }) {
        this._setOption('label', value);
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

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
import { DxoSchedulerScrolling } from './base/scheduler-scrolling';


@Component({
    selector: 'dxo-scrolling',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'columnRenderingMode',
        'mode',
        'preloadEnabled',
        'renderAsync',
        'rowRenderingMode',
        'scrollByContent',
        'scrollByThumb',
        'showScrollbar',
        'useNative'
    ]
})
export class DxoScrollingComponent extends DxoSchedulerScrolling implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'scrolling';
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
    DxoScrollingComponent
  ],
  exports: [
    DxoScrollingComponent
  ],
})
export class DxoScrollingModule { }

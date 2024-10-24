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





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-pivot-grid-scrolling',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPivotGridScrollingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get mode(): "standard" | "virtual" {
        return this._getOption('mode');
    }
    set mode(value: "standard" | "virtual") {
        this._setOption('mode', value);
    }

    @Input()
    get useNative(): boolean | "auto" {
        return this._getOption('useNative');
    }
    set useNative(value: boolean | "auto") {
        this._setOption('useNative', value);
    }


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
    DxoPivotGridScrollingComponent
  ],
  exports: [
    DxoPivotGridScrollingComponent
  ],
})
export class DxoPivotGridScrollingModule { }

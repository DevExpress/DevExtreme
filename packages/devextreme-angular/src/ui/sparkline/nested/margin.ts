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
    selector: 'dxo-sparkline-margin',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSparklineMarginComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get bottom(): number {
        return this._getOption('bottom');
    }
    set bottom(value: number) {
        this._setOption('bottom', value);
    }

    @Input()
    get left(): number {
        return this._getOption('left');
    }
    set left(value: number) {
        this._setOption('left', value);
    }

    @Input()
    get right(): number {
        return this._getOption('right');
    }
    set right(value: number) {
        this._setOption('right', value);
    }

    @Input()
    get top(): number {
        return this._getOption('top');
    }
    set top(value: number) {
        this._setOption('top', value);
    }


    protected get _optionPath() {
        return 'margin';
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
    DxoSparklineMarginComponent
  ],
  exports: [
    DxoSparklineMarginComponent
  ],
})
export class DxoSparklineMarginModule { }

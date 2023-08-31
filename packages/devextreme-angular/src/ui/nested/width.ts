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
    selector: 'dxo-width',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoWidthComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get rangeMaxPoint(): number | undefined {
        return this._getOption('rangeMaxPoint');
    }
    set rangeMaxPoint(value: number | undefined) {
        this._setOption('rangeMaxPoint', value);
    }

    @Input()
    get rangeMinPoint(): number | undefined {
        return this._getOption('rangeMinPoint');
    }
    set rangeMinPoint(value: number | undefined) {
        this._setOption('rangeMinPoint', value);
    }

    @Input()
    get end(): number {
        return this._getOption('end');
    }
    set end(value: number) {
        this._setOption('end', value);
    }

    @Input()
    get start(): number {
        return this._getOption('start');
    }
    set start(value: number) {
        this._setOption('start', value);
    }


    protected get _optionPath() {
        return 'width';
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
    DxoWidthComponent
  ],
  exports: [
    DxoWidthComponent
  ],
})
export class DxoWidthModule { }

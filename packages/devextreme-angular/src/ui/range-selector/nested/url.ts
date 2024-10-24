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
    selector: 'dxo-range-selector-url',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRangeSelectorUrlComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get rangeMaxPoint(): string {
        return this._getOption('rangeMaxPoint');
    }
    set rangeMaxPoint(value: string) {
        this._setOption('rangeMaxPoint', value);
    }

    @Input()
    get rangeMinPoint(): string {
        return this._getOption('rangeMinPoint');
    }
    set rangeMinPoint(value: string) {
        this._setOption('rangeMinPoint', value);
    }


    protected get _optionPath() {
        return 'url';
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
    DxoRangeSelectorUrlComponent
  ],
  exports: [
    DxoRangeSelectorUrlComponent
  ],
})
export class DxoRangeSelectorUrlModule { }

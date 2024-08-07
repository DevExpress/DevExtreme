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
    selector: 'dxo-height',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoHeightComponent extends NestedOption implements OnDestroy, OnInit  {
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


    protected get _optionPath() {
        return 'height';
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
    DxoHeightComponent
  ],
  exports: [
    DxoHeightComponent
  ],
})
export class DxoHeightModule { }

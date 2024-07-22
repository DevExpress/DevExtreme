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
    selector: 'dxo-source-vector-map',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSourceVectorMapComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get grouping(): string {
        return this._getOption('grouping');
    }
    set grouping(value: string) {
        this._setOption('grouping', value);
    }

    @Input()
    get layer(): string {
        return this._getOption('layer');
    }
    set layer(value: string) {
        this._setOption('layer', value);
    }


    protected get _optionPath() {
        return 'source';
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
    DxoSourceVectorMapComponent
  ],
  exports: [
    DxoSourceVectorMapComponent
  ],
})
export class DxoSourceVectorMapModule { }

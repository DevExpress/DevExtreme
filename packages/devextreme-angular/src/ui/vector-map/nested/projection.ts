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
    selector: 'dxo-vector-map-projection',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoVectorMapProjectionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get aspectRatio(): number {
        return this._getOption('aspectRatio');
    }
    set aspectRatio(value: number) {
        this._setOption('aspectRatio', value);
    }

    @Input()
    get from(): Function {
        return this._getOption('from');
    }
    set from(value: Function) {
        this._setOption('from', value);
    }

    @Input()
    get to(): Function {
        return this._getOption('to');
    }
    set to(value: Function) {
        this._setOption('to', value);
    }


    protected get _optionPath() {
        return 'projection';
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
    DxoVectorMapProjectionComponent
  ],
  exports: [
    DxoVectorMapProjectionComponent
  ],
})
export class DxoVectorMapProjectionModule { }

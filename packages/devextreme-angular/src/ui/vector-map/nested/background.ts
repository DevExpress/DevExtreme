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
    selector: 'dxo-vector-map-background',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoVectorMapBackgroundComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get borderColor(): string {
        return this._getOption('borderColor');
    }
    set borderColor(value: string) {
        this._setOption('borderColor', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }


    protected get _optionPath() {
        return 'background';
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
    DxoVectorMapBackgroundComponent
  ],
  exports: [
    DxoVectorMapBackgroundComponent
  ],
})
export class DxoVectorMapBackgroundModule { }

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
    selector: 'dxo-drop-down-button-at',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDropDownButtonAtComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get x(): "center" | "left" | "right" {
        return this._getOption('x');
    }
    set x(value: "center" | "left" | "right") {
        this._setOption('x', value);
    }

    @Input()
    get y(): "bottom" | "center" | "top" {
        return this._getOption('y');
    }
    set y(value: "bottom" | "center" | "top") {
        this._setOption('y', value);
    }


    protected get _optionPath() {
        return 'at';
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
    DxoDropDownButtonAtComponent
  ],
  exports: [
    DxoDropDownButtonAtComponent
  ],
})
export class DxoDropDownButtonAtModule { }

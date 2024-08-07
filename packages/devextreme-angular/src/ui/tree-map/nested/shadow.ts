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
    selector: 'dxo-shadow',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoShadowComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get blur(): number {
        return this._getOption('blur');
    }
    set blur(value: number) {
        this._setOption('blur', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get offsetX(): number {
        return this._getOption('offsetX');
    }
    set offsetX(value: number) {
        this._setOption('offsetX', value);
    }

    @Input()
    get offsetY(): number {
        return this._getOption('offsetY');
    }
    set offsetY(value: number) {
        this._setOption('offsetY', value);
    }

    @Input()
    get opacity(): number {
        return this._getOption('opacity');
    }
    set opacity(value: number) {
        this._setOption('opacity', value);
    }


    protected get _optionPath() {
        return 'shadow';
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
    DxoShadowComponent
  ],
  exports: [
    DxoShadowComponent
  ],
})
export class DxoShadowModule { }

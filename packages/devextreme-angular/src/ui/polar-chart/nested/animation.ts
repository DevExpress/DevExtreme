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
    selector: 'dxo-polar-chart-animation',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPolarChartAnimationComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get duration(): number {
        return this._getOption('duration');
    }
    set duration(value: number) {
        this._setOption('duration', value);
    }

    @Input()
    get easing(): "easeOutCubic" | "linear" {
        return this._getOption('easing');
    }
    set easing(value: "easeOutCubic" | "linear") {
        this._setOption('easing', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get maxPointCountSupported(): number {
        return this._getOption('maxPointCountSupported');
    }
    set maxPointCountSupported(value: number) {
        this._setOption('maxPointCountSupported', value);
    }


    protected get _optionPath() {
        return 'animation';
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
    DxoPolarChartAnimationComponent
  ],
  exports: [
    DxoPolarChartAnimationComponent
  ],
})
export class DxoPolarChartAnimationModule { }

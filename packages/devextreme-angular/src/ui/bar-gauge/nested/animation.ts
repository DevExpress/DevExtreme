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




import { AnimationEaseMode } from 'devextreme/common/charts';

import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-bar-gauge-animation',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoBarGaugeAnimationComponent) => ({
                propertyName: 'animation',
                className: 'DxoBarGaugeAnimationComponent',
                component
            }),
            deps: [DxoBarGaugeAnimationComponent],
         }
         ]
})
export class DxoBarGaugeAnimationComponent extends NestedOption implements OnDestroy, OnInit {
    @Input()
    get duration(): number {
        return this._getOption('duration');
    }
    set duration(value: number) {
        this._setOption('duration', value);
    }

    @Input()
    get easing(): AnimationEaseMode {
        return this._getOption('easing');
    }
    set easing(value: AnimationEaseMode) {
        this._setOption('easing', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
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
  imports: [
    DxoBarGaugeAnimationComponent
  ],
  exports: [
    DxoBarGaugeAnimationComponent
  ],
})
export class DxoBarGaugeAnimationModule { }

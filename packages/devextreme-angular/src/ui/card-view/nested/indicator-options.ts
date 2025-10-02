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




import { LoadingAnimationType } from 'devextreme/ui/load_indicator';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-card-view-indicator-options',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoCardViewIndicatorOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get animationType(): LoadingAnimationType {
        return this._getOption('animationType');
    }
    set animationType(value: LoadingAnimationType) {
        this._setOption('animationType', value);
    }

    @Input()
    get height(): number | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | string | undefined) {
        this._setOption('height', value);
    }

    @Input()
    get indicatorSrc(): string {
        return this._getOption('indicatorSrc');
    }
    set indicatorSrc(value: string) {
        this._setOption('indicatorSrc', value);
    }

    @Input()
    get width(): number | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | string | undefined) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'indicatorOptions';
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
    DxoCardViewIndicatorOptionsComponent
  ],
  exports: [
    DxoCardViewIndicatorOptionsComponent
  ],
})
export class DxoCardViewIndicatorOptionsModule { }

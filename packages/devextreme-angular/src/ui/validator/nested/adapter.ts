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
    selector: 'dxo-validator-adapter',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoValidatorAdapterComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get applyValidationResults(): (() => void) {
        return this._getOption('applyValidationResults');
    }
    set applyValidationResults(value: (() => void)) {
        this._setOption('applyValidationResults', value);
    }

    @Input()
    get bypass(): (() => void) {
        return this._getOption('bypass');
    }
    set bypass(value: (() => void)) {
        this._setOption('bypass', value);
    }

    @Input()
    get focus(): (() => void) {
        return this._getOption('focus');
    }
    set focus(value: (() => void)) {
        this._setOption('focus', value);
    }

    @Input()
    get getValue(): (() => void) {
        return this._getOption('getValue');
    }
    set getValue(value: (() => void)) {
        this._setOption('getValue', value);
    }

    @Input()
    get reset(): (() => void) {
        return this._getOption('reset');
    }
    set reset(value: (() => void)) {
        this._setOption('reset', value);
    }

    @Input()
    get validationRequestsCallbacks(): Array<(() => void)> {
        return this._getOption('validationRequestsCallbacks');
    }
    set validationRequestsCallbacks(value: Array<(() => void)>) {
        this._setOption('validationRequestsCallbacks', value);
    }


    protected get _optionPath() {
        return 'adapter';
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
    DxoValidatorAdapterComponent
  ],
  exports: [
    DxoValidatorAdapterComponent
  ],
})
export class DxoValidatorAdapterModule { }

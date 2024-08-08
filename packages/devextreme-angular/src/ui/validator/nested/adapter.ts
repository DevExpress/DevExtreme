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
    get applyValidationResults(): Function {
        return this._getOption('applyValidationResults');
    }
    set applyValidationResults(value: Function) {
        this._setOption('applyValidationResults', value);
    }

    @Input()
    get bypass(): Function {
        return this._getOption('bypass');
    }
    set bypass(value: Function) {
        this._setOption('bypass', value);
    }

    @Input()
    get focus(): Function {
        return this._getOption('focus');
    }
    set focus(value: Function) {
        this._setOption('focus', value);
    }

    @Input()
    get getValue(): Function {
        return this._getOption('getValue');
    }
    set getValue(value: Function) {
        this._setOption('getValue', value);
    }

    @Input()
    get reset(): Function {
        return this._getOption('reset');
    }
    set reset(value: Function) {
        this._setOption('reset', value);
    }

    @Input()
    get validationRequestsCallbacks(): Array<Function> {
        return this._getOption('validationRequestsCallbacks');
    }
    set validationRequestsCallbacks(value: Array<Function>) {
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

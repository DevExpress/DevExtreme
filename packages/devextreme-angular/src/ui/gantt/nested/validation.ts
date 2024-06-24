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
    selector: 'dxo-validation',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoValidationComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get autoUpdateParentTasks(): boolean {
        return this._getOption('autoUpdateParentTasks');
    }
    set autoUpdateParentTasks(value: boolean) {
        this._setOption('autoUpdateParentTasks', value);
    }

    @Input()
    get enablePredecessorGap(): boolean {
        return this._getOption('enablePredecessorGap');
    }
    set enablePredecessorGap(value: boolean) {
        this._setOption('enablePredecessorGap', value);
    }

    @Input()
    get validateDependencies(): boolean {
        return this._getOption('validateDependencies');
    }
    set validateDependencies(value: boolean) {
        this._setOption('validateDependencies', value);
    }


    protected get _optionPath() {
        return 'validation';
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
    DxoValidationComponent
  ],
  exports: [
    DxoValidationComponent
  ],
})
export class DxoValidationModule { }

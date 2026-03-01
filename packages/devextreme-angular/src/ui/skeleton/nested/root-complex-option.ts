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
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-skeleton-root-complex-option',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoSkeletonRootComplexOptionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get prop1(): string {
        return this._getOption('prop1');
    }
    set prop1(value: string) {
        this._setOption('prop1', value);
    }

    @Input()
    get prop2(): boolean {
        return this._getOption('prop2');
    }
    set prop2(value: boolean) {
        this._setOption('prop2', value);
    }


    protected get _optionPath() {
        return 'rootComplexOption';
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
    DxoSkeletonRootComplexOptionComponent
  ],
  exports: [
    DxoSkeletonRootComplexOptionComponent
  ],
})
export class DxoSkeletonRootComplexOptionModule { }

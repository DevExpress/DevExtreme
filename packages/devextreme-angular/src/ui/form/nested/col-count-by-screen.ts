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
    selector: 'dxo-form-col-count-by-screen',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFormColCountByScreenComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get lg(): number {
        return this._getOption('lg');
    }
    set lg(value: number) {
        this._setOption('lg', value);
    }

    @Input()
    get md(): number {
        return this._getOption('md');
    }
    set md(value: number) {
        this._setOption('md', value);
    }

    @Input()
    get sm(): number {
        return this._getOption('sm');
    }
    set sm(value: number) {
        this._setOption('sm', value);
    }

    @Input()
    get xs(): number {
        return this._getOption('xs');
    }
    set xs(value: number) {
        this._setOption('xs', value);
    }


    protected get _optionPath() {
        return 'colCountByScreen';
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
    DxoFormColCountByScreenComponent
  ],
  exports: [
    DxoFormColCountByScreenComponent
  ],
})
export class DxoFormColCountByScreenModule { }

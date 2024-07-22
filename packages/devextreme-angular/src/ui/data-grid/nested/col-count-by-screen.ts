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
    selector: 'dxo-col-count-by-screen-data-grid',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoColCountByScreenDataGridComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get lg(): number | undefined {
        return this._getOption('lg');
    }
    set lg(value: number | undefined) {
        this._setOption('lg', value);
    }

    @Input()
    get md(): number | undefined {
        return this._getOption('md');
    }
    set md(value: number | undefined) {
        this._setOption('md', value);
    }

    @Input()
    get sm(): number | undefined {
        return this._getOption('sm');
    }
    set sm(value: number | undefined) {
        this._setOption('sm', value);
    }

    @Input()
    get xs(): number | undefined {
        return this._getOption('xs');
    }
    set xs(value: number | undefined) {
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
    DxoColCountByScreenDataGridComponent
  ],
  exports: [
    DxoColCountByScreenDataGridComponent
  ],
})
export class DxoColCountByScreenDataGridModule { }

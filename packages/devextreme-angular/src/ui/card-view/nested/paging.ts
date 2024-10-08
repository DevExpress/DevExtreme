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
    selector: 'dxo-card-view-paging',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCardViewPagingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get pageIndex(): number {
        return this._getOption('pageIndex');
    }
    set pageIndex(value: number) {
        this._setOption('pageIndex', value);
    }

    @Input()
    get pageSize(): number {
        return this._getOption('pageSize');
    }
    set pageSize(value: number) {
        this._setOption('pageSize', value);
    }


    protected get _optionPath() {
        return 'paging';
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
    DxoCardViewPagingComponent
  ],
  exports: [
    DxoCardViewPagingComponent
  ],
})
export class DxoCardViewPagingModule { }

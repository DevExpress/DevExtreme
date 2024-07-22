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
    selector: 'dxo-remote-operations-data-grid',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoRemoteOperationsDataGridComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get filtering(): boolean {
        return this._getOption('filtering');
    }
    set filtering(value: boolean) {
        this._setOption('filtering', value);
    }

    @Input()
    get grouping(): boolean {
        return this._getOption('grouping');
    }
    set grouping(value: boolean) {
        this._setOption('grouping', value);
    }

    @Input()
    get groupPaging(): boolean {
        return this._getOption('groupPaging');
    }
    set groupPaging(value: boolean) {
        this._setOption('groupPaging', value);
    }

    @Input()
    get paging(): boolean {
        return this._getOption('paging');
    }
    set paging(value: boolean) {
        this._setOption('paging', value);
    }

    @Input()
    get sorting(): boolean {
        return this._getOption('sorting');
    }
    set sorting(value: boolean) {
        this._setOption('sorting', value);
    }

    @Input()
    get summary(): boolean {
        return this._getOption('summary');
    }
    set summary(value: boolean) {
        this._setOption('summary', value);
    }


    protected get _optionPath() {
        return 'remoteOperations';
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
    DxoRemoteOperationsDataGridComponent
  ],
  exports: [
    DxoRemoteOperationsDataGridComponent
  ],
})
export class DxoRemoteOperationsDataGridModule { }

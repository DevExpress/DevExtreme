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




import { GroupExpandMode } from 'devextreme/common/grids';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-grouping',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGroupingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowCollapsing(): boolean {
        return this._getOption('allowCollapsing');
    }
    set allowCollapsing(value: boolean) {
        this._setOption('allowCollapsing', value);
    }

    @Input()
    get autoExpandAll(): boolean {
        return this._getOption('autoExpandAll');
    }
    set autoExpandAll(value: boolean) {
        this._setOption('autoExpandAll', value);
    }

    @Input()
    get contextMenuEnabled(): boolean {
        return this._getOption('contextMenuEnabled');
    }
    set contextMenuEnabled(value: boolean) {
        this._setOption('contextMenuEnabled', value);
    }

    @Input()
    get expandMode(): GroupExpandMode {
        return this._getOption('expandMode');
    }
    set expandMode(value: GroupExpandMode) {
        this._setOption('expandMode', value);
    }

    @Input()
    get texts(): { groupByThisColumn?: string, groupContinuedMessage?: string, groupContinuesMessage?: string, ungroup?: string, ungroupAll?: string } {
        return this._getOption('texts');
    }
    set texts(value: { groupByThisColumn?: string, groupContinuedMessage?: string, groupContinuesMessage?: string, ungroup?: string, ungroupAll?: string }) {
        this._setOption('texts', value);
    }


    protected get _optionPath() {
        return 'grouping';
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
    DxoGroupingComponent
  ],
  exports: [
    DxoGroupingComponent
  ],
})
export class DxoGroupingModule { }

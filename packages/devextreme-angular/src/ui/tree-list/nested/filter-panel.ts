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




import { GridBase } from 'devextreme/common/grids';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tree-list-filter-panel',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListFilterPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customizeText(): ((e: { component: GridBase, filterValue: Record<string, any>, text: string }) => string) {
        return this._getOption('customizeText');
    }
    set customizeText(value: ((e: { component: GridBase, filterValue: Record<string, any>, text: string }) => string)) {
        this._setOption('customizeText', value);
    }

    @Input()
    get filterEnabled(): boolean {
        return this._getOption('filterEnabled');
    }
    set filterEnabled(value: boolean) {
        this._setOption('filterEnabled', value);
    }

    @Input()
    get texts(): Record<string, any> | { clearFilter?: string, createFilter?: string, filterEnabledHint?: string } {
        return this._getOption('texts');
    }
    set texts(value: Record<string, any> | { clearFilter?: string, createFilter?: string, filterEnabledHint?: string }) {
        this._setOption('texts', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'filterPanel';
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
    DxoTreeListFilterPanelComponent
  ],
  exports: [
    DxoTreeListFilterPanelComponent
  ],
})
export class DxoTreeListFilterPanelModule { }

/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { ChartsColor } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-chart-pane',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiChartPaneComponent extends CollectionNestedOption {
    @Input()
    get backgroundColor(): ChartsColor | string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: ChartsColor | string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): Record<string, any> | { bottom: boolean, color: string, dashStyle: "dash" | "dot" | "longDash" | "solid", left: boolean, opacity: number, right: boolean, top: boolean, visible: boolean, width: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { bottom: boolean, color: string, dashStyle: "dash" | "dot" | "longDash" | "solid", left: boolean, opacity: number, right: boolean, top: boolean, visible: boolean, width: number }) {
        this._setOption('border', value);
    }

    @Input()
    get height(): number | string {
        return this._getOption('height');
    }
    set height(value: number | string) {
        this._setOption('height', value);
    }

    @Input()
    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }


    protected get _optionPath() {
        return 'panes';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiChartPaneComponent
  ],
  exports: [
    DxiChartPaneComponent
  ],
})
export class DxiChartPaneModule { }

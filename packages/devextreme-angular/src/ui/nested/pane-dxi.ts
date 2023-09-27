/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import DevExpress from 'devextreme/bundles/dx.all';
import { DashStyle } from 'devextreme/common/charts';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-pane',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiPaneComponent extends CollectionNestedOption {
    @Input()
    get backgroundColor(): DevExpress.common.charts.ChartsColor | string {
        return this._getOption('backgroundColor');
    }
    set backgroundColor(value: DevExpress.common.charts.ChartsColor | string) {
        this._setOption('backgroundColor', value);
    }

    @Input()
    get border(): { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number } {
        return this._getOption('border');
    }
    set border(value: { bottom?: boolean, color?: string, dashStyle?: DashStyle, left?: boolean, opacity?: number | undefined, right?: boolean, top?: boolean, visible?: boolean, width?: number }) {
        this._setOption('border', value);
    }

    @Input()
    get height(): number | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | string | undefined) {
        this._setOption('height', value);
    }

    @Input()
    get name(): string | undefined {
        return this._getOption('name');
    }
    set name(value: string | undefined) {
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
    DxiPaneComponent
  ],
  exports: [
    DxiPaneComponent
  ],
})
export class DxiPaneModule { }

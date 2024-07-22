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




import { GanttScaleType } from 'devextreme/ui/gantt';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-scale-type-range-gantt',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoScaleTypeRangeGanttComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get max(): GanttScaleType {
        return this._getOption('max');
    }
    set max(value: GanttScaleType) {
        this._setOption('max', value);
    }

    @Input()
    get min(): GanttScaleType {
        return this._getOption('min');
    }
    set min(value: GanttScaleType) {
        this._setOption('min', value);
    }


    protected get _optionPath() {
        return 'scaleTypeRange';
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
    DxoScaleTypeRangeGanttComponent
  ],
  exports: [
    DxoScaleTypeRangeGanttComponent
  ],
})
export class DxoScaleTypeRangeGanttModule { }

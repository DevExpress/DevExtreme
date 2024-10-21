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
    selector: 'dxo-gantt-scale-type-range',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGanttScaleTypeRangeComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get max(): "auto" | "minutes" | "hours" | "sixHours" | "days" | "weeks" | "months" | "quarters" | "years" {
        return this._getOption('max');
    }
    set max(value: "auto" | "minutes" | "hours" | "sixHours" | "days" | "weeks" | "months" | "quarters" | "years") {
        this._setOption('max', value);
    }

    @Input()
    get min(): "auto" | "minutes" | "hours" | "sixHours" | "days" | "weeks" | "months" | "quarters" | "years" {
        return this._getOption('min');
    }
    set min(value: "auto" | "minutes" | "hours" | "sixHours" | "days" | "weeks" | "months" | "quarters" | "years") {
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
    DxoGanttScaleTypeRangeComponent
  ],
  exports: [
    DxoGanttScaleTypeRangeComponent
  ],
})
export class DxoGanttScaleTypeRangeModule { }

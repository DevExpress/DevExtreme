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
    selector: 'dxo-pie-chart-small-values-grouping',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPieChartSmallValuesGroupingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get groupName(): string {
        return this._getOption('groupName');
    }
    set groupName(value: string) {
        this._setOption('groupName', value);
    }

    @Input()
    get mode(): "none" | "smallValueThreshold" | "topN" {
        return this._getOption('mode');
    }
    set mode(value: "none" | "smallValueThreshold" | "topN") {
        this._setOption('mode', value);
    }

    @Input()
    get threshold(): number {
        return this._getOption('threshold');
    }
    set threshold(value: number) {
        this._setOption('threshold', value);
    }

    @Input()
    get topCount(): number {
        return this._getOption('topCount');
    }
    set topCount(value: number) {
        this._setOption('topCount', value);
    }


    protected get _optionPath() {
        return 'smallValuesGrouping';
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
    DxoPieChartSmallValuesGroupingComponent
  ],
  exports: [
    DxoPieChartSmallValuesGroupingComponent
  ],
})
export class DxoPieChartSmallValuesGroupingModule { }

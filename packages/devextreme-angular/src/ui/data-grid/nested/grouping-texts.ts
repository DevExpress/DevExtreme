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
    selector: 'dxo-data-grid-grouping-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridGroupingTextsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get groupByThisColumn(): string {
        return this._getOption('groupByThisColumn');
    }
    set groupByThisColumn(value: string) {
        this._setOption('groupByThisColumn', value);
    }

    @Input()
    get groupContinuedMessage(): string {
        return this._getOption('groupContinuedMessage');
    }
    set groupContinuedMessage(value: string) {
        this._setOption('groupContinuedMessage', value);
    }

    @Input()
    get groupContinuesMessage(): string {
        return this._getOption('groupContinuesMessage');
    }
    set groupContinuesMessage(value: string) {
        this._setOption('groupContinuesMessage', value);
    }

    @Input()
    get ungroup(): string {
        return this._getOption('ungroup');
    }
    set ungroup(value: string) {
        this._setOption('ungroup', value);
    }

    @Input()
    get ungroupAll(): string {
        return this._getOption('ungroupAll');
    }
    set ungroupAll(value: string) {
        this._setOption('ungroupAll', value);
    }


    protected get _optionPath() {
        return 'texts';
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
    DxoDataGridGroupingTextsComponent
  ],
  exports: [
    DxoDataGridGroupingTextsComponent
  ],
})
export class DxoDataGridGroupingTextsModule { }

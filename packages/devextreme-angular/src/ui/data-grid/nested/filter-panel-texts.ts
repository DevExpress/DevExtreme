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
    selector: 'dxo-data-grid-filter-panel-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridFilterPanelTextsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get clearFilter(): string {
        return this._getOption('clearFilter');
    }
    set clearFilter(value: string) {
        this._setOption('clearFilter', value);
    }

    @Input()
    get createFilter(): string {
        return this._getOption('createFilter');
    }
    set createFilter(value: string) {
        this._setOption('createFilter', value);
    }

    @Input()
    get filterEnabledHint(): string {
        return this._getOption('filterEnabledHint');
    }
    set filterEnabledHint(value: string) {
        this._setOption('filterEnabledHint', value);
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
    DxoDataGridFilterPanelTextsComponent
  ],
  exports: [
    DxoDataGridFilterPanelTextsComponent
  ],
})
export class DxoDataGridFilterPanelTextsModule { }

/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoFilterPanelTexts } from './base/filter-panel-texts';


@Component({
    selector: 'dxo-texts',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'fix',
        'leftPosition',
        'rightPosition',
        'stickyPosition',
        'unfix',
        'addRow',
        'cancelAllChanges',
        'cancelRowChanges',
        'confirmDeleteMessage',
        'confirmDeleteTitle',
        'deleteRow',
        'editRow',
        'saveAllChanges',
        'saveRowChanges',
        'undeleteRow',
        'validationCancelChanges',
        'exportAll',
        'exportSelectedRows',
        'exportTo',
        'clearFilter',
        'createFilter',
        'filterEnabledHint',
        'groupByThisColumn',
        'groupContinuedMessage',
        'groupContinuesMessage',
        'ungroup',
        'ungroupAll',
        'cancel',
        'emptyValue',
        'ok',
        'avg',
        'avgOtherColumn',
        'count',
        'max',
        'maxOtherColumn',
        'min',
        'minOtherColumn',
        'sum',
        'sumOtherColumn',
        'allFields',
        'columnFields',
        'dataFields',
        'filterFields',
        'rowFields',
        'columnFieldArea',
        'dataFieldArea',
        'filterFieldArea',
        'rowFieldArea',
        'collapseAll',
        'dataNotAvailable',
        'expandAll',
        'exportToExcel',
        'grandTotal',
        'noData',
        'removeAllSorting',
        'showFieldChooser',
        'sortColumnBySummary',
        'sortRowBySummary',
        'total',
        'addRowToNode'
    ]
})
export class DxoTextsComponent extends DxoFilterPanelTexts implements OnDestroy, OnInit  {

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
  imports: [
    DxoTextsComponent
  ],
  exports: [
    DxoTextsComponent
  ],
})
export class DxoTextsModule { }

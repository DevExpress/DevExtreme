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
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoGanttFilterRow } from './base/gantt-filter-row';

@Component({
    selector: 'dxo-filter-row',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoFilterRowComponent) => ({
                propertyName: 'filterRow',
                className: 'DxoFilterRowComponent',
                component
            }),
            deps: [DxoFilterRowComponent],
         }
         ],
    inputs: [
        'applyFilter',
        'applyFilterText',
        'betweenEndText',
        'betweenStartText',
        'operationDescriptions',
        'resetOperationText',
        'showAllText',
        'showOperationChooser',
        'visible'
    ]
})
export class DxoFilterRowComponent extends DxoGanttFilterRow implements OnDestroy, OnInit {

    protected get _optionPath() {
        return 'filterRow';
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
    DxoFilterRowComponent
  ],
  exports: [
    DxoFilterRowComponent
  ],
})
export class DxoFilterRowModule { }

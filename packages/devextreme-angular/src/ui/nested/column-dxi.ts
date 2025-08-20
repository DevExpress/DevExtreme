/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Output,
    EventEmitter,
    ContentChildren,
    QueryList
} from '@angular/core';




import { SortOrder } from 'devextreme/common';
import { SelectedFilterOperation } from 'devextreme/common/grids';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { DxiDataGridColumn } from './base/data-grid-column-dxi';

import {
    PROPERTY_TOKEN_buttons,
    PROPERTY_TOKEN_columns,
    PROPERTY_TOKEN_validationRules,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-column',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_columns,
           useExisting: DxiColumnComponent,
        }
    ],
    inputs: [
        'alignment',
        'allowEditing',
        'allowExporting',
        'allowFiltering',
        'allowFixing',
        'allowGrouping',
        'allowHeaderFiltering',
        'allowHiding',
        'allowReordering',
        'allowResizing',
        'allowSearch',
        'allowSorting',
        'autoExpandGroup',
        'buttons',
        'calculateCellValue',
        'calculateDisplayValue',
        'calculateFilterExpression',
        'calculateGroupValue',
        'calculateSortValue',
        'caption',
        'cellTemplate',
        'columns',
        'cssClass',
        'customizeText',
        'dataField',
        'dataType',
        'editCellTemplate',
        'editorOptions',
        'encodeHtml',
        'falseText',
        'filterOperations',
        'filterType',
        'filterValue',
        'filterValues',
        'fixed',
        'fixedPosition',
        'format',
        'formItem',
        'groupCellTemplate',
        'groupIndex',
        'headerCellTemplate',
        'headerFilter',
        'hidingPriority',
        'isBand',
        'lookup',
        'minWidth',
        'name',
        'ownerBand',
        'renderAsync',
        'selectedFilterOperation',
        'setCellValue',
        'showEditorAlways',
        'showInColumnChooser',
        'showWhenGrouped',
        'sortIndex',
        'sortingMethod',
        'sortOrder',
        'trueText',
        'type',
        'validationRules',
        'visible',
        'visibleIndex',
        'width'
    ]
})
export class DxiColumnComponent extends DxiDataGridColumn {

    @ContentChildren(PROPERTY_TOKEN_buttons)
    set _buttonsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('buttons', value);
    }
    @ContentChildren(PROPERTY_TOKEN_columns)
    set _columnsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('columns', value);
    }
    @ContentChildren(PROPERTY_TOKEN_validationRules)
    set _validationRulesContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('validationRules', value);
    }
    

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterValueChange: EventEmitter<any | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterValuesChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupIndexChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedFilterOperationChange: EventEmitter<SelectedFilterOperation | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortIndexChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortOrderChange: EventEmitter<SortOrder | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleIndexChange: EventEmitter<number | undefined>;
    protected get _optionPath() {
        return 'columns';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        this._createEventEmitters([
            { emit: 'filterValueChange' },
            { emit: 'filterValuesChange' },
            { emit: 'groupIndexChange' },
            { emit: 'selectedFilterOperationChange' },
            { emit: 'sortIndexChange' },
            { emit: 'sortOrderChange' },
            { emit: 'visibleChange' },
            { emit: 'visibleIndexChange' }
        ]);

        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  imports: [
    DxiColumnComponent
  ],
  exports: [
    DxiColumnComponent
  ],
})
export class DxiColumnModule { }

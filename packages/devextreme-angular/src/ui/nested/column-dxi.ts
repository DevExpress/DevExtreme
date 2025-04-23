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
    forwardRef,
    QueryList
} from '@angular/core';




import { SortOrder } from 'devextreme/common';
import { SelectedFilterOperation } from 'devextreme/common/grids';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiColumnProperties } from './base/column-properties-dxi';
import { DxiValidationRuleComponent } from './validation-rule-dxi';
import { DxiButtonComponent } from './button-dxi';


@Component({
    selector: 'dxi-column',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'alignment',
        'allowEditing',
        'allowFiltering',
        'allowHeaderFiltering',
        'allowHiding',
        'allowReordering',
        'allowSearch',
        'allowSorting',
        'calculateDisplayValue',
        'calculateFieldValue',
        'calculateFilterExpression',
        'calculateSortValue',
        'caption',
        'customizeText',
        'dataField',
        'dataType',
        'editorOptions',
        'falseText',
        'fieldCaptionTemplate',
        'fieldTemplate',
        'fieldValueTemplate',
        'filterType',
        'filterValue',
        'filterValues',
        'format',
        'formItem',
        'headerFilter',
        'headerItemCssClass',
        'headerItemTemplate',
        'name',
        'setFieldValue',
        'showInColumnChooser',
        'sortIndex',
        'sortingMethod',
        'sortOrder',
        'trueText',
        'validationRules',
        'visible',
        'visibleIndex',
        'allowExporting',
        'allowFixing',
        'allowGrouping',
        'allowResizing',
        'autoExpandGroup',
        'buttons',
        'calculateCellValue',
        'calculateGroupValue',
        'cellTemplate',
        'columns',
        'cssClass',
        'editCellTemplate',
        'encodeHtml',
        'filterOperations',
        'fixed',
        'fixedPosition',
        'groupCellTemplate',
        'groupIndex',
        'headerCellTemplate',
        'hidingPriority',
        'isBand',
        'lookup',
        'minWidth',
        'ownerBand',
        'renderAsync',
        'selectedFilterOperation',
        'setCellValue',
        'showEditorAlways',
        'showWhenGrouped',
        'type',
        'width'
    ]
})
export class DxiColumnComponent extends DxiColumnProperties {

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
    @Output() sortIndexChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortOrderChange: EventEmitter<SortOrder | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleIndexChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupIndexChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedFilterOperationChange: EventEmitter<SelectedFilterOperation | undefined>;
    protected get _optionPath() {
        return 'columns';
    }


    @ContentChildren(forwardRef(() => DxiValidationRuleComponent))
    get validationRulesChildren(): QueryList<DxiValidationRuleComponent> {
        return this._getOption('validationRules');
    }
    set validationRulesChildren(value) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(forwardRef(() => DxiButtonComponent))
    get buttonsChildren(): QueryList<DxiButtonComponent> {
        return this._getOption('buttons');
    }
    set buttonsChildren(value) {
        this.setChildren('buttons', value);
    }

    @ContentChildren(forwardRef(() => DxiColumnComponent))
    get columnsChildren(): QueryList<DxiColumnComponent> {
        return this._getOption('columns');
    }
    set columnsChildren(value) {
        this.setChildren('columns', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'filterValueChange' },
            { emit: 'filterValuesChange' },
            { emit: 'sortIndexChange' },
            { emit: 'sortOrderChange' },
            { emit: 'visibleChange' },
            { emit: 'visibleIndexChange' },
            { emit: 'groupIndexChange' },
            { emit: 'selectedFilterOperationChange' }
        ]);

        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiColumnComponent
  ],
  exports: [
    DxiColumnComponent
  ],
})
export class DxiColumnModule { }

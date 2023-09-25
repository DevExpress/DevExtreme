/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { ApplyFilterMode } from 'devextreme/common/grids';
import { dxGanttFilterRowOperationDescriptions } from 'devextreme/ui/gantt';

@Component({
    template: ''
})
export abstract class DxoGanttFilterRow extends NestedOption {
    get applyFilter(): ApplyFilterMode {
        return this._getOption('applyFilter');
    }
    set applyFilter(value: ApplyFilterMode) {
        this._setOption('applyFilter', value);
    }

    get applyFilterText(): string {
        return this._getOption('applyFilterText');
    }
    set applyFilterText(value: string) {
        this._setOption('applyFilterText', value);
    }

    get betweenEndText(): string {
        return this._getOption('betweenEndText');
    }
    set betweenEndText(value: string) {
        this._setOption('betweenEndText', value);
    }

    get betweenStartText(): string {
        return this._getOption('betweenStartText');
    }
    set betweenStartText(value: string) {
        this._setOption('betweenStartText', value);
    }

    get operationDescriptions(): { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string } | dxGanttFilterRowOperationDescriptions {
        return this._getOption('operationDescriptions');
    }
    set operationDescriptions(value: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string } | dxGanttFilterRowOperationDescriptions) {
        this._setOption('operationDescriptions', value);
    }

    get resetOperationText(): string {
        return this._getOption('resetOperationText');
    }
    set resetOperationText(value: string) {
        this._setOption('resetOperationText', value);
    }

    get showAllText(): string {
        return this._getOption('showAllText');
    }
    set showAllText(value: string) {
        this._setOption('showAllText', value);
    }

    get showOperationChooser(): boolean {
        return this._getOption('showOperationChooser');
    }
    set showOperationChooser(value: boolean) {
        this._setOption('showOperationChooser', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }
}

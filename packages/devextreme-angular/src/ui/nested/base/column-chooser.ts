/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import type { SortOrder } from 'devextreme/common';
import type { PositionConfig } from 'devextreme/common/core/animation';
import type { ColumnChooserMode, ColumnChooserSearchConfig, ColumnChooserSelectionConfig } from 'devextreme/common/grids';
import type { UserDefinedElement } from 'devextreme/core/element';

@Component({
    template: ''
})
export abstract class DxoColumnChooser extends NestedOption {
    get allowSearch(): boolean {
        return this._getOption('allowSearch');
    }
    set allowSearch(value: boolean) {
        this._setOption('allowSearch', value);
    }

    get container(): UserDefinedElement | string | undefined {
        return this._getOption('container');
    }
    set container(value: UserDefinedElement | string | undefined) {
        this._setOption('container', value);
    }

    get emptyPanelText(): string {
        return this._getOption('emptyPanelText');
    }
    set emptyPanelText(value: string) {
        this._setOption('emptyPanelText', value);
    }

    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    get height(): number | string {
        return this._getOption('height');
    }
    set height(value: number | string) {
        this._setOption('height', value);
    }

    get mode(): ColumnChooserMode {
        return this._getOption('mode');
    }
    set mode(value: ColumnChooserMode) {
        this._setOption('mode', value);
    }

    get position(): PositionConfig | undefined {
        return this._getOption('position');
    }
    set position(value: PositionConfig | undefined) {
        this._setOption('position', value);
    }

    get search(): ColumnChooserSearchConfig {
        return this._getOption('search');
    }
    set search(value: ColumnChooserSearchConfig) {
        this._setOption('search', value);
    }

    get searchTimeout(): number {
        return this._getOption('searchTimeout');
    }
    set searchTimeout(value: number) {
        this._setOption('searchTimeout', value);
    }

    get selection(): ColumnChooserSelectionConfig {
        return this._getOption('selection');
    }
    set selection(value: ColumnChooserSelectionConfig) {
        this._setOption('selection', value);
    }

    get sortOrder(): SortOrder | undefined {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: SortOrder | undefined) {
        this._setOption('sortOrder', value);
    }

    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    get width(): number | string {
        return this._getOption('width');
    }
    set width(value: number | string) {
        this._setOption('width', value);
    }
}

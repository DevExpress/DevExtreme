/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Mode, ScrollbarMode, ScrollMode } from 'devextreme/common';
import { DataRenderMode } from 'devextreme/common/grids';
import { DataGridScrollMode } from 'devextreme/ui/data_grid';

@Component({
    template: ''
})
export abstract class DxoSchedulerScrolling extends NestedOption {
    get columnRenderingMode(): DataRenderMode {
        return this._getOption('columnRenderingMode');
    }
    set columnRenderingMode(value: DataRenderMode) {
        this._setOption('columnRenderingMode', value);
    }

    get mode(): DataGridScrollMode | ScrollMode {
        return this._getOption('mode');
    }
    set mode(value: DataGridScrollMode | ScrollMode) {
        this._setOption('mode', value);
    }

    get preloadEnabled(): boolean {
        return this._getOption('preloadEnabled');
    }
    set preloadEnabled(value: boolean) {
        this._setOption('preloadEnabled', value);
    }

    get renderAsync(): boolean | undefined {
        return this._getOption('renderAsync');
    }
    set renderAsync(value: boolean | undefined) {
        this._setOption('renderAsync', value);
    }

    get rowRenderingMode(): DataRenderMode {
        return this._getOption('rowRenderingMode');
    }
    set rowRenderingMode(value: DataRenderMode) {
        this._setOption('rowRenderingMode', value);
    }

    get scrollByContent(): boolean {
        return this._getOption('scrollByContent');
    }
    set scrollByContent(value: boolean) {
        this._setOption('scrollByContent', value);
    }

    get scrollByThumb(): boolean {
        return this._getOption('scrollByThumb');
    }
    set scrollByThumb(value: boolean) {
        this._setOption('scrollByThumb', value);
    }

    get showScrollbar(): ScrollbarMode {
        return this._getOption('showScrollbar');
    }
    set showScrollbar(value: ScrollbarMode) {
        this._setOption('showScrollbar', value);
    }

    get useNative(): Mode | boolean {
        return this._getOption('useNative');
    }
    set useNative(value: Mode | boolean) {
        this._setOption('useNative', value);
    }
}

/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoSchedulerScrolling extends NestedOption {
    get columnRenderingMode(): string {
        return this._getOption('columnRenderingMode');
    }
    set columnRenderingMode(value: string) {
        this._setOption('columnRenderingMode', value);
    }

    get mode(): string {
        return this._getOption('mode');
    }
    set mode(value: string) {
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

    get rowRenderingMode(): string {
        return this._getOption('rowRenderingMode');
    }
    set rowRenderingMode(value: string) {
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

    get showScrollbar(): string {
        return this._getOption('showScrollbar');
    }
    set showScrollbar(value: string) {
        this._setOption('showScrollbar', value);
    }

    get useNative(): boolean | string {
        return this._getOption('useNative');
    }
    set useNative(value: boolean | string) {
        this._setOption('useNative', value);
    }
}

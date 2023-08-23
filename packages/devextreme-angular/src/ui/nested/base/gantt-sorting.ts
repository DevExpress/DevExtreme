/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoGanttSorting extends NestedOption {
    get ascendingText(): string {
        return this._getOption('ascendingText');
    }
    set ascendingText(value: string) {
        this._setOption('ascendingText', value);
    }

    get clearText(): string {
        return this._getOption('clearText');
    }
    set clearText(value: string) {
        this._setOption('clearText', value);
    }

    get descendingText(): string {
        return this._getOption('descendingText');
    }
    set descendingText(value: string) {
        this._setOption('descendingText', value);
    }

    get mode(): string {
        return this._getOption('mode');
    }
    set mode(value: string) {
        this._setOption('mode', value);
    }

    get showSortIndexes(): boolean {
        return this._getOption('showSortIndexes');
    }
    set showSortIndexes(value: boolean) {
        this._setOption('showSortIndexes', value);
    }
}

/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxiGanttStripLine extends CollectionNestedOption {
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    get end(): Date | number | Function | string | undefined {
        return this._getOption('end');
    }
    set end(value: Date | number | Function | string | undefined) {
        this._setOption('end', value);
    }

    get start(): Date | number | Function | string | undefined {
        return this._getOption('start');
    }
    set start(value: Date | number | Function | string | undefined) {
        this._setOption('start', value);
    }

    get title(): string | undefined {
        return this._getOption('title');
    }
    set title(value: string | undefined) {
        this._setOption('title', value);
    }
}

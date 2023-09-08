/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoChartsColor extends NestedOption {
    get base(): string | undefined {
        return this._getOption('base');
    }
    set base(value: string | undefined) {
        this._setOption('base', value);
    }

    get fillId(): string | undefined {
        return this._getOption('fillId');
    }
    set fillId(value: string | undefined) {
        this._setOption('fillId', value);
    }
}

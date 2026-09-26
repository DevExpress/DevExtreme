/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import type { LoadingAnimationType } from 'devextreme/ui/load_indicator';

@Component({
    template: ''
})
export abstract class DxoLoadPanelIndicatorProperties extends NestedOption {
    get animationType(): LoadingAnimationType {
        return this._getOption('animationType');
    }
    set animationType(value: LoadingAnimationType) {
        this._setOption('animationType', value);
    }

    get height(): number | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | string | undefined) {
        this._setOption('height', value);
    }

    get src(): string {
        return this._getOption('src');
    }
    set src(value: string) {
        this._setOption('src', value);
    }

    get width(): number | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | string | undefined) {
        this._setOption('width', value);
    }
}

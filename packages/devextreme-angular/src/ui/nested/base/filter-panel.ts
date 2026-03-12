/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import type { FilterPanelTexts } from 'devextreme/common/grids';

@Component({
    template: ''
})
export abstract class DxoFilterPanel extends NestedOption {
    get customizeText(): Function {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function) {
        this._setOption('customizeText', value);
    }

    get filterEnabled(): boolean {
        return this._getOption('filterEnabled');
    }
    set filterEnabled(value: boolean) {
        this._setOption('filterEnabled', value);
    }

    get texts(): FilterPanelTexts {
        return this._getOption('texts');
    }
    set texts(value: FilterPanelTexts) {
        this._setOption('texts', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }
}

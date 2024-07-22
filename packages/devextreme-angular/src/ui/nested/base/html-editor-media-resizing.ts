/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoHtmlEditorMediaResizing extends NestedOption {
    get allowedTargets(): Array<string> {
        return this._getOption('allowedTargets');
    }
    set allowedTargets(value: Array<string>) {
        this._setOption('allowedTargets', value);
    }

    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }
}

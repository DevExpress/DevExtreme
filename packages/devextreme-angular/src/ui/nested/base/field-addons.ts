/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoFieldAddons extends NestedOption {
    get afterTemplate(): any {
        return this._getOption('afterTemplate');
    }
    set afterTemplate(value: any) {
        this._setOption('afterTemplate', value);
    }

    get beforeTemplate(): any {
        return this._getOption('beforeTemplate');
    }
    set beforeTemplate(value: any) {
        this._setOption('beforeTemplate', value);
    }
}

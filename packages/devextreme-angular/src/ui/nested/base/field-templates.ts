/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { FieldTemplate } from 'devextreme/ui/drop_down_editor/ui.drop_down_editor';

@Component({
    template: ''
})
export abstract class DxoFieldTemplates extends NestedOption {
    get afterTemplate(): FieldTemplate {
        return this._getOption('afterTemplate');
    }
    set afterTemplate(value: FieldTemplate) {
        this._setOption('afterTemplate', value);
    }

    get beforeTemplate(): FieldTemplate {
        return this._getOption('beforeTemplate');
    }
    set beforeTemplate(value: FieldTemplate) {
        this._setOption('beforeTemplate', value);
    }
}

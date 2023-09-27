/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { SearchMode } from 'devextreme/common';

@Component({
    template: ''
})
export abstract class DxoColumnChooserSearchConfig extends NestedOption {
    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
        this._setOption('editorOptions', value);
    }

    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    get timeout(): number {
        return this._getOption('timeout');
    }
    set timeout(value: number) {
        this._setOption('timeout', value);
    }

    get mode(): SearchMode {
        return this._getOption('mode');
    }
    set mode(value: SearchMode) {
        this._setOption('mode', value);
    }

    get searchExpr(): Function | string | undefined | Array<Function | string> {
        return this._getOption('searchExpr');
    }
    set searchExpr(value: Function | string | undefined | Array<Function | string>) {
        this._setOption('searchExpr', value);
    }
}

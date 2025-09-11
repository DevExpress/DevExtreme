/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoWebSpeechApiConfig extends NestedOption {
    get continuous(): boolean {
        return this._getOption('continuous');
    }
    set continuous(value: boolean) {
        this._setOption('continuous', value);
    }

    get grammars(): Array<string> {
        return this._getOption('grammars');
    }
    set grammars(value: Array<string>) {
        this._setOption('grammars', value);
    }

    get interimResults(): boolean {
        return this._getOption('interimResults');
    }
    set interimResults(value: boolean) {
        this._setOption('interimResults', value);
    }

    get lang(): string {
        return this._getOption('lang');
    }
    set lang(value: string) {
        this._setOption('lang', value);
    }

    get maxAlternatives(): number {
        return this._getOption('maxAlternatives');
    }
    set maxAlternatives(value: number) {
        this._setOption('maxAlternatives', value);
    }
}

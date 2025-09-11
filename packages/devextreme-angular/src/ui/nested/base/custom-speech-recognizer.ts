/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoCustomSpeechRecognizer extends NestedOption {
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    get isListening(): boolean {
        return this._getOption('isListening');
    }
    set isListening(value: boolean) {
        this._setOption('isListening', value);
    }
}

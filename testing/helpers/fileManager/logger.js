import { extend } from 'core/utils/extend';
import { isNumeric } from 'core/utils/type';

export default class FileManagerLogger {

    constructor() {
        this._logEntries = [];
    }

    addEntry(type, info) {
        const preparedInfo = this._getPreparedObject(info);
        const entry = extend(preparedInfo, { type });
        this._logEntries.push(entry);
    }

    getEntries() {
        return this._logEntries;
    }

    clear() {
        this._logEntries = [];
    }

    _getPreparedObject(srcObject) {
        const result = {};

        for(let key in srcObject) {
            if(!Object.prototype.hasOwnProperty.call(srcObject, key)) {
                continue;
            }

            let value = srcObject[key];

            if(value === undefined) {
                continue;
            }

            if(isNumeric(value)) {
                value = Math.round(value * 10) / 10;
            }

            result[key] = value;
        }

        return result;
    }

}

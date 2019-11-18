import devices from './devices';
import { isFunction, isEmptyObject } from './utils/type';
import { findBestMatches } from './utils/common';
import { extend } from './utils/extend';

const deviceMatch = (device, filter) => isEmptyObject(filter) || findBestMatches(device, [filter]).length > 0;

export class Options {
    constructor(options = {}) {
        this._options = options;
    }

    get() {
        return this._options;
    }

    static convertRulesToOptions(rules) {
        const currentDevice = devices.current();
        return rules.reduce((options, { device, options: ruleOptions }) => {
            const deviceFilter = device || {};
            const match = isFunction(deviceFilter) ?
                deviceFilter(currentDevice) :
                deviceMatch(currentDevice, deviceFilter);

            if(match) {
                extend(options, ruleOptions);
            }
            return options;
        }, {});
    }

    static normalizeOptions(options, value) {
        return typeof options !== 'string' ? options : { [options]: value };
    }
}

import { normalizeEnum as _normalizeEnum } from '../core/utils';

const algorithms = {};
let defaultAlgorithm;

export function getAlgorithm(name) {
    return algorithms[_normalizeEnum(name)] || defaultAlgorithm;
}

export function addAlgorithm(name, callback, setDefault) {
    algorithms[name] = callback;

    if(setDefault) {
        defaultAlgorithm = algorithms[name];
    }
}

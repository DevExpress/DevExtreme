/* global HTMLElement, jQuery, HTMLCollection */
// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import config from '../../core/config';
import { normalizeOptionsPatch } from '../../core/options/utils';

const useJQuery = config().useJQuery;

const MAX_NESTING_DEPTH = 100;


const isDomElem = (object) => {
    const checkInstance = (inst) => {
        if(inst instanceof HTMLElement || inst instanceof jQuery) {
            return true;
        }
        return false;
    };
    if(object instanceof HTMLCollection) {
        for(let i = 0; i < object.length; i++) {
            if(!checkInstance(object[i])) {
                return false;
            }
        }
        return true;
    }
    return checkInstance(object);
};
const traverse = (object, fn, scope = []) => {
    if(!object || isDomElem(object) || scope.length > MAX_NESTING_DEPTH) {
        return false;
    }
    if(object.NAME && typeof object.NAME === 'string' && object.NAME.startsWith('dx')) {
        return false;
    }
    if(scope.includes('_owner')) {
        return false;
    }
    if(typeof object === 'object') {
        return Object.entries(object).map(([key, value]) => {
            if(value !== null && typeof value === 'object') {
                return traverse(value, fn, scope.concat(key));
            }
            return fn.apply(this, [value]);
        }).includes(true);
    }
    return false;
};
const isComputed = (object) => {
    return ko.isComputed(object) || ko.isPureComputed(object);
};

export default function() {
    if(ko && useJQuery) {
        normalizeOptionsPatch.current = (options, value) => {
            if(value && !isDomElem(value) && traverse(value, isComputed)) {
                return {};
            }
            return typeof options !== 'string' ? options : { [options]: value };
        };
    }
}

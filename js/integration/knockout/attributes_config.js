/* global HTMLElement, jQuery, HTMLCollection */
// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import config from '../../core/config';
import { normalizeOptionsPatch } from '../../core/options/utils';

const useJQuery = config().useJQuery;


const isDomElem = (object) => {
    const checkInstance = (inst)=>{
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
const containsComputed = (object) => {
    if(!object || isDomElem(object)) {
        return false;
    }
    if(ko.isComputed(object) || ko.isPureComputed(object)) {
        return true;
    }
    const objFields = Object.values(object);
    if(objFields.length && typeof object === 'object') {
        return objFields.map(obj=>containsComputed(obj)).includes(true);
    }
    return false;
};

export default function() {
    if(ko && useJQuery) {
        normalizeOptionsPatch.current = (options, value) => {
            if(value && !isDomElem(value) && containsComputed(value)) {
                return {};
            }
            return typeof options !== 'string' ? options : { [options]: value };
        };
    }
}

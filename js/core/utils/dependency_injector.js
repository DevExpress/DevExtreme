import { extend } from './extend';
import { isFunction } from './type';
import { each } from './iterator';
import Class from '../class';

export default function(object) {
    const BaseClass = Class.inherit(object);
    let InjectedClass = BaseClass;
    let instance = new InjectedClass(object);
    const initialFields = {};

    const injectFields = function(injectionObject, initial) {
        each(injectionObject, function(key) {
            if(isFunction(instance[key])) {
                if(initial || !object[key]) {
                    object[key] = function() {
                        return instance[key].apply(object, arguments);
                    };
                }
            } else {
                if(initial) {
                    initialFields[key] = object[key];
                }
                object[key] = instance[key];
            }
        });
    };

    injectFields(object, true);

    object.inject = function(injectionObject) {
        InjectedClass = InjectedClass.inherit(injectionObject);
        instance = new InjectedClass();
        injectFields(injectionObject);
    };

    object.resetInjection = function() {
        extend(object, initialFields);
        InjectedClass = BaseClass;
        instance = new BaseClass();
    };

    return object;
}

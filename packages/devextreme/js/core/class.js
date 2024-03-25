import errors from './errors';
import { isWindow } from './utils/type';

const wrapOverridden = function(baseProto, methodName, method) {
    return function() {
        const prevCallBase = this.callBase;
        this.callBase = baseProto[methodName];
        try {
            return method.apply(this, arguments);
        } finally {
            this.callBase = prevCallBase;
        }
    };
};

const clonePrototype = function(obj) {
    const func = function() { };
    func.prototype = obj.prototype;
    return new func();
};

const redefine = function(members) {
    const that = this;
    let overridden;
    let memberName;
    let member;

    if(!members) {
        return that;
    }

    for(memberName in members) {
        member = members[memberName];
        overridden = typeof that.prototype[memberName] === 'function' && typeof member === 'function';
        that.prototype[memberName] = overridden ? wrapOverridden(that.parent.prototype, memberName, member) : member;
    }

    return that;
};

const include = function() {
    const classObj = this;
    let argument;
    let name;
    let i;

    // NOTE: For ES6 classes. They don't have _includedCtors/_includedPostCtors
    // properties and get them from the ancestor class.
    const hasClassObjOwnProperty = Object.prototype.hasOwnProperty.bind(classObj);
    const isES6Class = !hasClassObjOwnProperty('_includedCtors') && !hasClassObjOwnProperty('_includedPostCtors');

    if(isES6Class) {
        classObj._includedCtors = classObj._includedCtors.slice(0);
        classObj._includedPostCtors = classObj._includedPostCtors.slice(0);
    }

    for(i = 0; i < arguments.length; i++) {
        argument = arguments[i];
        if(argument.ctor) {
            classObj._includedCtors.push(argument.ctor);
        }
        if(argument.postCtor) {
            classObj._includedPostCtors.push(argument.postCtor);
        }

        for(name in argument) {
            if(name === 'ctor' || name === 'postCtor' || name === 'default') {
                continue;
            }
            ///#DEBUG
            if(name in classObj.prototype) {
                throw errors.Error('E0002', name);
            }
            ///#ENDDEBUG
            classObj.prototype[name] = argument[name];
        }
    }

    return classObj;
};

const subclassOf = function(parentClass) {
    const hasParentProperty = Object.prototype.hasOwnProperty.bind(this)('parent');
    const isES6Class = !hasParentProperty && this.parent;

    if(isES6Class) {
        const baseClass = Object.getPrototypeOf(this);

        return baseClass === parentClass || baseClass.subclassOf(parentClass);
    } else {
        if(this.parent === parentClass) {
            return true;
        }

        if(!this.parent || !this.parent.subclassOf) {
            return false;
        }

        return this.parent.subclassOf(parentClass);
    }
};

const abstract = function() {
    throw errors.Error('E0001');
};

const classImpl = function() { };

classImpl.inherit = function(members) {
    const parent = this;
    const inheritor = function() {
        const instance = this;
        if(!instance || isWindow(instance) || typeof instance.constructor !== 'function') {
            throw errors.Error('E0003');
        }

        const ctor = instance.ctor;
        const includedCtors = instance.constructor._includedCtors;
        const includedPostCtors = instance.constructor._includedPostCtors;
        let i;

        for(i = 0; i < includedCtors.length; i++) {
            includedCtors[i].call(instance);
        }

        if(ctor) {
            ctor.apply(instance, arguments);
        }

        for(i = 0; i < includedPostCtors.length; i++) {
            includedPostCtors[i].call(instance);
        }
    };

    inheritor.prototype = clonePrototype(parent);

    Object.setPrototypeOf(inheritor, parent);

    inheritor.inherit = parent.inherit;
    inheritor.abstract = abstract;
    inheritor.redefine = redefine;
    inheritor.include = include;
    inheritor.subclassOf = subclassOf;

    inheritor.parent = parent;
    inheritor._includedCtors = parent._includedCtors ? parent._includedCtors.slice(0) : [];
    inheritor._includedPostCtors = parent._includedPostCtors ? parent._includedPostCtors.slice(0) : [];
    inheritor.prototype.constructor = inheritor;

    inheritor.redefine(members);

    return inheritor;
};

classImpl.abstract = abstract;

export default classImpl;

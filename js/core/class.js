var errors = require("./errors"),
    typeUtils = require("./utils/type");

var wrapOverridden = function(baseProto, methodName, method) {
    return function() {
        var prevCallBase = this.callBase;
        this.callBase = baseProto[methodName];
        try {
            return method.apply(this, arguments);
        } finally {
            this.callBase = prevCallBase;
        }
    };
};

var clonePrototype = function(obj) {
    var func = function() { };
    func.prototype = obj.prototype;
    return new func();
};

var redefine = function(members) {
    var that = this,
        overridden,
        memberName,
        member;

    if(!members) {
        return that;
    }

    for(memberName in members) {
        member = members[memberName];
        overridden = typeof that.prototype[memberName] === "function" && typeof member === "function";
        that.prototype[memberName] = overridden ? wrapOverridden(that.parent.prototype, memberName, member) : member;
    }

    return that;
};

var include = function() {
    var classObj = this,
        argument,
        name,
        i;

    for(i = 0; i < arguments.length; i++) {
        argument = arguments[i];
        if(argument.ctor) {
            classObj._includedCtors.push(argument.ctor);
        }
        if(argument.postCtor) {
            classObj._includedPostCtors.push(argument.postCtor);
        }

        for(name in argument) {
            if(name === "ctor" || name === "postCtor") {
                continue;
            }
            ///#DEBUG
            if(name in classObj.prototype) {
                throw errors.Error("E0002", name);
            }
            ///#ENDDEBUG
            classObj.prototype[name] = argument[name];
        }
    }

    return classObj;
};

var subclassOf = function(parentClass) {
    if(this.parent === parentClass) {
        return true;
    }
    if(!this.parent || !this.parent.subclassOf) {
        return false;
    }
    return this.parent.subclassOf(parentClass);
};

var abstract = function() {
    throw errors.Error("E0001");
};

var copyStatic = (function() {
    var hasOwn = Object.prototype.hasOwnProperty;

    return function(source, destination) {
        for(var key in source) {
            if(!hasOwn.call(source, key)) {
                return;
            }

            destination[key] = source[key];
        }
    };
})();

var classImpl = function() { };

classImpl.inherit = function(members) {
    var inheritor = function() {
        if(!this || typeUtils.isWindow(this) || typeof this.constructor !== "function") {
            throw errors.Error("E0003");
        }

        var instance = this,
            ctor = instance.ctor,
            includedCtors = instance.constructor._includedCtors,
            includedPostCtors = instance.constructor._includedPostCtors,
            i;

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

    inheritor.prototype = clonePrototype(this);

    copyStatic(this, inheritor);

    inheritor.inherit = this.inherit;
    inheritor.abstract = abstract;
    inheritor.redefine = redefine;
    inheritor.include = include;
    inheritor.subclassOf = subclassOf;

    inheritor.parent = this;
    inheritor._includedCtors = this._includedCtors ? this._includedCtors.slice(0) : [];
    inheritor._includedPostCtors = this._includedPostCtors ? this._includedPostCtors.slice(0) : [];
    inheritor.prototype.constructor = inheritor;

    inheritor.redefine(members);

    return inheritor;
};

classImpl.abstract = abstract;

module.exports = classImpl;

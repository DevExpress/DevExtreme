"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEmitOptionChangedFunc = exports.bindOptionWatchers = void 0;
var helpers_1 = require("./helpers");
var Configuration = /** @class */ (function () {
    function Configuration(updateFunc, name, initialValues, expectedChildren, isCollectionItem, collectionItemIndex, ownerConfig) {
        this._updateFunc = updateFunc;
        this._name = name;
        this._initialValues = initialValues ? initialValues : {};
        this._nestedConfigurations = [];
        this._isCollectionItem = !!isCollectionItem;
        this._collectionItemIndex = collectionItemIndex;
        this._expectedChildren = expectedChildren || {};
        this._ownerConfig = ownerConfig;
        this._componentChanges = [];
        this.updateValue = this.updateValue.bind(this);
    }
    Object.defineProperty(Configuration.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "fullName", {
        get: function () {
            return this._name && this._isCollectionItem
                ? this._name + "[" + this._collectionItemIndex + "]"
                : this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "componentsCountChanged", {
        get: function () {
            return this._componentChanges;
        },
        enumerable: false,
        configurable: true
    });
    Configuration.prototype.cleanComponentsCountChanged = function () {
        this._componentChanges = [];
    };
    Object.defineProperty(Configuration.prototype, "fullPath", {
        get: function () {
            return this._ownerConfig && this._ownerConfig.fullPath
                ? this._ownerConfig.fullPath + "." + this.fullName
                : this.fullName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "ownerConfig", {
        get: function () {
            return this._ownerConfig;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "initialValues", {
        get: function () {
            return this._initialValues;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "expectedChildren", {
        get: function () {
            return this._expectedChildren;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "nested", {
        get: function () {
            return this._nestedConfigurations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "prevNestedOptions", {
        get: function () {
            return this._prevNestedConfigOptions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "collectionItemIndex", {
        get: function () {
            return this._collectionItemIndex;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "isCollectionItem", {
        get: function () {
            return this._isCollectionItem;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "updateFunc", {
        get: function () {
            return this._updateFunc;
        },
        enumerable: false,
        configurable: true
    });
    Configuration.prototype.init = function (options) {
        this._options = options ? options : [];
    };
    Object.defineProperty(Configuration.prototype, "emitOptionChanged", {
        set: function (handler) {
            this._emitOptionChanged = handler;
        },
        enumerable: false,
        configurable: true
    });
    Configuration.prototype.setPrevNestedOptions = function (value) {
        this._prevNestedConfigOptions = value;
    };
    Configuration.prototype.onOptionChanged = function (args) {
        if (helpers_1.isEqual(args.value, args.previousValue)) {
            return;
        }
        this._onOptionChanged(args.fullName.split("."), args);
    };
    Configuration.prototype.cleanNested = function () {
        this._nestedConfigurations = [];
    };
    Configuration.prototype.createNested = function (name, initialValues, isCollectionItem, expectedChildren) {
        var expected = this._expectedChildren[name];
        var actualName = name;
        var actualIsCollectionItem = isCollectionItem;
        if (expected) {
            actualIsCollectionItem = expected.isCollectionItem;
            if (expected.optionName) {
                actualName = expected.optionName;
            }
        }
        var collectionItemIndex = -1;
        if (actualIsCollectionItem && actualName) {
            collectionItemIndex = this._nestedConfigurations.filter(function (c) { return c._name && c._name === actualName; }).length;
        }
        var configuration = new Configuration(this._updateFunc, actualName, initialValues, expectedChildren, actualIsCollectionItem, collectionItemIndex, this);
        this._nestedConfigurations.push(configuration);
        return configuration;
    };
    Configuration.prototype.updateValue = function (nestedName, value) {
        var fullName = [this.fullPath, nestedName].filter(function (n) { return n; }).join(".");
        this._updateFunc(fullName, value);
    };
    Configuration.prototype.getNestedOptionValues = function () {
        var values = {};
        this._nestedConfigurations.forEach(function (o) {
            if (!o._name) {
                return;
            }
            var nestedValue = __assign(__assign({}, o.initialValues), o.getNestedOptionValues());
            if (!nestedValue) {
                return;
            }
            if (!o._isCollectionItem) {
                values[o._name] = nestedValue;
            }
            else {
                var arr = values[o._name];
                if (!arr || !Array.isArray(arr)) {
                    arr = [];
                    values[o._name] = arr;
                }
                arr.push(nestedValue);
            }
        });
        return values;
    };
    Configuration.prototype.getOptionsToWatch = function () {
        var blackList = {};
        this._nestedConfigurations.forEach(function (c) { return c._name && (blackList[c._name] = true); });
        return this._options.filter(function (o) { return !blackList[o]; });
    };
    Configuration.prototype._onOptionChanged = function (optionRelPath, args) {
        if (optionRelPath.length === 0) {
            return;
        }
        var optionInfo = helpers_1.getOptionInfo(optionRelPath[0]);
        if (optionInfo.isCollection || optionRelPath.length > 1) {
            var nestedConfig = this._getNestedConfig(optionInfo.fullName);
            if (nestedConfig) {
                nestedConfig._onOptionChanged(optionRelPath.slice(1), args);
                return;
            }
            this._tryEmitOptionChanged(optionInfo.name, args.component.option(this.fullPath ? this.fullPath + "." + optionInfo.name : optionInfo.name));
        }
        else {
            this._tryEmitOptionChanged(optionInfo.name, args.value);
        }
    };
    Configuration.prototype._getNestedConfig = function (fullName) {
        for (var _i = 0, _a = this._nestedConfigurations; _i < _a.length; _i++) {
            var nestedConfig = _a[_i];
            if (nestedConfig.fullName === fullName) {
                return nestedConfig;
            }
        }
        return undefined;
    };
    Configuration.prototype._tryEmitOptionChanged = function (name, value) {
        if (this._emitOptionChanged) {
            this._emitOptionChanged(name, value);
        }
    };
    return Configuration;
}());
function bindOptionWatchers(config, vueInstance, innerChanges) {
    var targets = config && config.getOptionsToWatch();
    if (targets) {
        targets.forEach(function (optionName) {
            vueInstance.$watch(optionName, function (value) {
                if (!innerChanges.hasOwnProperty(optionName) ||
                    innerChanges[optionName] !== value) {
                    config.updateValue(optionName, value);
                }
                delete innerChanges[optionName];
            });
        });
    }
}
exports.bindOptionWatchers = bindOptionWatchers;
function setEmitOptionChangedFunc(config, vueInstance, innerChanges) {
    config.emitOptionChanged = function (name, value) {
        if (!helpers_1.isEqual(value, vueInstance.$props[name])) {
            innerChanges[name] = value;
            vueInstance.$emit("update:" + name, value);
        }
    };
}
exports.setEmitOptionChangedFunc = setEmitOptionChangedFunc;
exports.default = Configuration;

const Config = require('./config');
const extend = require('./utils/extend').extend;
const optionManager = require('./option_manager').OptionManager;
const bracketsToDots = require('./utils/data').bracketsToDots;
const Class = require('./class');
const Action = require('./action');
const errors = require('./errors');
const commonUtils = require('./utils/common');
const typeUtils = require('./utils/type');
const objectUtils = require('./utils/object');
const deferredUtils = require('../core/utils/deferred');
const Deferred = deferredUtils.Deferred;
const when = deferredUtils.when;
const Callbacks = require('./utils/callbacks');
const EventsMixin = require('./events_mixin');
const publicComponentUtils = require('./utils/public_component');
const devices = require('./devices');
const isFunction = typeUtils.isFunction;
const noop = commonUtils.noop;


class PostponedOperations {
    constructor() {
        this._postponedOperations = {};
    }

    add(key, fn, postponedPromise) {
        if(key in this._postponedOperations) {
            postponedPromise && this._postponedOperations[key].promises.push(postponedPromise);
        } else {
            const completePromise = new Deferred();
            this._postponedOperations[key] = {
                fn: fn,
                completePromise: completePromise,
                promises: postponedPromise ? [postponedPromise] : []
            };
        }

        return this._postponedOperations[key].completePromise.promise();
    }

    callPostponedOperations() {
        for(const key in this._postponedOperations) {
            const operation = this._postponedOperations[key];

            if(typeUtils.isDefined(operation)) {
                if(operation.promises && operation.promises.length) {
                    when(...operation.promises).done(operation.fn).then(operation.completePromise.resolve);
                } else {
                    operation.fn().done(operation.completePromise.resolve);
                }
            }
        }
        this._postponedOperations = {};
    }
}

const normalizeOptions = (options, value) => {
    if(typeof options !== 'string') return options;

    const result = {};
    result[options] = value;
    return result;
};

const Component = Class.inherit({

    _setDeprecatedOptions: function() {
        this._deprecatedOptions = {};
    },

    _getDeprecatedOptions: function() {
        return this._deprecatedOptions;
    },

    _getOptionAliasesByName: function(optionName) {
        return Object.keys(this._deprecatedOptions).filter(aliasName => {
            return optionName === this._deprecatedOptions[aliasName].alias;
        });
    },

    _getDefaultOptions: function() {
        return {
            onInitialized: null,
            onOptionChanged: null,
            onDisposing: null,

            defaultOptionsRules: null
        };
    },

    _defaultOptionsRules: function() {
        return [];
    },

    _getOptionByRules: function(customRules) {
        let rules = this._defaultOptionsRules();

        if(Array.isArray(customRules)) {
            rules = rules.concat(customRules);
        }

        return this._convertRulesToOptions(rules);
    },

    _setOptionsByDevice: function(customRules) {
        const rulesOptions = this._getOptionByRules(customRules);

        this._setOptionByStealth(rulesOptions);
    },

    _convertRulesToOptions: function(rules) {
        const options = {};
        const currentDevice = devices.current();
        const deviceMatch = function(device, filter) {
            const filterArray = [];

            Array.prototype.push.call(filterArray, filter);

            return (filterArray.length === 1 && typeUtils.isEmptyObject(filterArray[0]))
                || commonUtils.findBestMatches(device, filterArray).length > 0;
        };

        for(let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            const deviceFilter = rule.device || { };
            var match;

            if(isFunction(deviceFilter)) {
                match = deviceFilter(currentDevice);
            } else {
                match = deviceMatch(currentDevice, deviceFilter);
            }

            if(match) {
                extend(options, rule.options);
            }
        }
        return options;
    },

    _isInitialOptionValue: function(name) {
        const optionValue = this.option(name);
        const initialOptionValue = this.initialOption(name);
        const isInitialOption = isFunction(optionValue) && isFunction(initialOptionValue) ? optionValue.toString() === initialOptionValue.toString() : commonUtils.equalByValue(optionValue, initialOptionValue);

        return isInitialOption;
    },

    _setOptionsByReference: function() {
        this._optionsByReference = {};
    },

    _getOptionsByReference: function() {
        return this._optionsByReference;
    },
    /**
    * @name ComponentMethods.ctor
    * @publicName ctor(options)
    * @param1 options:ComponentOptions|undefined
    * @hidden
    */
    ctor: function(options) {
        this.NAME = publicComponentUtils.name(this.constructor);

        options = options || {};
        if(options.eventsStrategy) {
            this.setEventsStrategy(options.eventsStrategy);
        }
        this._options = {};
        this._updateLockCount = 0;

        this._optionChangedCallbacks = options._optionChangedCallbacks || Callbacks();
        this._disposingCallbacks = options._disposingCallbacks || Callbacks();
        this.postponedOperations = new PostponedOperations();

        this.beginUpdate();

        try {
            this._setOptionsByReference();
            this._setDeprecatedOptions();
            this._options = this._getDefaultOptions();
            this._optionManager = new optionManager(
                this._options,
                this._getOptionsByReference(),
                this._deprecatedOptions);

            this._optionManager.onChanging((name, previousValue, value) => {
                if(this._initialized) {
                    this._optionChanging(name, previousValue, value);
                }
            });

            this._optionManager.onDeprecated((option, info) => {
                this._logDeprecatedWarning(option, info);
            });

            this._optionManager.onChanged((name, value, previousValue) => {
                this._notifyOptionChanged(name, value, previousValue);
            });

            if(options && options.onInitializing) {
                options.onInitializing.apply(this, [options]);
            }
            this._setOptionsByDevice(options.defaultOptionsRules);

            this._initOptions(options);
        } finally {
            this.endUpdate();
        }
    },

    _initOptions: function(options) {
        this.option(options);
    },

    _init: function() {
        this._createOptionChangedAction();

        this.on('disposing', function(args) {
            this._disposingCallbacks.fireWith(this, [args]);
        }.bind(this));
    },

    _logDeprecatedWarning(option, info) {
        const message = info.message || ('Use the \'' + info.alias + '\' option instead');
        errors.log('W0001', this.NAME, option, info.since, message);
    },

    _createOptionChangedAction: function() {
        this._optionChangedAction = this._createActionByOption('onOptionChanged', { excludeValidators: ['disabled', 'readOnly'] });
    },

    _createDisposingAction: function() {
        this._disposingAction = this._createActionByOption('onDisposing', { excludeValidators: ['disabled', 'readOnly'] });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'onDisposing':
            case 'onInitialized':
                break;
            case 'onOptionChanged':
                this._createOptionChangedAction();
                break;
            case 'defaultOptionsRules':
                break;
        }
    },

    _dispose: function() {
        this._optionChangedCallbacks.empty();
        this._createDisposingAction();
        this._disposingAction();
        this._disposeEvents();
        this._optionManager.dispose();
        this._disposed = true;
    },

    instance: function() {
        return this;
    },

    beginUpdate: function() {
        this._updateLockCount++;
    },

    endUpdate: function() {
        this._updateLockCount = Math.max(this._updateLockCount - 1, 0);
        if(!this._updateLockCount) {
            this.postponedOperations.callPostponedOperations();
            if(!this._initializing && !this._initialized) {
                this._initializing = true;
                try {
                    this._init();
                } finally {
                    this._initializing = false;
                    this._updateLockCount++;
                    this._createActionByOption('onInitialized', { excludeValidators: ['disabled', 'readOnly'] })();
                    this._updateLockCount--;
                    this._initialized = true;
                }
            }
        }
    },

    _optionChanging: noop,

    _notifyOptionChanged: function(option, value, previousValue) {
        const that = this;

        if(this._initialized) {
            const optionNames = [option].concat(that._getOptionAliasesByName(option));
            for(let i = 0; i < optionNames.length; i++) {
                const name = optionNames[i];
                const args = {
                    name: name.split(/[.[]/)[0],
                    fullName: name,
                    value: value,
                    previousValue: previousValue
                };

                that._optionChangedCallbacks.fireWith(that, [extend(that._defaultActionArgs(), args)]);
                that._optionChangedAction(extend({}, args));

                if(!that._disposed && this._cancelOptionChange !== args.name) {
                    that._optionChanged(args);
                }
            }
        }
    },

    initialOption: function(optionName) {
        if(!this._initialOptions) {
            this._initialOptions = this._getDefaultOptions();
            const rulesOptions = this._getOptionByRules(this._getOptionByStealth('defaultOptionsRules'));
            this._optionManager.setValueByReference(this._initialOptions, rulesOptions);
        }

        return this._initialOptions[optionName];
    },

    _defaultActionConfig: function() {
        return {
            context: this,
            component: this
        };
    },

    _defaultActionArgs: function() {
        return {
            component: this
        };
    },

    _createAction: function(actionSource, config) {
        const that = this;
        let action;

        return function(e) {
            if(!arguments.length) {
                e = {};
            }

            if(!typeUtils.isPlainObject(e)) {
                e = { actionValue: e };
            }

            action = action || new Action(actionSource, extend(config, that._defaultActionConfig()));

            return action.execute.call(action, extend(e, that._defaultActionArgs()));
        };
    },

    _createActionByOption: function(optionName, config) {
        const that = this;
        let action;
        let eventName;
        let actionFunc;

        let result = function() {
            if(!eventName) {
                config = config || {};

                if(typeof optionName !== 'string') {
                    throw errors.Error('E0008');
                }

                if(optionName.indexOf('on') === 0) {
                    eventName = that._getEventName(optionName);
                }
                ///#DEBUG
                if(optionName.indexOf('on') !== 0) {
                    throw Error('The \'' + optionName + '\' option name should start with \'on\' prefix');
                }
                ///#ENDDEBUG

                actionFunc = that.option(optionName);
            }

            if(!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !that.hasEvent(eventName)) {
                return;
            }

            if(!action) {
                const beforeExecute = config.beforeExecute;
                config.beforeExecute = function(args) {
                    beforeExecute && beforeExecute.apply(that, arguments);
                    that.fireEvent(eventName, args.args);
                };
                action = that._createAction(actionFunc, config);
            }

            if(Config().wrapActionsBeforeExecute) {
                const beforeActionExecute = that.option('beforeActionExecute') || noop;
                const wrappedAction = beforeActionExecute(that, action, config) || action;
                return wrappedAction.apply(that, arguments);
            }

            return action.apply(that, arguments);
        };

        if(!Config().wrapActionsBeforeExecute) {
            const onActionCreated = that.option('onActionCreated') || noop;
            result = onActionCreated(that, result, config) || result;
        }

        return result;
    },

    _getOptionByStealth: function(name) {
        return this._optionManager.getValueSilently(name);
    },

    _setOptionByStealth: function(options, value) {
        this._optionManager.setValueSilently(normalizeOptions(options, value));
    },

    _getEventName: function(actionName) {
        return actionName.charAt(2).toLowerCase() + actionName.substr(3);
    },

    hasActionSubscription: function(actionName) {
        return !!this.option(actionName) ||
            this.hasEvent(this._getEventName(actionName));
    },

    isOptionDeprecated: function(name) {
        const deprecatedOptions = this._getDeprecatedOptions();
        return Object.prototype.hasOwnProperty.call(deprecatedOptions, name);
    },

    _setOptionSilent: function(name, value) {
        this._cancelOptionChange = name;
        this.option(name, value);
        this._cancelOptionChange = false;
    },

    _getOptionValue: function(name, context) {
        const value = this.option(name);

        if(isFunction(value)) {
            return value.bind(context)();
        }

        return value;
    },

    option: function(options, value) {
        if(arguments.length < 2 && typeUtils.type(options) !== 'object') {
            return this._optionManager.getValue(options);
        }

        this.beginUpdate();

        try {
            this._optionManager.setValue(normalizeOptions(options, value));
        } finally {
            this.endUpdate();
        }
    },

    resetOption: function(name) {
        if(!name) {
            return;
        }

        let defaultValue;
        if(name.search(/\.|\[/) !== -1) {
            name = bracketsToDots(name);
            const fullPath = name.split('.');
            fullPath.forEach((path) => {
                defaultValue = defaultValue ? defaultValue[path] : this.initialOption(path);
            });
        } else {
            defaultValue = this.initialOption(name);
        }

        defaultValue = typeUtils.isObject(defaultValue) ? objectUtils.clone(defaultValue) : defaultValue;

        this.beginUpdate();
        this._optionManager.setValue(normalizeOptions(name, defaultValue), false);
        this.endUpdate();
    }
}).include(EventsMixin);

module.exports = Component;
module.exports.PostponedOperations = PostponedOperations;

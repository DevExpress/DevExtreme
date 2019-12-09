import Config from './config';
import { extend } from './utils/extend';
import { Options } from './options/index';
import { convertRulesToOptions } from './options/utils';
import Class from './class';
import Action from './action';
import errors from './errors';
import Callbacks from './utils/callbacks';
import { EventsStrategy } from './events_strategy';
import publicComponentUtils from './utils/public_component';
import { PostponedOperations } from './postponed_operations';
import { isFunction, isPlainObject, type, isDefined } from './utils/type';
import { noop } from './utils/common';

const getEventName = (actionName) => {
    return actionName.charAt(2).toLowerCase() + actionName.substr(3);
};

/**
* @name Component
* @type object
* @module core/component
* @export default
* @namespace DevExpress
* @hidden
*/
const Component = Class.inherit({
    _setDeprecatedOptions() {
        this._deprecatedOptions = {};
    },

    _getDeprecatedOptions() {
        return this._deprecatedOptions;
    },

    _getDefaultOptions() {
        return {
            /**
            * @name ComponentOptions.onInitialized
            * @type function
            * @type_function_param1 e:object
            * @type_function_param1_field1 component:this
            * @type_function_param1_field2 element:dxElement
            * @default null
            * @action
            */
            onInitialized: null,
            /**
            * @name ComponentOptions.onOptionChanged
            * @type function
            * @type_function_param1 e:object
            * @type_function_param1_field1 component:this
            * @type_function_param1_field4 name:string
            * @type_function_param1_field5 fullName:string
            * @type_function_param1_field6 value:any
            * @default null
            * @action
            */
            onOptionChanged: null,
            /**
            * @name ComponentOptions.onDisposing
            * @type function
            * @type_function_param1 e:object
            * @type_function_param1_field1 component:this
            * @default null
            * @action
            */
            onDisposing: null,

            defaultOptionsRules: null
        };
    },

    _defaultOptionsRules() {
        return [];
    },

    _setOptionsByDevice(rules) {
        this._options.applyRules(rules);
    },

    _convertRulesToOptions(rules) {
        return convertRulesToOptions(rules);
    },

    _isInitialOptionValue(name) {
        return this._options.isInitial(name);
    },

    _setOptionsByReference() {
        this._optionsByReference = {};
    },

    _getOptionsByReference() {
        return this._optionsByReference;
    },
    /**
    * @name ComponentMethods.ctor
    * @publicName ctor(options)
    * @param1 options:ComponentOptions|undefined
    * @hidden
    */
    ctor(options = {}) {
        const { _optionChangedCallbacks, _disposingCallbacks } = options;

        this.NAME = publicComponentUtils.name(this.constructor);

        this._eventsStrategy = EventsStrategy.create(this, options.eventsStrategy);

        this._updateLockCount = 0;

        this._optionChangedCallbacks = _optionChangedCallbacks || Callbacks();
        this._disposingCallbacks = _disposingCallbacks || Callbacks();
        this.postponedOperations = new PostponedOperations();
        this._createOptions(options);
    },

    _createOptions(options) {
        this.beginUpdate();

        try {
            this._setOptionsByReference();
            this._setDeprecatedOptions();
            this._options = new Options(
                this._getDefaultOptions(),
                this._getDefaultOptions(),
                this._getOptionsByReference(),
                this._getDeprecatedOptions()
            );

            this._options.onChanging(
                (name, previousValue, value) => this._initialized && this._optionChanging(name, previousValue, value));
            this._options.onDeprecated(
                (option, info) => this._logDeprecatedWarning(option, info));
            this._options.onChanged(
                (name, value, previousValue) => this._notifyOptionChanged(name, value, previousValue));
            this._options.addRules(this._defaultOptionsRules());

            if(options && options.onInitializing) {
                options.onInitializing.apply(this, [options]);
            }

            this._setOptionsByDevice(options.defaultOptionsRules);
            this._initOptions(options);
        } finally {
            this.endUpdate();
        }
    },

    _initOptions(options) {
        this.option(options);
    },

    _init() {
        this._createOptionChangedAction();

        this.on("disposing", (args) => {
            this._disposingCallbacks.fireWith(this, [args]);
        });
    },

    _logDeprecatedWarning(option, info) {
        const message = info.message || ("Use the '" + info.alias + "' option instead");
        errors.log("W0001", this.NAME, option, info.since, message);
    },

    _createOptionChangedAction() {
        this._optionChangedAction = this._createActionByOption("onOptionChanged", { excludeValidators: ["disabled", "readOnly"] });
    },

    _createDisposingAction() {
        this._disposingAction = this._createActionByOption("onDisposing", { excludeValidators: ["disabled", "readOnly"] });
    },

    _optionChanged(args) {
        switch(args.name) {
            case "onDisposing":
            case "onInitialized":
                break;
            case "onOptionChanged":
                this._createOptionChangedAction();
                break;
            case "defaultOptionsRules":
                break;
        }
    },

    _dispose() {
        this._optionChangedCallbacks.empty();
        this._createDisposingAction();
        this._disposingAction();
        this._eventsStrategy.dispose();
        this._options.dispose();
        this._disposed = true;
    },

    /**
     * @name componentmethods.instance
     * @publicName instance()
     * @return this
     */
    instance() {
        return this;
    },

    /**
     * @name componentmethods.beginupdate
     * @publicName beginUpdate()
     */
    beginUpdate() {
        this._updateLockCount++;
    },

    /**
     * @name componentmethods.endupdate
     * @publicName endUpdate()
     */
    endUpdate() {
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
                    this._createActionByOption("onInitialized", { excludeValidators: ["disabled", "readOnly"] })();
                    this._updateLockCount--;
                    this._initialized = true;
                }
            }
        }
    },

    _optionChanging: noop,

    _notifyOptionChanged(option, value, previousValue) {
        if(this._initialized) {
            const optionNames = [option].concat(this._options.getAliasesByName(option));
            for(let i = 0; i < optionNames.length; i++) {
                const name = optionNames[i];
                const args = {
                    name: name.split(/[.[]/)[0],
                    fullName: name,
                    value: value,
                    previousValue: previousValue
                };

                this._optionChangedCallbacks.fireWith(this, [extend(this._defaultActionArgs(), args)]);
                this._optionChangedAction(extend({}, args));

                if(!this._disposed && this._cancelOptionChange !== args.name) {
                    this._optionChanged(args);
                }
            }
        }
    },

    initialOption(name) {
        return this._options.initial(name);
    },

    _defaultActionConfig() {
        return {
            context: this,
            component: this
        };
    },

    _defaultActionArgs() {
        return {
            component: this
        };
    },

    _createAction(actionSource, config) {
        let action;

        return (e) => {
            if(!isDefined(e)) {
                e = {};
            }

            if(!isPlainObject(e)) {
                e = { actionValue: e };
            }

            action = action || new Action(actionSource, extend(config, this._defaultActionConfig()));

            return action.execute.call(action, extend(e, this._defaultActionArgs()));
        };
    },

    _createActionByOption(optionName, config) {
        let action;
        let eventName;
        let actionFunc;

        let result = (...args) => {
            if(!eventName) {
                config = config || {};

                if(typeof optionName !== "string") {
                    throw errors.Error("E0008");
                }

                if(optionName.indexOf("on") === 0) {
                    eventName = getEventName(optionName);
                }
                ///#DEBUG
                if(optionName.indexOf("on") !== 0) {
                    throw Error("The '" + optionName + "' option name should start with 'on' prefix");
                }
                ///#ENDDEBUG

                actionFunc = this.option(optionName);
            }

            if(!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !this._eventsStrategy.hasEvent(eventName)) {
                return;
            }

            if(!action) {
                const beforeExecute = config.beforeExecute;
                config.beforeExecute = (...props) => {
                    beforeExecute && beforeExecute.apply(this, props);
                    this._eventsStrategy.fireEvent(eventName, props[0].args);
                };
                action = this._createAction(actionFunc, config);
            }

            if(Config().wrapActionsBeforeExecute) {
                const beforeActionExecute = this.option("beforeActionExecute") || noop;
                const wrappedAction = beforeActionExecute(this, action, config) || action;
                return wrappedAction.apply(this, args);
            }

            return action.apply(this, args);
        };

        if(!Config().wrapActionsBeforeExecute) {
            const onActionCreated = this.option("onActionCreated") || noop;
            result = onActionCreated(this, result, config) || result;
        }

        return result;
    },

    /**
     * @name ComponentMethods.on
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    /**
     * @name ComponentMethods.on
     * @publicName on(events)
     * @param1 events:object
     * @return this
     */
    on(eventName, eventHandler) {
        this._eventsStrategy.on(eventName, eventHandler);
        return this;
    },

    /**
     * @name ComponentMethods.off
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     */
    /**
     * @name ComponentMethods.off
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     */
    off(eventName, eventHandler) {
        this._eventsStrategy.off(eventName, eventHandler);
        return this;
    },

    hasActionSubscription(actionName) {
        return !!this._getOptionByStealth(actionName) ||
            this._eventsStrategy.hasEvent(getEventName(actionName));
    },

    isOptionDeprecated(name) {
        return this._options.isDeprecated(name);
    },

    _getOptionByStealth(name) {
        return this._options.silent(name);
    },

    _setOptionByStealth(options, value) {
        this._options.silent(options, value);
    },

    _setOptionSilent(name, value) {
        this._cancelOptionChange = name;
        this.option(name, value);
        this._cancelOptionChange = false;
    },

    _getOptionValue(name, context) {
        const value = this.option(name);

        if(isFunction(value)) {
            return value.bind(context)();
        }

        return value;
    },

    /**
     * @name componentmethods.option
     * @publicName option()
     * @return object
     */
    /**
     * @name componentmethods.option
     * @publicName option(optionName)
     * @param1 optionName:string
     * @return any
     */
    /**
     * @name componentmethods.option
     * @publicName option(optionName, optionValue)
     * @param1 optionName:string
     * @param2 optionValue:any
     */
    /**
     * @name componentmethods.option
     * @publicName option(options)
     * @param1 options:object
     */
    option(options, value) {
        if(arguments.length < 2 && type(options) !== "object") {
            return this._options.option(options);
        } else {
            this.beginUpdate();

            try {
                this._options.option(options, value);
            } finally {
                this.endUpdate();
            }
        }
    },

    /**
     * @name componentmethods.resetOption
     * @publicName resetOption(optionName)
     * @param1 optionName:string
     */
    resetOption(name) {
        this.beginUpdate();
        this._options.reset(name);
        this.endUpdate();
    }
});

module.exports = Component;

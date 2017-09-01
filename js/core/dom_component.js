"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    extend = require("./utils/extend").extend,
    config = require("./config"),
    errors = require("./errors"),
    windowResizeCallbacks = require("./utils/window").resizeCallbacks,
    commonUtils = require("./utils/common"),
    each = require("./utils/iterator").each,
    typeUtils = require("./utils/type"),
    inArray = require("./utils/array").inArray,
    publicComponentUtils = require("./utils/public_component"),
    dataUtils = require("./element_data"),
    Component = require("./component"),
    abstract = Component.abstract;

var RTL_DIRECTION_CLASS = "dx-rtl",
    VISIBILITY_CHANGE_CLASS = "dx-visibility-change-handler",
    VISIBILITY_CHANGE_EVENTNAMESPACE = "VisibilityChange";

/**
 * @name domcomponent
 * @section uiWidgets
 * @publicName DOMComponent
 * @type object
 * @inherits Component
 * @module core/dom_component
 * @export default
 * @hidden
 */
var DOMComponent = Component.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name domcomponentoptions_onOptionChanged
            * @publicName onOptionChanged
            * @action
            * @extends Action
            * @extend_doc
            */
            /**
            * @name domcomponentoptions_onDisposing
            * @publicName onDisposing
            * @action
            * @extends Action
            * @extend_doc
            */

            /**
            * @name domcomponentoptions_width
            * @publicName width
            * @type number|string|function
            * @default undefined
            * @type_function_return number|string
            */
            width: undefined,

            /**
            * @name domcomponentoptions_height
            * @publicName height
            * @type number|string|function
            * @default undefined
            * @type_function_return number|string
            */
            height: undefined,

            /**
            * @name domcomponentoptions_rtlEnabled
            * @publicName rtlEnabled
            * @type boolean
            * @default false
            */
            rtlEnabled: config().rtlEnabled,

            /**
             * @name domcomponentoptions_elementAttr
             * @publicName elementAttr
             * @type object
             * @default {}
             */
            elementAttr: {},

            disabled: false,

            integrationOptions: {}
        });
    },

    ctor: function(element, options) {
        this._$element = $(element);
        publicComponentUtils.attachInstanceToElement(this._$element, this, this._dispose);
        this.callBase(options);
    },

    _visibilityChanged: abstract,

    _dimensionChanged: abstract,

    _init: function() {
        this.callBase();
        this._attachWindowResizeCallback();
    },

    _setOptionsByDevice: function(instanceCustomRules) {
        this.callBase([].concat(this.constructor._classCustomRules || [], instanceCustomRules || []));
    },

    _isInitialOptionValue: function(name) {
        var isCustomOption = this.constructor._classCustomRules && this._convertRulesToOptions(this.constructor._classCustomRules).hasOwnProperty(name);

        return !isCustomOption && this.callBase(name);
    },

    _attachWindowResizeCallback: function() {
        if(this._isDimensionChangeSupported()) {
            var windowResizeCallBack = this._windowResizeCallBack = this._dimensionChanged.bind(this);
            windowResizeCallbacks.add(windowResizeCallBack);
        }
    },

    _isDimensionChangeSupported: function() {
        return this._dimensionChanged !== abstract;
    },

    _render: function() {
        this._renderElementAttributes();
        this._toggleRTLDirection(this.option("rtlEnabled"));
        this._renderVisibilityChange();
        this._renderDimensions();
    },

    _renderElementAttributes: function() {
        var attributes = extend({}, this.option("elementAttr")),
            classNames = attributes.class;

        delete attributes.class;

        this.element()
            .attr(attributes)
            .addClass(classNames);
    },

    _renderVisibilityChange: function() {
        if(this._isDimensionChangeSupported()) {
            this._attachDimensionChangeHandlers();
        }

        if(!this._isVisibilityChangeSupported()) {
            return;
        }

        this.element().addClass(VISIBILITY_CHANGE_CLASS);
        this._attachVisibilityChangeHandlers();
    },

    _renderDimensions: function() {
        var width = this._getOptionValue("width"),
            height = this._getOptionValue("height"),
            $element = this.element();

        $element.outerWidth(width);
        $element.outerHeight(height);
    },

    _attachDimensionChangeHandlers: function() {
        var that = this;
        var resizeEventName = "dxresize." + this.NAME + VISIBILITY_CHANGE_EVENTNAMESPACE;


        eventsEngine.off(that.element(), resizeEventName);
        eventsEngine.on(that.element(), resizeEventName, function() {
            that._dimensionChanged();
        });
    },

    _attachVisibilityChangeHandlers: function() {
        var that = this;
        var hidingEventName = "dxhiding." + this.NAME + VISIBILITY_CHANGE_EVENTNAMESPACE;
        var shownEventName = "dxshown." + this.NAME + VISIBILITY_CHANGE_EVENTNAMESPACE;

        that._isHidden = !that._isVisible();
        eventsEngine.off(that.element(), hidingEventName);
        eventsEngine.on(that.element(), hidingEventName, function() {
            that._checkVisibilityChanged("hiding");
        });
        eventsEngine.off(that.element(), shownEventName);
        eventsEngine.on(that.element(), shownEventName, function() {
            that._checkVisibilityChanged("shown");
        });
    },

    _isVisible: function() {
        return this.element().is(":visible");
    },

    _checkVisibilityChanged: function(event) {
        if(event === "hiding" && this._isVisible() && !this._isHidden) {
            this._visibilityChanged(false);
            this._isHidden = true;
        } else if(event === "shown" && this._isVisible() && this._isHidden) {
            this._isHidden = false;
            this._visibilityChanged(true);
        }
    },

    _isVisibilityChangeSupported: function() {
        return this._visibilityChanged !== abstract;
    },

    _clean: commonUtils.noop,

    _modelByElement: function() {
        var modelByElement = this.option("modelByElement") || commonUtils.noop;
        return modelByElement(this.element());
    },

    _invalidate: function() {
        if(!this._updateLockCount) {
            throw errors.Error("E0007");
        }

        this._requireRefresh = true;
    },

    _refresh: function() {
        this._clean();
        this._render();
    },

    _dispose: function() {
        this.callBase();
        this._clean();
        this._detachWindowResizeCallback();
    },

    _detachWindowResizeCallback: function() {
        if(this._isDimensionChangeSupported()) {
            windowResizeCallbacks.remove(this._windowResizeCallBack);
        }
    },

    _toggleRTLDirection: function(rtl) {
        this.element().toggleClass(RTL_DIRECTION_CLASS, rtl);
    },

    _createComponent: function(element, component, config) {
        var that = this;

        config = config || {};

        var synchronizableOptions = commonUtils.grep(["rtlEnabled", "disabled"], function(value) {
            return !(value in config);
        });

        var nestedComponentOptions = that.option("nestedComponentOptions") || commonUtils.noop;
        that._extendConfig(config, extend({
            integrationOptions: this.option("integrationOptions"),
            rtlEnabled: this.option("rtlEnabled"),
            disabled: this.option("disabled")
        }, nestedComponentOptions(this)));

        var instance;
        if(typeUtils.isString(component)) {
            var $element = $(element)[component](config);
            instance = $element[component]("instance");
        } else if(element) {
            instance = component.getInstance(element);
            if(instance) {
                instance.option(config);
            } else {
                instance = new component(element, config);
            }
        }
        if(instance) {
            var optionChangedHandler = function(args) {
                if(inArray(args.name, synchronizableOptions) >= 0) {
                    instance.option(args.name, args.value);
                }
            };

            that.on("optionChanged", optionChangedHandler);

            instance.on("disposing", function() {
                that.off("optionChanged", optionChangedHandler);
            });
        }

        return instance;
    },

    _extendConfig: function(config, extendConfig) {
        each(extendConfig, function(key, value) {
            config[key] = config.hasOwnProperty(key) ? config[key] : value;
        });
    },

    _defaultActionConfig: function() {
        return extend(this.callBase(), {
            context: this._modelByElement(this.element())
        });
    },

    /**
    * @pseudo Action
    * @section Utils
    * @type function
    * @default null
    * @type_function_param1 e:object
    * @type_function_param1_field1 component:object
    * @type_function_param1_field2 element:jQuery
    * @type_function_param1_field3 model:object
    **/
    _defaultActionArgs: function() {
        var element = this.element(),
            model = this._modelByElement(this.element());
        return extend(this.callBase(), {
            element: element,
            model: model
        });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "width":
            case "height":
                this._renderDimensions();
                break;
            case "rtlEnabled":
            case "elementAttr":
                this._invalidate();
                break;
            case "disabled":
            case "integrationOptions":
                break;
            default:
                this.callBase(args);
                break;
        }
    },

    endUpdate: function() {
        var requireRender = !this._initializing && !this._initialized;

        this.callBase.apply(this, arguments);

        if(!this._updateLockCount) {
            if(requireRender) {
                this._render();
            } else if(this._requireRefresh) {
                this._requireRefresh = false;
                this._refresh();
            }
        }
    },

    /**
    * @name domcomponentmethods_element
    * @publicName element()
    * @return jQuery
    */
    element: function() {
        return this._$element;
    },

    /**
    * @name domcomponentmethods_dispose
    * @publicName dispose()
    */
    dispose: function() {
        dataUtils.cleanDataRecursive(this.element().get(0), true);
        this.element().get(0).textContent = "";
    }

});

DOMComponent.getInstance = function($element) {
    return publicComponentUtils.getInstanceByElement($($element), this);
};

/**
* @name domcomponentmethods_defaultOptions
* @section uiWidgets
* @publicName defaultOptions(rule)
* @param1 rule:object
* @param1_field1 device:Object|array|function
* @param1_field2 options:Object
*/
DOMComponent.defaultOptions = function(rule) {
    this._classCustomRules = this._classCustomRules || [];
    this._classCustomRules.push(rule);
};


module.exports = DOMComponent;

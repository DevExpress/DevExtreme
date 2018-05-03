"use strict";

require("../integration/jquery");

var $ = require("jquery"),
    errors = require("./errors"),
    extend = require("../core/utils/extend").extend,
    typeUtils = require("../core/utils/type"),
    registerComponent = require("../core/component_registrator"),
    DOMComponent = require("../core/dom_component"),
    isFunction = typeUtils.isFunction,
    isPlainObject = typeUtils.isPlainObject,
    noop = require("../core/utils/common").noop;

require("../integration/knockout");

/**
* @name dxaction
* @publicName dxAction
* @type function(e)|string|object
* @type_function_param1 e:object
* @type_function_param1_field1 element:jQuery
* @type_function_param1_field2 model:object
* @type_function_param1_field3 jQueryEvent:jQuery.Event:deprecated(event)
* @type_function_param1_field4 event:event
*/

/**
* @name dxcommand
* @publicName dxCommand
* @inherits DOMComponent
* @type object
* @module framework/command
* @export default
*/
var Command = DOMComponent.inherit({
    ctor: function(element, options) {
        if(isPlainObject(element)) {
            options = element;
            element = $("<div>");
        }
        this.callBase(element, options);
    },

    _setDeprecatedOptions: function() {
        this.callBase();

        extend(this._deprecatedOptions, {
            /**
            * @name dxCommandOptions.iconSrc
            * @publicName iconSrc
            * @deprecated dxCommandOptions.icon
            * @inheritdoc
            */
            "iconSrc": { since: "15.1", alias: "icon" }
        });
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxCommandOptions.onExecute
            * @publicName onExecute
            * @type function|string|object
            * @extends Action
            */
            onExecute: null,
            /**
            * @name dxCommandOptions.id
            * @publicName id
            * @type string
            * @default null
            */
            id: null,
            /**
            * @name dxCommandOptions.title
            * @publicName title
            * @type string
            * @default ""
            */
            title: "",
            /**
            * @name dxCommandOptions.icon
            * @publicName icon
            * @type string
            * @default ""
            */
            icon: "",
            /**
            * @name dxCommandOptions.visible
            * @publicName visible
            * @type bool
            * @default true
            */
            visible: true,
            /**
            * @name dxCommandOptions.disabled
            * @publicName disabled
            * @type bool
            * @default false
            */
            disabled: false,
            /**
            * @name dxCommandOptions.renderStage
            * @publicName renderStage
            * @type string
            * @acceptValues 'onViewShown'|'onViewRendering'
            * @default "onViewShown"
            */
            renderStage: "onViewShown"
            /**
            * @name dxCommandOptions.type
            * @publicName type
            * @type string
            * @default undefined
            */

        });
    },
    /**
    * @name dxcommandmethods.execute
    * @publicName execute()
    */
    execute: function() {
        var isDisabled = this._options.disabled;
        if(isFunction(isDisabled)) {
            isDisabled = !!isDisabled.apply(this, arguments);
        }
        if(isDisabled) {
            throw errors.Error("E3004", this._options.id);
        }
        this.fireEvent("beforeExecute", arguments);
        this._createActionByOption("onExecute").apply(this, arguments);
        this.fireEvent("afterExecute", arguments);
    },

    _render: function() {
        this.callBase();
        this.$element().addClass("dx-command");
    },

    _renderDisabledState: noop,

    _dispose: function() {
        this.callBase();
        this.$element().removeData(this.NAME);
    }
});

registerComponent("dxCommand", Command);

module.exports = Command;

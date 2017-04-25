"use strict";

var $ = require("jquery"),
    MarkupComponent = require("./markup_component").MarkupComponent,
    registerComponent = require("../../core/component_registrator");

require("../../integration/knockout");

/**
* @name dxCommandContainer
* @section frameworkMarkupComponents
* @publicName dxCommandContainer
* @type object
* @module framework/html/command_container
*/
var CommandContainer = MarkupComponent.inherit({
    ctor: function(element, options) {
        if($.isPlainObject(element)) {
            options = element;
            element = $("<div />");
        }
        this.callBase(element, options);
    },
    _setDefaultOptions: function() {
        this.callBase();

        this.option({
            /**
            * @name dxCommandContaineroptions_id
            * @publicName id
            * @type string
            * @default null
            */
            id: null
        });
    },
    _render: function() {
        this.callBase();
        this.element().addClass("dx-command-container");
    }
});

registerComponent("dxCommandContainer", CommandContainer);

module.exports = CommandContainer;

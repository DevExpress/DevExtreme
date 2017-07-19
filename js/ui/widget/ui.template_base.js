"use strict";

var Callbacks = require("../../core/utils/callbacks"),
    triggerShownEvent = require("../../core/utils/dom").triggerShownEvent,
    Class = require("../../core/class"),
    abstract = Class.abstract;


var renderedCallbacks = Callbacks();

/**
 * @name dxTemplate
 * @section uiWidgetMarkupComponents
 * @publicName dxTemplate
 * @type object
 */

/**
 * @name dxTemplateOptions_name
 * @publicName name
 * @type string
 */

var TemplateBase = Class.inherit({

    render: function(options) {
        options = options || {};

        var $result = this._renderCore(options);

        this._ensureResultInContainer($result, options.container);
        renderedCallbacks.fire($result, options.container);

        return $result;
    },

    _ensureResultInContainer: function($result, $container) {
        if(!$container) {
            return;
        }

        var resultInContainer = $container.get(0).contains($result.get(0));
        $container.append($result);
        if(resultInContainer) {
            return;
        }

        var resultInBody = document.body.contains($container.get(0));
        if(!resultInBody) {
            return;
        }

        triggerShownEvent($result);
    },

    _renderCore: abstract

});

module.exports = TemplateBase;
module.exports.renderedCallbacks = renderedCallbacks;

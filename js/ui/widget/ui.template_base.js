var $ = require('../../core/renderer'),
    domAdapter = require('../../core/dom_adapter'),
    Callbacks = require('../../core/utils/callbacks'),
    domUtils = require('../../core/utils/dom'),
    Class = require('../../core/class'),
    abstract = Class.abstract;


var renderedCallbacks = Callbacks({ syncStrategy: true });

/**
 * @name dxTemplate
 * @section uiWidgetMarkupComponents
 * @type object
 */

/**
 * @name dxTemplateOptions.name
 * @type string
 */

var TemplateBase = Class.inherit({

    render: function(options) {
        options = options || {};

        var onRendered = options.onRendered;
        delete options.onRendered;

        var $result = this._renderCore(options);

        this._ensureResultInContainer($result, options.container);
        renderedCallbacks.fire($result, options.container);

        onRendered && onRendered();
        return $result;
    },

    _ensureResultInContainer: function($result, container) {
        if(!container) {
            return;
        }

        var $container = $(container);
        var resultInContainer = domUtils.contains($container.get(0), $result.get(0));
        $container.append($result);
        if(resultInContainer) {
            return;
        }

        var resultInBody = domAdapter.getBody().contains($container.get(0));
        if(!resultInBody) {
            return;
        }

        domUtils.triggerShownEvent($result);
    },

    _renderCore: abstract

});

module.exports = TemplateBase;
module.exports.renderedCallbacks = renderedCallbacks;

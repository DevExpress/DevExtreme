const $ = require('../../core/renderer');
const domAdapter = require('../../core/dom_adapter');
const Callbacks = require('../../core/utils/callbacks');
const domUtils = require('../../core/utils/dom');
const Class = require('../../core/class');
const abstract = Class.abstract;


const renderedCallbacks = Callbacks({ syncStrategy: true });

/**
 * @name dxTemplate
 * @section uiWidgetMarkupComponents
 * @type object
 */

/**
 * @name dxTemplateOptions.name
 * @type string
 */

const TemplateBase = Class.inherit({

    render: function(options) {
        options = options || {};

        const onRendered = options.onRendered;
        delete options.onRendered;

        const $result = this._renderCore(options);

        this._ensureResultInContainer($result, options.container);
        renderedCallbacks.fire($result, options.container);

        onRendered && onRendered();
        return $result;
    },

    _ensureResultInContainer: function($result, container) {
        if(!container) {
            return;
        }

        const $container = $(container);
        const resultInContainer = domUtils.contains($container.get(0), $result.get(0));
        $container.append($result);
        if(resultInContainer) {
            return;
        }

        const resultInBody = domAdapter.getBody().contains($container.get(0));
        if(!resultInBody) {
            return;
        }

        domUtils.triggerShownEvent($result);
    },

    _renderCore: abstract

});

module.exports = TemplateBase;
module.exports.renderedCallbacks = renderedCallbacks;

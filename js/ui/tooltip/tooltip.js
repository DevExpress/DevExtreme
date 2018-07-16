"use strict";

var $ = require("../../core/renderer"),
    Guid = require("../../core/guid"),
    registerComponent = require("../../core/component_registrator"),
    extend = require("../../core/utils/extend").extend,
    Popover = require("../popover"),
    TOOLTIP_CLASS = "dx-tooltip",
    TOOLTIP_WRAPPER_CLASS = "dx-tooltip-wrapper";

var Tooltip = Popover.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTooltipOptions.toolbarItems
            * @hidden
            * @inheritdoc
            */
            toolbarItems: [],

            /**
            * @name dxTooltipOptions.showCloseButton
            * @hidden
            * @inheritdoc
            */
            showCloseButton: false,

            /**
            * @name dxTooltipOptions.showTitle
            * @hidden
            * @inheritdoc
            */
            showTitle: false,

            /**
            * @name dxTooltipOptions.title
            * @hidden
            * @inheritdoc
            */
            title: null,

            /**
            * @name dxTooltipOptions.titleTemplate
            * @hidden
            * @inheritdoc
            */
            titleTemplate: null,

            /**
            * @name dxTooltipOptions.onTitleRendered
            * @hidden
            * @action
            * @inheritdoc
            */
            onTitleRendered: null,
            bottomTemplate: null,
            propagateOutsideClick: true
        });
    },

    _render: function() {
        this.$element().addClass(TOOLTIP_CLASS);
        this._wrapper().addClass(TOOLTIP_WRAPPER_CLASS);
        this.callBase();
    },

    _renderContent: function() {
        this.callBase();

        this._contentId = "dx-" + new Guid();

        this._$content.attr({
            "id": this._contentId,
            "role": "tooltip"
        });

        this._toggleAriaDescription(true);
    },

    _toggleAriaDescription: function(showing) {
        var $target = $(this.option("target")),
            label = showing ? this._contentId : undefined;

        this.setAria("describedby", label, $target);
    }
});

registerComponent("dxTooltip", Tooltip);

module.exports = Tooltip;

var $ = require("../../core/renderer"),
    Guid = require("../../core/guid"),
    registerComponent = require("../../core/component_registrator"),
    extend = require("../../core/utils/extend").extend,
    iconUtils = require("../../core/utils/icon"),
    // inkRipple = require("../widget/utils.ink_ripple"),
    Overlay = require("../overlay"),
    ActionButtonMain = require("./action_button_base"),
    ACTION_BUTTON_CLASS = "dx-actionbutton",
    ACTION_BUTTON_ICON_CLASS = "dx-actionbutton-icon";
    // ACTION_BUTTON_WRAPPER_CLASS = "dx-action-button-wrapper";

var ActionButton = Overlay.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxActionButtonOptions.icon
            * @hidden
            * @inheritdoc
            */
            icon: null,

            /**
            * @name dxActionButtonOptions.label
            * @hidden
            * @inheritdoc
            */
            closeIcon: null,

            /**
            * @name dxButtonOptions.onClick
            * @type function(e)
            * @extends Action
            */

            onClick: null,

            visible: true,
            position: "right bottom",
            width: 56,
            height: 56,
            shading: false,
            propagateOutsideClick: true
        });
    },

    _render: function() {
        this.$element().addClass(ACTION_BUTTON_CLASS);
        // this._wrapper().addClass(ACTION_BUTTON_WRAPPER_CLASS);
        this.callBase();
        this._renderIcon();
    },

    _renderContent: function() {
        this.callBase();

        this._contentId = "dx-" + new Guid();

        this._$content.attr({
            "id": this._contentId,
            "role": "action-button"
        });
    },

    _renderIcon: function() {
        this._$icon = $("<div>").addClass(ACTION_BUTTON_ICON_CLASS);
        var $iconElement = iconUtils.getImageContainer(this._options.icon);

        this._$icon.append($iconElement);
        this._$content.append(this._$icon);
    },

    _renderMainActionButton() {
        ActionButtonMain._render();
    }
});

registerComponent("dxActionButton", ActionButton);

module.exports = ActionButton;


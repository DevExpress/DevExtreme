var $ = require("../../core/renderer"),
    Guid = require("../../core/guid"),
    registerComponent = require("../../core/component_registrator"),
    extend = require("../../core/utils/extend").extend,
    Overlay = require("../overlay"),
    ACTION_BUTTON_MAIN_CLASS = "dx-actionbutton-main";
    // ACTION_BUTTON_WRAPPER_CLASS = "dx-action-button-wrapper";

var ActionButtonMain = Overlay.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxActionButtonMainOptions.icon
            * @hidden
            * @inheritdoc
            */
            icon: null,

            /**
            * @name dxActionButtonMainOptions.closeIcon
            * @hidden
            * @inheritdoc
            */
            closeIcon: null,

            /**
            * @name dxActionButtonMainOptions.position
            * @hidden
            * @inheritdoc
            */
            position: "right bottom",
            /**
            * @name dxActionButtonMainOptions.maxActionButtonCount
            * @hidden
            * @inheritdoc
            */
            maxActionButtonCount: 6,
            visible: true,
            width: 56,
            height: 56,
            shading: false
        });
    },

    _render: function() {
        $("<div>").addClass(ACTION_BUTTON_MAIN_CLASS);
        // this._wrapper().addClass(ACTION_BUTTON_WRAPPER_CLASS);
        this.callBase();
    },

    _renderContent: function() {
        this.callBase();

        this._contentId = "dx-" + new Guid();

        this._$content.attr({
            "id": this._contentId,
            "role": "action-button-main"
        });

    }
});

registerComponent("dxActionButtonMain", ActionButtonMain);

module.exports = ActionButtonMain;

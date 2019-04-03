import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import eventUtils from "../../events/utils";
import clickEvent from "../../events/click";
import iconUtils from "../../core/utils/icon";
import Overlay from "../overlay";
import inkRipple from "../widget/utils.ink_ripple";

const FAB_CLASS = "dx-fa-button";
const FAB_ICON_CLASS = "dx-fa-button-icon";

const ActionButtonItem = Overlay.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            shading: false,
            onClick: null
        });
    },

    _render: function() {
        this.element().addClass(FAB_CLASS);
        this.callBase();
        this._renderIcon();
        this.option("useInkRipple") && this._renderInkRipple();
        this._renderClick();
    },

    _renderContent: function() {
        this.callBase();
    },

    _renderIcon: function() {
        !!this._$icon && this._$icon.remove();

        this._$icon = $("<div>").addClass(FAB_ICON_CLASS);
        const $iconElement = iconUtils.getImageContainer(this._options.icon);

        this._$icon
            .append($iconElement)
            .appendTo(this.content());
    },

    _renderClick: function() {
        const eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);

        this._clickAction = this._createActionByOption("onClick");

        eventsEngine.off(this.$element().find(".dx-overlay-content"), eventName);
        eventsEngine.on(this.$element().find(".dx-overlay-content"), eventName, (e) => {
            this._clickAction({ event: e });
        });
    },

    _renderInkRipple: function() {
        this._inkRipple = inkRipple.render();
    },

    _toggleActiveState: function($element, value, e) {
        this.callBase.apply(this, arguments);

        if(!this._inkRipple) {
            return;
        }

        const config = {
            element: this.$content(),
            event: e
        };

        if(value) {
            this._inkRipple.showWave(config);
        } else {
            this._inkRipple.hideWave(config);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "icon":
                this._renderIcon();
                break;
            case "onClick":
                this._renderClick();
                break;
            default:
                this.callBase(args);
        }
    }
});

module.exports = ActionButtonItem;

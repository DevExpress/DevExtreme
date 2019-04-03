import $ from "../../core/renderer";
import config from "../../core/config";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import eventUtils from "../../events/utils";
import clickEvent from "../../events/click";
import iconUtils from "../../core/utils/icon";
import swatch from "../widget/swatch_container";
import ActionButtonItem from "./action_button_item";
import themes from "../themes";

const FAB_MAIN_CLASS = "dx-fa-button-main";
const FAB_ICON_CLASS = "dx-fa-button-icon";
const FAB_CLOSE_ICON_CLASS = "dx-fa-button-icon-close";

let actionButtonBase = null;

const ActionButtonBase = ActionButtonItem.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            icon: config().actionButtonConfig.icon,
            closeIcon: config().actionButtonConfig.closeIcon,
            position: config().actionButtonConfig.position,
            maxActionButtonCount: config().actionButtonConfig.maxActionButtonCount,
            onClick: null,
            actions: [],
            visible: true,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            indent: 56,
            childIndent: 36
        });
    },

    _defaultOptionsRules() {
        return this.callBase().concat([
            {
                device: function() {
                    return themes.isMaterial();
                },
                options: {
                    indent: 80,
                    childIndent: 56
                }
            }
        ]);
    },

    _render() {
        this.element().addClass(FAB_MAIN_CLASS);
        this.callBase();
        this._renderIcon();
        this._renderCloseIcon();
        this._renderInkRipple();
        this._renderClick();
    },

    _renderContent() {
        this.callBase();
    },

    _renderIcon() {
        !!this._$icon && this._$icon.remove();
        this._$icon = $("<div>").addClass(FAB_ICON_CLASS);

        const $iconElement = iconUtils.getImageContainer(this._options.icon);

        this._$icon
            .append($iconElement)
            .appendTo(this.content());
    },

    _renderCloseIcon() {
        !!this._$closeIcon && this._$closeIcon.remove();
        this._$closeIcon = $("<div>").addClass(FAB_CLOSE_ICON_CLASS);

        const $closeIconElement = iconUtils.getImageContainer(this._options.closeIcon);

        this._$closeIcon
            .append($closeIconElement)
            .appendTo(this.content());
    },

    _renderClick() {
        const eventName = eventUtils.addNamespace(clickEvent.name, this.NAME);

        this._clickAction = this.option("actions").length === 1 ?
            this._createActionByOption("onClick") :
            this._createAction(this._clickHandler);

        eventsEngine.off(this.$element().find(".dx-overlay-content"), eventName);
        eventsEngine.on(this.$element().find(".dx-overlay-content"), eventName, (e) => {
            this._clickAction({ event: e });
        });
    },

    _clickHandler() {
        const actions = this._actionItems;
        actions.forEach(action => {
            action.toggle();
        });

        this._$icon.toggle();
        this._$closeIcon.toggle();
    },

    _actionItems: [],

    _renderActions() {
        const actions = this.option("actions");
        const lastActionIndex = actions.length - 1;

        if(actions.length >= this.option("maxActionButtonCount")) return;

        if(this._actionItems) {
            this._actionItems.forEach(actionItem => {
                actionItem.dispose();
                actionItem.element().remove();
            });
        }

        if(!actions.length) return;

        for(let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const $actionElement = $("<div>")
                .appendTo(swatch.getSwatchContainer(action.$element()));

            eventsEngine.off($actionElement, "click");
            eventsEngine.on($actionElement, "click", () => {
                this._clickHandler();
            });

            const actionOffsetY = this.option("indent") + this.option("childIndent") * i;

            action._options.position = {
                of: this.content(),
                at: "center",
                my: "center",
                offset: {
                    x: 0,
                    y: -actionOffsetY
                }
            };

            action._options.animation.show.delay = action._options.animation.show.duration * i;
            action._options.animation.hide.delay = action._options.animation.hide.duration * (lastActionIndex - i);

            this._actionItems.push(this._createComponent($actionElement, ActionButtonItem, action._options));
        }
    },

    _optionChanged(args) {
        switch(args.name) {
            case "actions":
                this._renderActions();
                break;
            case "position":
                this._renderActions();
                break;
            case "maxActionButtonCount":
                this._renderActions();
                break;
            case "icon":
                this._renderIcon();
                break;
            case "closeIcon":
                this._renderCloseIcon();
                break;
            default:
                this.callBase(args);
        }
    }
});

exports.init = function(newAction) {
    let isActionExist = false;
    if(!actionButtonBase) {
        const $fabMainElement = $("<div>")
            .appendTo(swatch.getSwatchContainer(newAction.$element()));
        actionButtonBase = new ActionButtonBase($fabMainElement, {
            icon: newAction._options.icon || config().actionButtonConfig.icon,
            onClick: newAction._options.onClick,
            actions: [ newAction ]
        });
    } else {
        const savedActions = actionButtonBase.option("actions");

        savedActions.forEach(action => {
            if(action._options.id === newAction._options.id) {
                isActionExist = true;
                return newAction;
            }
        });

        if(!isActionExist) {
            savedActions.push(newAction);
            actionButtonBase.option("actions", savedActions);
            actionButtonBase.option("icon", config().actionButtonConfig.icon);
            actionButtonBase.option("onClick", null);
        } else if(savedActions.length === 1) {
            actionButtonBase.option("icon", newAction._options.icon);
            actionButtonBase.option("onClick", newAction._options.onClick);
        } else {
            actionButtonBase.option("actions", savedActions);
        }
    }
};

exports.dispose = function(actionId) {
    let savedActions = actionButtonBase.option("actions");
    if(savedActions.length === 1) {
        actionButtonBase.option("actions", []);
        actionButtonBase.dispose();
        actionButtonBase.element().remove();
        actionButtonBase = null;
    } else {
        savedActions = savedActions.filter(action => {
            return action._options.id !== actionId;
        });
        actionButtonBase.option("actions", savedActions);
    }
};

import $ from "../../core/renderer";
import config from "../../core/config";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import { getSwatchContainer } from "../widget/swatch_container";
import ActionButtonItem from "./action_button_item";
import themes from "../themes";

const FAB_MAIN_CLASS = "dx-fa-button-main";
const FAB_CLOSE_ICON_CLASS = "dx-fa-button-icon-close";

let actionButtonBase = null;

const ActionButtonBase = ActionButtonItem.inherit({
    _actionItems: [],

    _getDefaultOptions() {
        const defaultOptions = {
            icon: "add",
            closeIcon: "close",
            position: {
                at: "right bottom",
                my: "right bottom",
                offset: {
                    x: -16,
                    y: -16
                }
            },
            maxActionButtonCount: 6,
            actions: [],
            visible: true,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            indent: 56,
            childIndent: 36
        };

        return extend(
            this.callBase(),
            extend(defaultOptions, config().floatingActionButtonConfig)
        );
    },

    _defaultOptionsRules() {
        return this.callBase().concat([
            {
                device() {
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
        this.$element().addClass(FAB_MAIN_CLASS);
        this.callBase();
        this._renderCloseIcon();
        this._renderClick();
    },

    _renderCloseIcon() {
        this._$closeIcon = this._renderButtonIcon(
            this._$closeIcon,
            this._options.closeIcon,
            FAB_CLOSE_ICON_CLASS);
    },

    _renderClick() {
        this._clickAction = this.option("actions").length === 1 ?
            this._createActionByOption("onClick") :
            this._createAction(this._clickHandler);

        this._setClickAction();
    },

    _clickHandler() {
        const actions = this._actionItems;
        actions.forEach(action => {
            action.toggle();
        });

        this._$icon.toggle();
        this._$closeIcon.toggle();
    },

    _renderActions() {
        const actions = this.option("actions");
        const lastActionIndex = actions.length - 1;

        if(actions.length >= this.option("maxActionButtonCount")) return;

        if(this._actionItems.length) {
            this._actionItems.forEach(actionItem => {
                actionItem.dispose();
                actionItem.element().remove();
            });
        }

        if(!actions.length) return;

        for(let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const $actionElement = $("<div>")
                .appendTo(getSwatchContainer(action.$element()));

            eventsEngine.off($actionElement, "click");
            eventsEngine.on($actionElement, "click", () => {
                this._clickHandler();
            });

            const actionOffsetY = this.option("indent") + this.option("childIndent") * i;

            action._options.position = {
                of: this.$content(),
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
                this._renderClick();
                this._renderActions();
                break;
            case "position":
            case "maxActionButtonCount":
                this._renderActions();
                break;
            case "closeIcon":
                this._renderCloseIcon();
                break;
            default:
                this.callBase(args);
        }
    }
});

exports.initAction = function(newAction) {
    let isActionExist = false;
    if(!actionButtonBase) {
        const $fabMainElement = $("<div>")
            .appendTo(getSwatchContainer(newAction.$element()));
        actionButtonBase = new ActionButtonBase($fabMainElement, {
            icon: newAction._options.icon,
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
            actionButtonBase.option({
                actions: savedActions,
                icon: actionButtonBase._getDefaultOptions().icon
            });
        } else if(savedActions.length === 1) {
            actionButtonBase.option({
                onClick: newAction._options.onClick,
                icon: newAction._options.icon
            });
        } else {
            actionButtonBase.option({ actions: savedActions });
        }
    }
};

exports.disposeAction = function(actionId) {
    if(!actionButtonBase) return;

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
        actionButtonBase.option({ actions: savedActions });
    }
};

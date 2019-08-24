import $ from "../../core/renderer";
import config from "../../core/config";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import errors from "../widget/ui.errors";
import { getSwatchContainer } from "../widget/swatch_container";
import SpeedDialItem from "./speed_dial_item";
import themes from "../themes";

const FAB_MAIN_CLASS = "dx-fa-button-main";
const FAB_CLOSE_ICON_CLASS = "dx-fa-button-icon-close";
const INVISIBLE_STATE_CLASS = "dx-state-invisible";

let speedDialMainItem = null;

const SpeedDialMainItem = SpeedDialItem.inherit({
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
            maxSpeedDialActionCount: 5,
            hint: "",
            actions: [],
            visible: true,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            indent: 56,
            childIndent: 40,
            callOverlayRenderShading: true
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
                    indent: 72,
                    childIndent: 56
                }
            }
        ]);
    },

    _render() {
        this.$element().addClass(FAB_MAIN_CLASS);
        this.callBase();
        this._moveToContainer();
        this._renderCloseIcon();
        this._renderClick();
    },

    _renderCloseIcon() {
        this._$closeIcon = this._renderButtonIcon(
            this._$closeIcon,
            this._options.closeIcon,
            FAB_CLOSE_ICON_CLASS);

        this._$closeIcon.addClass(INVISIBLE_STATE_CLASS);
    },

    _renderClick() {
        this._clickAction = this.option("actions").length === 1 ?
            this._createActionByOption("onClick") :
            this._createAction(this._clickHandler);

        this._setClickAction();
    },

    _defaultActionArgs() {
        const actions = this.option("actions");

        return {
            component: actions.length === 1 ? actions[0] : this
        };
    },

    _clickHandler() {
        const actions = this._actionItems;
        actions.forEach(action => {
            action.toggle();

            if(action.option("visible")) {
                action._$wrapper.css("position", this._$wrapper.css("position"));
            }
        });

        this._$icon.toggleClass(INVISIBLE_STATE_CLASS);
        this._$closeIcon.toggleClass(INVISIBLE_STATE_CLASS);
    },

    _renderActions() {
        const actions = this.option("actions");
        const lastActionIndex = actions.length - 1;
        const minActionButtonCount = 1;

        if(this._actionItems.length) {
            this._actionItems.forEach(actionItem => {
                actionItem.dispose();
                actionItem.$element().remove();
            });
        }

        if(actions.length === minActionButtonCount) return;

        for(let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const $actionElement = $("<div>")
                .appendTo(getSwatchContainer(action.$element()));

            eventsEngine.off($actionElement, "click");
            eventsEngine.on($actionElement, "click", () => {
                this._clickHandler();
            });

            const actionOffsetY = this.initialOption("indent") + this.initialOption("childIndent") * i;
            const actionAnimationDelay = 30;

            action._options.position = {
                of: this.$content(),
                at: "center",
                my: "center",
                offset: {
                    x: 0,
                    y: -actionOffsetY
                }
            };

            action._options.animation.show.delay = actionAnimationDelay * i;
            action._options.animation.hide.delay = actionAnimationDelay * (lastActionIndex - i);

            action._options.actionComponent = action;

            this._actionItems.push(this._createComponent($actionElement, SpeedDialItem, action._options));
        }
    },

    _setPosition() {
        this._hide();
        this._show();
    },

    _optionChanged(args) {
        switch(args.name) {
            case "actions":
                this._renderIcon();
                this._renderCloseIcon();
                this._renderClick();
                this._renderActions();
                break;
            case "maxSpeedDialActionCount":
                this._renderActions();
                break;
            case "closeIcon":
                this._renderCloseIcon();
                break;
            case "position":
                this._setPosition();
                break;
            default:
                this.callBase(args);
        }
    }
});

exports.initAction = function(newAction) {
    // TODO: workaround for Angular/React/Vue
    delete newAction._options.onInitializing;

    let isActionExist = false;
    if(!speedDialMainItem) {
        const $fabMainElement = $("<div>")
            .appendTo(getSwatchContainer(newAction.$element()));

        speedDialMainItem = newAction._createComponent($fabMainElement, SpeedDialMainItem,
            extend({}, newAction._options, {
                actions: [ newAction ],
                visible: true
            })
        );

    } else {
        const savedActions = speedDialMainItem.option("actions");

        savedActions.forEach(action => {
            if(action._options.id === newAction._options.id) {
                isActionExist = true;
                return newAction;
            }
        });

        if(!isActionExist) {
            if(savedActions.length >= speedDialMainItem.option("maxSpeedDialActionCount")) {
                newAction.dispose();
                errors.log("W1014");
                return;
            }
            savedActions.push(newAction);
            speedDialMainItem.option(extend(speedDialMainItem._getDefaultOptions(), {
                actions: savedActions
            }));
        } else if(savedActions.length === 1) {
            speedDialMainItem.option(extend({}, newAction._options, {
                actions: savedActions,
                visible: true,
                position: speedDialMainItem._getDefaultOptions().position
            }));
        } else {
            speedDialMainItem.option({
                actions: savedActions,
                position: speedDialMainItem._getDefaultOptions().position
            });
        }
    }
};

exports.disposeAction = function(actionId) {
    if(!speedDialMainItem) return;

    let savedActions = speedDialMainItem.option("actions");
    const savedActionsCount = savedActions.length;


    savedActions = savedActions.filter(action => {
        return action._options.id !== actionId;
    });

    if(savedActionsCount === savedActions.length) return;

    if(!savedActions.length) {
        speedDialMainItem.dispose();
        speedDialMainItem.$element().remove();
        speedDialMainItem = null;
    } else if(savedActions.length === 1) {
        speedDialMainItem.option(extend({}, savedActions[0]._options, {
            actions: savedActions,
            visible: true,
            position: speedDialMainItem._getDefaultOptions().position
        }));
    } else {
        speedDialMainItem.option({
            actions: savedActions
        });
    }
};

exports.repaint = function() {
    if(!speedDialMainItem) return;

    const icon = speedDialMainItem.option("actions").length === 1 ?
        speedDialMainItem.option("actions")[0].option("icon") :
        speedDialMainItem._getDefaultOptions().icon;

    speedDialMainItem.option({
        actions: speedDialMainItem.option("actions"),
        icon: icon,
        closeIcon: speedDialMainItem._getDefaultOptions().closeIcon,
        position: speedDialMainItem._getDefaultOptions().position,
        maxSpeedDialActionCount: speedDialMainItem._getDefaultOptions().maxSpeedDialActionCount
    });
};

import $ from "../../core/renderer";
import config from "../../core/config";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import errors from "../widget/ui.errors";
import { getSwatchContainer } from "../widget/swatch_container";
import ActionButtonItem from "./action_button_item";
import themes from "../themes";

const FAB_MAIN_CLASS = "dx-fa-button-main";
const FAB_CLOSE_ICON_CLASS = "dx-fa-button-icon-close";
const INVISIBLE_STATE_CLASS = "dx-state-invisible";

let actionButtonContainer = null;

const ActionButtonContainer = ActionButtonItem.inherit({
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
            maxSpeedDialCount: 5,
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
                    indent: 80,
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
                this._renderIcon();
                this._renderCloseIcon();
                this._renderClick();
                this._renderActions();
                break;
            case "maxSpeedDialCount":
                this._renderActions();
                break;
            case "closeIcon":
                this._renderCloseIcon();
                break;
            case "position":
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
    if(!actionButtonContainer) {
        const $fabMainElement = $("<div>")
            .appendTo(getSwatchContainer(newAction.$element()));

        actionButtonContainer = new ActionButtonContainer($fabMainElement,
            extend({}, newAction._options, {
                actions: [ newAction ],
                visible: true
            })
        );

    } else {
        const savedActions = actionButtonContainer.option("actions");

        savedActions.forEach(action => {
            if(action._options.id === newAction._options.id) {
                isActionExist = true;
                return newAction;
            }
        });

        if(!isActionExist) {
            if(savedActions.length >= actionButtonContainer.option("maxSpeedDialCount")) {
                newAction.dispose();
                errors.log("W1014");
                return;
            }
            savedActions.push(newAction);
            actionButtonContainer.option(extend(actionButtonContainer._getDefaultOptions(), {
                actions: savedActions
            }));
        } else if(savedActions.length === 1) {
            actionButtonContainer.option(extend({}, newAction._options, {
                actions: savedActions,
                visible: true,
                position: actionButtonContainer._getDefaultOptions().position
            }));
        } else {
            actionButtonContainer.option({ actions: savedActions });
        }
    }
};

exports.disposeAction = function(actionId) {
    if(!actionButtonContainer) return;

    let savedActions = actionButtonContainer.option("actions");
    const savedActionsCount = savedActions.length;


    savedActions = savedActions.filter(action => {
        return action._options.id !== actionId;
    });

    if(savedActionsCount === savedActions.length) return;

    if(!savedActions.length) {
        actionButtonContainer.dispose();
        actionButtonContainer.$element().remove();
        actionButtonContainer = null;
    } else if(savedActions.length === 1) {
        actionButtonContainer.option(extend({}, savedActions[0]._options, {
            actions: savedActions,
            visible: true,
            position: actionButtonContainer._getDefaultOptions().position
        }));
    } else {
        actionButtonContainer.option({ actions: savedActions });
    }
};

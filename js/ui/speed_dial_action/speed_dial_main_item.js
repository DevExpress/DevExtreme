import $ from "../../core/renderer";
import config from "../../core/config";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import errors from "../widget/ui.errors";
import { getSwatchContainer } from "../widget/swatch_container";
import SpeedDialItem from "./speed_dial_item";
import themes from "../themes";

const FAB_MAIN_CLASS = "dx-fa-button-main";
const FAB_MAIN_CLASS_WITH_LABEL = "dx-fa-button-with-label";
const FAB_CLOSE_ICON_CLASS = "dx-fa-button-icon-close";
const INVISIBLE_STATE_CLASS = "dx-state-invisible";

let speedDialMainItem = null;

const SpeedDialMainItem = SpeedDialItem.inherit({
    _actionItems: [],

    _isShadingShown: false,

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
            label: "",
            direction: "auto",
            actions: [],
            activeStateEnabled: true,
            hoverStateEnabled: true,
            indent: 55,
            childIndent: 40,
            childOffset: 9,
            callOverlayRenderShading: true,
            closeOnOutsideClick: true
        };

        return extend(
            this.callBase(),
            extend(defaultOptions, config().floatingActionButtonConfig, { shading: false })
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
                    childIndent: 56,
                    childOffset: 8
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

    _renderLabel() {
        this.callBase();
        this.$element().toggleClass(FAB_MAIN_CLASS_WITH_LABEL, !!this._$label);
    },

    _renderCloseIcon() {
        this._$closeIcon = this._renderButtonIcon(
            this._$closeIcon,
            this._options.closeIcon,
            FAB_CLOSE_ICON_CLASS);

        this._$closeIcon.addClass(INVISIBLE_STATE_CLASS);
    },

    _renderClick() {
        this._clickAction = this._getVisibleActions().length === 1 ?
            this._createActionByOption("onClick") :
            this._createAction(this._clickHandler);

        this._setClickAction();
    },

    _defaultActionArgs() {
        const actions = this._getVisibleActions();

        return {
            component: actions.length === 1 ? actions[0] : this
        };
    },

    _getVisibleActions(actions) {
        const currentActions = actions || this.option("actions");

        return currentActions.filter((action) => action.option("visible"));
    },

    _getCurrentOptions(actions) {
        const visibleActions = speedDialMainItem._getVisibleActions(actions);

        return visibleActions.length === 1 ?
            extend(visibleActions[0]._options, { position: this._getPosition() }) :
            extend(this._getDefaultOptions(), { visible: visibleActions.length !== 0 });
    },

    _clickHandler() {
        const actions = this._actionItems
            .filter((action) => action.option("actionVisible"))
            .sort((action, nextAction) => action.option("index") - nextAction.option("index"));

        if(actions.length === 1) return;

        const lastActionIndex = actions.length - 1;

        for(let i = 0; i < actions.length; i++) {
            actions[i].option("animation", this._getActionAnimation(actions[i], i, lastActionIndex));
            actions[i].option("position", this._getActionPosition(actions, i));
            actions[i]._$wrapper.css("position", this._$wrapper.css("position"));
            actions[i].toggle();
        }

        if(config().floatingActionButtonConfig.shading) {
            this._isShadingShown = !this.option("shading");
            this.option("shading", this._isShadingShown);
        }

        this._$icon.toggleClass(INVISIBLE_STATE_CLASS);
        this._$closeIcon.toggleClass(INVISIBLE_STATE_CLASS);
    },

    _updateZIndexStackPosition() {
        this.callBase();

        const overlayStack = this._overlayStack();

        overlayStack.push(this);
    },

    _renderActions() {
        const actions = this.option("actions");
        const minActionButtonCount = 1;

        if(this._actionItems.length) {
            this._actionItems.forEach(actionItem => {
                actionItem.dispose();
                actionItem.$element().remove();
            });
            this._actionItems = [];
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

            action._options.actionComponent = action;
            action._options.parentPosition = this._getPosition();
            action._options.actionVisible = action._options.visible;

            this._actionItems.push(this._createComponent($actionElement, SpeedDialItem, extend({}, action._options, { visible: false })));
        }
    },

    _getActionAnimation(action, index, lastActionIndex) {
        const actionAnimationDelay = 30;

        action._options.animation.show.delay = actionAnimationDelay * index;
        action._options.animation.hide.delay = actionAnimationDelay * (lastActionIndex - index);

        return action._options.animation;
    },

    _getDirectionIndex(actions, direction) {
        const directionIndex = 1;

        if(direction === "auto") {
            const contentHeight = this.$content().height();
            const actionsHeight = this.initialOption("indent") + this.initialOption("childIndent") * actions.length - contentHeight;
            const offsetTop = this.$content().offset().top;

            if(actionsHeight < offsetTop) {
                return -directionIndex;
            } else {
                const offsetBottom = this._getContainer().height() - contentHeight - offsetTop;

                return offsetTop >= offsetBottom ? -directionIndex : directionIndex;
            }
        }

        return direction !== "down" ? -directionIndex : directionIndex;
    },

    _getActionPosition(actions, index) {
        const action = actions[index];
        const actionOffsetXValue = this.initialOption("childOffset");
        const actionOffsetX = action._options.label && !this._$label ?
            (this._isPositionLeft(this._getPosition()) ? actionOffsetXValue : -actionOffsetXValue) :
            0;

        const actionOffsetYValue = this.initialOption("indent") + this.initialOption("childIndent") * index;
        const actionOffsetY = this._getDirectionIndex(actions, this.option("direction")) * actionOffsetYValue;

        const actionPositionAtMy = action._options.label ?
            (this._isPositionLeft(this._getPosition()) ? "left" : "right") :
            "center";

        return {
            of: this.$content(),
            at: actionPositionAtMy,
            my: actionPositionAtMy,
            offset: {
                x: actionOffsetX,
                y: actionOffsetY
            }
        };
    },

    _outsideClickHandler(e) {
        if(this._isShadingShown) {
            const isShadingClick = $(e.target)[0] === this._$wrapper[0];

            if(isShadingClick) this._clickHandler();
        }
    },

    _setPosition() {
        if(this.option("visible")) {
            this._hide();
            this._show();
        }
    },

    _getPosition() {
        return this._getDefaultOptions().position;
    },

    _getInkRippleContainer() {
        return this.$content();
    },

    _optionChanged(args) {
        switch(args.name) {
            case "actions":
                if(this._isVisible()) this._renderIcon();
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
            case "label":
                if(this._isVisible()) this._renderLabel();
                this._setPosition();
                break;
            case "icon":
                if(this._isVisible()) this._renderIcon();
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
                actions: [ newAction ]
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

        delete speedDialMainItem._options.position;

        if(!isActionExist) {
            if(speedDialMainItem._getVisibleActions(savedActions).length >= speedDialMainItem.option("maxSpeedDialActionCount")) {
                newAction.dispose();
                errors.log("W1014");
                return;
            }

            savedActions.push(newAction);

            speedDialMainItem.option(extend(speedDialMainItem._getCurrentOptions(savedActions), {
                actions: savedActions
            }));
        } else if(savedActions.length === 1) {
            speedDialMainItem.option(extend({}, savedActions[0]._options, {
                actions: savedActions,
                position: speedDialMainItem._getPosition()
            }));
        } else {
            speedDialMainItem.option(extend(speedDialMainItem._getCurrentOptions(savedActions), {
                actions: savedActions
            }));
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
            actions: savedActions
        }));
    } else {
        speedDialMainItem.option({
            actions: savedActions
        });
    }
};

exports.repaint = function() {
    if(!speedDialMainItem) return;

    const icon = speedDialMainItem._getVisibleActions().length === 1 ?
        speedDialMainItem.option("actions")[0].option("icon") :
        speedDialMainItem._getDefaultOptions().icon;

    speedDialMainItem.option({
        actions: speedDialMainItem.option("actions"),
        icon: icon,
        closeIcon: speedDialMainItem._getDefaultOptions().closeIcon,
        position: speedDialMainItem._getPosition(),
        label: speedDialMainItem._getDefaultOptions().label,
        maxSpeedDialActionCount: speedDialMainItem._getDefaultOptions().maxSpeedDialActionCount,
        direction: speedDialMainItem._getDefaultOptions().direction
    });
};

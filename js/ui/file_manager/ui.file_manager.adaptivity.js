import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isFunction } from "../../core/utils/type";
import { getWindow } from "../../core/utils/window";

import Widget from "../widget/ui.widget";
import Drawer from "../drawer/ui.drawer";
import SplitterControl from "../splitter";

const window = getWindow();
const ADAPTIVE_STATE_SCREEN_WIDTH = 573;

class FileManagerAdaptivityControl extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._initActions();

        this._isInAdaptiveState = false;

        const $drawer = $("<div>").appendTo(this.$element());

        const contentRenderer = this.option("contentTemplate");
        if(isFunction(contentRenderer)) {
            contentRenderer($drawer);
        }

        this._drawer = this._createComponent($drawer, Drawer, {
            opened: true,
            template: this._createDrawerTemplate.bind(this)
        });
    }

    _createDrawerTemplate(container) {
        this.option("drawerTemplate")(container);
        const leftElement = container;
        const rightElement = this.$element().find(".dx-drawer-content");
        const minAvailablePosX = 100;
        const splitter = this._createComponent("<div>", SplitterControl, {
            container: this.$element(),
            leftElement,
            rightElement,
            minAvailablePosX,
            onSplitterChanged: this._onSplitterChanged.bind(this)
        });
        splitter.$element().appendTo(container);
        this._leftElement = leftElement;
        this._rightElement = rightElement;
        this._splitter = splitter;
    }

    _render() {
        super._render();
        this._checkAdaptiveState();
    }

    _onSplitterChanged(elementsWidth) {
        this._updateWidth(elementsWidth.actionValue);
    }

    _updateWidth(newDirsPanelWidth) {
        let newItemsPanelWidth = this._splitter.computeRightPanelWidth(newDirsPanelWidth);
        this._leftElement.width(newDirsPanelWidth);
        this._rightElement.width(newItemsPanelWidth);
    }

    _dimensionChanged(dimension) {
        if(!dimension || dimension !== "height") {
            this._checkAdaptiveState();
        }
    }

    _checkAdaptiveState() {
        const oldState = this._isInAdaptiveState;
        this._isInAdaptiveState = this._isSmallScreen();
        if(oldState !== this._isInAdaptiveState) {
            this.toggleDrawer(!this._isInAdaptiveState, true);
            this._raiseAdaptiveStateChanged(this._isInAdaptiveState);
        }
    }

    _isSmallScreen() {
        return $(window).width() <= ADAPTIVE_STATE_SCREEN_WIDTH;
    }

    _initActions() {
        this._actions = {
            onAdaptiveStateChanged: this._createActionByOption("onAdaptiveStateChanged")
        };
    }

    _raiseAdaptiveStateChanged(enabled) {
        this._actions.onAdaptiveStateChanged({ enabled });
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            drawerTemplate: null,
            contentTemplate: null,
            onAdaptiveStateChanged: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "drawerTemplate":
            case "contentTemplate":
                this.repaint();
                break;
            case "onAdaptiveStateChanged":
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    isInAdaptiveState() {
        return this._isInAdaptiveState;
    }

    toggleDrawer(showing, skipAnimation) {
        this._drawer.option("animationEnabled", !skipAnimation);
        this._drawer.toggle(showing);
    }

}

module.exports = FileManagerAdaptivityControl;

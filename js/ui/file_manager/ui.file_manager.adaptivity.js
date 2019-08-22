import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isFunction } from "../../core/utils/type";
import { getWindow, hasWindow } from "../../core/utils/window";
import { addNamespace } from "../../events/utils";
import eventsEngine from "../../events/core/events_engine";

import Widget from "../widget/ui.widget";
import Drawer from "../drawer/ui.drawer";
import SplitterControl from "../splitter";

const window = getWindow();
const ADAPTIVE_STATE_SCREEN_WIDTH = 573;

const FILE_MANAGER_NAMESPACE = "dxFileManagerResizing";
const FILE_MANAGER_WINDOW_RESIZE_EVENT_NAME = addNamespace("resize", FILE_MANAGER_NAMESPACE);

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
        this.option("dirsPanelWidth", this._splitter.convertToPercentRelativeToContainer(this.option("dirsPanelWidth")));
    }

    _createDrawerTemplate(container) {
        this.option("drawerTemplate")(container);
        const leftElement = container;
        const rightElement = this.$element().find(".dx-drawer-content");
        const splitter = this._createComponent("<div>", SplitterControl, {
            container: this.$element(),
            leftElement,
            rightElement,
            onApplyPanelSize: this._onApplyPanelSize.bind(this)
        });
        splitter.$element().appendTo(container);
        this._leftElement = leftElement;
        this._rightElement = rightElement;
        this._splitter = splitter;
    }

    _render() {
        super._render();
        this._checkAdaptiveState();
        this._detachEventHandlers();
        this._attachEventHandlers();
    }

    _detachEventHandlers() {
        eventsEngine.off(getWindow(), FILE_MANAGER_WINDOW_RESIZE_EVENT_NAME);
    }
    _attachEventHandlers() {
        eventsEngine.on(getWindow(), FILE_MANAGER_WINDOW_RESIZE_EVENT_NAME, this._windowResizeHandler.bind(this));
    }

    _windowResizeHandler() {
        if(!this.isInAdaptiveState()) {
            this._updateWidth(this.option("dirsPanelWidth"));
        }
    }

    _onApplyPanelSize(newDirsPanelWidth) {
        this.option("dirsPanelWidth", newDirsPanelWidth.actionValue);
    }

    _updateWidth(newDirsPanelWidth) {
        if(!hasWindow()) {
            return;
        }

        this._leftElement.width(`${newDirsPanelWidth}%`);
        this._rightElement.width(`${100 - newDirsPanelWidth}%`);
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
            this._toggleSplitter(!this._isInAdaptiveState);
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
            onAdaptiveStateChanged: null,
            dirsPanelWidth: 250
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
            case "dirsPanelWidth":
                this._updateWidth(args.value);
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

    _toggleSplitter(isActive) {
        if(isActive) {
            this._splitter.$element().removeClass("dx-state-disabled");
        } else {
            this._splitter.$element().addClass("dx-state-disabled");
        }
    }

}

module.exports = FileManagerAdaptivityControl;

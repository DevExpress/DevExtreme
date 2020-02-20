import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { isFunction } from '../../core/utils/type';
import { getWindow, hasWindow } from '../../core/utils/window';

import Widget from '../widget/ui.widget';
import Drawer from '../drawer/ui.drawer';
import SplitterControl from '../splitter';

const window = getWindow();
const ADAPTIVE_STATE_SCREEN_WIDTH = 573;

const DRAWER_PANEL_CONTENT_INITIAL = 'dx-drawer-panel-content-initial';

class FileManagerAdaptivityControl extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._initActions();

        this._isInAdaptiveState = false;

        const $drawer = $('<div>').appendTo(this.$element());

        const contentRenderer = this.option('contentTemplate');
        if(isFunction(contentRenderer)) {
            contentRenderer($drawer);
        }

        this._drawer = this._createComponent($drawer, Drawer);
        this._drawer.option({
            opened: true,
            template: this._createDrawerTemplate.bind(this)
        });
        $(this._drawer.content()).addClass(DRAWER_PANEL_CONTENT_INITIAL);
    }

    _createDrawerTemplate(container) {
        this.option('drawerTemplate')(container);
        this._splitter = this._createComponent('<div>', SplitterControl, {
            container: this.$element(),
            leftElement: $(this._drawer.content()),
            rightElement: $(this._drawer.viewContent()),
            onApplyPanelSize: this._onApplyPanelSize.bind(this)
        });
        this._splitter.$element().appendTo(container);
    }

    _render() {
        super._render();
        this._checkAdaptiveState();
    }

    _onApplyPanelSize(e) {
        if(!hasWindow()) {
            return;
        }

        if(!this._splitter.isSplitterMoved()) {
            this._updateDrawerDimensions();
            return;
        }
        $(this._drawer.content()).removeClass(DRAWER_PANEL_CONTENT_INITIAL);
        $(this._drawer.content()).css('width', e.leftPanelWidth);
        this._drawer.resizeContent();
    }

    _updateDrawerDimensions() {
        $(this._drawer.content()).css('width', '');
        this._drawer._initSize();
        this._drawer._strategy.setPanelSize(true);
    }

    _dimensionChanged(dimension) {
        if(!dimension || dimension !== 'height') {
            this._checkAdaptiveState();
        }
    }

    _checkAdaptiveState() {
        const oldState = this._isInAdaptiveState;
        this._isInAdaptiveState = this._isSmallScreen();
        if(oldState !== this._isInAdaptiveState) {
            this.toggleDrawer(!this._isInAdaptiveState, true);
            this._raiseAdaptiveStateChanged(this._isInAdaptiveState);
            this._splitter.toggleState(!this._isInAdaptiveState);
        }
    }

    _isSmallScreen() {
        return $(window).width() <= ADAPTIVE_STATE_SCREEN_WIDTH;
    }

    _initActions() {
        this._actions = {
            onAdaptiveStateChanged: this._createActionByOption('onAdaptiveStateChanged')
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
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'drawerTemplate':
            case 'contentTemplate':
                this.repaint();
                break;
            case 'onAdaptiveStateChanged':
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
        this._drawer.option('animationEnabled', !skipAnimation);
        this._drawer.toggle(showing);
    }
}

module.exports = FileManagerAdaptivityControl;

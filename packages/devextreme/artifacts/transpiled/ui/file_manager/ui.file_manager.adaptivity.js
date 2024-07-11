"use strict";

exports.default = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _drawer = _interopRequireDefault(require("../drawer"));
var _splitter = _interopRequireDefault(require("../splitter"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const ADAPTIVE_STATE_SCREEN_WIDTH = 573;
const FILE_MANAGER_ADAPTIVITY_DRAWER_PANEL_CLASS = 'dx-filemanager-adaptivity-drawer-panel';
const DRAWER_PANEL_CONTENT_INITIAL = 'dx-drawer-panel-content-initial';
const DRAWER_PANEL_CONTENT_ADAPTIVE = 'dx-drawer-panel-content-adaptive';
class FileManagerAdaptivityControl extends _ui.default {
  _initMarkup() {
    super._initMarkup();
    this._initActions();
    this._isInAdaptiveState = false;
    const $drawer = (0, _renderer.default)('<div>').appendTo(this.$element());
    (0, _renderer.default)('<div>').addClass(FILE_MANAGER_ADAPTIVITY_DRAWER_PANEL_CLASS).appendTo($drawer);
    this._drawer = this._createComponent($drawer, _drawer.default);
    this._drawer.option({
      opened: true,
      template: this._createDrawerTemplate.bind(this)
    });
    (0, _renderer.default)(this._drawer.content()).addClass(DRAWER_PANEL_CONTENT_INITIAL);
    const $drawerContent = $drawer.find(`.${FILE_MANAGER_ADAPTIVITY_DRAWER_PANEL_CLASS}`).first();
    const contentRenderer = this.option('contentTemplate');
    if ((0, _type.isFunction)(contentRenderer)) {
      contentRenderer($drawerContent);
    }
    this._updateDrawerMaxSize();
  }
  _createDrawerTemplate(container) {
    this.option('drawerTemplate')(container);
    this._splitter = this._createComponent('<div>', _splitter.default, {
      container: this.$element(),
      leftElement: (0, _renderer.default)(this._drawer.content()),
      rightElement: (0, _renderer.default)(this._drawer.viewContent()),
      onApplyPanelSize: this._onApplyPanelSize.bind(this),
      onActiveStateChanged: this._onActiveStateChanged.bind(this)
    });
    this._splitter.$element().appendTo(container);
    this._splitter.disableSplitterCalculation(true);
  }
  _render() {
    super._render();
    this._checkAdaptiveState();
  }
  _onApplyPanelSize(e) {
    if (!(0, _window.hasWindow)()) {
      return;
    }
    if (!this._splitter.isSplitterMoved()) {
      this._setDrawerWidth('');
      return;
    }
    (0, _renderer.default)(this._drawer.content()).removeClass(DRAWER_PANEL_CONTENT_INITIAL);
    this._setDrawerWidth(e.leftPanelWidth);
  }
  _onActiveStateChanged(_ref) {
    let {
      isActive
    } = _ref;
    this._splitter.disableSplitterCalculation(!isActive);
    !isActive && this._splitter.$element().css('left', 'auto');
  }
  _setDrawerWidth(width) {
    (0, _renderer.default)(this._drawer.content()).css('width', width);
    this._updateDrawerMaxSize();
    this._drawer.resizeViewContent();
  }
  _updateDrawerMaxSize() {
    this._drawer.option('maxSize', this._drawer.getRealPanelWidth());
  }
  _dimensionChanged(dimension) {
    if (!dimension || dimension !== 'height') {
      this._checkAdaptiveState();
    }
  }
  _checkAdaptiveState() {
    const oldState = this._isInAdaptiveState;
    this._isInAdaptiveState = this._isSmallScreen();
    if (oldState !== this._isInAdaptiveState) {
      this.toggleDrawer(!this._isInAdaptiveState, true);
      (0, _renderer.default)(this._drawer.content()).toggleClass(DRAWER_PANEL_CONTENT_ADAPTIVE, this._isInAdaptiveState);
      this._raiseAdaptiveStateChanged(this._isInAdaptiveState);
    }
    if (this._isInAdaptiveState && this._isDrawerOpened()) {
      this._updateDrawerMaxSize();
    }
  }
  _isSmallScreen() {
    return (0, _size.getWidth)(window) <= ADAPTIVE_STATE_SCREEN_WIDTH;
  }
  _isDrawerOpened() {
    return this._drawer.option('opened');
  }
  _initActions() {
    this._actions = {
      onAdaptiveStateChanged: this._createActionByOption('onAdaptiveStateChanged')
    };
  }
  _raiseAdaptiveStateChanged(enabled) {
    this._actions.onAdaptiveStateChanged({
      enabled
    });
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      drawerTemplate: null,
      contentTemplate: null,
      onAdaptiveStateChanged: null
    });
  }
  _optionChanged(args) {
    const name = args.name;
    switch (name) {
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
    this._updateDrawerMaxSize();
    this._drawer.option('animationEnabled', !skipAnimation);
    this._drawer.toggle(showing);
    const isSplitterActive = this._isDrawerOpened() && !this.isInAdaptiveState();
    this._splitter.toggleDisabled(!isSplitterActive);
  }
  getSplitterElement() {
    return this._splitter.getSplitterBorderElement().get(0);
  }
}
var _default = exports.default = FileManagerAdaptivityControl;
module.exports = exports.default;
module.exports.default = exports.default;
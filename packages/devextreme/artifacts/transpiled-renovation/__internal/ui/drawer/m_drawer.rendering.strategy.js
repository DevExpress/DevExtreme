"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _deferred = require("../../../core/utils/deferred");
var _size = require("../../../core/utils/size");
var _m_drawer = require("./m_drawer.animation");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DrawerStrategy {
  constructor(drawer) {
    this._drawer = drawer;
  }
  getDrawerInstance() {
    return this._drawer;
  }
  renderPanelContent(whenPanelContentRendered) {
    const drawer = this.getDrawerInstance();
    const template = drawer._getTemplate(drawer.option('template'));
    if (template) {
      template.render({
        container: drawer.content(),
        // @ts-expect-error
        onRendered: () => {
          whenPanelContentRendered.resolve();
        }
      });
    }
  }
  renderPosition(changePositionUsingFxAnimation, animationDuration) {
    const whenPositionAnimationCompleted = (0, _deferred.Deferred)();
    const whenShaderAnimationCompleted = (0, _deferred.Deferred)();
    const drawer = this.getDrawerInstance();
    if (changePositionUsingFxAnimation) {
      _deferred.when.apply(_renderer.default, [whenPositionAnimationCompleted, whenShaderAnimationCompleted]).done(() => {
        // @ts-expect-error
        drawer._animationCompleteHandler();
      });
    }
    // @ts-expect-error
    this._internalRenderPosition(changePositionUsingFxAnimation, whenPositionAnimationCompleted);
    if (!changePositionUsingFxAnimation) {
      // @ts-expect-error
      drawer.resizeViewContent();
    }
    this.renderShaderVisibility(changePositionUsingFxAnimation, animationDuration, whenShaderAnimationCompleted);
  }
  _getPanelOffset(isDrawerOpened) {
    const drawer = this.getDrawerInstance();
    // @ts-expect-error
    const size = drawer.isHorizontalDirection() ? drawer.getRealPanelWidth() : drawer.getRealPanelHeight();
    if (isDrawerOpened) {
      // @ts-expect-error
      return -(size - drawer.getMaxSize());
    }
    // @ts-expect-error
    return -(size - drawer.getMinSize());
  }
  _getPanelSize(isDrawerOpened) {
    return isDrawerOpened
    // @ts-expect-error
    ? this.getDrawerInstance().getMaxSize()
    // @ts-expect-error
    : this.getDrawerInstance().getMinSize();
  }
  renderShaderVisibility(changePositionUsingFxAnimation, duration, whenAnimationCompleted) {
    const drawer = this.getDrawerInstance();
    const isShaderVisible = drawer.option('opened');
    const fadeConfig = isShaderVisible ? {
      from: 0,
      to: 1
    } : {
      from: 1,
      to: 0
    };
    if (changePositionUsingFxAnimation) {
      // @ts-expect-error
      _m_drawer.animation.fade((0, _renderer.default)(drawer._$shader), fadeConfig, duration, () => {
        // @ts-expect-error
        this._drawer._toggleShaderVisibility(isShaderVisible);
        whenAnimationCompleted.resolve();
      });
    } else {
      // @ts-expect-error
      drawer._toggleShaderVisibility(isShaderVisible);
      // @ts-expect-error
      drawer._$shader.css('opacity', fadeConfig.to);
    }
  }
  getPanelContent() {
    return (0, _renderer.default)(this.getDrawerInstance().content());
  }
  setPanelSize(calcFromRealPanelSize) {
    this.refreshPanelElementSize(calcFromRealPanelSize);
  }
  refreshPanelElementSize(calcFromRealPanelSize) {
    const drawer = this.getDrawerInstance();
    const panelSize = this._getPanelSize(drawer.option('opened'));
    // @ts-expect-error
    if (drawer.isHorizontalDirection()) {
      (0, _size.setWidth)((0, _renderer.default)(drawer.content()),
      // @ts-expect-error
      calcFromRealPanelSize ? drawer.getRealPanelWidth() : panelSize);
    } else {
      (0, _size.setHeight)((0, _renderer.default)(drawer.content()),
      // @ts-expect-error
      calcFromRealPanelSize ? drawer.getRealPanelHeight() : panelSize);
    }
  }
  isViewContentFirst() {
    return false;
  }
  onPanelContentRendered() {}
}
var _default = exports.default = DrawerStrategy;
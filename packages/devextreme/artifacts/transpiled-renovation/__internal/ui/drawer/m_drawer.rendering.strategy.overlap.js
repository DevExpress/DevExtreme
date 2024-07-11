"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _translator = require("../../../animation/translator");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _inflector = require("../../../core/utils/inflector");
var _size = require("../../../core/utils/size");
var _ui = _interopRequireDefault(require("../../../ui/overlay/ui.overlay"));
var _m_drawer = require("./m_drawer.animation");
var _m_drawerRendering = _interopRequireDefault(require("./m_drawer.rendering.strategy"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class OverlapStrategy extends _m_drawerRendering.default {
  renderPanelContent(whenPanelContentRendered) {
    // @ts-expect-error
    delete this._initialPosition;
    const drawer = this.getDrawerInstance();
    const {
      opened,
      minSize
    } = drawer.option();
    // @ts-expect-error
    drawer._overlay = drawer._createComponent(drawer.content(), _ui.default, {
      shading: false,
      container: drawer.content(),
      // @ts-expect-error
      visualContainer: drawer.getOverlayTarget(),
      position: this._getOverlayPosition(),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      width: opened ? 'auto' : minSize || 0,
      height: '100%',
      templatesRenderAsynchronously: drawer.option('templatesRenderAsynchronously'),
      animation: {
        show: {
          duration: 0
        }
      },
      onPositioned: function (e) {
        this._fixOverlayPosition(e.component.$content());
      }.bind(this),
      contentTemplate: drawer.option('template'),
      onContentReady: args => {
        whenPanelContentRendered.resolve();
        this._processOverlayZIndex(args.component.content());
      },
      visible: true,
      propagateOutsideClick: true
    });
  }
  _fixOverlayPosition($overlayContent) {
    // NOTE: overlay should be positioned in extended wrapper
    // @ts-expect-error
    const position = (0, _common.ensureDefined)(this._initialPosition, {
      left: 0,
      top: 0
    });
    (0, _translator.move)($overlayContent, position);
    // @ts-expect-error
    if (this.getDrawerInstance().calcTargetPosition() === 'right') {
      $overlayContent.css('left', 'auto');
    }
    // @ts-expect-error
    if (this.getDrawerInstance().calcTargetPosition() === 'bottom') {
      $overlayContent.css('top', 'auto');
      $overlayContent.css('bottom', '0px');
    }
  }
  _getOverlayPosition() {
    const drawer = this.getDrawerInstance();
    // @ts-expect-error
    const panelPosition = drawer.calcTargetPosition();
    let result = {};
    // eslint-disable-next-line default-case
    switch (panelPosition) {
      case 'left':
        {
          result = {
            my: 'top left',
            at: 'top left'
          };
          break;
        }
      case 'right':
        {
          result = {
            my: drawer.option('rtlEnabled') ? 'top left' : 'top right',
            at: 'top right'
          };
          break;
        }
      case 'top':
      case 'bottom':
        {
          result = {
            my: panelPosition,
            at: panelPosition
          };
          break;
        }
    }
    // @ts-expect-error
    result.of = drawer.getOverlayTarget();
    return result;
  }
  refreshPanelElementSize(calcFromRealPanelSize) {
    const drawer = this.getDrawerInstance();
    // @ts-expect-error
    const overlay = drawer.getOverlay();
    // @ts-expect-error
    if (drawer.isHorizontalDirection()) {
      overlay.option('height', '100%');
      // @ts-expect-error
      overlay.option('width', calcFromRealPanelSize ? drawer.getRealPanelWidth() : this._getPanelSize(drawer.option('opened')));
    } else {
      // @ts-expect-error
      overlay.option('width', (0, _size.getWidth)(drawer.getOverlayTarget()));
      // @ts-expect-error
      overlay.option('height', calcFromRealPanelSize ? drawer.getRealPanelHeight() : this._getPanelSize(drawer.option('opened')));
    }
  }
  onPanelContentRendered() {
    this._updateViewContentStyles();
  }
  _updateViewContentStyles() {
    const drawer = this.getDrawerInstance();
    // @ts-expect-error
    (0, _renderer.default)(drawer.viewContent()).css(`padding${(0, _inflector.camelize)(drawer.calcTargetPosition(), true)}`, drawer.option('minSize'));
    // @ts-expect-error
    (0, _renderer.default)(drawer.viewContent()).css('transform', 'inherit');
  }
  _internalRenderPosition(changePositionUsingFxAnimation, whenAnimationCompleted) {
    const drawer = this.getDrawerInstance();
    const $panel = (0, _renderer.default)(drawer.content());
    // @ts-expect-error
    const $panelOverlayContent = drawer.getOverlay().$content();
    const revealMode = drawer.option('revealMode');
    // @ts-expect-error
    const targetPanelPosition = drawer.calcTargetPosition();
    const panelSize = this._getPanelSize(drawer.option('opened'));
    // @ts-expect-error
    const panelOffset = this._getPanelOffset(drawer.option('opened')) * drawer._getPositionCorrection();
    // @ts-expect-error
    const marginTop = drawer.getRealPanelHeight() - panelSize;
    this._updateViewContentStyles();
    if (changePositionUsingFxAnimation) {
      if (revealMode === 'slide') {
        // @ts-expect-error
        this._initialPosition = drawer.isHorizontalDirection() ? {
          left: panelOffset
        } : {
          top: panelOffset
        };
        _m_drawer.animation.moveTo({
          complete: () => {
            whenAnimationCompleted.resolve();
          },
          duration: drawer.option('animationDuration'),
          direction: targetPanelPosition,
          $element: $panel,
          position: panelOffset
        });
      } else if (revealMode === 'expand') {
        // @ts-expect-error
        this._initialPosition = drawer.isHorizontalDirection() ? {
          left: 0
        } : {
          top: 0
        };
        // @ts-expect-error
        (0, _translator.move)($panelOverlayContent, this._initialPosition);
        _m_drawer.animation.size({
          complete: () => {
            whenAnimationCompleted.resolve();
          },
          duration: drawer.option('animationDuration'),
          direction: targetPanelPosition,
          $element: $panelOverlayContent,
          size: panelSize,
          marginTop
        });
      }
    } else if (revealMode === 'slide') {
      // @ts-expect-error
      this._initialPosition = drawer.isHorizontalDirection() ? {
        left: panelOffset
      } : {
        top: panelOffset
      };
      // @ts-expect-error
      (0, _translator.move)($panel, this._initialPosition);
    } else if (revealMode === 'expand') {
      // @ts-expect-error
      this._initialPosition = drawer.isHorizontalDirection() ? {
        left: 0
      } : {
        top: 0
      };
      // @ts-expect-error
      (0, _translator.move)($panelOverlayContent, this._initialPosition);
      // @ts-expect-error
      if (drawer.isHorizontalDirection()) {
        (0, _renderer.default)($panelOverlayContent).css('width', panelSize);
      } else {
        (0, _renderer.default)($panelOverlayContent).css('height', panelSize);
        if (targetPanelPosition === 'bottom') {
          (0, _renderer.default)($panelOverlayContent).css('marginTop', marginTop);
        }
      }
    }
  }
  getPanelContent() {
    // @ts-expect-error
    return (0, _renderer.default)(this.getDrawerInstance().getOverlay().content());
  }
  _processOverlayZIndex($element) {
    // @ts-expect-error
    const styles = (0, _renderer.default)($element).get(0).style;
    const zIndex = styles.zIndex || 1;
    // @ts-expect-error
    this.getDrawerInstance().setZIndex(zIndex);
  }
  // @ts-expect-error
  isViewContentFirst(position) {
    return position === 'right' || position === 'bottom';
  }
}
var _default = exports.default = OverlapStrategy;
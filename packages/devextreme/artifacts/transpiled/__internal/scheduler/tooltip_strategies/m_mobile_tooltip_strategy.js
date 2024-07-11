"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MobileTooltipStrategy = void 0;
var _size = require("../../../core/utils/size");
var _window = require("../../../core/utils/window");
var _ui = _interopRequireDefault(require("../../../ui/overlay/ui.overlay"));
var _m_tooltip_strategy_base = require("./m_tooltip_strategy_base");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CLASS = {
  slidePanel: 'dx-scheduler-overlay-panel',
  scrollableContent: '.dx-scrollable-content'
};
const MAX_TABLET_OVERLAY_HEIGHT_FACTOR = 0.9;
const MAX_HEIGHT = {
  PHONE: 250,
  TABLET: '90%',
  DEFAULT: 'auto'
};
const MAX_WIDTH = {
  PHONE: '100%',
  TABLET: '80%'
};
const animationConfig = {
  show: {
    type: 'slide',
    duration: 300,
    from: {
      position: {
        my: 'top',
        at: 'bottom',
        of: (0, _window.getWindow)()
      }
    },
    to: {
      position: {
        my: 'center',
        at: 'center',
        of: (0, _window.getWindow)()
      }
    }
  },
  hide: {
    type: 'slide',
    duration: 300,
    to: {
      position: {
        my: 'top',
        at: 'bottom',
        of: (0, _window.getWindow)()
      }
    },
    from: {
      position: {
        my: 'center',
        at: 'center',
        of: (0, _window.getWindow)()
      }
    }
  }
};
const createPhoneDeviceConfig = listHeight => ({
  shading: false,
  width: MAX_WIDTH.PHONE,
  height: listHeight > MAX_HEIGHT.PHONE ? MAX_HEIGHT.PHONE : MAX_HEIGHT.DEFAULT,
  position: {
    my: 'bottom',
    at: 'bottom',
    of: (0, _window.getWindow)()
  }
});
const createTabletDeviceConfig = listHeight => {
  const currentMaxHeight = (0, _size.getHeight)((0, _window.getWindow)()) * MAX_TABLET_OVERLAY_HEIGHT_FACTOR;
  return {
    shading: true,
    width: MAX_WIDTH.TABLET,
    height: listHeight > currentMaxHeight ? MAX_HEIGHT.TABLET : MAX_HEIGHT.DEFAULT,
    position: {
      my: 'center',
      at: 'center',
      of: (0, _window.getWindow)()
    }
  };
};
class MobileTooltipStrategy extends _m_tooltip_strategy_base.TooltipStrategyBase {
  _shouldUseTarget() {
    return false;
  }
  setTooltipConfig() {
    const isTabletWidth = (0, _size.getWidth)((0, _window.getWindow)()) > 700;
    const listHeight = (0, _size.getOuterHeight)(this._list.$element().find(CLASS.scrollableContent));
    this._tooltip.option(isTabletWidth ? createTabletDeviceConfig(listHeight) : createPhoneDeviceConfig(listHeight));
  }
  async _onShowing() {
    this._tooltip.option('height', MAX_HEIGHT.DEFAULT);
    /*
    NOTE: there are two setTooltipConfig calls to reduce blinking of overlay.
    The first one sets initial sizes, the second updates them after rendering async templates
    */
    this.setTooltipConfig();
    await Promise.all([...this.asyncTemplatePromises]);
    this.setTooltipConfig();
  }
  _createTooltip(target, dataList) {
    const element = this._createTooltipElement(CLASS.slidePanel);
    return this._options.createComponent(element, _ui.default, {
      target: (0, _window.getWindow)(),
      hideOnOutsideClick: true,
      animation: animationConfig,
      onShowing: () => this._onShowing(),
      onShown: this._onShown.bind(this),
      contentTemplate: this._getContentTemplate(dataList),
      wrapperAttr: {
        class: CLASS.slidePanel
      }
    });
  }
}
exports.MobileTooltipStrategy = MobileTooltipStrategy;
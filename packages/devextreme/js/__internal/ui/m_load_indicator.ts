import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getHeight, getWidth } from '@js/core/utils/size';
import { getNavigator } from '@js/core/utils/window';
// @ts-expect-error
import { current, isGeneric, isMaterialBased } from '@js/ui/themes';
import Widget from '@js/ui/widget/ui.widget';

import supportUtils from '../core/utils/m_support';

const navigator = getNavigator();

const LOADINDICATOR_CLASS = 'dx-loadindicator';
const LOADINDICATOR_WRAPPER_CLASS = 'dx-loadindicator-wrapper';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';
const LOADINDICATOR_IMAGE_CLASS = 'dx-loadindicator-image';

// @ts-expect-error
const LoadIndicator = Widget.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      indicatorSrc: '',
      activeStateEnabled: false,
      hoverStateEnabled: false,
      _animatingSegmentCount: 1,
      _animatingSegmentInner: false,

    });
  },

  _defaultOptionsRules() {
    const themeName = current();

    return this.callBase().concat([
      {
        device() {
          const realDevice = devices.real();
          const obsoleteAndroid = realDevice.platform === 'android' && !/chrome/i.test(navigator.userAgent);
          return obsoleteAndroid;
        },
        options: {
          viaImage: true,
        },
      },
      {
        device() {
          return isMaterialBased(themeName);
        },
        options: {
          _animatingSegmentCount: 2,
          _animatingSegmentInner: true,
        },
      },
      {
        device() {
          return isGeneric(themeName);
        },
        options: {
          _animatingSegmentCount: 7,
        },
      },
    ]);
  },

  _useTemplates() {
    return false;
  },

  _init() {
    this.callBase();

    this.$element().addClass(LOADINDICATOR_CLASS);

    const label = messageLocalization.format('Loading');
    const aria = {
      role: 'alert',
      label,
    };

    this.setAria(aria);
  },

  _initMarkup() {
    this.callBase();
    this._renderWrapper();
    this._renderIndicatorContent();
    this._renderMarkup();
  },

  _renderWrapper() {
    this._$wrapper = $('<div>').addClass(LOADINDICATOR_WRAPPER_CLASS);
    this.$element().append(this._$wrapper);
  },

  _renderIndicatorContent() {
    this._$content = $('<div>').addClass(LOADINDICATOR_CONTENT_CLASS);
    this._$wrapper.append(this._$content);
  },

  _renderMarkup() {
    const { viaImage, indicatorSrc } = this.option();

    if (supportUtils.animation() && !viaImage && !indicatorSrc) { // B236922
      this._renderMarkupForAnimation();
    } else {
      this._renderMarkupForImage();
    }
  },

  _renderMarkupForAnimation() {
    const animatingSegmentInner = this.option('_animatingSegmentInner');

    this._$indicator = $('<div>').addClass(LOADINDICATOR_ICON_CLASS);
    this._$content.append(this._$indicator);

    // Indicator markup
    for (let i = this.option('_animatingSegmentCount'); i >= 0; --i) {
      const $segment = $('<div>')
        .addClass(LOADINDICATOR_SEGMENT_CLASS)
        .addClass(LOADINDICATOR_SEGMENT_CLASS + i);

      if (animatingSegmentInner) {
        $segment.append($('<div>').addClass(LOADINDICATOR_SEGMENT_INNER_CLASS));
      }

      this._$indicator.append($segment);
    }
  },

  _renderMarkupForImage() {
    const { indicatorSrc } = this.option();

    if (indicatorSrc) {
      this._$wrapper.addClass(LOADINDICATOR_IMAGE_CLASS);
      this._$wrapper.css('backgroundImage', `url(${indicatorSrc})`);
    } else if (supportUtils.animation()) {
      this._renderMarkupForAnimation();
    }
  },

  _renderDimensions() {
    this.callBase();
    this._updateContentSizeForAnimation();
  },

  _updateContentSizeForAnimation() {
    if (!this._$indicator) {
      return;
    }

    let width = this.option('width');
    let height = this.option('height');

    if (width || height) {
      width = getWidth(this.$element());
      height = getHeight(this.$element());
      const minDimension = Math.min(height, width);

      this._$wrapper.css({
        height: minDimension,
        width: minDimension,
        fontSize: minDimension,
      });
    }
  },

  _clean() {
    this.callBase();

    this._removeMarkupForAnimation();
    this._removeMarkupForImage();
  },

  _removeMarkupForAnimation() {
    if (!this._$indicator) {
      return;
    }

    this._$indicator.remove();
    delete this._$indicator;
  },

  _removeMarkupForImage() {
    this._$wrapper.css('backgroundImage', 'none');
  },

  _optionChanged(args) {
    switch (args.name) {
      case '_animatingSegmentCount':
      case '_animatingSegmentInner':
      case 'indicatorSrc':
        this._invalidate();
        break;
      default:
        this.callBase(args);
    }
  },
});

registerComponent('dxLoadIndicator', LoadIndicator);

export default LoadIndicator;

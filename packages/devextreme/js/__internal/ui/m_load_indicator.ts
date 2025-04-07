import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getHeight, getWidth } from '@js/core/utils/size';
import { getNavigator } from '@js/core/utils/window';
import type { Properties } from '@js/ui/load_indicator';
import { current, isGeneric, isMaterialBased } from '@js/ui/themes';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import supportUtils from '../core/utils/m_support';

const navigator = getNavigator();

const LOADINDICATOR_CLASS = 'dx-loadindicator';
const LOADINDICATOR_WRAPPER_CLASS = 'dx-loadindicator-wrapper';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';
const LOADINDICATOR_IMAGE_CLASS = 'dx-loadindicator-image';
const LOADINDICATOR_IMAGE_AI_CLASS = 'dx-loadindicator-image-ai';

export interface LoadIndicatorProperties extends Properties {
  useAISVG?: boolean;

  viaImage?: boolean;

  _animatingSegmentCount?: number;

  _animatingSegmentInner?: boolean;
}

class LoadIndicator extends Widget<LoadIndicatorProperties> {
  _$wrapper!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _$indicator?: dxElementWrapper;

  _getDefaultOptions(): LoadIndicatorProperties {
    return {
      ...super._getDefaultOptions(),
      indicatorSrc: '',
      activeStateEnabled: false,
      hoverStateEnabled: false,
      _animatingSegmentCount: 1,
      _animatingSegmentInner: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<LoadIndicatorProperties>[] {
    const themeName = current();

    return super._defaultOptionsRules().concat([
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
        device(): boolean {
          return isMaterialBased(themeName);
        },
        options: {
          _animatingSegmentCount: 2,
          _animatingSegmentInner: true,
        },
      },
      {
        device(): boolean {
          return isGeneric(themeName);
        },
        options: {
          _animatingSegmentCount: 7,
        },
      },
    ]);
  }

  // eslint-disable-next-line class-methods-use-this
  _useTemplates(): boolean {
    return false;
  }

  _init(): void {
    super._init();

    this.$element().addClass(LOADINDICATOR_CLASS);

    const label = messageLocalization.format('Loading');
    const aria = {
      role: 'alert',
      label,
    };

    this.setAria(aria);
  }

  _initMarkup(): void {
    super._initMarkup();
    this._renderWrapper();
    this._renderIndicatorContent();
    this._renderMarkup();
  }

  _renderWrapper(): void {
    this._$wrapper = $('<div>').addClass(LOADINDICATOR_WRAPPER_CLASS);
    this.$element().append(this._$wrapper);
  }

  _renderIndicatorContent(): void {
    this._$content = $('<div>').addClass(LOADINDICATOR_CONTENT_CLASS);
    this._$wrapper.append(this._$content);
  }

  _renderMarkup(): void {
    const { useAISVG, viaImage, indicatorSrc } = this.option();
    const isAnimationAvailable = supportUtils.animation();

    if (useAISVG) {
      this._renderMarkupForSvg();
    } else if (viaImage || indicatorSrc || !isAnimationAvailable) {
      this._renderMarkupForImage();
    } else {
      this._renderMarkupForAnimation();
    }
  }

  _renderMarkupForAnimation(): void {
    const animatingSegmentInner = this.option('_animatingSegmentInner');

    this._$indicator = $('<div>').addClass(LOADINDICATOR_ICON_CLASS);
    this._$content.append(this._$indicator);

    // Indicator markup
    // @ts-expect-error ts-error
    for (let i = this.option('_animatingSegmentCount'); i >= 0; --i) {
      const $segment = $('<div>')
        .addClass(LOADINDICATOR_SEGMENT_CLASS)
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
        .addClass(LOADINDICATOR_SEGMENT_CLASS + i);

      if (animatingSegmentInner) {
        $segment.append($('<div>').addClass(LOADINDICATOR_SEGMENT_INNER_CLASS));
      }

      this._$indicator.append($segment);
    }
  }

  _renderMarkupForSvg(): void {
    this._$wrapper
      .addClass(LOADINDICATOR_IMAGE_CLASS)
      .addClass(LOADINDICATOR_IMAGE_AI_CLASS);
  }

  _renderMarkupForImage(): void {
    const { indicatorSrc } = this.option();

    if (indicatorSrc) {
      this._$wrapper.addClass(LOADINDICATOR_IMAGE_CLASS);
      this._$wrapper.css('backgroundImage', `url(${indicatorSrc})`);
    } else if (supportUtils.animation()) {
      this._renderMarkupForAnimation();
    }
  }

  _renderDimensions(): void {
    super._renderDimensions();
    this._updateContentSizeForAnimation();
  }

  _updateContentSizeForAnimation(): void {
    if (!this._$indicator) {
      return;
    }

    let width = this.option('width');
    let height = this.option('height');

    if (width || height) {
      width = getWidth(this.$element());
      height = getHeight(this.$element());
      // @ts-expect-error ts-error
      const minDimension = Math.min(height, width);

      this._$wrapper.css({
        height: minDimension,
        width: minDimension,
        fontSize: minDimension,
      });
    }
  }

  _clean(): void {
    super._clean();

    this._removeMarkupForAnimation();
    this._removeMarkupForImage();
  }

  _removeMarkupForAnimation(): void {
    if (!this._$indicator) {
      return;
    }

    this._$indicator.remove();
    delete this._$indicator;
  }

  _removeMarkupForImage(): void {
    this._$wrapper.css('backgroundImage', 'none');
  }

  _optionChanged(args: OptionChanged<LoadIndicatorProperties>): void {
    switch (args.name) {
      case '_animatingSegmentCount':
      case '_animatingSegmentInner':
      case 'indicatorSrc':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxLoadIndicator', LoadIndicator);

export default LoadIndicator;

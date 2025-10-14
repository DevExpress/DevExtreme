import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getHeight, getWidth } from '@js/core/utils/size';
import type { Properties } from '@js/ui/load_indicator';
import { current, isGeneric, isMaterialBased } from '@js/ui/themes';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import supportUtils from '../core/utils/m_support';

export const LOADINDICATOR_CLASS = 'dx-loadindicator';
export const LOADINDICATOR_WRAPPER_CLASS = 'dx-loadindicator-wrapper';
export const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
export const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
export const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
export const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';
export const LOADINDICATOR_IMAGE_CLASS = 'dx-loadindicator-image';

export enum AnimationType {
  Circle = 'circle',
  Sparkle = 'sparkle',
}

export const ANIMATION_TYPE_CLASSES = {
  [AnimationType.Circle]: 'dx-loadindicator-content-circle',
  [AnimationType.Sparkle]: 'dx-loadindicator-content-sparkle',
} as const;

export interface LoadIndicatorProperties extends Properties {
  _animatingSegmentCount?: number;
  _animatingSegmentInner?: boolean;
}

interface SegmentParams {
  segmentCount: number;
  segmentInner: boolean;
}

class LoadIndicator extends Widget<LoadIndicatorProperties> {
  _$wrapper!: dxElementWrapper;

  _$content!: dxElementWrapper;

  _$indicator?: dxElementWrapper;

  _getDefaultOptions(): LoadIndicatorProperties {
    return {
      ...super._getDefaultOptions(),
      _animatingSegmentCount: 1,
      _animatingSegmentInner: false,
      animationType: AnimationType.Circle,
      activeStateEnabled: false,
      hoverStateEnabled: false,
      indicatorSrc: '',
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<LoadIndicatorProperties>[] {
    const themeName = current();

    return super._defaultOptionsRules().concat([
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

  _getAnimationTypeContentClass(): (typeof ANIMATION_TYPE_CLASSES)[AnimationType] | undefined {
    const { animationType } = this.option();

    return animationType && ANIMATION_TYPE_CLASSES[animationType];
  }

  _renderIndicatorContent(): void {
    const animationClass = this._getAnimationTypeContentClass() ?? '';
    const contentClasses = [LOADINDICATOR_CONTENT_CLASS, animationClass].join(' ');

    this._$content = $('<div>').addClass(contentClasses);
    this._$wrapper.append(this._$content);
  }

  _renderMarkup(): void {
    const { indicatorSrc } = this.option();
    const isAnimationAvailable = supportUtils.animation();

    if (indicatorSrc) {
      this._renderImageMarkup();
    } else if (isAnimationAvailable) {
      this._renderAnimationMarkup();
    }
  }

  _getSegmentParams(): SegmentParams {
    const {
      animationType,
      _animatingSegmentCount: animatingSegmentCount,
      _animatingSegmentInner: animatingSegmentInner,
    } = this.option();

    switch (animationType) {
      case AnimationType.Sparkle:
        return {
          segmentCount: 2,
          segmentInner: false,
        };
      case AnimationType.Circle:
      default:
        return {
          segmentCount: animatingSegmentCount ?? 0,
          segmentInner: Boolean(animatingSegmentInner),
        };
    }
  }

  _renderAnimationMarkup(): void {
    this._$indicator = $('<div>').addClass(LOADINDICATOR_ICON_CLASS);
    this._$content.append(this._$indicator);

    const params = this._getSegmentParams();

    this._renderSegments(params);
  }

  _renderSegments(params: SegmentParams): void {
    const { segmentCount, segmentInner } = params;

    for (let i = segmentCount; i >= 0; i -= 1) {
      const $segment = $('<div>')
        .addClass(LOADINDICATOR_SEGMENT_CLASS)
        .addClass(`${LOADINDICATOR_SEGMENT_CLASS}${i}`);

      if (segmentInner) {
        const $segmentInner = $('<div>').addClass(LOADINDICATOR_SEGMENT_INNER_CLASS);

        $segment.append($segmentInner);
      }

      this._$indicator?.append($segment);
    }
  }

  _renderImageMarkup(): void {
    const { indicatorSrc } = this.option();

    this._$wrapper.addClass(LOADINDICATOR_IMAGE_CLASS);
    this._$wrapper.css('backgroundImage', `url(${indicatorSrc})`);
  }

  _renderDimensions(): void {
    super._renderDimensions();
    this._updateContentSizeForAnimation();
  }

  _updateContentSizeForAnimation(): void {
    if (!this._$indicator) {
      return;
    }

    const { width, height } = this.option();

    if (width || height) {
      const elementWidth = getWidth(this.$element());
      const elementHeight = getHeight(this.$element());

      const minDimension = Math.min(elementHeight, elementWidth);

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
    this._$indicator = undefined;
  }

  _removeMarkupForImage(): void {
    this._$wrapper.css('backgroundImage', 'none');
  }

  _optionChanged(args: OptionChanged<LoadIndicatorProperties>): void {
    switch (args.name) {
      case '_animatingSegmentCount':
      case '_animatingSegmentInner':
      case 'animationType':
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

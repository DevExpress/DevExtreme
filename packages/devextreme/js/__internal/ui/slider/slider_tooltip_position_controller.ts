import type { VerticalEdge } from '@js/common';
import positionUtils from '@js/common/core/animation/position';
import { move } from '@js/common/core/animation/translator';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type {
  POPOVER_POSITION_ALIASES,
  PopoverControllerElements,
  PopoverControllerProperties,
  PopoverPosition,
} from '@ts/ui/popover/popover_position_controller';
import {
  isCommonPosition,
  PopoverPositionController,
} from '@ts/ui/popover/popover_position_controller';

const SLIDER_CLASS = 'dx-slider';

const SLIDER_TOOLTIP_POSITION_ALIASES: Pick<
  typeof POPOVER_POSITION_ALIASES,
  VerticalEdge
> = {
  top: {
    my: 'bottom center',
    at: 'top center',
    collision: 'fit none',
  },
  bottom: {
    my: 'top center',
    at: 'bottom center',
    collision: 'fit none',
  },
};

const DEFAULT_BOUNDARY_OFFSET = { h: 2, v: 1 };

export class SliderTooltipPositionController<
  TProperties extends PopoverControllerProperties = PopoverControllerProperties,
  TElements extends PopoverControllerElements = PopoverControllerElements,
  TPosition extends VerticalEdge = VerticalEdge,
> extends PopoverPositionController<
  TProperties,
  TElements,
  TPosition
> {
  _normalizePosition(position?: TPosition): PopoverPosition {
    const { target } = this._properties;

    const $sliderHandle = target ? $(target) : null;
    const sliderElement = $sliderHandle?.closest(`.${SLIDER_CLASS}`)?.get(0);

    const defaultPositionConfig = {
      of: $sliderHandle,
      boundaryOffset: DEFAULT_BOUNDARY_OFFSET,
      boundary: sliderElement,
    };

    const positionObject = isDefined(position)
      ? this._positionToObject(position)
      : {};

    const resultPosition: PopoverPosition = extend(
      true,
      {},
      defaultPositionConfig,
      positionObject,
    );

    this._positionSide = this._getDisplaySide(resultPosition);

    return resultPosition;
  }

  _renderContentInitialPosition(): void {
    super._renderContentInitialPosition();

    this._fitIntoSlider();
  }

  _fitIntoSlider(): void {
    const calculatedPosition = positionUtils.calculate(this._$content, this._position);

    const { collisionSide, oversize } = calculatedPosition.h;
    const left = this._visualPosition?.left ?? 0;

    const isLeftSide = collisionSide === 'left';
    const offset = (isLeftSide ? 1 : -1) * oversize;

    move(this._$content, { left: left + offset });

    this._updateVisualPositionValue();
  }

  _positionToObject(position: TPosition): PopoverPosition {
    if (isCommonPosition(position)) {
      const configuration: PopoverPosition = {
        ...SLIDER_TOOLTIP_POSITION_ALIASES[position],
      };

      return configuration;
    }

    return position as PopoverPosition;
  }
}

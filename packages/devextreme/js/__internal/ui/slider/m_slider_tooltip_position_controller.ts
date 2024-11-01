import positionUtils from '@js/common/core/animation/position';
import { move } from '@js/common/core/animation/translator';
import { extend } from '@js/core/utils/extend';
import { isString } from '@js/core/utils/type';
import { PopoverPositionController } from '@ts/ui/popover/m_popover_position_controller';

const SLIDER_TOOLTIP_POSITION_ALIASES = {
  top: { my: 'bottom center', at: 'top center', collision: 'fit none' },
  bottom: { my: 'top center', at: 'bottom center', collision: 'fit none' },
};
const SLIDER_TOOLTIP_DEFAULT_BOUNDARY_OFFSET = { h: 2, v: 1 };
const SLIDER_CLASS = 'dx-slider';

class SliderTooltipPositionController extends PopoverPositionController {
  _normalizePosition(positionProp) {
    const $sliderHandle = this._props.target;
    const sliderClass = `.${SLIDER_CLASS}`;
    const $slider = $sliderHandle?.closest(sliderClass);
    const defaultPositionConfig = {
      of: $sliderHandle,
      boundaryOffset: SLIDER_TOOLTIP_DEFAULT_BOUNDARY_OFFSET,
      boundary: $slider?.get(0),
    };

    const resultPosition = extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp));

    this._positionSide = this._getDisplaySide(resultPosition);

    return resultPosition;
  }

  _renderContentInitialPosition() {
    super._renderContentInitialPosition();

    this._fitIntoSlider();
  }

  _fitIntoSlider() {
    const { collisionSide, oversize } = positionUtils.calculate(this._$content, this._position).h;
    const { left } = this._visualPosition;
    const isLeftSide = collisionSide === 'left';

    const offset = (isLeftSide ? 1 : -1) * oversize;
    move(this._$content, { left: left + offset });

    this._updateVisualPositionValue();
  }

  _positionToObject(positionProp) {
    if (isString(positionProp)) {
      return extend({}, SLIDER_TOOLTIP_POSITION_ALIASES[positionProp]);
    }

    return positionProp;
  }
}

export { SliderTooltipPositionController };

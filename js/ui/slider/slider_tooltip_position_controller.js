import { PopoverPositionController } from '../popover/popover_position_controller';
import { move } from '../../animation/translator';
import positionUtils from '../../animation/position';
import { extend } from '../../core/utils/extend';
import { isString } from '../../core/utils/type';

const SLIDER_TOOLTIP_POSITION_ALIASES = {
    'top': { my: 'bottom center', at: 'top center', collision: 'fit none' },
    'bottom': { my: 'top center', at: 'bottom center', collision: 'fit none' },
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
            boundary: $slider?.get(0)
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
        const left = this._visualPosition.left;
        const isLeftSide = collisionSide === 'left';

        const offset = (isLeftSide ? 1 : -1) * oversize;
        move(this._$content, { left: left + offset });

        this._updateVisualPositionValue();
    }

    _positionToObject(positionProp) {
        if(isString(positionProp)) {
            return extend({}, SLIDER_TOOLTIP_POSITION_ALIASES[positionProp]);
        }

        return positionProp;
    }
}

export { SliderTooltipPositionController };

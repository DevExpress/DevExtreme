import positionUtils from '@js/common/core/animation/position';
import type { dxElementWrapper } from '@js/core/renderer';
// @ts-expect-error
import { pairToObject } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined, isString } from '@js/core/utils/type';
import { OverlayPositionController } from '@ts/ui/overlay/m_overlay_position_controller';
import { borderWidthStyles } from '@ts/ui/resizable/utils';

const WEIGHT_OF_SIDES = {
  left: -1,
  top: -1,
  center: 0,
  right: 1,
  bottom: 1,
};
const POPOVER_POSITION_ALIASES = {
  // NOTE: public API
  top: { my: 'bottom center', at: 'top center', collision: 'fit flip' },
  bottom: { my: 'top center', at: 'bottom center', collision: 'fit flip' },
  right: { my: 'left center', at: 'right center', collision: 'flip fit' },
  left: { my: 'right center', at: 'left center', collision: 'flip fit' },
};
const POPOVER_DEFAULT_BOUNDARY_OFFSET = { h: 10, v: 10 };

class PopoverPositionController extends OverlayPositionController {
  _positionSide?: any;

  _$arrow?: dxElementWrapper;

  constructor({
    shading,
    target,
    $arrow,
    ...args
  }) {
    // @ts-expect-error
    super(args);

    this._props = {
      ...this._props,
      shading,
      target,
    };

    this._$arrow = $arrow;

    this._positionSide = undefined;

    this.updatePosition(this._props.position);
  }

  positionWrapper(): void {
    if (this._props.shading) {
      this._$wrapper.css({ top: 0, left: 0 });
    }
  }

  updateTarget(target): void {
    this._props.target = target;

    this.updatePosition(this._props.position);
  }

  _renderBoundaryOffset(): void {}

  _getContainerPosition() {
    const offset = pairToObject(this._position.offset || '');
    let { h: hOffset, v: vOffset } = offset;
    const isVerticalSide = this._isVerticalSide();
    const isHorizontalSide = this._isHorizontalSide();

    if (isVerticalSide || isHorizontalSide) {
      const isPopoverInside = this._isPopoverInside();
      const sign = (isPopoverInside ? -1 : 1) * WEIGHT_OF_SIDES[this._positionSide];
      const arrowSize = isVerticalSide ? getHeight(this._$arrow) : getWidth(this._$arrow);
      const arrowSizeCorrection = this._getContentBorderWidth(this._positionSide);
      const arrowOffset = sign * (arrowSize - arrowSizeCorrection);

      isVerticalSide ? vOffset += arrowOffset : hOffset += arrowOffset;
    }

    return extend({}, this._position, { offset: `${hOffset} ${vOffset}` });
  }

  _getContentBorderWidth(side) {
    const borderWidth = this._$content.css(borderWidthStyles[side]);

    // @ts-expect-error
    // eslint-disable-next-line radix
    return parseInt(borderWidth) || 0;
  }

  _isPopoverInside(): boolean {
    const my = positionUtils.setup.normalizeAlign(this._position.my);
    const at = positionUtils.setup.normalizeAlign(this._position.at);

    return my.h === at.h && my.v === at.v;
  }

  _isVerticalSide(side = this._positionSide) {
    return side === 'top' || side === 'bottom';
  }

  _isHorizontalSide(side = this._positionSide) {
    return side === 'left' || side === 'right';
  }

  _getDisplaySide(position) {
    const my = positionUtils.setup.normalizeAlign(position.my);
    const at = positionUtils.setup.normalizeAlign(position.at);

    const weightSign = WEIGHT_OF_SIDES[my.h] === WEIGHT_OF_SIDES[at.h] && WEIGHT_OF_SIDES[my.v] === WEIGHT_OF_SIDES[at.v] ? -1 : 1;
    const horizontalWeight = Math.abs(WEIGHT_OF_SIDES[my.h] - weightSign * WEIGHT_OF_SIDES[at.h]);
    const verticalWeight = Math.abs(WEIGHT_OF_SIDES[my.v] - weightSign * WEIGHT_OF_SIDES[at.v]);

    return horizontalWeight > verticalWeight ? at.h : at.v;
  }

  _normalizePosition(positionProp) {
    const defaultPositionConfig = {
      of: this._props.target,
      boundaryOffset: POPOVER_DEFAULT_BOUNDARY_OFFSET,
    };

    let resultPosition;
    if (isDefined(positionProp)) {
      resultPosition = extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
    } else {
      resultPosition = defaultPositionConfig;
    }

    this._positionSide = this._getDisplaySide(resultPosition);

    return resultPosition;
  }

  _positionToObject(positionProp) {
    if (isString(positionProp)) {
      return extend({}, POPOVER_POSITION_ALIASES[positionProp]);
    }

    return positionProp;
  }
}

export {
  POPOVER_POSITION_ALIASES,
  PopoverPositionController,
};

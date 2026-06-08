import type { Position as CommonPosition } from '@js/common';
import type { CollisionResolutionCombination } from '@js/common/core/animation';
import positionUtils from '@js/common/core/animation/position';
import type { dxElementWrapper } from '@js/core/renderer';
import { pairToObject } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { getHeight, getWidth } from '@js/core/utils/size';
import { isDefined, isString } from '@js/core/utils/type';
import type {
  ControllerOverlayElements,
  OverlayPosition,
  Position as OverlayBasePosition,
} from '@ts/ui/overlay/overlay_position_controller';
import type { PopoverProperties } from '@ts/ui/popover/m_popover';
import type {
  PopupControllerProperties,
  PopupPositionControllerConstructor,
} from '@ts/ui/popup/popup_position_controller';
import { PopupPositionController } from '@ts/ui/popup/popup_position_controller';
import { borderWidthStyles } from '@ts/ui/resizable/utils';

export interface PopoverControllerElements extends ControllerOverlayElements {
  $arrow?: dxElementWrapper;
}

export interface PopoverControllerProperties extends PopupControllerProperties {
  target?: PopoverProperties['target'];
  shading?: PopoverProperties['shading'];
}

export interface PopoverPosition extends OverlayPosition {
  collision?: CollisionResolutionCombination;
}

export type Position = PopoverPosition | CommonPosition | OverlayBasePosition;

export type DisplaySide = CommonPosition | 'center';

export type PopoverPositionControllerConstructor<
  TProperties extends PopoverControllerProperties = PopoverControllerProperties,
  TElements extends PopoverControllerElements = PopoverControllerElements,
  TPosition = Position,
> = PopupPositionControllerConstructor<TProperties, TElements, TPosition>;

const WEIGHT_OF_SIDES = {
  left: -1,
  top: -1,
  center: 0,
  right: 1,
  bottom: 1,
};

// NOTE: public API
export const POPOVER_POSITION_ALIASES: Record<CommonPosition, PopoverPosition> = {
  top: {
    my: 'bottom center',
    at: 'top center',
    collision: 'fit flip',
  },
  bottom: {
    my: 'top center',
    at: 'bottom center',
    collision: 'fit flip',
  },
  right: {
    my: 'left center',
    at: 'right center',
    collision: 'flip fit',
  },
  left: {
    my: 'right center',
    at: 'left center',
    collision: 'flip fit',
  },
};

const POPOVER_DEFAULT_BOUNDARY_OFFSET = { h: 10, v: 10 };

export const isCommonPosition = (
  position: unknown,
): position is CommonPosition => isString(position)
  && Object.prototype.hasOwnProperty.call(POPOVER_POSITION_ALIASES, position);

export class PopoverPositionController<
  TProperties extends PopoverControllerProperties = PopoverControllerProperties,
  TElements extends PopoverControllerElements = PopoverControllerElements,
  TPosition extends Position = Position,
> extends PopupPositionController<
    TProperties,
    TElements,
    TPosition
  > {
  _positionSide?: DisplaySide;

  _$arrow?: TElements['$arrow'];

  constructor(params: PopoverPositionControllerConstructor<TProperties, TElements, TPosition>) {
    super(params);

    const superProperties = this._properties;

    const { properties, elements } = params;
    const { shading, target } = properties;
    const { $arrow } = elements;

    this._properties = {
      ...superProperties,
      shading,
      target,
    };

    this._$arrow = $arrow;

    this._positionSide = undefined;

    this.updatePosition(this._properties.position);
  }

  positionWrapper(): void {
    if (this._properties.shading) {
      this._$wrapper?.css({ top: 0, left: 0 });
    }
  }

  updateTarget(target: PopoverControllerProperties['target']): void {
    this._properties.target = target;

    this.updatePosition(this._properties.position);
  }

  _renderBoundaryOffset(): void {}

  _getContainerPosition(): PopoverPosition {
    const offset = pairToObject(this._position?.offset ?? '');

    let { h: hOffset, v: vOffset } = offset;

    const isVerticalSide = this._isVerticalSide();
    const isHorizontalSide = this._isHorizontalSide();

    if (isVerticalSide || isHorizontalSide) {
      const isPopoverInside = this._isPopoverInside();

      const weightOfSide = this._positionSide
        ? WEIGHT_OF_SIDES[this._positionSide]
        : WEIGHT_OF_SIDES.center;

      const sign = (isPopoverInside ? -1 : 1) * weightOfSide;

      const arrowSize = isVerticalSide ? getHeight(this._$arrow) : getWidth(this._$arrow);
      const arrowSizeCorrection = this._getContentBorderWidth(this._positionSide);
      const arrowOffset = sign * (arrowSize - arrowSizeCorrection);

      if (isVerticalSide) {
        vOffset += arrowOffset;
      } else {
        hOffset += arrowOffset;
      }
    }

    const position: PopoverPosition = {
      ...this._position,
      offset: `${hOffset} ${vOffset}`,
    };

    return position;
  }

  _getContentBorderWidth(side?: DisplaySide): number {
    if (!side || side === 'center') {
      return 0;
    }

    const borderWidth = this._$content?.css(borderWidthStyles[side]) ?? '';

    return parseInt(borderWidth, 10) || 0;
  }

  _isPopoverInside(): boolean {
    const my = positionUtils.setup.normalizeAlign(this._position?.my);
    const at = positionUtils.setup.normalizeAlign(this._position?.at);

    return my.h === at.h && my.v === at.v;
  }

  _isVerticalSide(side: DisplaySide | undefined = this._positionSide): boolean {
    return side === 'top' || side === 'bottom';
  }

  _isHorizontalSide(side: DisplaySide | undefined = this._positionSide): boolean {
    return side === 'left' || side === 'right';
  }

  _getDisplaySide(position: PopoverPosition): DisplaySide {
    const my = positionUtils.setup.normalizeAlign(position.my);
    const at = positionUtils.setup.normalizeAlign(position.at);

    const weightSign = WEIGHT_OF_SIDES[my.h] === WEIGHT_OF_SIDES[at.h]
      && WEIGHT_OF_SIDES[my.v] === WEIGHT_OF_SIDES[at.v] ? -1 : 1;

    const horizontalWeight = Math.abs(WEIGHT_OF_SIDES[my.h] - weightSign * WEIGHT_OF_SIDES[at.h]);
    const verticalWeight = Math.abs(WEIGHT_OF_SIDES[my.v] - weightSign * WEIGHT_OF_SIDES[at.v]);

    return (horizontalWeight > verticalWeight ? at.h : at.v) as DisplaySide;
  }

  _normalizePosition(position?: TPosition): PopoverPosition {
    const defaultPositionConfig: PopoverPosition = {
      of: this._properties.target,
      boundaryOffset: POPOVER_DEFAULT_BOUNDARY_OFFSET,
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

  _positionToObject(position: TPosition): PopoverPosition {
    if (isCommonPosition(position)) {
      return {
        ...POPOVER_POSITION_ALIASES[position],
      };
    }

    if (isString(position)) {
      return { my: position, at: position };
    }

    return position;
  }
}

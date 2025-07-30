import type { PositionAlignment } from '@js/common';
import positionUtils from '@js/common/core/animation/position';
import { locate, move, resetPosition } from '@js/common/core/animation/translator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import {
  isDefined,
  // @ts-expect-error private prop
  isEvent,
  isString,
  isWindow,
} from '@js/core/utils/type';
import swatch from '@js/ui/widget/swatch_container';
import type {
  OverlayActions,
  OverlayProperties,
  PointerLikeEvent,
} from '@ts/ui/overlay/overlay';

import windowUtils from '../../core/utils/m_window';

type OverlayPositionAlignment =
  | 'top center'
  | 'bottom center'
  | 'right center'
  | 'left center'
  | 'center'
  | 'right bottom'
  | 'right top'
  | 'left bottom'
  | 'left top';

type Position = OverlayPosition | OverlayPositionAlignment;

interface OverlayPosition {
  my?: OverlayPositionAlignment;
  at?: OverlayPositionAlignment;
  of?: string | dxElementWrapper | Element; // Move to Popover
  offset?: unknown; // Move to Popover
  boundaryOffset?: typeof OVERLAY_DEFAULT_BOUNDARY_OFFSET;
}

export interface OverlayPositionControllerConstructor {
  position?: OverlayProperties['position'];
  container?: OverlayProperties['container'];
  visualContainer?: OverlayProperties['visualContainer'];
  $root?: dxElementWrapper;
  $content?: dxElementWrapper;
  $wrapper?: dxElementWrapper;
  onPositioned?: OverlayActions['onPositioned'];
  onVisualPositionChanged?: OverlayActions['onVisualPositionChanged'];
  restorePosition?: OverlayProperties['restorePosition'];
  _fixWrapperPosition?: OverlayProperties['_fixWrapperPosition'];
  _skipContentPositioning?: OverlayProperties['_skipContentPositioning'];
}

type Props = Partial<OverlayPositionControllerConstructor> & {
  target?: dxElementWrapper; // Move to Popover
  shading?: unknown; // Move to Popover
  fullScreen?: unknown; // Move to Popup
  dragOutsideBoundary?: unknown; // Move to Popup
  dragAndResizeArea?: string | dxElementWrapper | Element; // Move to Popup
  outsideDragFactor?: unknown; // Move to Popup
  forceApplyBindings?: () => void; // Move to Popup
};

const window = windowUtils.getWindow();

const OVERLAY_POSITION_ALIASES: Record<PositionAlignment, OverlayPosition> = {
  top: { my: 'top center', at: 'top center' },
  bottom: { my: 'bottom center', at: 'bottom center' },
  right: { my: 'right center', at: 'right center' },
  left: { my: 'left center', at: 'left center' },
  center: { my: 'center', at: 'center' },
  'right bottom': { my: 'right bottom', at: 'right bottom' },
  'right top': { my: 'right top', at: 'right top' },
  'left bottom': { my: 'left bottom', at: 'left bottom' },
  'left top': { my: 'left top', at: 'left top' },
};

const OVERLAY_DEFAULT_BOUNDARY_OFFSET = { h: 0, v: 0 };

class OverlayPositionController {
  _props: Props;

  _$root?: dxElementWrapper;

  _$content?: dxElementWrapper;

  _$wrapper?: dxElementWrapper;

  _$markupContainer?: dxElementWrapper;

  _$visualContainer?: dxElementWrapper;

  _shouldRenderContentInitialPosition: boolean;

  _visualPosition: Props['position'];

  _initialPosition: Props['position'];

  _previousVisualPosition: Props['position'];

  _position?: OverlayPosition;

  constructor({
    position,
    container,
    visualContainer,
    $root,
    $content,
    $wrapper,
    onPositioned,
    onVisualPositionChanged,
    restorePosition,
    _fixWrapperPosition,
    _skipContentPositioning,
  }: OverlayPositionControllerConstructor) {
    this._props = {
      position,
      container,
      visualContainer,
      restorePosition,
      onPositioned,
      onVisualPositionChanged,
      _fixWrapperPosition,
      _skipContentPositioning,
    };

    this._$root = $root;
    this._$content = $content;
    this._$wrapper = $wrapper;

    this._$markupContainer = undefined;
    this._$visualContainer = undefined;

    this._shouldRenderContentInitialPosition = true;
    this._visualPosition = undefined;
    this._initialPosition = undefined;
    this._previousVisualPosition = undefined;

    this.updateContainer(container);
    this.updatePosition(position);
    this.updateVisualContainer(visualContainer);
  }

  get $container(): dxElementWrapper | undefined {
    this.updateContainer(); // NOTE: swatch classes can be updated runtime

    return this._$markupContainer;
  }

  get $visualContainer(): dxElementWrapper | undefined {
    return this._$visualContainer;
  }

  get position(): OverlayPosition | undefined {
    return this._position;
  }

  set fixWrapperPosition(fixWrapperPosition: Props['_fixWrapperPosition']) {
    this._props._fixWrapperPosition = fixWrapperPosition;

    this.styleWrapperPosition();
  }

  set restorePosition(restorePosition: Props['restorePosition']) {
    this._props.restorePosition = restorePosition;
  }

  restorePositionOnNextRender(value: boolean): void {
    // NOTE: no visual position means it's a first render
    this._shouldRenderContentInitialPosition = value || !this._visualPosition;
  }

  openingHandled(): void {
    const shouldRestorePosition = Boolean(this._props.restorePosition);

    this.restorePositionOnNextRender(shouldRestorePosition);
  }

  updatePosition(position: Position): void {
    this._props.position = position;
    this._position = this._normalizePosition(position);

    this.updateVisualContainer();
  }

  updateContainer(container?: Props['container']): void {
    const element = container ?? this._props.container;

    if (isDefined(container)) {
      this._props.container = element;
    }

    this._$markupContainer = container
      ? $(container)
      : swatch.getSwatchContainer(this._$root);

    this.updateVisualContainer(this._props.visualContainer);
  }

  updateVisualContainer(visualContainer?: Props['visualContainer']): void {
    const element = visualContainer ?? this._props.visualContainer;

    if (isDefined(visualContainer)) {
      this._props.visualContainer = element;
    }

    this._$visualContainer = this._getVisualContainer();
  }

  detectVisualPositionChange(event?: PointerLikeEvent): void {
    this._updateVisualPositionValue();
    this._raisePositionedEvents(event);
  }

  positionContent(): void {
    if (this._shouldRenderContentInitialPosition) {
      this._renderContentInitialPosition();
    } else {
      move(this._$content, this._visualPosition);

      this.detectVisualPositionChange();
    }
  }

  positionWrapper(): void {
    if (this._$visualContainer) {
      positionUtils.setup(this._$wrapper, {
        my: 'top left',
        at: 'top left',
        of: this._$visualContainer,
      });
    }
  }

  styleWrapperPosition(): void {
    const useFixed = isWindow(this.$visualContainer?.get(0)) || this._props._fixWrapperPosition;

    const positionStyle = useFixed ? 'fixed' : 'absolute';
    this._$wrapper?.css('position', positionStyle);
  }

  _updateVisualPositionValue(): void {
    this._previousVisualPosition = this._visualPosition;
    this._visualPosition = locate(this._$content);
  }

  _renderContentInitialPosition(): void {
    this._renderBoundaryOffset();

    resetPosition(this._$content);

    // @ts-expect-error css must be able to accept 1 argument
    const wrapperOverflow: string = this._$wrapper?.css('overflow');
    this._$wrapper?.css('overflow', 'hidden');

    if (!this._props._skipContentPositioning) {
      const resultPosition = positionUtils.setup(this._$content, this._position);

      this._initialPosition = resultPosition;
    }

    this._$wrapper?.css('overflow', wrapperOverflow);
    this.detectVisualPositionChange();
  }

  _raisePositionedEvents(event?: PointerLikeEvent): void {
    const prevPosition = this._previousVisualPosition;
    const newPosition = this._visualPosition;

    const isTopEqual = prevPosition?.top === newPosition.top;
    const isLeftEqual = prevPosition?.left !== newPosition.left;

    const isVisualPositionChanged = !(isTopEqual && isLeftEqual);

    if (isVisualPositionChanged) {
      this._props.onVisualPositionChanged?.({
        event,
        prevPosition,
        position: newPosition,
      });
    }

    this._props.onPositioned?.({
      position: this._initialPosition,
    });
  }

  _renderBoundaryOffset(): void {
    const boundaryOffset = this._position?.boundaryOffset ?? OVERLAY_DEFAULT_BOUNDARY_OFFSET;

    if (!boundaryOffset) {
      return;
    }

    this._$content?.css('margin', `${boundaryOffset.v}px ${boundaryOffset.h}px`);
  }

  _getVisualContainer(): dxElementWrapper {
    const containerProp = this._props.container;
    const visualContainerProp = this._props.visualContainer;
    const positionOf = isEvent(this._props.position?.of)
      ? this._props.position?.of?.target
      : this._props.position?.of;

    if (visualContainerProp) {
      return $(visualContainerProp);
    }

    if (containerProp) {
      return $(containerProp);
    }

    if (positionOf) {
      return $(positionOf);
    }

    return $(window);
  }

  _normalizePosition(positionProp: Position): OverlayPosition {
    const defaultConfiguration = {
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET,
    };

    if (isDefined(positionProp)) {
      const configuration: OverlayPosition = extend(
        true,
        {},
        defaultConfiguration,
        this._positionToObject(positionProp),
      );

      return configuration;
    }

    return defaultConfiguration;
  }

  // eslint-disable-next-line class-methods-use-this
  _positionToObject(position: Position): OverlayPosition {
    if (isString(position)) {
      const configuration: OverlayPosition = {
        ...OVERLAY_POSITION_ALIASES[position],
      };

      return configuration;
    }

    return position;
  }
}

export {
  OVERLAY_POSITION_ALIASES,
  OverlayPositionController,
};

import type { PositionAlignment } from '@js/common';
import positionUtils from '@js/common/core/animation/position';
import { locate, move, resetPosition } from '@js/common/core/animation/translator';
import type { Coordinates, dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import {
  isDefined,
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

export type OverlayPositionAlignment =
  | 'top center'
  | 'bottom center'
  | 'right center'
  | 'left center'
  | 'center'
  | 'right bottom'
  | 'right top'
  | 'left bottom'
  | 'left top';

export interface OverlayPosition extends Partial<Coordinates> {
  my?: OverlayPositionAlignment;
  at?: OverlayPositionAlignment;
  of?: string | dxElementWrapper | Element;
  offset?: string | { x?: number; y?: number };
  boundaryOffset?: typeof DEFAULT_BOUNDARY_OFFSET;
}

export type Position = OverlayPosition | OverlayPositionAlignment;

export interface ControllerOverlayElements {
  $root?: dxElementWrapper;
  $content?: dxElementWrapper;
  $wrapper?: dxElementWrapper;
}

export interface BaseControllerProperties {
  container?: OverlayProperties['container'];
  visualContainer?: OverlayProperties['visualContainer'];
  position?: OverlayProperties['position'];
  restorePosition?: OverlayProperties['restorePosition'];
  _fixWrapperPosition?: OverlayProperties['_fixWrapperPosition'];
  _skipContentPositioning?: OverlayProperties['_skipContentPositioning'];
}

export type ControllerProperties<
  TProperties extends BaseControllerProperties,
> = Partial<TProperties> & OverlayActions;

export type ControllerOverlayProperties = ControllerProperties<OverlayProperties>;

export interface PositionControllerConstructor<
  TProperties extends BaseControllerProperties,
  TElements extends ControllerOverlayElements = ControllerOverlayElements,
> {
  properties: ControllerProperties<TProperties>;
  elements: TElements;
}

const window = windowUtils.getWindow();

export const OVERLAY_POSITION_ALIASES: Record<
  PositionAlignment,
  OverlayPosition
> = {
  top: {
    my: 'top center',
    at: 'top center',
  },
  bottom: {
    my: 'bottom center',
    at: 'bottom center',
  },
  right: {
    my: 'right center',
    at: 'right center',
  },
  left: {
    my: 'left center',
    at: 'left center',
  },
  center: {
    my: 'center',
    at: 'center',
  },
  'right bottom': {
    my: 'right bottom',
    at: 'right bottom',
  },
  'right top': {
    my: 'right top',
    at: 'right top',
  },
  'left bottom': {
    my: 'left bottom',
    at: 'left bottom',
  },
  'left top': {
    my: 'left top',
    at: 'left top',
  },
};

const DEFAULT_BOUNDARY_OFFSET = { h: 0, v: 0 };

export class OverlayPositionController<
  TProperties extends BaseControllerProperties = BaseControllerProperties,
  TElements extends ControllerOverlayElements = ControllerOverlayElements,
  TPosition = Position,
> {
  _properties: ControllerProperties<TProperties>;

  _$root?: TElements['$root'];

  _$content?: TElements['$content'];

  _$wrapper?: TElements['$wrapper'];

  _$markupContainer?: dxElementWrapper;

  _$visualContainer?: dxElementWrapper;

  _shouldRenderContentInitialPosition?: boolean;

  _visualPosition?: Coordinates;

  _initialPosition?: OverlayPosition;

  _previousVisualPosition?: Coordinates;

  _position?: OverlayPosition;

  constructor(params: PositionControllerConstructor<TProperties>) {
    const { properties, elements } = params;
    const { container, position, visualContainer } = properties;
    const { $root, $content, $wrapper } = elements;

    this._properties = properties;

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

  set fixWrapperPosition(fixWrapperPosition: OverlayProperties['_fixWrapperPosition']) {
    this._properties._fixWrapperPosition = fixWrapperPosition;

    this.styleWrapperPosition();
  }

  set restorePosition(restorePosition: OverlayProperties['restorePosition']) {
    this._properties.restorePosition = restorePosition;
  }

  updatePosition(position?: TPosition): void {
    this._properties.position = position;
    this._position = this._normalizePosition(position);

    this.updateVisualContainer();
  }

  updateContainer(container?: OverlayProperties['container']): void {
    const element = container ?? this._properties.container;

    if (isDefined(container)) {
      this._properties.container = element;
    }

    this._$markupContainer = element
      ? $(element)
      : swatch.getSwatchContainer(this._$root);

    this.updateVisualContainer(this._properties.visualContainer);
  }

  updateVisualContainer(visualContainer?: OverlayProperties['visualContainer']): void {
    if (isDefined(visualContainer)) {
      this._properties.visualContainer = visualContainer;
    }

    this._$visualContainer = this._getVisualContainer();
  }

  restorePositionOnNextRender(value: boolean): void {
    // NOTE: no visual position means it's a first render
    this._shouldRenderContentInitialPosition = value || !this._visualPosition;
  }

  openingHandled(): void {
    const shouldRestorePosition = Boolean(this._properties.restorePosition);

    this.restorePositionOnNextRender(shouldRestorePosition);
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
    const isContainerWindow = isWindow(this.$visualContainer?.get(0));
    const useFixed = isContainerWindow || this._properties._fixWrapperPosition;

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

    const wrapperOverflow = this._$wrapper?.css('overflow') ?? '';

    this._$wrapper?.css('overflow', 'hidden');

    if (!this._properties._skipContentPositioning) {
      const resultPosition = positionUtils.setup(this._$content, this._position);

      this._initialPosition = resultPosition;
    }

    this._$wrapper?.css('overflow', wrapperOverflow);

    this.detectVisualPositionChange();
  }

  _raisePositionedEvents(event?: PointerLikeEvent): void {
    const previousPosition = this._previousVisualPosition;
    const newPosition = this._visualPosition;

    const isTopEqual = previousPosition?.top === newPosition?.top;
    const isLeftEqual = previousPosition?.left === newPosition?.left;

    const isVisualPositionChanged = !(isTopEqual && isLeftEqual);

    if (isVisualPositionChanged) {
      this._properties.onVisualPositionChanged?.({
        event,
        previousPosition,
        position: newPosition,
      });
    }

    this._properties.onPositioned?.({
      position: this._initialPosition,
    });
  }

  _renderBoundaryOffset(): void {
    const boundaryOffset = this._position?.boundaryOffset ?? DEFAULT_BOUNDARY_OFFSET;

    const { v, h } = boundaryOffset;

    if (!(v && h)) {
      return;
    }

    this._$content?.css('margin', `${boundaryOffset.v}px ${boundaryOffset.h}px`);
  }

  _getVisualContainer(): dxElementWrapper {
    const containerProp = this._properties.container;
    const visualContainerProp = this._properties.visualContainer;
    const positionOf = isEvent(this._properties.position?.of)
      ? this._properties.position?.of?.target
      : this._properties.position?.of;

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

  _normalizePosition(position?: TPosition): OverlayPosition {
    const defaultConfiguration: OverlayPosition = {
      boundaryOffset: DEFAULT_BOUNDARY_OFFSET,
    };

    if (isDefined(position)) {
      const positionObject = this._positionToObject(position);

      const configuration: OverlayPosition = extend(
        true,
        {},
        defaultConfiguration,
        positionObject,
      );

      return configuration;
    }

    return defaultConfiguration;
  }

  // eslint-disable-next-line class-methods-use-this
  _positionToObject(position: TPosition): OverlayPosition {
    if (isString(position)) {
      const configuration: OverlayPosition = {
        ...OVERLAY_POSITION_ALIASES[position as OverlayPositionAlignment],
      };

      return configuration;
    }

    return position as OverlayPosition;
  }
}

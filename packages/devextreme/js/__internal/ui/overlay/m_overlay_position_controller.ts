import positionUtils from '@js/common/core/animation/position';
import { locate, move, resetPosition } from '@js/common/core/animation/translator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import {
  isDefined,
  // @ts-expect-error
  isEvent,
  isString,
  isWindow,
} from '@js/core/utils/type';
import swatch from '@js/ui/widget/swatch_container';

import windowUtils from '../../core/utils/m_window';

const window = windowUtils.getWindow();

const OVERLAY_POSITION_ALIASES = {
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
  _props: any;

  _$root: dxElementWrapper;

  _$content: dxElementWrapper;

  _$wrapper: dxElementWrapper;

  _$markupContainer: dxElementWrapper | undefined;

  _$visualContainer: dxElementWrapper | undefined;

  _shouldRenderContentInitialPosition: boolean;

  _visualPosition: any;

  _initialPosition: any;

  _previousVisualPosition: any;

  _position: any;

  constructor({
    position, container, visualContainer,
    $root, $content, $wrapper,
    onPositioned, onVisualPositionChanged,
    restorePosition,
    _fixWrapperPosition,
    _skipContentPositioning,
  }) {
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

  get $container() {
    this.updateContainer(); // NOTE: swatch classes can be updated runtime

    return this._$markupContainer;
  }

  get $visualContainer() {
    return this._$visualContainer;
  }

  get position() {
    return this._position;
  }

  set fixWrapperPosition(fixWrapperPosition) {
    this._props._fixWrapperPosition = fixWrapperPosition;

    this.styleWrapperPosition();
  }

  set restorePosition(restorePosition) {
    this._props.restorePosition = restorePosition;
  }

  restorePositionOnNextRender(value) {
    // NOTE: no visual position means it's a first render
    this._shouldRenderContentInitialPosition = value || !this._visualPosition;
  }

  openingHandled() {
    const shouldRestorePosition = this._props.restorePosition;

    this.restorePositionOnNextRender(shouldRestorePosition);
  }

  updatePosition(positionProp) {
    this._props.position = positionProp;
    this._position = this._normalizePosition(positionProp);

    this.updateVisualContainer();
  }

  updateContainer(containerProp = this._props.container) {
    this._props.container = containerProp;

    this._$markupContainer = containerProp
      ? $(containerProp)
      : swatch.getSwatchContainer(this._$root);

    this.updateVisualContainer(this._props.visualContainer);
  }

  updateVisualContainer(visualContainer = this._props.visualContainer) {
    this._props.visualContainer = visualContainer;

    this._$visualContainer = this._getVisualContainer();
  }

  detectVisualPositionChange(event?: unknown): void {
    this._updateVisualPositionValue();
    this._raisePositionedEvents(event);
  }

  positionContent() {
    if (this._shouldRenderContentInitialPosition) {
      this._renderContentInitialPosition();
    } else {
      move(this._$content, this._visualPosition);
      this.detectVisualPositionChange();
    }
  }

  positionWrapper() {
    if (this._$visualContainer) {
      positionUtils.setup(this._$wrapper, { my: 'top left', at: 'top left', of: this._$visualContainer });
    }
  }

  styleWrapperPosition(): void {
    // @ts-expect-error
    const useFixed = isWindow(this.$visualContainer.get(0)) || this._props._fixWrapperPosition;

    const positionStyle = useFixed ? 'fixed' : 'absolute';
    this._$wrapper.css('position', positionStyle);
  }

  _updateVisualPositionValue() {
    this._previousVisualPosition = this._visualPosition;
    this._visualPosition = locate(this._$content);
  }

  _renderContentInitialPosition() {
    this._renderBoundaryOffset();
    resetPosition(this._$content);
    // @ts-expect-error
    const wrapperOverflow = this._$wrapper.css('overflow');
    this._$wrapper.css('overflow', 'hidden');

    if (!this._props._skipContentPositioning) {
      const resultPosition = positionUtils.setup(this._$content, this._position);
      this._initialPosition = resultPosition;
    }
    // @ts-expect-error
    this._$wrapper.css('overflow', wrapperOverflow);
    this.detectVisualPositionChange();
  }

  _raisePositionedEvents(event) {
    const previousPosition = this._previousVisualPosition;
    const newPosition = this._visualPosition;

    const isVisualPositionChanged = previousPosition?.top !== newPosition.top
            || previousPosition?.left !== newPosition.left;

    if (isVisualPositionChanged) {
      this._props.onVisualPositionChanged({
        previousPosition,
        position: newPosition,
        event,
      });
    }

    this._props.onPositioned({
      position: this._initialPosition,
    });
  }

  _renderBoundaryOffset() {
    const boundaryOffset = this._position ?? { boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET };

    this._$content.css('margin', `${boundaryOffset.v}px ${boundaryOffset.h}px`);
  }

  _getVisualContainer() {
    const containerProp = this._props.container;
    const visualContainerProp = this._props.visualContainer;
    const positionOf = isEvent(this._props.position?.of) ? this._props.position.of.target : this._props.position?.of;

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

  _normalizePosition(positionProp) {
    const defaultPositionConfig = {
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET,
    };

    if (isDefined(positionProp)) {
      return extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
    }
    return defaultPositionConfig;
  }

  _positionToObject(position) {
    if (isString(position)) {
      return extend({}, OVERLAY_POSITION_ALIASES[position]);
    }

    return position;
  }
}

export {
  OVERLAY_POSITION_ALIASES,
  OverlayPositionController,
};

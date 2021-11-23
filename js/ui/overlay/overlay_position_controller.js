import $ from '../../core/renderer';
import { isDefined, isString, isEvent, isWindow } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import positionUtils from '../../animation/position';
import { resetPosition, move, locate } from '../../animation/translator';
import { getWindow } from '../../core/utils/window';
import { value as viewPort } from '../../core/utils/view_port';

const window = getWindow();

const OVERLAY_POSITION_ALIASES = {
    'top': { my: 'top center', at: 'top center' },
    'bottom': { my: 'bottom center', at: 'bottom center' },
    'right': { my: 'right center', at: 'right center' },
    'left': { my: 'left center', at: 'left center' },
    'center': { my: 'center', at: 'center' },
    'right bottom': { my: 'right bottom', at: 'right bottom' },
    'right top': { my: 'right top', at: 'right top' },
    'left bottom': { my: 'left bottom', at: 'left bottom' },
    'left top': { my: 'left top', at: 'left top' }
};
const OVERLAY_DEFAULT_BOUNDARY_OFFSET = { h: 0, v: 0 };

class OverlayPositionController {
    constructor({
        position, target, container,
        $root, $content, $wrapper,
        onPositioned, onVisualPositionChanged,
        restorePosition,
        _fixWrapperPosition
    }) {
        this._props = {
            position,
            target,
            container,
            restorePosition,
            onPositioned,
            onVisualPositionChanged,
            _fixWrapperPosition
        };

        this._$root = $root;
        this._$content = $content;
        this._$wrapper = $wrapper;

        this._$markupContainer = undefined;
        this._$wrapperCoveredElement = undefined;

        this._shouldRenderContentInitialPosition = true;
        this._visualPosition = undefined;
        this._initialPosition = undefined;
        this._previousVisualPosition = undefined;

        this.updateContainer(container);
        this.updatePosition(position, target);
    }

    get $container() {
        return this._$markupContainer;
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

    updateTarget(target) {
        this._props.target = target;

        this.updatePosition(this._props.position, target);
    }

    updatePosition(positionProp, targetProp = this._props.target) {
        this._props.position = positionProp;
        this._position = this._normalizePosition(positionProp, targetProp);

        this._updateWrapperCoveredElement();
    }

    updateContainer(containerProp) {
        this._props.container = containerProp;

        const container = containerProp ?? viewPort();

        let $container = this._$root.closest(container);

        if(!$container.length) {
            $container = $(container).first();
        }

        this._$markupContainer = $container.length ? $container : this._$root.parent();

        this._updateWrapperCoveredElement();
    }

    detectVisualPositionChange(event) {
        this._updateVisualPositionValue();
        this._raisePositionedEvents(event);
    }

    positionContent() {
        if(this._shouldRenderContentInitialPosition) {
            this._renderContentInitialPosition();
        } else {
            move(this._$content, this._visualPosition);
            this.detectVisualPositionChange();
        }
    }

    positionWrapper() {
        if(this._$wrapperCoveredElement) {
            positionUtils.setup(this._$wrapper, { my: 'top left', at: 'top left', of: this._$wrapperCoveredElement });
        }
    }

    isAllWindowCoveredByWrapper() {
        return !this._$wrapperCoveredElement || isWindow(this._$wrapperCoveredElement.get(0));
    }

    styleWrapperPosition() {
        const useFixed = this.isAllWindowCoveredByWrapper() || this._props._fixWrapperPosition;

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
        const wrapperOverflow = this._$wrapper.css('overflow');
        this._$wrapper.css('overflow', 'hidden');
        const resultPosition = positionUtils.setup(this._$content, this._position);
        this._$wrapper.css('overflow', wrapperOverflow);
        this._initialPosition = resultPosition;
        this.detectVisualPositionChange();
    }

    _raisePositionedEvents(event) {
        const previousPosition = this._previousVisualPosition;
        const newPosition = this._visualPosition;

        const isVisualPositionChanged = previousPosition?.top !== newPosition.top
            || previousPosition?.left !== newPosition.left;

        if(isVisualPositionChanged) {
            this._props.onVisualPositionChanged({
                previousPosition: previousPosition,
                position: newPosition,
                event
            });
        }

        this._props.onPositioned({
            position: this._initialPosition
        });
    }

    _updateWrapperCoveredElement() {
        this._$wrapperCoveredElement = this._getWrapperCoveredElement();
    }

    _renderBoundaryOffset() {
        const boundaryOffset = this._position ?? { boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET };

        this._$content.css('margin', `${boundaryOffset.v}px ${boundaryOffset.h}px`);
    }

    _getWrapperCoveredElement() {
        const containerProp = this._props.container;

        if(containerProp) {
            return $(containerProp);
        }
        if(this._position) {
            return $(isEvent(this._position.of) ? window : (this._position.of || window));
        }
    }

    _normalizePosition(positionProp, targetProp) {
        const defaultPositionConfig = {
            of: targetProp,
            boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
        };

        if(isDefined(positionProp)) {
            return extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
        } else {
            return defaultPositionConfig;
        }
    }

    _positionToObject(position) {
        if(isString(position)) {
            return extend({}, OVERLAY_POSITION_ALIASES[position]);
        }

        return position;
    }
}

export {
    OVERLAY_POSITION_ALIASES,
    OverlayPositionController
};

import $ from '../../core/renderer';
import { isDefined, isString, isEvent, isWindow } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import positionUtils from '../../animation/position';
import { resetPosition, locate, move } from '../../animation/translator';
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
        onPositioned
    }) {
        this._props = {
            position,
            target,
            container
        };

        this._onPositioned = onPositioned;
        this._visualPosition = undefined;
        this._$root = $root;
        this._$content = $content;
        this._$wrapper = $wrapper;
        this._position = this._normalizePosition(position);
        this.initContainer(container);
    }

    initContainer(containerProp) {
        const container = containerProp ?? viewPort();

        let $container = this._$root.closest(container);

        if(!$container.length) {
            $container = $(container).first();
        }

        this._$container = $container.length ? $container : this._$root.parent();
        this._updateWrapperCoveredElement(containerProp);
    }

    positionContent() {
        if(!this._visualPosition) {
            this.renderInitialPosition();
        } else {
            const currentPosition = locate(this._$content);
            move(this._$content, this._visualPosition);
            this._positionedHandler(currentPosition, this._visualPosition);
        }
    }

    renderInitialPosition() {
        const currentPosition = this._visualPosition;

        this._renderBoundaryOffset();
        resetPosition(this._$content);
        const position = positionUtils.setup(this._$content, this._position);
        this._visualPosition = { top: position.v.location, left: position.h.location };

        this._positionedHandler(currentPosition, this._visualPosition);
    }

    positionWrapper() {
        if(this._wrapperCoveredElement) {
            positionUtils.setup(this._$wrapper, { my: 'top left', at: 'top left', of: this._wrapperCoveredElement });
        }
    }

    isContainerWindow() {
        return !this._wrapperCoveredElement || isWindow(this._wrapperCoveredElement);
    }

    _updateWrapperCoveredElement(containerProp) {
        this._$wrapperCoveredElement = this._getWrapperCoveredElement(containerProp);
    }

    _positionedHandler(previousPosition, position) {
        this._onPositioned({ previousPosition, position });
    }

    _renderBoundaryOffset() {
        const boundaryOffset = this._position ?? { boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET };

        this._$content.css('margin', `${boundaryOffset.v}px ${boundaryOffset.h}px`);
    }

    _getWrapperCoveredElement(container) {
        if(container) {
            return $(container);
        }
        if(this._position) {
            return $(isEvent(this._position.of) ? window : (this._position.of || window));
        }
    }

    _normalizePosition(position) {
        const defaultPositionConfig = {
            of: this._props.target,
            boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
        };

        if(isDefined(position)) {
            return extend(true, {}, defaultPositionConfig, this._positionToObject(position));
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

class PopupPositionController extends OverlayPositionController {
    constructor({ fullScreen, ...args }) {
        super(args);

        this._fullScreen = fullScreen;
        this.initContainer();
    }

    _getWrapperCoveredElement(containerProp) {
        if(this._fullScreen) {
            return $(window);
        }

        return super._getWrapperCoveredElement(containerProp);
    }
}

export {
    OVERLAY_POSITION_ALIASES,
    OverlayPositionController,
    PopupPositionController
};

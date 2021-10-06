import $ from '../../core/renderer';
import { move } from '../../animation/translator';
import { getWindow } from '../../core/utils/window';
import { OverlayPositionController } from '../overlay/overlay_position_controller';

const window = getWindow();

class PopupPositionController extends OverlayPositionController {
    constructor({
        fullScreen, forceApplyBindings,
        ...args
    }) {
        super(args);

        this._props = {
            ...this._props,
            fullScreen,
            forceApplyBindings
        };

        this._lastPositionBeforeFullScreen = undefined;
    }

    set fullScreen(fullScreen) {
        this._props.fullScreen = fullScreen;

        if(fullScreen) {
            this._fullScreenEnabled();
        } else {
            this._fullScreenDisabled();
        }
    }

    positionContent() {
        if(this._props.fullScreen) {
            move(this._$content, { top: 0, left: 0 });
            this.detectVisualPositionChange();
        } else {
            this._props.forceApplyBindings?.();

            if(!this._shouldRenderContentInitialPosition && this._lastPositionBeforeFullScreen) {
                move(this._$content, this._lastPositionBeforeFullScreen);
                this._lastPositionBeforeFullScreen = undefined;
                this.detectVisualPositionChange();
            } else {
                super.positionContent();
            }
        }
    }

    _getWrapperCoveredElement() {
        if(this._props.fullScreen) {
            return $(window);
        }

        return super._getWrapperCoveredElement();
    }

    _fullScreenEnabled() {
        this.restorePositionOnNextRender(false);
        this._lastPositionBeforeFullScreen = this._visualPosition;
    }

    _fullScreenDisabled() {
        this.restorePositionOnNextRender(false);
    }
}

export {
    PopupPositionController
};

import $ from '../../core/renderer';
import { move } from '../../animation/translator';
import { getWindow } from '../../core/utils/window';
import { originalViewPort } from '../../core/utils/view_port';
import { OverlayPositionController } from '../../__internal/ui/overlay/m_overlay_position_controller';

const window = getWindow();

class PopupPositionController extends OverlayPositionController {
    constructor({
        fullScreen, forceApplyBindings,
        dragOutsideBoundary, dragAndResizeArea, outsideDragFactor,
        ...args
    }) {
        super(args);

        this._props = {
            ...this._props,
            fullScreen,
            forceApplyBindings,
            dragOutsideBoundary,
            dragAndResizeArea,
            outsideDragFactor,
        };

        this._$dragResizeContainer = undefined;

        this._updateDragResizeContainer();
    }

    set fullScreen(fullScreen) {
        this._props.fullScreen = fullScreen;

        if(fullScreen) {
            this._fullScreenEnabled();
        } else {
            this._fullScreenDisabled();
        }
    }

    get $dragResizeContainer() {
        return this._$dragResizeContainer;
    }

    get outsideDragFactor() {
        if(this._props.dragOutsideBoundary) {
            return 1;
        }

        return this._props.outsideDragFactor;
    }

    set dragAndResizeArea(dragAndResizeArea) {
        this._props.dragAndResizeArea = dragAndResizeArea;

        this._updateDragResizeContainer();
    }

    set dragOutsideBoundary(dragOutsideBoundary) {
        this._props.dragOutsideBoundary = dragOutsideBoundary;

        this._updateDragResizeContainer();
    }

    set outsideDragFactor(outsideDragFactor) {
        this._props.outsideDragFactor = outsideDragFactor;
    }

    updateContainer(containerProp) {
        super.updateContainer(containerProp);
        this._updateDragResizeContainer();
    }

    dragHandled() {
        this.restorePositionOnNextRender(false);
    }

    resizeHandled() {
        this.restorePositionOnNextRender(false);
    }

    positionContent() {
        if(this._props.fullScreen) {
            move(this._$content, { top: 0, left: 0 });
            this.detectVisualPositionChange();
        } else {
            this._props.forceApplyBindings?.();

            super.positionContent();
        }
    }

    _updateDragResizeContainer() {
        this._$dragResizeContainer = this._getDragResizeContainer();
    }

    _getDragResizeContainer() {
        if(this._props.dragOutsideBoundary) {
            return $(window);
        }
        if(this._props.dragAndResizeArea) {
            return $(this._props.dragAndResizeArea);
        }

        const isContainerDefined = originalViewPort().get(0) || this._props.container;

        return isContainerDefined ? this._$markupContainer : $(window);
    }

    _getVisualContainer() {
        if(this._props.fullScreen) {
            return $(window);
        }

        return super._getVisualContainer();
    }

    _fullScreenEnabled() {
        this.restorePositionOnNextRender(false);
    }

    _fullScreenDisabled() {
        this.restorePositionOnNextRender(true);
    }
}

export {
    PopupPositionController
};

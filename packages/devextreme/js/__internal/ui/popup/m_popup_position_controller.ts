import { move } from '@js/common/core/animation/translator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { originalViewPort } from '@js/core/utils/view_port';
import { OverlayPositionController } from '@ts/ui/overlay/m_overlay_position_controller';

import windowUtils from '../../core/utils/m_window';

const window = windowUtils.getWindow();

class PopupPositionController extends OverlayPositionController {
  _$dragResizeContainer?: dxElementWrapper;

  constructor({
    fullScreen,
    forceApplyBindings,
    dragOutsideBoundary,
    dragAndResizeArea,
    outsideDragFactor,
    ...args
  }) {
    // @ts-expect-error
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

    if (fullScreen) {
      this._fullScreenEnabled();
    } else {
      this._fullScreenDisabled();
    }
  }

  get $dragResizeContainer() {
    return this._$dragResizeContainer;
  }

  get outsideDragFactor() {
    if (this._props.dragOutsideBoundary) {
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

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures, grouped-accessor-pairs
  set outsideDragFactor(outsideDragFactor) {
    this._props.outsideDragFactor = outsideDragFactor;
  }

  updateContainer(containerProp): void {
    super.updateContainer(containerProp);
    this._updateDragResizeContainer();
  }

  dragHandled(): void {
    this.restorePositionOnNextRender(false);
  }

  resizeHandled(): void {
    this.restorePositionOnNextRender(false);
  }

  positionContent(): void {
    if (this._props.fullScreen) {
      move(this._$content, { top: 0, left: 0 });
      this.detectVisualPositionChange();
    } else {
      this._props.forceApplyBindings?.();

      super.positionContent();
    }
  }

  _updateDragResizeContainer(): void {
    this._$dragResizeContainer = this._getDragResizeContainer();
  }

  _getDragResizeContainer() {
    if (this._props.dragOutsideBoundary) {
      return $(window);
    }
    if (this._props.dragAndResizeArea) {
      return $(this._props.dragAndResizeArea);
    }

    const isContainerDefined = originalViewPort().get(0) || this._props.container;

    return isContainerDefined
      ? this._$markupContainer
      : $(window);
  }

  _getVisualContainer(): dxElementWrapper {
    if (this._props.fullScreen) {
      return $(window);
    }

    return super._getVisualContainer();
  }

  _fullScreenEnabled(): void {
    this.restorePositionOnNextRender(false);
  }

  _fullScreenDisabled(): void {
    this.restorePositionOnNextRender(true);
  }
}

export {
  PopupPositionController,
};

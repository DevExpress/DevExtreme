import { move } from '@js/common/core/animation/translator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { originalViewPort } from '@js/core/utils/view_port';
import type { OverlayPositionControllerConstructor } from '@ts/ui/overlay/m_overlay_position_controller';
import { OverlayPositionController } from '@ts/ui/overlay/m_overlay_position_controller';

// import type {
//   PopupProperties,
// } from '@ts/ui/popup/m_popup';
import windowUtils from '../../core/utils/m_window';

export interface PopupPositionControllerConstructor extends OverlayPositionControllerConstructor {
  [key: string]: any;
}

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
  }: PopupPositionControllerConstructor) {
    super(args);

    this._properties = {
      ...this._properties,
      // @ts-expect-error todo
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
    // @ts-expect-error todo
    this._properties.fullScreen = fullScreen;

    if (fullScreen) {
      this._fullScreenEnabled();
    } else {
      this._fullScreenDisabled();
    }
  }

  get $dragResizeContainer(): dxElementWrapper | undefined {
    return this._$dragResizeContainer;
  }

  get outsideDragFactor() {
    // @ts-expect-error todo
    if (this._properties.dragOutsideBoundary) {
      return 1;
    }

    // @ts-expect-error todo
    return this._properties.outsideDragFactor;
  }

  set dragAndResizeArea(dragAndResizeArea) {
    // @ts-expect-error todo
    this._properties.dragAndResizeArea = dragAndResizeArea;

    this._updateDragResizeContainer();
  }

  set dragOutsideBoundary(dragOutsideBoundary) {
    // @ts-expect-error todo
    this._properties.dragOutsideBoundary = dragOutsideBoundary;

    this._updateDragResizeContainer();
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures, grouped-accessor-pairs
  set outsideDragFactor(outsideDragFactor) {
    // @ts-expect-error todo
    this._properties.outsideDragFactor = outsideDragFactor;
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
    // @ts-expect-error todo
    if (this._properties.fullScreen) {
      move(this._$content, { top: 0, left: 0 });

      this.detectVisualPositionChange();
    } else {
      // @ts-expect-error todo
      this._properties.forceApplyBindings?.();

      super.positionContent();
    }
  }

  _normalizePosition(positionProp) {
    const normalizedPosition = super._normalizePosition(positionProp);

    // @ts-expect-error todo
    if (this._properties.fullScreen) {
      // @ts-expect-error todo
      normalizedPosition.of = 'window';
    }

    return normalizedPosition;
  }

  _updateDragResizeContainer(): void {
    this._$dragResizeContainer = this._getDragResizeContainer();
  }

  _getDragResizeContainer(): dxElementWrapper | undefined {
    // @ts-expect-error todo
    if (this._properties.dragOutsideBoundary) {
      return $(window);
    }

    // @ts-expect-error todo
    if (this._properties.dragAndResizeArea) {
      // @ts-expect-error todo
      return $(this._properties.dragAndResizeArea);
    }

    const isContainerDefined = originalViewPort().get(0) || this._properties.container;

    return isContainerDefined
      ? this._$markupContainer
      : $(window);
  }

  _getVisualContainer(): dxElementWrapper {
    // @ts-expect-error todo
    if (this._properties.fullScreen) {
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

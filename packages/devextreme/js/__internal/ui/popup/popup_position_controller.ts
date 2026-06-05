import { move } from '@js/common/core/animation/translator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { originalViewPort } from '@js/core/utils/view_port';
import windowUtils from '@ts/core/utils/m_window';
import type {
  BaseControllerProperties,
  ControllerOverlayElements,
  OverlayPosition,
  Position,
  PositionControllerConstructor,
} from '@ts/ui/overlay/overlay_position_controller';
import { OverlayPositionController } from '@ts/ui/overlay/overlay_position_controller';
import type { PopupProperties } from '@ts/ui/popup/m_popup';

export interface PopupControllerProperties extends BaseControllerProperties {
  fullScreen?: PopupProperties['fullScreen'];
  dragOutsideBoundary?: PopupProperties['dragOutsideBoundary'];
  dragAndResizeArea?: PopupProperties['dragAndResizeArea'];
  outsideDragFactor?: PopupProperties['outsideDragFactor'];
  forceApplyBindings?: PopupProperties['forceApplyBindings'];
}

export type PopupPositionControllerConstructor<
  TProperties extends PopupControllerProperties = PopupControllerProperties,
  TElements extends ControllerOverlayElements = ControllerOverlayElements,
  TPosition = Position,
> = PositionControllerConstructor<TProperties, TElements, TPosition>;

const window = windowUtils.getWindow();

export class PopupPositionController<
  TProperties extends PopupControllerProperties = PopupControllerProperties,
  TElements extends ControllerOverlayElements = ControllerOverlayElements,
  TPosition = Position,
> extends OverlayPositionController<
    TProperties,
    TElements,
    TPosition
  > {
  _$dragResizeContainer?: dxElementWrapper;

  constructor(params: PopupPositionControllerConstructor<TProperties, TElements, TPosition>) {
    super(params);

    const superProperties = this._properties;

    const { properties } = params;

    const {
      fullScreen,
      forceApplyBindings,
      dragOutsideBoundary,
      dragAndResizeArea,
      outsideDragFactor,
    } = properties;

    this._properties = {
      ...superProperties,
      fullScreen,
      forceApplyBindings,
      dragOutsideBoundary,
      dragAndResizeArea,
      outsideDragFactor,
    };

    this._$dragResizeContainer = undefined;

    this._updateDragResizeContainer();
  }

  get $dragResizeContainer(): dxElementWrapper | undefined {
    return this._$dragResizeContainer;
  }

  get outsideDragFactor(): PopupProperties['outsideDragFactor'] {
    if (this._properties.dragOutsideBoundary) {
      return 1;
    }

    return this._properties.outsideDragFactor;
  }

  set outsideDragFactor(outsideDragFactor: PopupProperties['outsideDragFactor']) {
    this._properties.outsideDragFactor = outsideDragFactor;
  }

  set fullScreen(fullScreen: PopupProperties['fullScreen']) {
    this._properties.fullScreen = fullScreen;

    if (fullScreen) {
      this._fullScreenEnabled();
    } else {
      this._fullScreenDisabled();
    }
  }

  set dragAndResizeArea(dragAndResizeArea: PopupProperties['dragAndResizeArea']) {
    this._properties.dragAndResizeArea = dragAndResizeArea;

    this._updateDragResizeContainer();
  }

  set dragOutsideBoundary(dragOutsideBoundary: PopupProperties['dragOutsideBoundary']) {
    this._properties.dragOutsideBoundary = dragOutsideBoundary;

    this._updateDragResizeContainer();
  }

  updateContainer(container?: PopupProperties['container']): void {
    super.updateContainer(container);
    this._updateDragResizeContainer();
  }

  dragHandled(): void {
    this.restorePositionOnNextRender(false);
  }

  resizeHandled(): void {
    this.restorePositionOnNextRender(false);
  }

  positionContent(): void {
    if (this._properties.fullScreen) {
      if (this._$content) {
        move(this._$content, { top: 0, left: 0 });
      }

      this.detectVisualPositionChange();
    } else {
      this._properties.forceApplyBindings?.();

      super.positionContent();
    }
  }

  clean(): void {
    this._$dragResizeContainer = undefined;
    super.clean();
  }

  _normalizePosition(position?: TPosition): OverlayPosition {
    const normalizedPosition = super._normalizePosition(position);

    if (this._properties.fullScreen) {
      normalizedPosition.of = 'window';
    }

    return normalizedPosition;
  }

  _updateDragResizeContainer(): void {
    this._$dragResizeContainer = this._getDragResizeContainer();
  }

  _getDragResizeContainer(): dxElementWrapper | undefined {
    if (this._properties.dragOutsideBoundary) {
      return $(window);
    }

    if (this._properties.dragAndResizeArea) {
      return $(this._properties.dragAndResizeArea);
    }

    const isContainerDefined = originalViewPort().get(0) || this._properties.container;

    return isContainerDefined
      ? this._$markupContainer
      : $(window);
  }

  _getVisualContainer(): dxElementWrapper {
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

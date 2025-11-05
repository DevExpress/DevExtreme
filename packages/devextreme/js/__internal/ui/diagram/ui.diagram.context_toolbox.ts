/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { PositionConfig } from '@js/common/core/animation';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWindow } from '@js/core/utils/window';
import type { ShownEvent } from '@js/ui/popover';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import { getDiagram } from '@ts/ui/diagram/diagram.importer';
import Popover from '@ts/ui/popover/m_popover';

const DIAGRAM_CONTEXT_TOOLBOX_TARGET_CLASS = 'dx-diagram-context-toolbox-target';
const DIAGRAM_CONTEXT_TOOLBOX_CLASS = 'dx-diagram-context-toolbox';
const DIAGRAM_TOUCH_CONTEXT_TOOLBOX_CLASS = 'dx-diagram-touch-context-toolbox';
const DIAGRAM_CONTEXT_TOOLBOX_CONTENT_CLASS = 'dx-diagram-context-toolbox-content';
const DIAGRAM_CONTEXT_TOOLBOX_MINHEIGHT = 150;

interface Properties extends WidgetProperties {
  toolboxWidth?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onShown?: any;
}

interface PopoverPositionData extends PositionConfig {
  calcMaxHeight: (rect: DOMRect) => number;
}

class DiagramContextToolbox extends Widget<Properties> {
  private _$popoverTargetElement!: dxElementWrapper;

  private _popoverInstance!: Popover;

  private _popoverPositionData!: PopoverPositionData[];

  private _onShownAction!: (e: Partial<ShownEvent>) => void;

  _init(): void {
    super._init();

    this._onShownAction = this._createActionByOption('onShown');
    const window = getWindow();
    this._popoverPositionData = [
      {
        my: { x: 'center', y: 'top' },
        at: { x: 'center', y: 'bottom' },
        offset: { x: 0, y: 5 },
        calcMaxHeight: (rect): number => Math.max(
          DIAGRAM_CONTEXT_TOOLBOX_MINHEIGHT,
          window.innerHeight - rect.bottom - 6,
        ),
      },
      {
        my: { x: 'right', y: 'center' },
        at: { x: 'left', y: 'center' },
        offset: { x: -5, y: 0 },
        calcMaxHeight: (rect): number => Math.max(
          DIAGRAM_CONTEXT_TOOLBOX_MINHEIGHT,
          Math.min(rect.top, window.innerHeight - rect.bottom) * 2 - 2,
        ),
      },
      {
        my: { x: 'center', y: 'bottom' },
        at: { x: 'center', y: 'top' },
        offset: { x: 0, y: -5 },
        calcMaxHeight: (rect): number => Math.max(DIAGRAM_CONTEXT_TOOLBOX_MINHEIGHT, rect.top - 6),
      },
      {
        my: { x: 'left', y: 'center' },
        at: { x: 'right', y: 'center' },
        offset: { x: 5, y: 0 },
        calcMaxHeight: (rect): number => Math.max(
          DIAGRAM_CONTEXT_TOOLBOX_MINHEIGHT,
          Math.min(rect.top, window.innerHeight - rect.bottom) * 2 - 2,
        ),
      },
    ];
  }

  _initMarkup(): void {
    super._initMarkup();

    this._$popoverTargetElement = $('<div>')
      .addClass(DIAGRAM_CONTEXT_TOOLBOX_TARGET_CLASS)
      .appendTo(this.$element());

    const $popoverElement = $('<div>')
      .addClass(DIAGRAM_CONTEXT_TOOLBOX_CLASS)
      .appendTo(this.$element());

    if (this._isTouchMode()) {
      $popoverElement.addClass(DIAGRAM_TOUCH_CONTEXT_TOOLBOX_CLASS);
    }
    this._popoverInstance = this._createComponent($popoverElement, Popover, {
      hideOnOutsideClick: false,
      container: this.$element(),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _isTouchMode(): any {
    const { Browser } = getDiagram();
    return Browser.TouchUI;
  }

  _show(x, y, side, category, callback): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popoverInstance.hide();

    this._$popoverTargetElement
      .css({
        // @ts-expect-error ts-error
        left: x + this._popoverPositionData[side].offset.x,
        // @ts-expect-error ts-error
        top: y + this._popoverPositionData[side].offset.y,
      })
      .show();

    // correct offset when parent has position absolute, relative, etc (T1010677)
    const window = getWindow();
    const targetDiv = this._$popoverTargetElement.get(0);
    this._$popoverTargetElement.css({
      left:
      // @ts-expect-error ts-error
        targetDiv.offsetLeft
        - (targetDiv.getBoundingClientRect().left
          + window.scrollX
          // @ts-expect-error ts-error
          - targetDiv.offsetLeft),
      top:
      // @ts-expect-error ts-error
        targetDiv.offsetTop
        - (targetDiv.getBoundingClientRect().top
          + window.scrollY
          // @ts-expect-error ts-error
          - targetDiv.offsetTop),
    });
    const posRect = targetDiv.getBoundingClientRect();
    this._popoverInstance.option({
      maxHeight: this._popoverPositionData[side].calcMaxHeight(posRect),
      width:
        this.option('toolboxWidth') !== undefined
          ? this.option('toolboxWidth')
          : undefined,
      position: {
        my: this._popoverPositionData[side].my,
        at: this._popoverPositionData[side].at,
        of: this._$popoverTargetElement,
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      contentTemplate: () => $('<div>')
        .append($('<div>').addClass(DIAGRAM_CONTEXT_TOOLBOX_CONTENT_CLASS))
        // @ts-expect-error ts-error
        .dxScrollView({
          width: '100%',
          height: '100%',
        }),
      onContentReady: (): void => {
        const $element = this.$element().find(
          `.${DIAGRAM_CONTEXT_TOOLBOX_CONTENT_CLASS}`,
        );
        this._onShownAction({
          // @ts-expect-error ts-error
          category,
          callback,
          $element,
          hide: () => this._popoverInstance.hide(),
        });
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popoverInstance.show();
  }

  _hide(): void {
    this._$popoverTargetElement.hide();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popoverInstance.hide();
  }
}

export default DiagramContextToolbox;

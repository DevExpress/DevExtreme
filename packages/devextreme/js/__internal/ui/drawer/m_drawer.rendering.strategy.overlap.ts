import { move } from '@js/common/core/animation/translator';
import type { EventInfo } from '@js/common/core/events';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ensureDefined } from '@js/core/utils/common';
import { camelize } from '@js/core/utils/inflector';
import { getWidth } from '@js/core/utils/size';
import type { PanelLocation } from '@js/ui/drawer';
import Overlay from '@ts/ui/overlay/m_overlay';

import type Drawer from './m_drawer';
import { animation } from './m_drawer.animation';
import DrawerStrategy from './m_drawer.rendering.strategy';

interface InitialPosition {
  left?: number;
  top?: number;
}

interface DrawerOverlayPosition {
  my?: string;
  at?: string;
  of?: dxElementWrapper;
}

class OverlapStrategy extends DrawerStrategy {
  _initialPosition?: InitialPosition;

  renderPanelContent(whenPanelContentRendered: Drawer['_whenPanelContentRendered']): void {
    delete this._initialPosition;

    const drawer = this.getDrawerInstance();
    const { opened, minSize, template: contentTemplate } = drawer.option();
    drawer._overlay = drawer._createComponent($(drawer.content()), Overlay, {
      shading: false,
      container: drawer.content(),
      // @ts-expect-error ts-error
      visualContainer: drawer.getOverlayTarget(),
      position: this._getOverlayPosition(),
      width: opened ? 'auto' : minSize ?? 0,
      height: '100%',
      templatesRenderAsynchronously: drawer.option('templatesRenderAsynchronously'),
      animation: {
        show: {
          duration: 0,
        },
      },
      // eslint-disable-next-line func-names
      onPositioned: function (e: EventInfo<Overlay>): void {
        this._fixOverlayPosition(e.component.$content());
      }.bind(this),
      contentTemplate,
      onContentReady: (args) => {
        whenPanelContentRendered?.resolve();
        this._processOverlayZIndex(args.component.content());
      },
      visible: true,
      propagateOutsideClick: true,
    });
  }

  _fixOverlayPosition($overlayContent: dxElementWrapper): void {
    // NOTE: overlay should be positioned in extended wrapper
    const position = ensureDefined(this._initialPosition, { left: 0, top: 0 });
    move($overlayContent, position);
    if (this.getDrawerInstance().calcTargetPosition() === 'right') {
      $overlayContent.css('left', 'auto');
    }
    if (this.getDrawerInstance().calcTargetPosition() === 'bottom') {
      $overlayContent.css('top', 'auto');
      $overlayContent.css('bottom', '0px');
    }
  }

  _getOverlayPosition(): DrawerOverlayPosition {
    const drawer = this.getDrawerInstance();
    const panelPosition = drawer.calcTargetPosition();

    let result: DrawerOverlayPosition = {};

    switch (panelPosition) {
      case 'left': {
        result = {
          my: 'top left',
          at: 'top left',
        };
        break;
      }
      case 'right': {
        result = {
          my: drawer.option('rtlEnabled') ? 'top left' : 'top right',
          at: 'top right',
        };
        break;
      }
      case 'top':
      case 'bottom': {
        result = {
          my: panelPosition,
          at: panelPosition,
        };
        break;
      }
      default:
        break;
    }

    result.of = drawer.getOverlayTarget();

    return result;
  }

  refreshPanelElementSize(calcFromRealPanelSize: boolean): void {
    const drawer = this.getDrawerInstance();
    const overlay = drawer.getOverlay();
    const { opened: isDrawerOpened } = drawer.option();

    if (!overlay) {
      return;
    }

    if (drawer.isHorizontalDirection()) {
      overlay.option('height', '100%');
      overlay.option('width', calcFromRealPanelSize ? drawer.getRealPanelWidth() : this._getPanelSize(isDrawerOpened));
    } else {
      overlay.option('width', getWidth(drawer.getOverlayTarget()));
      overlay.option('height', calcFromRealPanelSize ? drawer.getRealPanelHeight() : this._getPanelSize(isDrawerOpened));
    }
  }

  onPanelContentRendered(): void {
    this._updateViewContentStyles();
  }

  _updateViewContentStyles(): void {
    const drawer = this.getDrawerInstance();
    const { minSize } = drawer.option();

    // @ts-expect-error ts-error
    $(drawer.viewContent()).css(`padding${camelize(drawer.calcTargetPosition(), true)}`, minSize);
    $(drawer.viewContent()).css('transform', 'inherit');
  }

  _internalRenderPosition(
    changePositionUsingFxAnimation: boolean | undefined,
    whenAnimationCompleted: Drawer['_whenAnimationCompleted'],
  ): void {
    const drawer = this.getDrawerInstance();
    const $panel = $(drawer.content());
    const { opened: isDrawerOpened, revealMode, animationDuration } = drawer.option();

    // @ts-expect-error ts-error
    const $panelOverlayContent = drawer.getOverlay().$content();
    const targetPanelPosition = drawer.calcTargetPosition();

    const panelSize = this._getPanelSize(isDrawerOpened) ?? 0;
    const panelOffset = this._getPanelOffset(isDrawerOpened) * drawer._getPositionCorrection();
    const marginTop = drawer.getRealPanelHeight() - panelSize;

    this._updateViewContentStyles();

    if (changePositionUsingFxAnimation) {
      if (revealMode === 'slide') {
        this._initialPosition = drawer.isHorizontalDirection()
          ? { left: panelOffset }
          : { top: panelOffset };

        animation.moveTo({
          complete: () => {
            whenAnimationCompleted?.resolve();
          },
          duration: animationDuration,
          direction: targetPanelPosition,
          $element: $panel,
          position: panelOffset,
        });
      } else if (revealMode === 'expand') {
        this._initialPosition = drawer.isHorizontalDirection() ? { left: 0 } : { top: 0 };
        move($panelOverlayContent, this._initialPosition);

        animation.size({
          complete: () => {
            whenAnimationCompleted?.resolve();
          },
          duration: animationDuration,
          direction: targetPanelPosition,
          $element: $panelOverlayContent,
          size: panelSize,
          marginTop,
        });
      }
    } else if (revealMode === 'slide') {
      this._initialPosition = drawer.isHorizontalDirection()
        ? { left: panelOffset }
        : { top: panelOffset };
      move($panel, this._initialPosition);
    } else if (revealMode === 'expand') {
      this._initialPosition = drawer.isHorizontalDirection() ? { left: 0 } : { top: 0 };
      move($panelOverlayContent, this._initialPosition);
      if (drawer.isHorizontalDirection()) {
        $($panelOverlayContent).css('width', panelSize);
      } else {
        $($panelOverlayContent).css('height', panelSize);

        if (targetPanelPosition === 'bottom') {
          $($panelOverlayContent).css('marginTop', marginTop);
        }
      }
    }
  }

  getPanelContent(): dxElementWrapper {
    // @ts-expect-error ts-error
    return $(this.getDrawerInstance().getOverlay().content());
  }

  _processOverlayZIndex(element: Element): void {
    // @ts-expect-error ts-error
    const styles = $(element).get(0).style;
    const zIndex = styles.zIndex || 1;
    this.getDrawerInstance().setZIndex(zIndex);
  }

  // eslint-disable-next-line class-methods-use-this
  isViewContentFirst(position: PanelLocation | undefined): boolean {
    return position === 'right' || position === 'bottom';
  }
}

export default OverlapStrategy;

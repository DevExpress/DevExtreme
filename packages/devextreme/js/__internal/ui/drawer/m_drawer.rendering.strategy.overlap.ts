import { move } from '@js/common/core/animation/translator';
import $ from '@js/core/renderer';
import { ensureDefined } from '@js/core/utils/common';
import { camelize } from '@js/core/utils/inflector';
import { getWidth } from '@js/core/utils/size';
import Overlay from '@js/ui/overlay/ui.overlay';

import { animation } from './m_drawer.animation';
import DrawerStrategy from './m_drawer.rendering.strategy';

class OverlapStrategy extends DrawerStrategy {
  renderPanelContent(whenPanelContentRendered) {
    // @ts-expect-error
    delete this._initialPosition;

    const drawer = this.getDrawerInstance();
    const { opened, minSize } = drawer.option();
    // @ts-expect-error
    drawer._overlay = drawer._createComponent(drawer.content(), Overlay, {
      shading: false,
      container: drawer.content(),
      // @ts-expect-error
      visualContainer: drawer.getOverlayTarget(),
      position: this._getOverlayPosition(),
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      width: opened ? 'auto' : minSize || 0,
      height: '100%',
      templatesRenderAsynchronously: drawer.option('templatesRenderAsynchronously'),
      animation: {
        show: {
          duration: 0,
        },
      },
      onPositioned: function (e) {
        this._fixOverlayPosition(e.component.$content());
      }.bind(this),
      contentTemplate: drawer.option('template'),
      onContentReady: (args) => {
        whenPanelContentRendered.resolve();
        this._processOverlayZIndex(args.component.content());
      },
      visible: true,
      propagateOutsideClick: true,
    });
  }

  _fixOverlayPosition($overlayContent) {
    // NOTE: overlay should be positioned in extended wrapper
    // @ts-expect-error
    const position = ensureDefined(this._initialPosition, { left: 0, top: 0 });
    move($overlayContent, position);
    // @ts-expect-error
    if (this.getDrawerInstance().calcTargetPosition() === 'right') {
      $overlayContent.css('left', 'auto');
    }
    // @ts-expect-error
    if (this.getDrawerInstance().calcTargetPosition() === 'bottom') {
      $overlayContent.css('top', 'auto');
      $overlayContent.css('bottom', '0px');
    }
  }

  _getOverlayPosition() {
    const drawer = this.getDrawerInstance();
    // @ts-expect-error
    const panelPosition = drawer.calcTargetPosition();

    let result = {};

    // eslint-disable-next-line default-case
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
    }
    // @ts-expect-error
    result.of = drawer.getOverlayTarget();

    return result;
  }

  refreshPanelElementSize(calcFromRealPanelSize) {
    const drawer = this.getDrawerInstance();
    // @ts-expect-error
    const overlay = drawer.getOverlay();
    // @ts-expect-error
    if (drawer.isHorizontalDirection()) {
      overlay.option('height', '100%');
      // @ts-expect-error
      overlay.option('width', calcFromRealPanelSize ? drawer.getRealPanelWidth() : this._getPanelSize(drawer.option('opened')));
    } else {
      // @ts-expect-error
      overlay.option('width', getWidth(drawer.getOverlayTarget()));
      // @ts-expect-error
      overlay.option('height', calcFromRealPanelSize ? drawer.getRealPanelHeight() : this._getPanelSize(drawer.option('opened')));
    }
  }

  onPanelContentRendered(): void {
    this._updateViewContentStyles();
  }

  _updateViewContentStyles() {
    const drawer = this.getDrawerInstance();
    // @ts-expect-error
    $(drawer.viewContent()).css(`padding${camelize(drawer.calcTargetPosition(), true)}`, drawer.option('minSize'));
    // @ts-expect-error
    $(drawer.viewContent()).css('transform', 'inherit');
  }

  _internalRenderPosition(changePositionUsingFxAnimation, whenAnimationCompleted) {
    const drawer = this.getDrawerInstance();
    const $panel = $(drawer.content());
    // @ts-expect-error
    const $panelOverlayContent = drawer.getOverlay().$content();
    const revealMode = drawer.option('revealMode');
    // @ts-expect-error
    const targetPanelPosition = drawer.calcTargetPosition();

    const panelSize = this._getPanelSize(drawer.option('opened'));
    // @ts-expect-error
    const panelOffset = this._getPanelOffset(drawer.option('opened')) * drawer._getPositionCorrection();
    // @ts-expect-error
    const marginTop = drawer.getRealPanelHeight() - panelSize;

    this._updateViewContentStyles();

    if (changePositionUsingFxAnimation) {
      if (revealMode === 'slide') {
        // @ts-expect-error
        this._initialPosition = drawer.isHorizontalDirection() ? { left: panelOffset } : { top: panelOffset };

        animation.moveTo({
          complete: () => {
            whenAnimationCompleted.resolve();
          },
          duration: drawer.option('animationDuration'),
          direction: targetPanelPosition,
          $element: $panel,
          position: panelOffset,
        });
      } else if (revealMode === 'expand') {
        // @ts-expect-error
        this._initialPosition = drawer.isHorizontalDirection() ? { left: 0 } : { top: 0 };
        // @ts-expect-error
        move($panelOverlayContent, this._initialPosition);

        animation.size({
          complete: () => {
            whenAnimationCompleted.resolve();
          },
          duration: drawer.option('animationDuration'),
          direction: targetPanelPosition,
          $element: $panelOverlayContent,
          size: panelSize,
          marginTop,
        });
      }
    } else if (revealMode === 'slide') {
      // @ts-expect-error
      this._initialPosition = drawer.isHorizontalDirection() ? { left: panelOffset } : { top: panelOffset };
      // @ts-expect-error
      move($panel, this._initialPosition);
    } else if (revealMode === 'expand') {
      // @ts-expect-error
      this._initialPosition = drawer.isHorizontalDirection() ? { left: 0 } : { top: 0 };
      // @ts-expect-error
      move($panelOverlayContent, this._initialPosition);
      // @ts-expect-error
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

  getPanelContent() {
    // @ts-expect-error
    return $(this.getDrawerInstance().getOverlay().content());
  }

  _processOverlayZIndex($element) {
    // @ts-expect-error
    const styles = $($element).get(0).style;
    const zIndex = styles.zIndex || 1;
    // @ts-expect-error
    this.getDrawerInstance().setZIndex(zIndex);
  }

  // @ts-expect-error
  isViewContentFirst(position): boolean {
    return position === 'right' || position === 'bottom';
  }
}

export default OverlapStrategy;

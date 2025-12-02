import $ from '@js/core/renderer';
import { camelize } from '@js/core/utils/inflector';
import type { PanelLocation } from '@js/ui/drawer';
import type Drawer from '@ts/ui/drawer/drawer';
import { animation } from '@ts/ui/drawer/drawer.animation';
import DrawerStrategy from '@ts/ui/drawer/drawer.rendering.strategy';

class ShrinkStrategy extends DrawerStrategy {
  _internalRenderPosition(
    changePositionUsingFxAnimation: boolean | undefined,
    whenAnimationCompleted: Drawer['_whenAnimationCompleted'],
  ): void {
    const drawer = this.getDrawerInstance();
    const { opened: isDrawerOpened, revealMode, animationDuration } = drawer.option();

    const direction = drawer.calcTargetPosition();
    const $panel = $(drawer.content());
    const panelSize = this._getPanelSize(isDrawerOpened);
    const panelOffset = this._getPanelOffset(isDrawerOpened);

    if (changePositionUsingFxAnimation) {
      if (revealMode === 'slide') {
        animation.margin({
          complete: () => {
            whenAnimationCompleted?.resolve();
          },
          $element: $panel,
          duration: animationDuration,
          direction,
          margin: panelOffset,
        });
      } else if (revealMode === 'expand') {
        animation.size({
          complete: () => {
            whenAnimationCompleted?.resolve();
          },
          $element: $panel,
          duration: animationDuration,
          direction,
          size: panelSize,
        });
      }
    } else if (revealMode === 'slide') {
      $panel.css(`margin${camelize(direction, true)}`, panelOffset);
    } else if (revealMode === 'expand') {
      // @ts-expect-error ts-error
      $panel.css(drawer.isHorizontalDirection() ? 'width' : 'height', panelSize);
    }
  }

  isViewContentFirst(position: PanelLocation | undefined, isRtl: boolean | undefined): boolean {
    return (isRtl ? position === 'left' : position === 'right') || position === 'bottom';
  }
}

export default ShrinkStrategy;

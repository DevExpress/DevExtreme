import { move } from '@js/common/core/animation/translator';
import $ from '@js/core/renderer';
import type Drawer from '@ts/ui/drawer/drawer';
import { animation } from '@ts/ui/drawer/drawer.animation';
import DrawerStrategy from '@ts/ui/drawer/drawer.rendering.strategy';

class PushStrategy extends DrawerStrategy {
  _internalRenderPosition(
    changePositionUsingFxAnimation: boolean | undefined,
    whenAnimationCompleted: Drawer['_whenAnimationCompleted'],
  ): void {
    const drawer = this.getDrawerInstance();
    const { opened: isDrawerOpened, animationDuration } = drawer.option();

    const openedPanelSize = this._getPanelSize(true);
    // @ts-expect-error ts-error
    const contentPosition = this._getPanelSize(isDrawerOpened) * drawer._getPositionCorrection();
    // @ts-expect-error ts-error
    $(drawer.content()).css(drawer.isHorizontalDirection() ? 'width' : 'height', openedPanelSize);
    if (drawer.getMinSize()) {
      let paddingCssPropertyName = 'padding';
      switch (drawer.calcTargetPosition()) {
        case 'left': paddingCssPropertyName += 'Right'; break;
        case 'right': paddingCssPropertyName += 'Left'; break;
        case 'top': paddingCssPropertyName += 'Bottom'; break;
        case 'bottom': paddingCssPropertyName += 'Top'; break;
        default: break;
      }
      // @ts-expect-error ts-error
      $(drawer.viewContent()).css(paddingCssPropertyName, drawer.getMinSize());
    } else {
      // TODO: ???
    }

    if (changePositionUsingFxAnimation) {
      animation.moveTo({
        $element: $(drawer.viewContent()),
        position: contentPosition,
        direction: drawer.calcTargetPosition(),
        duration: animationDuration,
        complete: () => {
          whenAnimationCompleted?.resolve();
        },
      });
    } else if (drawer.isHorizontalDirection()) {
      move($(drawer.viewContent()), { left: contentPosition });
    } else {
      move($(drawer.viewContent()), { top: contentPosition });
    }
  }

  onPanelContentRendered(): void {
    $(this.getDrawerInstance().viewContent()).addClass('dx-theme-background-color');
  }
}

export default PushStrategy;

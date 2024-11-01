import $ from '@js/core/renderer';
import { Deferred, when } from '@js/core/utils/deferred';
import { setHeight, setWidth } from '@js/core/utils/size';
import type Drawer from '@js/ui/drawer';

import { animation } from './m_drawer.animation';

class DrawerStrategy {
  _drawer: Drawer;

  constructor(drawer: Drawer) {
    this._drawer = drawer;
  }

  getDrawerInstance(): Drawer {
    return this._drawer;
  }

  renderPanelContent(whenPanelContentRendered) {
    const drawer = this.getDrawerInstance();
    const template = drawer._getTemplate(drawer.option('template'));
    if (template) {
      template.render({
        container: drawer.content(),
        // @ts-expect-error
        onRendered: () => {
          whenPanelContentRendered.resolve();
        },
      });
    }
  }

  renderPosition(changePositionUsingFxAnimation, animationDuration) {
    const whenPositionAnimationCompleted = Deferred();
    const whenShaderAnimationCompleted = Deferred();

    const drawer = this.getDrawerInstance();

    if (changePositionUsingFxAnimation) {
      when.apply($, [whenPositionAnimationCompleted, whenShaderAnimationCompleted]).done(() => {
        // @ts-expect-error
        drawer._animationCompleteHandler();
      });
    }
    // @ts-expect-error
    this._internalRenderPosition(changePositionUsingFxAnimation, whenPositionAnimationCompleted);

    if (!changePositionUsingFxAnimation) {
      // @ts-expect-error
      drawer.resizeViewContent();
    }

    this.renderShaderVisibility(changePositionUsingFxAnimation, animationDuration, whenShaderAnimationCompleted);
  }

  _getPanelOffset(isDrawerOpened) {
    const drawer = this.getDrawerInstance();
    // @ts-expect-error
    const size = drawer.isHorizontalDirection() ? drawer.getRealPanelWidth() : drawer.getRealPanelHeight();

    if (isDrawerOpened) {
      // @ts-expect-error
      return -(size - drawer.getMaxSize());
    }
    // @ts-expect-error
    return -(size - drawer.getMinSize());
  }

  _getPanelSize(isDrawerOpened) {
    return isDrawerOpened
      // @ts-expect-error
      ? this.getDrawerInstance().getMaxSize()
      // @ts-expect-error
      : this.getDrawerInstance().getMinSize();
  }

  renderShaderVisibility(changePositionUsingFxAnimation, duration, whenAnimationCompleted) {
    const drawer = this.getDrawerInstance();
    const isShaderVisible = drawer.option('opened');
    const fadeConfig = isShaderVisible ? { from: 0, to: 1 } : { from: 1, to: 0 };

    if (changePositionUsingFxAnimation) {
      // @ts-expect-error
      animation.fade($(drawer._$shader), fadeConfig, duration, () => {
        // @ts-expect-error
        this._drawer._toggleShaderVisibility(isShaderVisible);
        whenAnimationCompleted.resolve();
      });
    } else {
      // @ts-expect-error
      drawer._toggleShaderVisibility(isShaderVisible);
      // @ts-expect-error
      drawer._$shader.css('opacity', fadeConfig.to);
    }
  }

  getPanelContent() {
    return $(this.getDrawerInstance().content());
  }

  setPanelSize(calcFromRealPanelSize) { // TODO: keep for ui.file_manager.adaptivity.js
    this.refreshPanelElementSize(calcFromRealPanelSize);
  }

  refreshPanelElementSize(calcFromRealPanelSize) {
    const drawer = this.getDrawerInstance();
    const panelSize = this._getPanelSize(drawer.option('opened'));
    // @ts-expect-error
    if (drawer.isHorizontalDirection()) {
      setWidth(
        $(drawer.content()),
        // @ts-expect-error
        calcFromRealPanelSize ? drawer.getRealPanelWidth() : panelSize,
      );
    } else {
      setHeight(
        $(drawer.content()),
        // @ts-expect-error
        calcFromRealPanelSize ? drawer.getRealPanelHeight() : panelSize,
      );
    }
  }

  isViewContentFirst(): boolean {
    return false;
  }

  onPanelContentRendered(): void { }
}

export default DrawerStrategy;

import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred, when } from '@js/core/utils/deferred';
import { setHeight, setWidth } from '@js/core/utils/size';
import type { PanelLocation } from '@js/ui/drawer';
import type Drawer from '@ts/ui/drawer/drawer';
import type { FadeConfig } from '@ts/ui/drawer/drawer.animation';
import { animation } from '@ts/ui/drawer/drawer.animation';

class DrawerStrategy {
  _drawer: Drawer;

  constructor(drawer: Drawer) {
    this._drawer = drawer;
  }

  getDrawerInstance(): Drawer {
    return this._drawer;
  }

  renderPanelContent(whenPanelContentRendered: Drawer['_whenPanelContentRendered']): void {
    const drawer = this.getDrawerInstance();
    const template = drawer._getTemplate(drawer.option('template'));
    if (template) {
      template.render({
        container: drawer.content(),
        onRendered: () => {
          whenPanelContentRendered?.resolve();
        },
      });
    }
  }

  renderPosition(
    changePositionUsingFxAnimation: boolean | undefined,
    animationDuration: number | undefined,
  ): void {
    const whenPositionAnimationCompleted = Deferred();
    const whenShaderAnimationCompleted = Deferred();

    const drawer = this.getDrawerInstance();

    if (changePositionUsingFxAnimation) {
      when.apply($, [whenPositionAnimationCompleted, whenShaderAnimationCompleted]).done(() => {
        drawer._animationCompleteHandler();
      });
    }
    this._internalRenderPosition(changePositionUsingFxAnimation, whenPositionAnimationCompleted);

    if (!changePositionUsingFxAnimation) {
      drawer.resizeViewContent();
    }

    this.renderShaderVisibility(
      changePositionUsingFxAnimation,
      animationDuration,
      whenShaderAnimationCompleted,
    );
  }

  _getPanelOffset(isDrawerOpened: boolean | undefined): number {
    const drawer = this.getDrawerInstance();
    const size = drawer.isHorizontalDirection()
      ? drawer.getRealPanelWidth()
      : drawer.getRealPanelHeight();
    const panelSize = this._getPanelSize(isDrawerOpened) ?? 0;

    return panelSize - size;
  }

  _getPanelSize(isDrawerOpened: boolean | undefined): number | undefined {
    return isDrawerOpened
      ? this.getDrawerInstance().getMaxSize()
      : this.getDrawerInstance().getMinSize();
  }

  renderShaderVisibility(
    changePositionUsingFxAnimation: boolean | undefined,
    duration: number | undefined,
    whenAnimationCompleted: Drawer['_whenAnimationCompleted'],
  ): void {
    const drawer = this.getDrawerInstance();
    const { opened: isShaderVisible } = drawer.option();
    const fadeConfig: FadeConfig = isShaderVisible ? { from: 0, to: 1 } : { from: 1, to: 0 };

    if (changePositionUsingFxAnimation) {
      animation.fade($(drawer._$shader), fadeConfig, duration, () => {
        this._drawer._toggleShaderVisibility(isShaderVisible);
        whenAnimationCompleted?.resolve();
      });
    } else {
      drawer._toggleShaderVisibility(isShaderVisible);
      drawer._$shader.css('opacity', fadeConfig.to);
    }
  }

  getPanelContent(): dxElementWrapper {
    return $(this.getDrawerInstance().content());
  }

  setPanelSize(calcFromRealPanelSize: boolean): void { // TODO: for ui.file_manager.adaptivity.js
    this.refreshPanelElementSize(calcFromRealPanelSize);
  }

  refreshPanelElementSize(calcFromRealPanelSize: boolean): void {
    const drawer = this.getDrawerInstance();
    const { opened: isDrawerOpened } = drawer.option();
    const panelSize = this._getPanelSize(isDrawerOpened);

    if (drawer.isHorizontalDirection()) {
      setWidth(
        $(drawer.content()),
        calcFromRealPanelSize ? drawer.getRealPanelWidth() : panelSize,
      );
    } else {
      setHeight(
        $(drawer.content()),
        calcFromRealPanelSize ? drawer.getRealPanelHeight() : panelSize,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isViewContentFirst(position: PanelLocation | undefined, isRtl?: boolean): boolean {
    return false;
  }

  onPanelContentRendered(): void {}

  _internalRenderPosition(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changePositionUsingFxAnimation: boolean | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    whenPositionAnimationCompleted: Drawer['_whenAnimationCompleted'],
  ): void {}
}

export default DrawerStrategy;

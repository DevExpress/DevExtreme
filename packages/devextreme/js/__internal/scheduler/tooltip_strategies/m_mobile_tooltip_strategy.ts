import { getHeight, getOuterHeight, getWidth } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';
import type dxOverlay from '@js/ui/overlay';
import type { Properties as OverlayProperties } from '@js/ui/overlay';
import Overlay from '@js/ui/overlay/ui.overlay';

import type { AppointmentTooltipItem } from '../types';
import { TooltipStrategyBase } from './m_tooltip_strategy_base';

const CLASS = {
  slidePanel: 'dx-scheduler-overlay-panel',
  scrollableContent: '.dx-scrollable-content',
};

const MAX_TABLET_OVERLAY_HEIGHT_FACTOR = 0.9;

const MAX_HEIGHT = {
  PHONE: 250,
  TABLET: '90%',
  DEFAULT: 'auto',
};

const MAX_WIDTH = {
  PHONE: '100%',
  TABLET: '80%',
};

const animationConfig: OverlayProperties['animation'] = {
  show: {
    type: 'slide',
    duration: 300,
    from: { position: { my: 'top', at: 'bottom', of: getWindow() } },
    to: { position: { my: 'center', at: 'center', of: getWindow() } },
  },
  hide: {
    type: 'slide',
    duration: 300,
    to: { position: { my: 'top', at: 'bottom', of: getWindow() } },
    from: { position: { my: 'center', at: 'center', of: getWindow() } },
  },
};

const createPhoneDeviceConfig = (listHeight: number): OverlayProperties => ({
  shading: false,
  width: MAX_WIDTH.PHONE,
  height: listHeight > MAX_HEIGHT.PHONE ? MAX_HEIGHT.PHONE : MAX_HEIGHT.DEFAULT,
  position: {
    my: 'bottom',
    at: 'bottom',
    of: getWindow(),
  },
});

const createTabletDeviceConfig = (listHeight: number): OverlayProperties => {
  const currentMaxHeight = getHeight(getWindow()) * MAX_TABLET_OVERLAY_HEIGHT_FACTOR;

  return {
    shading: true,
    width: MAX_WIDTH.TABLET,
    height: listHeight > currentMaxHeight ? MAX_HEIGHT.TABLET : MAX_HEIGHT.DEFAULT,
    position: {
      my: 'center',
      at: 'center',
      of: getWindow(),
    },
  };
};

export class MobileTooltipStrategy extends TooltipStrategyBase {
  protected override isDesktop(): boolean {
    return false;
  }

  private setTooltipConfig(): void {
    const isTabletWidth = getWidth(getWindow()) > 700;

    const listHeight = getOuterHeight(this.list.$element().find(CLASS.scrollableContent));
    this.tooltip?.option(
      isTabletWidth
        ? createTabletDeviceConfig(listHeight)
        : createPhoneDeviceConfig(listHeight),
    );
  }

  private async onShowing(): Promise<void> {
    this.tooltip?.option('height', MAX_HEIGHT.DEFAULT);
    /*
    NOTE: there are two setTooltipConfig calls to reduce blinking of overlay.
    The first one sets initial sizes, the second updates them after rendering async templates
    */
    this.setTooltipConfig();

    await Promise.all([...this.asyncTemplatePromises]);
    this.setTooltipConfig();
  }

  protected override createTooltip(
    dataList: AppointmentTooltipItem[],
  ): dxOverlay<OverlayProperties> {
    const element = this.createTooltipElement(CLASS.slidePanel);

    return this._options.createComponent(element, Overlay, {
      target: getWindow(),
      hideOnOutsideClick: true,
      animation: animationConfig,

      onShowing: () => this.onShowing(),
      onShown: this.onShown.bind(this),
      contentTemplate: this.getContentTemplate(dataList),
      wrapperAttr: { class: CLASS.slidePanel },
    }) as dxOverlay<OverlayProperties>;
  }
}

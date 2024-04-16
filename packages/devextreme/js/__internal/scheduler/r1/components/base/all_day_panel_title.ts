import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import messageLocalization from '@js/localization/message';
import type { VNode } from 'inferno';
import { createVNode } from 'inferno';

export class AllDayPanelTitle extends InfernoWrapperComponent {
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): VNode {
    const text = messageLocalization.format('dxScheduler-allDay');

    return createVNode(1, 'div', 'dx-scheduler-all-day-title', text, 0);
  }
}
AllDayPanelTitle.defaultProps = {};

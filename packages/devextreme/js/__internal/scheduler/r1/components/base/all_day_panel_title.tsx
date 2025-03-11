import messageLocalization from '@js/common/core/localization/message';
import type { InfernoEffect } from '@runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@runtime/inferno';

export class AllDayPanelTitle extends InfernoWrapperComponent {
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): JSX.Element {
    const text = messageLocalization.format('dxScheduler-allDay');

    return (
      <div className="dx-scheduler-all-day-title">
        {text}
      </div>
    );
  }
}

AllDayPanelTitle.defaultProps = {};

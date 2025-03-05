import type { InfernoEffect } from '@ts/core/r1/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@ts/core/r1/runtime/inferno';
import messageLocalization from '@js/common/core/localization/message';

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

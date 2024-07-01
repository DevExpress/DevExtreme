import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import messageLocalization from '@js/localization/message';

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

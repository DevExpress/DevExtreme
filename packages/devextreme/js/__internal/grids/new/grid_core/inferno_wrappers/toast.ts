import type { Properties as ToastProperties } from '@js/ui/toast';
import dxToast from '@js/ui/toast';

import { InfernoWrapper } from './widget_wrapper';

export class Toast extends InfernoWrapper<ToastProperties, dxToast> {
  protected getComponentFabric(): typeof dxToast {
    return dxToast;
  }

  public componentDidMount(): void {
    super.componentDidMount();
    this.component?.option('container', this.ref.current);
    this.component?.option('position', {
      my: 'bottom', at: 'bottom', offset: '0 -20',
    });
  }
}

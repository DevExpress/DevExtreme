import type { Properties as ToastProperties } from '@js/ui/toast';
import dxToast from '@js/ui/toast';

import { InfernoWrapper } from './widget_wrapper';

export class Toast extends InfernoWrapper<ToastProperties, dxToast> {
  protected getComponentFabric(): typeof dxToast {
    return dxToast;
  }
}

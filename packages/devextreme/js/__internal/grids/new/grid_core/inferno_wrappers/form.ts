import type { Properties as FormProperties } from '@js/ui/form';
import dxForm from '@js/ui/form';

import { InfernoWrapper } from './widget_wrapper';

export type { FormProperties };

export class Form extends InfernoWrapper<FormProperties, dxForm> {
  protected getComponentFabric(): typeof dxForm {
    return dxForm;
  }
}

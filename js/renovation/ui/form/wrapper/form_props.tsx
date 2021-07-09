import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

import { BaseWidgetProps } from '../../common/base_props';

@ComponentBindings()
export class FormProps extends BaseWidgetProps { // js\ui\form.d.ts
  @OneWay() showValidationSummary?: boolean;

  @OneWay() scrollingEnabled?: boolean;

  @OneWay() showColonAfterLabel?: boolean;

  @OneWay() labelLocation?: 'left' | 'right' | 'top';

  // <Form items={[{ { dataField: "Position", editorType: "dxSelectBox", editorOptions: { items: ...
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() items?: (any)[];

  // <Form formData={ { email: ... } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() formData?: any;
}

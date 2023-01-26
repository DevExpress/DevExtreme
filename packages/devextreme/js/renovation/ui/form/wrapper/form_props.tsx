import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

import { BaseWidgetProps } from '../../common/base_props';
import { SimpleItem } from './simple_item';

@ComponentBindings()
export class FormProps extends BaseWidgetProps { // js\ui\form.d.ts
  @OneWay() showValidationSummary?: boolean;

  @OneWay() scrollingEnabled?: boolean;

  @OneWay() showColonAfterLabel?: boolean;

  @OneWay() labelLocation?: 'left' | 'right' | 'top';

  @OneWay() colCountByScreen?: { lg: number; xs: number };

  @OneWay() colCount?: string | number;

  // <Form items={[{ { dataField: "Position", editorType: "dxSelectBox", editorOptions: { items: ...
  // Similar to a JQuery approach:
  // https://js.devexpress.com/Demos/WidgetsGallery/Demo/Form/CustomizeItem/jQuery/Light/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() items?: (SimpleItem)[];

  // <Form formData={ { email: ... } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() formData?: any;
}

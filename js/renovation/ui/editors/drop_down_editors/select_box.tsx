import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
// https://github.com/benmosher/eslint-plugin-import/issues/1699
/* eslint-disable-next-line import/named */
import DataSource, { Options as DataSourceOptions } from '../../../../data/data_source';
import Store from '../../../../data/abstract_store';
import LegacySelectBox from '../../../../ui/select_box';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import { EventCallback } from '../../common/event_callback';
import devices from '../../../../core/devices';
import { EditorProps } from '../internal/editor';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: SelectBox): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacySelectBox}
    componentProps={componentProps}
    templateNames={[
      'dropDownButtonTemplate',
      'groupTemplate',
      'itemTemplate',
    ]}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class SelectBoxProps extends EditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() dataSource?: string | (string | any)[] | Store | DataSource | DataSourceOptions;

  @OneWay() displayExpr?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @TwoWay() value?: any = null;

  @OneWay() valueExpr?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() valueChange?: EventCallback<any>;

  @OneWay() hoverStateEnabled = true;

  @OneWay() activeStateEnabled = true;

  @OneWay() focusStateEnabled = devices.real().deviceType === 'desktop' && !devices.isSimulator();
}
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class SelectBox extends JSXComponent(SelectBoxProps) {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): SelectBoxProps {
    return this.props;
  }
}

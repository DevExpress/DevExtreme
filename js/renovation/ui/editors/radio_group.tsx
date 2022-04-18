import {
  Component, ComponentBindings, JSXComponent, OneWay, React, Event,
} from '@devextreme-generator/declarations';
import LegacyRadioGroup from '../../../ui/radio_group';
import { EventCallback } from '../common/event_callback';
import { EditorProps } from './common/editor';
import { EditorStateProps } from './common/editor_state_props';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
// eslint-disable-next-line import/named
import DataSource, { Options as DataSourceOptions } from '../../../data/data_source';
import Store from '../../../data/abstract_store';
import devices from '../../../core/devices';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: RadioGroup): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyRadioGroup}
    componentProps={componentProps}
    templateNames={['itemTemplate']}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class RadioGroupProps extends EditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() valueChange?: EventCallback<any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() dataSource?: string | (string | any)[] | Store | DataSource | DataSourceOptions;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @OneWay() items?: any[];

  @OneWay() displayExpr?: string;

  @OneWay() valueExpr?: string;

  @OneWay() layout?: 'horizontal' | 'vertical' = devices.real().deviceType === 'tablet' ? 'horizontal' : 'vertical';
}

export type RadioGroupPropsType = RadioGroupProps & EditorStateProps;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class RadioGroup extends JSXComponent<RadioGroupPropsType>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): RadioGroupPropsType {
    return this.props;
  }
}

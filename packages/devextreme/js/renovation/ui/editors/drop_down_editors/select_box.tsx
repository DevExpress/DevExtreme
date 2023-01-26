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
import { EditorProps } from '../common/editor';
import { EditorStateProps } from '../common/editor_state_props';
import { EditorLabelProps } from '../common/editor_label_props';

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

  @OneWay() placeholder = '';

  @OneWay() hoverStateEnabled?: boolean = true;

  @OneWay() searchEnabled = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Event() valueChange?: EventCallback<any>;
}

export type SelectBoxPropsType = SelectBoxProps & EditorStateProps & EditorLabelProps;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class SelectBox extends JSXComponent<SelectBoxPropsType>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): SelectBoxPropsType {
    return this.props;
  }
}

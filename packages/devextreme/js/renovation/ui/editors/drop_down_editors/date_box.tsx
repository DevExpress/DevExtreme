import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
import LegacyDateBox from '../../../../ui/date_box';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import { EventCallback } from '../../common/event_callback';
import { EditorProps } from '../common/editor';
import { EditorStateProps } from '../common/editor_state_props';
import { EditorLabelProps } from '../common/editor_label_props';

export type DateEditorType = 'date' | 'datetime' | 'time';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: DateBox): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyDateBox}
    componentProps={componentProps}
    templateNames={[]}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class DateBoxProps extends EditorProps {
  @TwoWay() value?: Date | number | string | null = null;

  @Event() valueChange?: EventCallback<Date | number | string>;

  @OneWay() width?: number | string | (() => number | string);

  @OneWay() calendarOptions?: {
    firstDayOfWeek?: number;
  };

  @OneWay() field?: string;

  @OneWay() type: DateEditorType = 'date';

  @OneWay() useMaskBehavior = false;
}

export type DateBoxPropsType = DateBoxProps & EditorStateProps & EditorLabelProps;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateBox extends JSXComponent<DateBoxPropsType>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): DateBoxPropsType {
    return this.props;
  }
}

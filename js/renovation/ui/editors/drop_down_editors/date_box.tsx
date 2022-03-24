import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
import LegacyDateBox from '../../../../ui/date_box';
import { Editor, EditorProps } from '../editor_wrapper';
import { EventCallback } from '../../common/event_callback';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: DateBox): JSX.Element => (
  <Editor
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

  @OneWay() type?: string ;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateBox extends JSXComponent<DateBoxProps>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): DateBoxProps {
    return this.props;
  }
}

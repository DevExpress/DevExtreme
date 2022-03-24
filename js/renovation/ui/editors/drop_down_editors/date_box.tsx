import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
import LegacyDateBox from '../../../../ui/date_box';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import { EventCallback } from '../../common/event_callback';
import devices from '../../../../core/devices';

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

  @OneWay() type?: string ;

  @OneWay() hoverStateEnabled = true;

  @OneWay() activeStateEnabled = true;

  @OneWay() focusStateEnabled = devices.real().deviceType === 'desktop' && !devices.isSimulator();
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

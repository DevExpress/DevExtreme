import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
  Fragment,
} from '@devextreme-generator/declarations';
import { AppointmentDetails } from './details/layout';
import { AppointmentTitle } from './title/layout';
import { AppointmentTemplateProps } from '../types';
import type { AppointmentTemplateData } from '../../../../../ui/scheduler';

export const viewFunction = ({
  props: {
    text,
    index,
    isReduced,
    isRecurrent,
    data,
    dateText,
    appointmentTemplate,
  },
}: AppointmentContent): JSX.Element => {
  const AppointmentTemplate = appointmentTemplate;
  return (
    <div className="dx-scheduler-appointment-content">
      {
        AppointmentTemplate
          ? (<AppointmentTemplate data={data} index={index} />)
          : (
            <Fragment>
              <AppointmentTitle text={text} />
              <AppointmentDetails dateText={dateText} />
              {
                isRecurrent && (
                  <div className="dx-scheduler-appointment-recurrence-icon dx-icon-repeat" />
                )
              }
              {
                isReduced && (
                  <div className="dx-scheduler-appointment-reduced-icon" />
                )
              }
            </Fragment>
          )
      }
    </div>
  );
};

@ComponentBindings()
export class AppointmentContentProps {
  @OneWay() text = '';

  @OneWay() dateText = '';

  @OneWay() isRecurrent = false;

  @OneWay() isReduced = false;

  @OneWay() index = 0;

  @OneWay() data?: AppointmentTemplateData;

  @Template() appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentContent extends JSXComponent<AppointmentContentProps>() {
}

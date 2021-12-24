import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
  Fragment,
  RefObject,
  Ref,
  Effect,
} from '@devextreme-generator/declarations';
import { AppointmentDetails } from './details/layout';
import { AppointmentTitle } from './title/layout';
import { AppointmentTemplateProps, ReducedIconHoverData } from '../types';
import type { AppointmentTemplateData } from '../../../../../ui/scheduler';

export const viewFunction = ({
  refReducedIcon,
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
                  <div
                    ref={refReducedIcon}
                    className="dx-scheduler-appointment-reduced-icon"
                  />
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

  @OneWay() data!: AppointmentTemplateData;

  @OneWay() showReducedIconTooltip!: (data: ReducedIconHoverData) => void;

  @OneWay() hideReducedIconTooltip!: () => void;

  @Template() appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentContent extends JSXComponent<AppointmentContentProps, 'data' | 'showReducedIconTooltip' | 'hideReducedIconTooltip'>() {
  @Ref() refReducedIcon!: RefObject<HTMLDivElement>;

  @Effect({ run: 'once' })
  bindHoverEffect(): () => void {
    const { current: reducedIconElement } = this.refReducedIcon;

    reducedIconElement?.addEventListener('mouseenter', this.onReducedIconMouseEnter);
    reducedIconElement?.addEventListener('mouseleave', this.onReducedIconMouseLeave);

    return (): void => {
      reducedIconElement?.removeEventListener('mouseenter', this.onReducedIconMouseEnter);
      reducedIconElement?.removeEventListener('mouseleave', this.onReducedIconMouseLeave);
    };
  }

  onReducedIconMouseEnter(): void {
    this.props.showReducedIconTooltip({
      target: this.refReducedIcon.current as HTMLDivElement,
      endDate: this.props.data.appointmentData.endDate,
    });
  }

  onReducedIconMouseLeave(): void {
    this.props.hideReducedIconTooltip();
  }
}

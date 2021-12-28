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
import { EffectReturn } from '../../../../utils/effect_return';

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

  @Effect()
  bindHoverEffect(): EffectReturn {
    const onMouseEnter = (): void => this.onReducedIconMouseEnter();
    const onMouseLeave = (): void => this.onReducedIconMouseLeave();

    // TODO: https://trello.com/c/vMlPwrVE/2990-angular-support-native-event-generation
    this.refReducedIcon.current?.addEventListener('mouseenter', onMouseEnter);
    this.refReducedIcon.current?.addEventListener('mouseleave', onMouseLeave);

    return (): void => {
      this.refReducedIcon.current?.removeEventListener('mouseenter', onMouseEnter);
      this.refReducedIcon.current?.removeEventListener('mouseleave', onMouseLeave);
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

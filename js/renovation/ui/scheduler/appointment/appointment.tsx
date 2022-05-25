import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  JSXTemplate,
  Template,
  RefObject,
  Event,
  ForwardRef,
  Consumer,
  InternalState,
  Effect,
  CSSAttributes,
} from '@devextreme-generator/declarations';
import {
  AppointmentTemplateProps,
  AppointmentViewModel,
  AppointmentClickData,
  ReducedIconHoverData,
} from './types';
import { getAppointmentStyles, mergeStylesWithColor } from './utils';
import { AppointmentContent } from './content/layout';
import { Widget } from '../../common/widget';
import { combineClasses } from '../../../utils/combine_classes';
import type { AppointmentTemplateData } from '../../../../ui/scheduler';
import { getAppointmentColor } from '../resources/utils';
import { AppointmentsContext, IAppointmentContext } from '../appointments_context';
import { EffectReturn } from '../../../utils/effect_return';

export const viewFunction = ({
  text,
  styles,
  ref,
  onItemClick,
  classes,
  isReduced,
  data,
  dateText,
  props: {
    viewModel: {
      info: {
        isRecurrent,
      },
    },
    index,
    showReducedIconTooltip,
    hideReducedIconTooltip,
    appointmentTemplate,
  },
}: Appointment): JSX.Element => (
  <Widget
    focusStateEnabled
    onClick={onItemClick}
    rootElementRef={ref}
    style={styles}
    classes={classes}
    hint={text}
    {
      ...{
        role: 'button',
        'data-index': index,
      }
    }
  >
    <AppointmentContent
      text={text}
      isReduced={isReduced}
      dateText={dateText}
      isRecurrent={isRecurrent}
      index={index}
      data={data}
      showReducedIconTooltip={showReducedIconTooltip}
      hideReducedIconTooltip={hideReducedIconTooltip}
      appointmentTemplate={appointmentTemplate}
    />
  </Widget>
);

@ComponentBindings()
export class AppointmentProps {
  @OneWay() viewModel!: AppointmentViewModel;

  @OneWay() index = 0;

  @OneWay() showReducedIconTooltip!: (data: ReducedIconHoverData) => void;

  @OneWay() hideReducedIconTooltip!: () => void;

  @OneWay() groups!: string[];

  @Template() appointmentTemplate?: JSXTemplate<AppointmentTemplateProps>;

  @Event() onItemClick!: (e: AppointmentClickData) => void;

  @Event() onItemDoubleClick!: (e: AppointmentClickData) => void;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Appointment extends JSXComponent<
AppointmentProps,
'viewModel' | 'onItemClick' | 'onItemDoubleClick' |
'showReducedIconTooltip' | 'hideReducedIconTooltip' | 'groups'
>() {
  @Consumer(AppointmentsContext)
  appointmentsContextValue!: IAppointmentContext;

  @ForwardRef()
  ref!: RefObject<HTMLDivElement>;

  @InternalState()
  color?: string;

  get appointmentStyles(): CSSAttributes | undefined {
    return getAppointmentStyles(this.props.viewModel);
  }

  get styles(): CSSAttributes | undefined {
    return mergeStylesWithColor(
      this.color,
      this.appointmentStyles,
    );
  }

  get text(): string { return this.props.viewModel.appointment.text; }

  get isReduced(): boolean {
    const { appointmentReduced } = this.props.viewModel.info;
    return !!appointmentReduced;
  }

  get classes(): string {
    const {
      focused,
      info: {
        direction,
        isRecurrent,
        allDay,
        appointmentReduced,
      },
    } = this.props.viewModel;
    const isVerticalDirection = direction === 'vertical';

    return combineClasses({
      'dx-state-focused': !!focused,
      'dx-scheduler-appointment': true,
      'dx-scheduler-appointment-horizontal': !isVerticalDirection,
      'dx-scheduler-appointment-vertical': isVerticalDirection,
      'dx-scheduler-appointment-recurrence': isRecurrent,
      'dx-scheduler-all-day-appointment': allDay,
      'dx-scheduler-appointment-reduced': this.isReduced,
      'dx-scheduler-appointment-head': appointmentReduced === 'head',
      'dx-scheduler-appointment-body': appointmentReduced === 'body',
      'dx-scheduler-appointment-tail': appointmentReduced === 'tail',
    });
  }

  get dateText(): string { return this.props.viewModel.info.dateText; }

  get data(): AppointmentTemplateData {
    return {
      appointmentData: this.props.viewModel.info.appointment,
      targetedAppointmentData: this.props.viewModel.appointment,
    };
  }

  @Effect()
  updateStylesEffect(): void {
    const { viewModel } = this.props;
    const groupIndex = viewModel.info.groupIndex ?? 0;
    const { appointment } = viewModel;

    getAppointmentColor({
      resources: this.appointmentsContextValue.resources,
      resourceLoaderMap: this.appointmentsContextValue.resourceLoaderMap,
      resourcesDataAccessors: this.appointmentsContextValue.dataAccessors.resources,
      loadedResources: this.appointmentsContextValue.loadedResources,
    }, {
      itemData: appointment,
      groupIndex,
      groups: this.props.groups,
    })
      .then((color) => { this.color = color; })
      .catch(() => '');
  }

  @Effect({ run: 'once' })
  bindDoubleClickEffect(): EffectReturn {
    /* istanbul ignore next: Tested */
    const onDoubleClick = (): void => this.onItemDoubleClick();

    this.ref.current?.addEventListener('dblclick', onDoubleClick);

    return (): void => {
      this.ref.current?.removeEventListener('dblclick', onDoubleClick);
    };
  }

  onItemClick(): void {
    const e = {
      data: [this.props.viewModel],
      target: this.ref.current as HTMLDivElement,
      index: this.props.index,
    };

    this.props.onItemClick(e);
  }

  onItemDoubleClick(): void {
    const e = {
      data: [this.props.viewModel],
      target: this.ref.current as HTMLDivElement,
      index: this.props.index,
    };

    this.props.onItemDoubleClick(e);
  }
}

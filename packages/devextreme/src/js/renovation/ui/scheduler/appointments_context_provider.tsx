import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
  Provider,
  Component,
} from '@devextreme-generator/declarations';
import {
  IAppointmentContext,
  AppointmentsContext,
} from './appointments_context';

export const viewFunction = (
  viewModel: AppointmentsContextProvider,
): JSX.Element => viewModel.props.children;

@ComponentBindings()
export class AppointmentsContextProviderProps {
  @OneWay() appointmentsContextValue!: IAppointmentContext;

  @Slot() children!: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentsContextProvider extends JSXComponent<AppointmentsContextProviderProps, 'appointmentsContextValue' | 'children'>() {
  @Provider(AppointmentsContext)
  get appointmentsContextValue(): IAppointmentContext {
    return this.props.appointmentsContextValue;
  }
}

import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
  Provider,
  Component,
} from '@devextreme-generator/declarations';
import { AppointmentsContextValue, AppointmentsContext } from './appointments_context';

export const viewFunction = (
  viewModel: AppointmentsContextProvider,
): JSX.Element => viewModel.props.children;

@ComponentBindings()
export class AppointmentsContextProviderProps {
  @OneWay() appointmentsContextValue!: AppointmentsContextValue;

  @Slot() children!: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentsContextProvider extends JSXComponent<AppointmentsContextProviderProps, 'appointmentsContextValue' | 'children'>() {
  @Provider(AppointmentsContext)
  get appointmentsContextValue(): AppointmentsContextValue {
    return this.props.appointmentsContextValue;
  }
}

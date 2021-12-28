import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
  Provider,
  Component,
} from '@devextreme-generator/declarations';
import { AppointmentsContextValue, AppointmentsContext } from './appointments_data_context';

export const viewFunction = (
  viewModel: AppointmentsDataProvider,
): JSX.Element => viewModel.props.children;

@ComponentBindings()
export class AppointmentsDataProviderProps {
  @OneWay() appointmentsContextValue!: AppointmentsContextValue;

  @Slot() children!: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentsDataProvider extends JSXComponent<AppointmentsDataProviderProps, 'appointmentsContextValue' | 'children'>() {
  @Provider(AppointmentsContext)
  get appointmentsContextValue(): AppointmentsContextValue {
    return this.props.appointmentsContextValue;
  }
}

import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
  Provider,
  Component,
} from '@devextreme-generator/declarations';
import { AppointmentsContextValue, AppointmentsContext, AppointmentsData } from './appointments_data_context';

export const viewFunction = (
  viewModel: AppointmentsDataProvider,
): JSX.Element => viewModel.props.children;

@ComponentBindings()
export class AppointmentsDataProviderProps {
  @OneWay() appointmentsData!: AppointmentsData;

  @Slot() children!: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class AppointmentsDataProvider extends JSXComponent<AppointmentsDataProviderProps, 'appointmentsData' | 'children'>() {
  @Provider(AppointmentsContext)
  get appointmentsData(): AppointmentsContextValue {
    return {
      data: this.props.appointmentsData,
    };
  }
}

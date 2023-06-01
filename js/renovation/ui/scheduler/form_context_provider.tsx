import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
  Provider,
  Component,
} from '@devextreme-generator/declarations';
import {
  FormContext,
  IFormContext,
} from './form_context';

// istanbul ignore next: should be tested in React infrastructure
export const viewFunction = (
  viewModel: FormContextProvider,
): JSX.Element => viewModel.props.children;

@ComponentBindings()
export class FormContextProviderProps {
  @OneWay() formContextValue!: IFormContext;

  @Slot() children!: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class FormContextProvider extends JSXComponent<FormContextProviderProps, 'formContextValue' | 'children'>() {
  @Provider(FormContext)
  get formContextValue(): IFormContext {
    return this.props.formContextValue;
  }
}

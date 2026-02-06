import { Component } from '@js/core/component';
import { signal } from '@ts/core/state_manager/index';
import { FunctionTemplate } from '@ts/core/templates/m_function_template';
import { extend } from '@ts/core/utils/m_extend';

// NOTE: We cannot modify the base "_getDefaultOptions" method with Component base class params
// So, we use closure here to modify this method during class creation
export const createComponentMock = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProps extends Record<string, any>,
  TDefaultProps extends TProps = TProps,
>(
  options: TProps,
  defaultOptions: TDefaultProps,
  isInitialized = true,
): Component<TProps> => new class ComponentMock extends Component<TProps> {
  public initialized = signal(isInitialized);

  // NOTE: Add default option values to base Component for merging them
  // with Component's algorithms
  public _getDefaultOptions(): TDefaultProps {
    // @ts-expect-error badly typed base Component class
    const baseDefaultOptions = super._getDefaultOptions();

    return extend(true, {}, baseDefaultOptions, defaultOptions) as TDefaultProps;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public _getTemplate(template: any): any {
    if (typeof template === 'function') {
      return new FunctionTemplate(template);
    }
    return template;
  }
}(extend(true, {}, options));

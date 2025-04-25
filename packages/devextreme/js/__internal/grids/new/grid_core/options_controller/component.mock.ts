import { Component } from '@js/core/component';
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
  ): Component<TProps> => new class ComponentMock extends Component<TProps> {
    // NOTE: Add default option values to base Component for merging them
    // with Component's algorithms
    public _getDefaultOptions(): TDefaultProps {
    // @ts-expect-error badly typed base Component class
      const baseDefaultOptions = super._getDefaultOptions();

      return extend(true, {}, baseDefaultOptions, defaultOptions) as TDefaultProps;
    }
  }(extend(true, {}, options));

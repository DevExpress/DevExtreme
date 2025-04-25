import type { Component } from '@js/core/component';

import { createComponentMock } from './component.mock';
import { OptionsController } from './options_controller_base';

export class OptionsControllerMock<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProps extends Record<string, any>,
  TDefaultProps extends TProps,
> extends OptionsController<TProps, TDefaultProps> {
  private readonly componentMock: Component<TProps>;

  constructor(options: TProps, defaultOptions: TDefaultProps) {
    const componentMock = createComponentMock(options, defaultOptions);
    super(componentMock);
    this.defaults = defaultOptions;
    this.componentMock = componentMock;
  }

  // TODO: add typing
  public option(key?: string, value?: unknown): unknown {
    // @ts-expect-error
    return this.componentMock.option(key, value);
  }
}

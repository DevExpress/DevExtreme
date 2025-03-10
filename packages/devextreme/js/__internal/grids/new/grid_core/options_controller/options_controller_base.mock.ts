import { Component } from '@js/core/component';

import { OptionsController } from './options_controller_base';

export class OptionsControllerMock<
  TProps,
  TDefaultProps extends TProps,
> extends OptionsController<TProps, TDefaultProps> {
  private readonly componentMock: Component<TProps>;

  constructor(options: TProps, defaultOptions: TDefaultProps) {
    const componentMock = new Component(options);
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

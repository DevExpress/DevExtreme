/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable max-len */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

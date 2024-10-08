/* eslint-disable @typescript-eslint/ban-types */
import { Component } from 'inferno';

import { OptionsController } from '../options_controller/options_controller';

interface State {
  count: number;
}

export class MyView extends Component<{}, State> {
  public static dependencies = [OptionsController];

  constructor(
    private readonly options: OptionsController,
  ) {
    super();

    this.state = {
      count: 1,
    };

    this.options.oneWay('searchText').subscribe(() => {
      this.setState({ count: 1 });
    });
  }

  public render(): JSX.Element {
    return <div>{this.state?.count}</div>;
  }
}

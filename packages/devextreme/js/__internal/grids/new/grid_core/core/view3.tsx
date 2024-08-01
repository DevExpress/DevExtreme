import { Component } from 'inferno';

import { OptionsController } from '../options_controller/options_controller';

interface State {
  count: number;
}

export class MyView extends Component<{}, State> {
  static dependencies = [OptionsController];

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

  render() {
    return <div>{this.state?.count}</div>;
  }
}

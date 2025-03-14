import $ from '@js/core/renderer';
import * as accessibility from '@js/ui/shared/accessibility';
import { Component, createRef } from 'inferno';

export interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;

  className: string;

  tabIndex: number;

  text: string;

  clearFilter: () => void;
}

export class ClearFilterButton extends Component<Props> {
  private readonly ref = createRef<HTMLDivElement>();

  protected readonly clearFilter = (): void => this.props.clearFilter();

  private readonly onKeyPressHandler = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    this.clearFilter();
  };

  public render(): JSX.Element {
    return (
        <>
            <div ref={this.ref}
              className={this.props.className}
              tabIndex={this.props.tabIndex}
              onClick={(): void => this.props.clearFilter()}
              role='button'
            >
              {this.props.text}
            </div>
        </>
    );
  }

  public componentDidMount(): void {
    accessibility.registerKeyboardAction(
      'filterPanel',
      this.props.component,
      $(this.ref.current as Element),
      undefined,
      this.clearFilter,
      this.onKeyPressHandler,
    );
  }
}

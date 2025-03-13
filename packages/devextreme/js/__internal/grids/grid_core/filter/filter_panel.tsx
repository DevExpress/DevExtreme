import $ from '@js/core/renderer';
import * as accessibility from '@js/ui/shared/accessibility';
import { Component, createRef } from 'inferno';

import { CheckBox } from '../../new/grid_core/inferno_wrappers/checkbox';
import { ClearFilterButton } from './clear_filter_button';

type AddWidgetPrefix = (className: string) => string;

export interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;

  hasFilterValue: boolean;

  addWidgetPrefix: AddWidgetPrefix;

  tabIndex: number;

  text: string;

  showFilterBuilder: () => void;

  filterEnabledHint: string;

  clearFilterText: string;

  createFilterText: string;

  filterEnabled: boolean;

  onFilterEnabledChange: (value: boolean) => void;

  clearFilter: () => void;
}

const UNPREFIXED_CLASSES = {
  text: 'filter-panel-text',
  checkbox: 'filter-panel-checkbox',
  clearFilter: 'filter-panel-clear-filter',
  leftContainer: 'filter-panel-left',
};

const CLASSES = {
  filterIcon: 'dx-icon-filter',
};

function getClasses(
  addWidgetPrefix: AddWidgetPrefix,
): typeof UNPREFIXED_CLASSES {
  return {
    text: addWidgetPrefix(UNPREFIXED_CLASSES.text),
    checkbox: addWidgetPrefix(UNPREFIXED_CLASSES.checkbox),
    clearFilter: addWidgetPrefix(UNPREFIXED_CLASSES.clearFilter),
    leftContainer: addWidgetPrefix(UNPREFIXED_CLASSES.leftContainer),
  };
}

export class FilterPanel extends Component<Props> {
  private readonly filterIconRef = createRef<HTMLDivElement>();

  private readonly filterTextRef = createRef<HTMLDivElement>();

  protected readonly showFilterBuilder = (): void => this.props.showFilterBuilder();

  private readonly onShowFilterKeyPressHandler = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    this.showFilterBuilder();
  };

  public render(): JSX.Element {
    const classes = getClasses(this.props.addWidgetPrefix);

    return (
      <>
        <div className={classes.leftContainer}>
          {this.props.hasFilterValue && (
            <CheckBox
              elementAttr={{
                class: classes.checkbox,
              }}
              hint={this.props.filterEnabledHint}
              value={this.props.filterEnabled}
              onValueChanged={(e): void => { this.props.onFilterEnabledChange(e.value); }}
            />
          )}
          <div ref={this.filterIconRef}
            onClick={this.showFilterBuilder}
            tabIndex={this.props.tabIndex}
            className={CLASSES.filterIcon}
            aria-label={this.props.createFilterText}
            role='button'
          />
          <div ref={this.filterTextRef}
            className={classes.text}
            onClick={this.showFilterBuilder}
            tabIndex={this.props.tabIndex}
          >
            {this.props.text}
          </div>
        </div>
        {this.props.hasFilterValue
           && <ClearFilterButton
            component={this.props.component}
            className={classes.clearFilter}
            clearFilter={(): void => this.props.clearFilter()}
            tabIndex={this.props.tabIndex}
            text={this.props.clearFilterText}
          />
        }
      </>
    );
  }

  public componentDidMount(): void {
    accessibility.registerKeyboardAction(
      'filterPanel',
      this.props.component,
      $(this.filterIconRef.current as Element),
      undefined,
      this.showFilterBuilder,
      this.onShowFilterKeyPressHandler,
    );

    accessibility.registerKeyboardAction(
      'filterPanel',
      this.props.component,
      $(this.filterTextRef.current as Element),
      undefined,
      this.showFilterBuilder,
      this.onShowFilterKeyPressHandler,
    );
  }
}

/* eslint-disable
  @typescript-eslint/no-non-null-assertion,
  spellcheck/spell-checker
*/
import { isCommandKeyPressed } from '@js/common/core/events/utils';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { SelectCardOptions } from '@ts/grids/new/card_view/content_view/types';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import type { Key } from '@ts/grids/new/grid_core/data_controller/types';
import {
  KbnNavigationContainer,
  type NavigationStrategyBase,
  withKbnNavigationItem, withKeyDownHandler,
} from '@ts/grids/new/grid_core/keyboard_navigation/index';
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import { Card } from './card/card';
import type { CardHeaderItem } from './card/header';

export interface ContentProps {
  items: DataRow[];

  kbnEnabled: boolean;

  navigationStrategy: NavigationStrategyBase;

  isLoading?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;

  onFirstElementChange?: (element: HTMLDivElement | undefined) => void;

  onRowHeightChange?: (value: number) => void;

  showContextMenu?: (e: MouseEvent, card?: DataRow, cardIndex?: number) => void;

  cardsPerRow?: number;

  needToHiddenCheckBoxes?: boolean;

  wordWrapEnabled: boolean;

  cardProps?: {
    toolbar?: CardHeaderItem[];
    minWidth?: number;
    maxWidth?: number;
    selectCard: (row: DataRow, options: SelectCardOptions) => void;
    onSelectAllCards?: () => void;
    onSearchFocus?: () => void;
    onCardContentKeyDown?: (event: KeyboardEvent) => void;
    onFocusedCardChanged?: (card: DataRow, cardIdx: number, element: HTMLElement) => void;
    onEdit?: (key: Key, returnFocusTo?: HTMLElement) => void;
    onDelete?: (key: Key, returnFocusTo?: HTMLElement) => void;
  };

  onPageChange?: (value: number) => void;
}

export const CLASSES = {
  content: 'dx-cardview-content',
  grid: 'dx-cardview-content-grid',
  selectCheckBoxesHidden: 'dx-cardview-select-checkboxes-hidden',
  wrapEnabled: 'dx-cardview-word-wrap-enabled',
};

const CardWithKbn = withKeyDownHandler(withKbnNavigationItem(Card));

function getInfernoCardKey(card: DataRow): undefined | string | number {
  if (typeof card.key === 'string' || typeof card.key === 'number') {
    return card.key;
  }

  return undefined;
}

export class Content extends Component<ContentProps> {
  private readonly containerRef = createRef<HTMLDivElement>();

  private cardElementRefs: RefObject<HTMLDivElement>[] = [];

  private focusFirstCardAfterReload = false;

  private getCssVariables(): Record<string, unknown> {
    const variables = {};

    if (this.props.cardsPerRow) {
      variables['--dx-cardview-cardsperrow'] = this.props.cardsPerRow;
    }

    if (this.props.cardProps?.minWidth) {
      variables['--dx-cardview-card-min-width'] = `${this.props.cardProps?.minWidth}px`;
    }

    if (this.props.cardProps?.maxWidth) {
      variables['--dx-cardview-card-max-width'] = `${this.props.cardProps?.maxWidth}px`;
    }

    // @ts-expect-error
    if (this.props.cardProps?.cover?.maxHeight) {
      // @ts-expect-error
      variables['--dx-cardview-card-cover-max-height'] = `${this.props.cardProps?.cover?.maxHeight}px`;
    }

    // @ts-expect-error
    if (this.props.cardProps?.cover?.ratio) {
      // @ts-expect-error
      variables['--dx-cardview-card-cover-ratio'] = `${this.props.cardProps?.cover?.ratio}`;
    }

    return variables;
  }

  render(): JSX.Element {
    const className = combineClasses({
      [CLASSES.content]: true,
      [CLASSES.grid]: true,
      [CLASSES.selectCheckBoxesHidden]: !!this.props.needToHiddenCheckBoxes,
      [CLASSES.wrapEnabled]: !!this.props.wordWrapEnabled,
    });

    const CardItem = this.props.kbnEnabled
      ? CardWithKbn
      : Card;

    this.cardElementRefs = new Array(this.props.items.length)
      .fill(undefined)
      .map(() => createRef());

    return (
      <KbnNavigationContainer
        enabled={this.props.kbnEnabled}
        navigationStrategy={this.props.navigationStrategy}
        onFocusMoved={(newIdx, element) => {
          this.onCardFocusMoved(newIdx, element);
        }}
      >
        <div
          ref={this.containerRef}
          style={this.getCssVariables()}
          className={className}
          onContextMenu={this.props.showContextMenu}>
          {this.props.items.map((item, idx) => (
            <CardItem
              {...this.props.cardProps}
              key={getInfernoCardKey(item)}
              elementRef={this.cardElementRefs[idx]}
              navigationIdx={idx}
              kbnEnabled={this.props.kbnEnabled}
              navigationStrategy={this.props.navigationStrategy}
              keyDownConfig={{
                PageUp: () => {
                  this.props.onPageChange?.(-1);
                  this.focusFirstCardAfterReload = true;
                },
                PageDown: () => {
                  this.props.onPageChange?.(1);
                  this.focusFirstCardAfterReload = true;
                },
                Space: (event: KeyboardEvent) => {
                  this.props.cardProps?.selectCard?.(item, {
                    control: isCommandKeyPressed(event),
                    shift: event.shiftKey,
                    needToUpdateCheckboxes: true,
                  });
                },
                'Space+shift': (event: KeyboardEvent) => {
                  this.props.cardProps?.selectCard?.(item, {
                    control: isCommandKeyPressed(event),
                    shift: event.shiftKey,
                    needToUpdateCheckboxes: true,
                  });
                },
                'a+ctrl': () => {
                  this.props.cardProps?.onSelectAllCards?.();
                },
                'f+ctrl': () => {
                  this.props.cardProps?.onSearchFocus?.();
                },
                'Enter+shift': () => {
                  this.props.cardProps?.onEdit?.(
                    item.key,
                    this.cardElementRefs[idx].current ?? undefined,
                  );
                },
                Delete: () => {
                  this.props.cardProps?.onDelete?.(
                    item.key,
                    this.cardElementRefs[idx].current ?? undefined,
                  );
                },
              }}
              caughtEventPreventDefault={true}
              row={item}
              onContextMenu={(e) => {
                this.props.showContextMenu?.(e, item, idx);
              }}
              onFocusMoved={(newIdx, element) => {
                this.onCardFocusMoved(newIdx, element);
              }}
            />
          ))}
        </div>
      </KbnNavigationContainer>
    );
  }

  updateSizesInfo(): void {
    const firstCardElement = this.cardElementRefs[0]?.current ?? undefined;
    this.props.onFirstElementChange?.(firstCardElement);

    if (!firstCardElement || !this.containerRef.current) {
      return;
    }

    const cardHeight = firstCardElement.offsetHeight;
    const gapHeight = parseFloat(getComputedStyle(this.containerRef.current).rowGap);
    const rowHeight = cardHeight + gapHeight;
    this.props.onRowHeightChange?.(rowHeight);
  }

  componentDidMount(): void {
    this.updateSizesInfo();
  }

  componentDidUpdate(): void {
    this.handleFocusPageChange();
    this.updateSizesInfo();
  }

  private onCardFocusMoved(newIdx: number, element: HTMLElement): void {
    const { items, cardProps } = this.props;
    cardProps?.onFocusedCardChanged?.(
      items[newIdx],
      newIdx,
      element,
    );
  }

  private handleFocusPageChange(): void {
    const {
      isLoading, navigationStrategy,
    } = this.props;

    if (!isLoading && this.focusFirstCardAfterReload) {
      this.focusFirstCardAfterReload = false;
      const [, newActiveItem] = navigationStrategy
        .getNewActiveItem(() => navigationStrategy.setActiveItem(0, true));

      if (newActiveItem) {
        this.onCardFocusMoved(newActiveItem.idx, newActiveItem.element);
      }
    }
  }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import type { RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import { Card } from './card/card';
import type { CardHeaderItem } from './card/header';

export interface ContentProps {
  items: DataRow[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;

  onRowHeightChange?: (value: number) => void;

  cardsPerRow?: number;

  needToHiddenCheckBoxes?: boolean;

  cardProps?: {
    toolbar?: CardHeaderItem[];
    minWidth?: number;
    maxWidth?: number;
  };
}

export const CLASSES = {
  content: 'dx-cardview-content',
  grid: 'dx-cardview-content-grid',
  selectCheckBoxesHidden: 'dx-cardview-select-checkboxes-hidden',
};

function getInfernoCardKey(card: DataRow): undefined | string | number {
  if (typeof card.key === 'string' || typeof card.key === 'number') {
    return card.key;
  }

  return undefined;
}

export class Content extends Component<ContentProps> {
  private readonly containerRef = createRef<HTMLDivElement>();

  private cardRefs: RefObject<HTMLDivElement>[] = [];

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
    this.cardRefs = new Array(this.props.items.length).fill(undefined).map(() => createRef());
    const className = combineClasses({
      [CLASSES.content]: true,
      [CLASSES.grid]: true,
      [CLASSES.selectCheckBoxesHidden]: !!this.props.needToHiddenCheckBoxes,
    });
    return (
      <div
        tabIndex={0}
        className={className}
        style={this.getCssVariables()}
        ref={this.containerRef}
      >
        {this.props.items.map((item, i) => (
          <Card
            {...this.props.cardProps}
            key={getInfernoCardKey(item)}
            elementRef={this.cardRefs[i]}
            row={item}
            fieldTemplate={this.props.fieldTemplate}
          />
        ))}
      </div>
    );
  }

  updateSizesInfo(): void {
    const firstCard = this.cardRefs[0];
    if (!firstCard) {
      return;
    }
    const cardHeight = firstCard.current!.offsetHeight;
    const gapHeight = parseFloat(getComputedStyle(this.containerRef.current!).rowGap);
    const rowHeight = cardHeight + gapHeight;
    this.props.onRowHeightChange?.(rowHeight);
  }

  componentDidMount(): void {
    this.updateSizesInfo();
  }

  componentDidUpdate(): void {
    this.updateSizesInfo();
  }
}

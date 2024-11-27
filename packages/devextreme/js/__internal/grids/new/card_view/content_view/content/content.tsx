/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { resizeObserverSingleton } from '@ts/core/m_resize_observer';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { PureComponent } from '@ts/grids/new/grid_core/core/pure_component';
import { CollectionController } from '@ts/grids/new/grid_core/keyboard_navigation/collection_controller';
import type { RefObject } from 'inferno';
import { createRef } from 'inferno';

import { Card } from './card/card';

export interface ContentProps {
  items: DataRow[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;

  onRowHeightChange?: (value: number) => void;

  onWidthChange?: (value: number) => void;

  cardsPerRow?: number;
}

export const CLASSES = {
  content: 'dx-cardview-content',
  grid: 'dx-cardview-content-grid',
};

export class Content extends PureComponent<ContentProps> {
  private readonly containerRef = createRef<HTMLDivElement>();

  private cardRefs: RefObject<HTMLDivElement>[] = [];

  private readonly keyboardController = new CollectionController();

  render(): JSX.Element {
    this.cardRefs = new Array(this.props.items.length).fill(undefined).map(() => createRef());

    return (
      <div
        tabIndex={0}
        className={`${CLASSES.content} ${CLASSES.grid}`}
        style={{
          '--dx-cardview-cardsperrow': `${this.props.cardsPerRow}`,
        }}
        ref={this.containerRef}
        onKeyDown={(e): void => this.keyboardController.onKeyDown(e)}
      >
        {this.props.items.map((item, i) => (
          <Card
            key={item.key as string}
            elementRef={this.cardRefs[i]}
            row={item}
            fieldTemplate={this.props.fieldTemplate}
          />
        ))}
      </div>
    );
  }

  updateKeyboardController(): void {
    this.keyboardController.container = this.containerRef.current!;
    this.keyboardController.items = this.cardRefs.map((ref) => ref.current!);
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
    resizeObserverSingleton.observe(
      this.containerRef.current!,
      (entry: ResizeObserverEntry) => {
        this.props.onWidthChange?.(entry.contentRect.width);
      },
    );

    this.updateKeyboardController();
    this.updateSizesInfo();
  }

  componentDidUpdate(): void {
    this.updateKeyboardController();
    this.updateSizesInfo();
  }
}

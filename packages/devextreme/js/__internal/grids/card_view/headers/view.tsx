import { computed, Subscribable } from '@ts/core/reactive';
import type { RefObject } from 'inferno';
import { createRef, InfernoNode } from 'inferno';

import { ColumnsController } from '../columns_controller/columns_controller';
import { ColumnsDraggingController } from '../columns_dragging/columns_dragging';
import { View } from '../core/view';

export class HeadersView extends View {
  private readonly draggingAreaRef = createRef<HTMLDivElement>();

  private draggingAreaElements: RefObject<HTMLDivElement>[] = [];

  public vdom = computed(
    (columns) => {
      this.draggingAreaElements = columns.map(() => createRef());
      return <div ref={this.draggingAreaRef}>
        {columns.map((c, index) => (
          <div ref={this.draggingAreaElements[index]}>{c.name}</div>
        ))}
      </div>;
    },
    [this.columnsController.columns],
  );

  static dependencies = [ColumnsController, ColumnsDraggingController] as const;

  constructor(
    private readonly columnsController: ColumnsController,
    private readonly columnsDragging: ColumnsDraggingController,
  ) {
    super();
    // TODO: move to onMounted
    // setTimeout(() => {
    //   this.registerDragging();
    // }, 1000);
  }

  private registerDragging(): void {
    this.columnsDragging.registerDraggingArea({
      draggingArea: this.draggingAreaRef.current!,
      draggingElements: this.draggingAreaElements.map((r, i) => ({
        element: r.current!,
        index: i,
        column: undefined as any,
      })),
      draggedInto: this.draggedInto.bind(this),
      draggedOut: this.draggedOut.bind(this),
      draggingStart: this.draggingStart.bind(this),
      draggingCancel: this.draggingCancel.bind(this),
      draggingHover: this.draggingHover.bind(this),
      getHoverIndex: this.getHoverIndex.bind(this),
    });
  }

  private draggedInto() { }

  private draggedOut() { }

  private draggingStart() { }

  private draggingCancel() { }

  private draggingHover() { }

  private getHoverIndex(): number {
    throw new Error('not implemented');
  }
}

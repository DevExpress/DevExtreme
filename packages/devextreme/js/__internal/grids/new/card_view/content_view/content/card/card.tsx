/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isCommandKeyPressed } from '@js/common/core/events/utils/index';
import { off, on } from '@js/events/index';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import type { DataObject } from '@ts/grids/new/grid_core/data_controller/types';
import { CollectionController } from '@ts/grids/new/grid_core/keyboard_navigation/collection_controller';
import type { InfernoNode, RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import type { SelectCardOptions } from '../../types';
import { Cover } from './cover';
import { Field } from './field';
import type { CardHeaderItem } from './header';
import { CardHeader } from './header';

export const CLASSES = {
  card: 'dx-cardview-card',
  cardHover: 'dx-cardview-card-hoverable',
  content: 'dx-cardview-card-content',
  selectCard: 'dx-cardview-card-selection',
};

export interface CardClickEvent {
  event?: MouseEvent;
  row: DataRow;
}

export interface CardHoverEvent {
  isHovered: boolean;
  row: DataRow;
}

export interface CardPreparedEvent {
  instance: Card;
}

export interface CardProps {
  row: DataRow;

  allowSelectOnClick?: boolean;

  cover?: {
    imageExpr?: (data: DataObject) => string;

    altExpr?: (data: DataObject) => string;
  };

  header?: {
    captionExpr?: (data: DataObject) => string;
  };

  elementRef?: RefObject<HTMLDivElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;

  hoverStateEnabled?: boolean;

  toolbar?: CardHeaderItem[];

  isCheckBoxesRendered?: boolean;

  template?: (row: DataRow) => JSX.Element;

  onClick?: (e: CardClickEvent) => void;

  onHold?: (e: CardClickEvent) => void;

  onDblClick?: (e: CardClickEvent) => void;

  onHoverChanged?: (e: CardHoverEvent) => void;

  onPrepared?: (e: CardPreparedEvent) => void;

  onContextMenu?: (e: MouseEvent, card?: DataRow, cardIndex?: number) => void;

  selectCard?: (row: DataRow, options: SelectCardOptions) => void;
}

export class Card extends Component<CardProps> {
  private containerRef = createRef<HTMLDivElement>();

  private fieldRefs: RefObject<HTMLDivElement>[] = [];

  private readonly keyboardController = new CollectionController();

  render(): InfernoNode {
    if (this.props.elementRef) {
      this.containerRef = this.props.elementRef;
    }

    this.fieldRefs = new Array(this.props.row.cells.length).fill(undefined).map(() => createRef());

    const {
      fieldTemplate: FieldTemplate = Field,
      hoverStateEnabled,
      cover,
      row,
    } = this.props;

    const className = combineClasses({
      [CLASSES.card]: true,
      [CLASSES.cardHover]: !!hoverStateEnabled,
      [CLASSES.selectCard]: !!row.isSelected,
    });

    const imageSrc = cover?.imageExpr?.(this.props.row.data);
    const alt = cover?.altExpr?.(this.props.row.data);

    return (
      <div
        className={className}
        tabIndex={0}
        ref={this.props.elementRef}
        onKeyDown={(e): void => this.keyboardController.onKeyDown(e)}
        onDblClick={this.handleDoubleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onContextMenu={this.props.onContextMenu}
      >
        <CardHeader
          row={row}
          items={this.props.toolbar ?? []}
          isCheckBoxesRendered={this.props.isCheckBoxesRendered}
          selectCard={this.props.selectCard}
        />
        {imageSrc && (
          <Cover
            imageSrc={imageSrc}
            alt={alt}
          />
        )}
        <div className={CLASSES.content}>
          {this.props.row.cells.map((cell, index) => (
            <FieldTemplate
              elementRef={this.fieldRefs[index]}
              title={cell.column.caption || cell.column.name}
              text={cell.text}
              highlightedText={cell.highlightedText}
              alignment={cell.column.alignment}
            />
          ))}
        </div>
      </div>
    );
  }

  updateKeyboardController(): void {
    this.keyboardController.container = this.containerRef.current!;
    this.keyboardController.items = this.fieldRefs.map((ref) => ref.current!);
  }

  componentDidMount(): void {
    this.updateKeyboardController();
    const { onPrepared } = this.props;

    if (onPrepared) {
      onPrepared({ instance: this });
    }

    on(this.containerRef.current!, 'dxclick', this.handleClick);

    if (this.props.onHold) {
      on(this.containerRef.current!, 'dxhold', this.handleHold);
    }
  }

  componentWillUnmount(): void {
    off(this.containerRef.current!, 'dxclick', this.handleClick);

    if (this.props.onHold) {
      off(this.containerRef.current!, 'dxhold', this.handleHold);
    }
  }

  componentDidUpdate(): void {
    this.updateKeyboardController();
  }

  handleMouseEnter = (): void => {
    const { onHoverChanged, row } = this.props;

    onHoverChanged?.({ isHovered: true, row });
  };

  handleMouseLeave = (): void => {
    const { onHoverChanged, row } = this.props;

    onHoverChanged?.({ isHovered: false, row });
  };

  handleClick = (event: MouseEvent): void => {
    const {
      allowSelectOnClick,
      onClick,
      selectCard,
      row,
    } = this.props;

    onClick?.({ event, row });

    if (allowSelectOnClick) {
      selectCard?.(row, { control: isCommandKeyPressed(event), shift: event.shiftKey });
    }
  };

  handleDoubleClick = (event: MouseEvent): void => {
    const { onDblClick, row } = this.props;
    onDblClick?.({ event, row });
  };

  handleHold = (event: MouseEvent): void => {
    const { onHold, row } = this.props;

    onHold?.({ event, row });
    event.stopPropagation();
  };
}

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import type { DataObject } from '@ts/grids/new/grid_core/data_controller/types';
import type { InfernoNode, RefObject } from 'inferno';
import { Component, createRef } from 'inferno';

import { Cover } from './cover';
import { Field } from './field';
import type { CardHeaderItem } from './header';
import { CardHeader } from './header';

export const CLASSES = {
  card: 'dx-cardview-card',
  cardHover: 'dx-cardview-card-hoverable',
  content: 'dx-cardview-card-content',
};

export interface CardClickEvent {
  event: MouseEvent;
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

  cover?: {
    imageExpr?: (data: DataObject) => string;

    altExpr?: (data: DataObject) => string;
  };

  elementRef?: RefObject<HTMLDivElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;

  hoverStateEnabled?: boolean;

  toolbar?: CardHeaderItem[];

  template?: (row: DataRow) => JSX.Element;

  onClick?: (e: CardClickEvent) => void;

  onDblClick?: (e: CardClickEvent) => void;

  onHoverChanged?: (e: CardHoverEvent) => void;

  onPrepared?: (e: CardPreparedEvent) => void;
}

export class Card extends Component<CardProps> {
  private containerRef = createRef<HTMLDivElement>();

  private fieldRefs: RefObject<HTMLDivElement>[] = [];

  render(): InfernoNode {
    if (this.props.elementRef) {
      this.containerRef = this.props.elementRef;
    }

    this.fieldRefs = new Array(this.props.row.cells.length).fill(undefined).map(() => createRef());

    const {
      fieldTemplate: FieldTemplate = Field,
      hoverStateEnabled,
      cover,
    } = this.props;

    const className = [
      CLASSES.card,
      hoverStateEnabled ? CLASSES.cardHover : '',
    ].filter(Boolean).join(' ');

    const hasCover = cover?.imageExpr;

    // @ts-expect-error
    const imageSrc = cover?.imageExpr?.(this.props.row.data);
    // @ts-expect-error
    const alt = cover?.altExpr?.(this.props.row.data);

    return (
      <div
        className={className}
        tabIndex={0}
        ref={this.props.elementRef}
        onClick={this.handleClick}
        onDblClick={this.handleDoubleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <CardHeader
          items={this.props.toolbar || []}
        />
        {hasCover && <Cover
          imageSrc={imageSrc}
          alt={alt}
        />}
        <div className={CLASSES.content}>
          {this.props.row.cells.map((cell, index) => (
            <FieldTemplate
              elementRef={this.fieldRefs[index]}

              alignment={cell.column.alignment}
              title={cell.column.caption || cell.column.name}
              text={cell.text}
              highlightedText={cell.highlightedText}
            />
          ))}
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    const { onPrepared } = this.props;
    if (onPrepared) {
      onPrepared({ instance: this });
    }
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
    const { onClick, row } = this.props;
    onClick?.({ event, row });
  };

  handleDoubleClick = (event: MouseEvent): void => {
    const { onDblClick, row } = this.props;
    onDblClick?.({ event, row });
  };
}

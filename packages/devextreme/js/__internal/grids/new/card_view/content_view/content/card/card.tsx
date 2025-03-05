/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { CollectionController } from '@ts/grids/new/grid_core/keyboard_navigation/collection_controller';
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

  header?: {
    captionExpr?: (data: DataObject) => string;
  };

  elementRef?: RefObject<HTMLDivElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;

  hoverStateEnabled?: boolean;

  maxWidth?: number;

  minWidth?: number;

  toolbar?: CardHeaderItem[];

  width?: number;

  template?: (row: DataRow) => JSX.Element;

  onClick?: (e: CardClickEvent) => void;

  onDblClick?: (e: CardClickEvent) => void;

  onHoverChanged?: (e: CardHoverEvent) => void;

  onPrepared?: (e: CardPreparedEvent) => void;
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
      width,
      minWidth,
      maxWidth,
      hoverStateEnabled,
      cover,
    } = this.props;

    const style = {
      width: `${width}px`,
      'min-width': `${minWidth}px`,
      'max-width': `${maxWidth}px`,
    };

    const className = [
      CLASSES.card,
      hoverStateEnabled ? CLASSES.cardHover : '',
    ].filter(Boolean).join(' ');

    const imageSrc = cover?.imageExpr?.(this.props.row.data);
    const alt = cover?.altExpr?.(this.props.row.data);

    return (
      <div
        className={className}
        tabIndex={0}
        ref={this.props.elementRef}
        onKeyDown={(e): void => this.keyboardController.onKeyDown(e)}
        onClick={this.handleClick}
        onDblClick={this.handleDoubleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        // TODO: move to scss
        style={style}
      >
        <CardHeader
          items={this.props.toolbar || []}
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
              // eslint-disable-next-line max-len, @typescript-eslint/explicit-function-return-type
              alignment={cell.column.alignment}
              title={cell.column.caption || cell.column.name}
              value={cell.text}
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
    const { onClick, row } = this.props;
    onClick?.({ event, row });
  };

  handleDoubleClick = (event: MouseEvent): void => {
    const { onDblClick, row } = this.props;
    onDblClick?.({ event, row });
  };
}

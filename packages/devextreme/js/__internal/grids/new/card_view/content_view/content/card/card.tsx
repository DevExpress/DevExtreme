/* eslint-disable
  @typescript-eslint/no-non-null-assertion,
  spellcheck/spell-checker
*/
import { isCommandKeyPressed } from '@js/common/core/events/utils/index';
import { off, on } from '@js/events/index';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import type { DataObject } from '@ts/grids/new/grid_core/data_controller/types';
import { KbnFocusTrap } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import type { ComponentType, InfernoNode, RefObject } from 'inferno';
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
  footer: 'dx-cardview-card-footer',
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

  kbnEnabled: boolean;

  allowSelectOnClick?: boolean;

  cover?: {
    imageExpr?: (data: DataObject) => string;

    altExpr?: (data: DataObject) => string;
  };

  header?: {
    captionExpr?: (data: DataObject) => string;
  };

  elementRef?: RefObject<HTMLDivElement>;

  tabIndex?: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;

  hoverStateEnabled?: boolean;

  toolbar?: CardHeaderItem[];

  isCheckBoxesRendered?: boolean;

  template?: (row: DataRow) => JSX.Element;

  onClick?: (event: CardClickEvent) => void;

  onHold?: (event: CardClickEvent) => void;

  onDblClick?: (event: CardClickEvent) => void;

  onKeyDown?: (event: KeyboardEvent) => void;

  onHoverChanged?: (event: CardHoverEvent) => void;

  onPrepared?: (event: CardPreparedEvent) => void;

  onContextMenu?: (event: MouseEvent, card?: DataRow, cardIndex?: number) => void;

  selectCard?: (row: DataRow, options: SelectCardOptions) => void;

  footerTemplate?: ComponentType<{ card: DataRow }>;
}

export class Card extends Component<CardProps> {
  private containerRef = createRef<HTMLDivElement>();

  render(): InfernoNode {
    if (this.props.elementRef) {
      this.containerRef = this.props.elementRef;
    }

    const {
      hoverStateEnabled,
      cover,
      row,
      footerTemplate: FooterTemplate,
    } = this.props;

    const className = combineClasses({
      [CLASSES.card]: true,
      [CLASSES.cardHover]: !!hoverStateEnabled,
      [CLASSES.selectCard]: !!row.isSelected,
    });

    const hasCover = cover?.imageExpr;

    const imageSrc = cover?.imageExpr?.(this.props.row.data);
    const alt = cover?.altExpr?.(this.props.row.data);

    return (
      <KbnFocusTrap
        elementRef={this.containerRef}
        enabled={this.props.kbnEnabled}
        tabIndex={this.props.tabIndex}
        className={className}
        onDblClick={this.handleDoubleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onContextMenu={this.props.onContextMenu}
        onKeyDown={this.props.onKeyDown}
      >
        <CardHeader
          row={row}
          items={this.props.toolbar ?? []}
          isCheckBoxesRendered={this.props.isCheckBoxesRendered}
          selectCard={this.props.selectCard}
        />
        {hasCover && (
          <Cover
            imageSrc={imageSrc}
            alt={alt}
          />
        ) }
        {!!this.props.row.cells.length && (
          <div className={CLASSES.content}>
            {this.props.row.cells.map((cell) => (
              <Field
                cell={cell}
                template={cell.column.fieldTemplate}
                captionTemplate={cell.column.captionTemplate}
                valueTemplate={cell.column.valueTemplate}
              />
            ))}
          </div>
        )}
        {FooterTemplate && (
          <div className={CLASSES.footer}>
            <FooterTemplate card={row}/>
          </div>
        )}
      </KbnFocusTrap>
    );
  }

  componentDidMount(): void {
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

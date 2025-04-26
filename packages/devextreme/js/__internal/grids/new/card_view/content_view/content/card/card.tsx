/* eslint-disable
  @typescript-eslint/no-non-null-assertion,
  spellcheck/spell-checker
*/
import { isCommandKeyPressed } from '@js/common/core/events/utils/index';
import { off, on } from '@js/events/index';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { CardInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import type { DataObject, Key } from '@ts/grids/new/grid_core/data_controller/types';
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
  card: CardInfo;
}

export interface CardHoverEvent {
  isHovered: boolean;
  card: CardInfo;
}

export interface CardPreparedEvent {
  instance: Card;
}

export interface CardProps {
  card: CardInfo;

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

  template?: (card: CardInfo) => JSX.Element;

  onClick?: (event: CardClickEvent) => void;

  onHold?: (event: CardClickEvent) => void;

  onDblClick?: (event: CardClickEvent) => void;

  onKeyDown?: (event: KeyboardEvent) => void;

  onHoverChanged?: (event: CardHoverEvent) => void;

  onPrepared?: (event: CardPreparedEvent) => void;

  onContextMenu?: (event: MouseEvent, card?: CardInfo, cardIndex?: number) => void;

  selectCard?: (card: CardInfo, options: SelectCardOptions) => void;

  allowUpdating?: boolean;

  allowDeleting?: boolean;

  onEdit?: (key: Key) => void;

  onDelete?: (key: Key) => void;

  footerTemplate?: ComponentType<{ card: CardInfo }>;

  fieldHintEnabled?: boolean;
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
      card,
      footerTemplate: FooterTemplate,
    } = this.props;

    const className = combineClasses({
      [CLASSES.card]: true,
      [CLASSES.cardHover]: !!hoverStateEnabled,
      [CLASSES.selectCard]: !!card.isSelected,
    });

    const hasCover = cover?.imageExpr;

    const imageSrc = cover?.imageExpr?.(this.props.card.data);
    const alt = cover?.altExpr?.(this.props.card.data);

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
          card={card}
          items={this.props.toolbar ?? []}
          isCheckBoxesRendered={this.props.isCheckBoxesRendered}
          selectCard={this.props.selectCard}
          onEdit={() => { this.props.onEdit?.(this.props.card.key); }}
          onDelete={() => { this.props.onDelete?.(this.props.card.key); }}
          allowUpdating={this.props.allowUpdating}
          allowDeleting={this.props.allowDeleting}
        />
        {hasCover && (
          <Cover
            imageSrc={imageSrc}
            alt={alt}
          />
        ) }
        {!!this.props.card.fields.length && (
          <div className={CLASSES.content}>
            {this.props.card.fields.map((field) => (
              <Field
                fieldHintEnabled={this.props.fieldHintEnabled}
                field={field}
                template={field.column.fieldTemplate}
                captionTemplate={field.column.captionTemplate}
                valueTemplate={field.column.valueTemplate}
              />
            ))}
          </div>
        )}
        {FooterTemplate && (
          <div className={CLASSES.footer}>
            <FooterTemplate card={card}/>
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
    const { onHoverChanged, card } = this.props;

    onHoverChanged?.({ isHovered: true, card });
  };

  handleMouseLeave = (): void => {
    const { onHoverChanged, card } = this.props;

    onHoverChanged?.({ isHovered: false, card });
  };

  handleClick = (event: MouseEvent): void => {
    const {
      allowSelectOnClick,
      onClick,
      selectCard,
      card,
    } = this.props;

    onClick?.({ event, card });

    if (allowSelectOnClick) {
      selectCard?.(card, { control: isCommandKeyPressed(event), shift: event.shiftKey });
    }
  };

  handleDoubleClick = (event: MouseEvent): void => {
    const { onDblClick, card } = this.props;
    onDblClick?.({ event, card });
  };

  handleHold = (event: MouseEvent): void => {
    const { onHold, card } = this.props;

    onHold?.({ event, card });
    event.stopPropagation();
  };
}

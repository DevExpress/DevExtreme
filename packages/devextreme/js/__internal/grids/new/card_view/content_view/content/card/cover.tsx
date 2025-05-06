import messageLocalization from '@js/localization/message';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { CardInfo } from '@ts/grids/new/grid_core/columns_controller/types';
import { Icon } from '@ts/grids/new/grid_core/icon';
import type { ComponentType } from 'inferno';
import { Component } from 'inferno';

export const CLASSES = {
  cover: 'dx-card-cover',
  image: 'dx-card-cover-image',
  noImage: 'dx-card-cover-noimage',
};

export interface CoverProps {
  imageSrc?: string;
  alt?: string;
  card: CardInfo;
  template?: ComponentType<{ card: CardInfo }>;
}

export class Cover extends Component<CoverProps> {
  render(): JSX.Element {
    const {
      imageSrc, alt, template: Template, card,
    } = this.props;
    const src = imageSrc;

    const containerClasses = combineClasses({
      [CLASSES.cover]: true,
      [CLASSES.noImage]: !src,
    });

    return (
      <div className={containerClasses}>
        {
          Template
            ? <Template card={card} />
            : (<>
                {src && (
                  <img
                    src={src}
                    alt={alt}
                    className={CLASSES.image}
                  />
                )}
                {!src && (
                  <Icon
                    name='imagethumbnail'
                    aria-label={messageLocalization.format('dxCardView-cardNoImageAriaLabel')}
                  />
                )}
              </>)
        }
      </div>
    );
  }
}

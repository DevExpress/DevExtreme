import messageLocalization from '@js/localization/message';
import { combineClasses } from '@ts/core/utils/combine_classes';
import { Icon } from '@ts/grids/new/grid_core/icon';
import { Component } from 'inferno';

export const CLASSES = {
  cover: 'dx-card-cover',
  image: 'dx-card-cover-image',
  noImage: 'dx-card-cover-noimage',
};

export interface CoverProps {
  imageSrc?: string;
  alt?: string;
  template?: (src: string | undefined, alt: string | undefined, className: string) => JSX.Element;
}

export class Cover extends Component<CoverProps> {
  render(): JSX.Element {
    const {
      imageSrc, alt, template,
    } = this.props;
    const src = imageSrc;

    if (template) {
      return template(src, alt, CLASSES.image);
    }

    const containerClasses = combineClasses({
      [CLASSES.cover]: true,
      [CLASSES.noImage]: !src,
    });

    return (
      <div className={containerClasses}>
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
      </div>
    );
  }
}

/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Component } from 'inferno';

const CLASSES = {
  cover: 'dx-card-cover',
  image: 'dx-card-cover-image',
};

export interface CoverProps {
  imageSrc?: string;
  alt?: string;
  template?: (src: string, alt: string | undefined, className: string) => JSX.Element;
}

export class Cover extends Component<CoverProps> {
  render(): JSX.Element {
    const {
      imageSrc, alt, template,
    } = this.props;
    const src = imageSrc;

    if (!src) {
      // @ts-expect-error
      return null;
    }

    if (template) {
      return template(src, alt, CLASSES.image);
    }
    return (
      <div className={CLASSES.cover}>
        <img
          src={src}
          alt={alt}
          className={CLASSES.image}
          // TODO: move to scss
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    );
  }
}

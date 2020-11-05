/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Effect,
  Ref,
} from 'devextreme-generator/component_declaration/common';
import { LabelAlignment } from './types.d';
import SvgGraphicsProps from './base_graphics_props';
import {
  TextItem,
  removeExtraAttrs,
  parseHTML,
  parseMultiline,
  getTextWidth,
  setTextNodeAttribute,
  getItemLineHeight,
  getLineHeight,
  convertAlignmentToAnchor,
  applyGraphicProps,
} from './utils';
import { isDefined } from '../../../../core/utils/type';

const KEY_STROKE = 'stroke';

export const viewFunction = ({
  textRef, textItems,
  styles, textAnchor, isStroked,
  props: {
    text, x, y, fill, stroke, strokeWidth, strokeOpacity, opacity,
  },
}: TextSvgElement): JSX.Element => {
  const texts = textItems || [];

  return (
    <text
      ref={textRef as any}
      x={x}
      y={y}
      style={styles}
      textAnchor={textAnchor}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      opacity={opacity}
    >
      {texts.length && isStroked && texts.map(({ style, className, value }, index) => (
        <tspan key={index} style={style} className={className}>{value}</tspan>
      ))}
      {texts.length && texts.map(({ style, className, value }, index) => (
        <tspan key={index} style={style} className={className}>{value}</tspan>
      ))}
      {!(texts.length) && text}
    </text>
  );
};

@ComponentBindings()
export class TextSvgElementProps extends SvgGraphicsProps {
  @OneWay() text = '';

  @OneWay() x = 0;

  @OneWay() y = 0;

  @OneWay() align: LabelAlignment = 'center';

  @OneWay() textsAlignment?: LabelAlignment;

  @OneWay() styles?: { [key: string]: any };

  @OneWay() encodeHtml = true;

  @OneWay() rtl = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class TextSvgElement extends JSXComponent(TextSvgElementProps) {
  @Ref() textRef!: SVGGraphicsElement;

  get styles(): { [key: string]: any } {
    const style = this.props.styles || {};

    return {
      whiteSpace: 'pre',
      ...style,
    };
  }

  get textItems(): TextItem[] | undefined {
    let items;
    let parsedHtml;
    const { text } = this.props;

    if (!text) return;

    if (!this.props.encodeHtml && (/<[a-z][\s\S]*>/i.test(text) || text.indexOf('&') !== -1)) {
      parsedHtml = removeExtraAttrs(text);
      items = parseHTML(parsedHtml);
    } else if (/\n/g.test(text)) {
      items = parseMultiline(text);
    } else if (this.isStroked) {
      items = [{ value: text.trim(), height: 0 }];
    }

    // eslint-disable-next-line consistent-return
    return items;
  }

  get isStroked(): boolean {
    return isDefined(this.props.stroke) && isDefined(this.props.strokeWidth);
  }

  get textAnchor(): string | undefined {
    return convertAlignmentToAnchor(this.props.align, this.props.rtl);
  }

  @Effect()
  effectUpdateText(): void {
    const texts = this.textItems;
    if (texts) {
      const items = this.parseTspanElements(texts);

      this.alignTextNodes(items);
      applyGraphicProps(this.textRef, this.props as SvgGraphicsProps, this.props.x, this.props.y);
      if (this.props.x !== undefined || this.props.y !== undefined) {
        this.locateTextNodes(items);
      }
      this.strokeTextNodes(items);
    }
  }

  parseTspanElements(texts: TextItem[]): TextItem[] {
    const items = [...texts];
    const textElements = this.textRef.children;

    const strokeLength = !this.isStroked ? 0 : items.length;
    for (let i = 0; i < textElements.length; i++) {
      if (i < strokeLength) {
        items[i].stroke = textElements[i] as SVGTSpanElement;
      } else {
        items[i % items.length].tspan = textElements[i] as SVGTSpanElement;
      }
    }

    return items;
  }

  alignTextNodes(items: TextItem[]): void {
    const alignment = this.props.textsAlignment;

    if (!items || !alignment || alignment === 'center') {
      return;
    }

    const direction = alignment === 'left' ? -1 : 1;
    const maxTextWidth = Math.max(...items.map((t: TextItem) => getTextWidth(t)));

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const textWidth = getTextWidth(item);
      if (maxTextWidth !== 0 && maxTextWidth !== textWidth) {
        setTextNodeAttribute(item, 'dx', direction * (Math.round(((maxTextWidth - textWidth) / 2) * 10) / 10));
      }
    }
  }

  locateTextNodes(items: TextItem[]): void {
    const { x, y, styles } = this.props;
    const lineHeight = getLineHeight(styles || {});
    let item = items[0];
    setTextNodeAttribute(item, 'x', x);
    setTextNodeAttribute(item, 'y', y);
    for (let i = 1, ii = items.length; i < ii; ++i) {
      item = items[i];
      if (item.height >= 0) {
        setTextNodeAttribute(item, 'x', x);
        const height = getItemLineHeight(item, lineHeight);
        setTextNodeAttribute(item, 'dy', height); // T177039
      }
    }
  }

  strokeTextNodes(items: TextItem[]): void {
    if (!this.isStroked) return;

    const { stroke, strokeWidth } = this.props;
    const strokeOpacity = this.props.strokeOpacity || 1;
    let tspan: SVGTSpanElement;

    for (let i = 0, ii = items.length; i < ii; ++i) {
      tspan = items[i].stroke;
      tspan.setAttribute(KEY_STROKE, stroke);
      tspan.setAttribute('stroke-width', strokeWidth.toString());
      tspan.setAttribute('stroke-opacity', strokeOpacity.toString());
      tspan.setAttribute('stroke-linejoin', 'round');
    }
  }
}

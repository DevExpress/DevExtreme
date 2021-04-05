import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Ref,
  RefObject,
} from '@devextreme-generator/declarations';
import SvgGraphicsProps from './base_graphics_props';
import {
  getGraphicExtraProps,
} from './utils';

export const viewFunction = ({
  rectRef, parsedProps,
}: RectSvgElement): JSX.Element => {
  const {
    x, y, width, height, strokeWidth,
    rx, ry, fill, stroke, strokeOpacity, opacity,
  } = parsedProps;
  return (
    <rect
      ref={rectRef}
      x={x}
      y={y}
      width={width}
      height={height}
      rx={rx}
      ry={ry}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      opacity={opacity}
    // eslint-disable-next-line react/jsx-props-no-spreading
      {...getGraphicExtraProps(parsedProps, x, y)}
    />
  );
};

@ComponentBindings()
export class RectSvgElementProps extends SvgGraphicsProps {
  @OneWay() x = 0;

  @OneWay() y = 0;

  @OneWay() width = 0;

  @OneWay() height = 0;

  @OneWay() rx?: number;

  @OneWay() ry?: number;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class RectSvgElement extends JSXComponent(RectSvgElementProps) {
  @Ref() rectRef!: RefObject<SVGRectElement>;

  get parsedProps(): RectSvgElementProps {
    let tmpX: number;
    let tmpY: number;
    let tmpWidth: number;
    let tmpHeight: number;
    const tmpProps = { ...this.props };
    const {
      x,
      y,
      height,
      width,
      strokeWidth,
    } = tmpProps;
    let sw: number | undefined;

    if (x !== undefined || y !== undefined
      || width !== undefined || height !== undefined
      || strokeWidth !== undefined) {
      tmpX = x !== undefined ? x : 0;
      tmpY = y !== undefined ? y : 0;
      tmpWidth = width !== undefined ? width : 0;
      tmpHeight = height !== undefined ? height : 0;
      sw = strokeWidth !== undefined ? strokeWidth : 0;

      // eslint-disable-next-line no-bitwise
      const maxSW = ~~((tmpWidth < tmpHeight ? tmpWidth : tmpHeight) / 2);
      const newSW = Math.min(sw, maxSW);

      tmpProps.x = tmpX + newSW / 2;
      tmpProps.y = tmpY + newSW / 2;
      tmpProps.width = tmpWidth - newSW;
      tmpProps.height = tmpHeight - newSW;
      ((sw !== newSW) || !(newSW === 0 && strokeWidth === undefined))
      && (tmpProps.strokeWidth = newSW);
    }

    tmpProps.sharp && (tmpProps.sharp = false);

    return tmpProps;
  }
}

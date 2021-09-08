import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Ref,
  RefObject,
} from '@devextreme-generator/declarations';
import {
  PathType,
  Point,
  LineCap,
  Segment,
} from './types.d';
import SvgGraphicsProps from './base_graphics_props';
import {
  combinePathParam,
  buildPathSegments,
  getGraphicExtraProps,
} from './utils';

export const viewFunction = ({
  pathRef,
  d,
  computedProps,
}: PathSvgElement): JSX.Element => {
  const {
    className, fill, stroke, strokeWidth, strokeOpacity, strokeLineCap, opacity, pointerEvents,
  } = computedProps;
  return (
    <path
      ref={pathRef}
      className={className}
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      strokeLinecap={strokeLineCap}
      opacity={opacity}
      pointerEvents={pointerEvents}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...getGraphicExtraProps(computedProps)}
    />
  );
};

@ComponentBindings()
export class PathSvgElementProps extends SvgGraphicsProps {
  @OneWay() points?: Point[] | number[] | number[][];

  @OneWay() type: PathType = 'line';

  @OneWay() d = '';

  @OneWay() strokeLineCap?: LineCap;

  @OneWay() pointerEvents?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  isSVG: true,
})
export class PathSvgElement extends JSXComponent(PathSvgElementProps) {
  @Ref() pathRef!: RefObject<SVGPathElement>;

  get d(): string | undefined {
    let path = this.props.d;
    let segments: Segment[] = [];

    if (this.props.points?.length) {
      segments = buildPathSegments(this.props.points, this.props.type);
      segments && (path = combinePathParam(segments));
    }

    return path;
  }

  // https://trello.com/c/rc9RQJ2y
  get computedProps(): PathSvgElementProps {
    return this.props;
  }
}

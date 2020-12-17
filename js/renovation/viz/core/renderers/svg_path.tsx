import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Ref,
  Effect,
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import {
  PathType,
  Point,
  Segment,
  LineCap,
} from './types.d';
import SvgGraphicsProps from './base_graphics_props';
import {
  combinePathParam,
  buildPathSegments,
  applyGraphicProps,
} from './utils';

export const viewFunction = ({
  pathRef,
  d,
  props: {
    className, fill, stroke, strokeWidth, strokeOpacity, strokeLineCap, opacity,
  },
}: PathSvgElement): JSX.Element => (
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
  />
);

@ComponentBindings()
export class PathSvgElementProps extends SvgGraphicsProps {
  @OneWay() points?: Point[]|number[]|number[][];

  @OneWay() type: PathType = 'line';

  @OneWay() d = '';

  @OneWay() strokeLineCap?: LineCap;
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

  @Effect()
  effectUpdateShape(): void {
    applyGraphicProps(this.pathRef, this.props);
  }
}

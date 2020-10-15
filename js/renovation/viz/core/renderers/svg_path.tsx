import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from 'devextreme-generator/component_declaration/common';
import {
  PathType,
  Point,
  Segment,
  LineCap,
} from './types.d';
import SvgGraphicsProps from './base_graphics_props';
import { combinePathParam, buildPathSegments } from './utils';

export const viewFunction = ({
  d, props: {
    fill, stroke, strokeWidth, strokeOpacity, strokeLineCap, opacity,
  },
}: PathSvgElement): JSX.Element => (
  <path
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
  get d(): string | undefined {
    let path = this.props.d;
    let segments: Segment[] = [];

    if (this.props.points?.length) {
      segments = buildPathSegments(this.props.points, this.props.type);
      segments && (path = combinePathParam(segments));
    }

    return path;
  }
}

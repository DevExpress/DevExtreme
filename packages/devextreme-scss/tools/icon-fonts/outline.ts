import cubicToQuad from 'cubic2quad';

import { parsePath, type Point } from './svg-path.ts';

export const UNITS_PER_EM = 1024;
export const ASCENT = 960;
export const DESCENT = -64;

export interface GlyphPoint extends Point {
  onCurve: boolean;
}

export type Contour = GlyphPoint[];

export interface IconPath {
  d: string;
  evenOdd: boolean;
}

export interface IconDrawing {
  size: number;
  viewBox: [number, number, number, number];
  paths: IconPath[];
}

// Font units a quadratic curve may deviate from the drawn cubic one.
const CURVE_TOLERANCE = 0.3;

const samePosition = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

// Drops repeated points (keeping the on-curve one) and a last point that repeats the first.
const removeRepeats = (points: Contour): Contour => {
  const result: Contour = [];

  points.forEach((point) => {
    const previous = result.at(-1);

    if (previous && samePosition(previous, point)) {
      if (point.onCurve) {
        result[result.length - 1] = point;
      }
    } else {
      result.push(point);
    }
  });

  while (result.length > 1 && samePosition(result[0], result[result.length - 1])) {
    result.pop();
  }

  return result;
};

const signedArea = (contours: Contour[]): number => contours.reduce((sum, points) => sum + points
  .reduce((area, point, index) => {
    const next = points[(index + 1) % points.length];

    return area + point.x * next.y - next.x * point.y;
  }, 0), 0) / 2;

const pathContours = (d: string, toFont: (point: Point) => Point): Contour[] => parsePath(d)
  .map(({ start, segments }) => {
    const points: Contour = [{ ...toFont(start), onCurve: true }];
    let current = start;

    segments.forEach((segment) => {
      if (segment.type === 'line') {
        points.push({ ...toFont(segment.to), onCurve: true });
      } else if (segment.type === 'quad') {
        points.push(
          { ...toFont(segment.control), onCurve: false },
          { ...toFont(segment.to), onCurve: true },
        );
      } else {
        const [p1, c1, c2, p2] = [current, segment.control1, segment.control2, segment.to]
          .map(toFont);
        const curve = cubicToQuad(p1.x, p1.y, c1.x, c1.y, c2.x, c2.y, p2.x, p2.y, CURVE_TOLERANCE);

        for (let index = 2; index < curve.length; index += 4) {
          points.push(
            { x: curve[index], y: curve[index + 1], onCurve: false },
            { x: curve[index + 2], y: curve[index + 3], onCurve: true },
          );
        }
      }

      current = segment.to;
    });

    return removeRepeats(points.map(({ x, y, onCurve }) => ({
      x: Math.round(x), y: Math.round(y), onCurve,
    })));
  })
  .filter((points) => points.length >= 3);

const contains = (contour: Contour, { x, y }: Point): boolean => contour
  .reduce((inside, a, index) => {
    const b = contour[(index + 1) % contour.length];
    const crosses = a.y > y !== b.y > y && x < a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y);

    return crosses ? !inside : inside;
  }, false);

const reverse = ([first, ...rest]: Contour): Contour => [first, ...rest.reverse()];

// Every svg path is filled on its own, while a glyph fills all its contours together. Turning each
// path clockwise makes overlapping paths add up instead of cancelling each other out.
const clockwise = (contours: Contour[]): Contour[] => (signedArea(contours) > 0
  ? contours.map(reverse)
  : contours);

// Under the evenodd rule each nested contour toggles the fill, so outer contours turn clockwise
// and the ones inside them the other way.
const evenOddClockwise = (contours: Contour[]): Contour[] => contours.map((contour) => {
  const depth = contours.filter((other) => other !== contour && contains(other, contour[0])).length;
  const isClockwise = signedArea([contour]) < 0;

  return isClockwise === (depth % 2 === 0) ? contour : reverse(contour);
});

export const iconContours = ({ size, viewBox, paths }: IconDrawing): Contour[] => {
  const [x0, y0, , height] = viewBox;
  const scale = UNITS_PER_EM / height;
  // The baseline sits on a whole unit of the icon's design grid, as in the IcoMoon projects.
  const baseline = Math.round((size * -DESCENT) / UNITS_PER_EM) * (UNITS_PER_EM / size);
  const top = UNITS_PER_EM - baseline;
  const toFont = ({ x, y }: Point): Point => ({ x: (x - x0) * scale, y: top - (y - y0) * scale });

  return paths.flatMap(({ d, evenOdd }) => {
    const contours = pathContours(d, toFont);

    return evenOdd ? evenOddClockwise(contours) : clockwise(contours);
  });
};

import type { Contour, GlyphPoint } from './truetype.ts';

interface Point {
  x: number;
  y: number;
}

// Lossless mapping between TrueType contours and an SVG path in font units, y axis flipped:
//   M x y  the first point of a contour (always on-curve);
//   L x y  an on-curve point that follows an on-curve point;
//   Q c p  an off-curve point, then the on-curve point that ends the curve;
//   T p    the next off-curve point (the reflection of the previous one), so the end of
//          the preceding command is an implied on-curve point and is not stored;
//   Z      closes a contour whose last stored point is on-curve. A contour that ends with
//          an off-curve point has no Z: its last curve returns to the unrepeated start point.
const formatPoint = ({ x, y }: Point): string => `${x} ${-y}`;

const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

const contourToPath = (points: Contour): string => {
  if (!points[0].onCurve) {
    throw new Error('A contour must start with an on-curve point');
  }

  const commands = [`M${formatPoint(points[0])}`];
  let pending = '';
  let control: GlyphPoint | null = null;

  points.slice(1).forEach((point) => {
    if (point.onCurve) {
      commands.push(control ? `${pending}${formatPoint(point)}` : `L${formatPoint(point)}`);
      control = null;
    } else if (control) {
      commands.push(`${pending}${formatPoint(midpoint(control, point))}`);
      pending = 'T';
      control = point;
    } else {
      pending = `Q${formatPoint(point)} `;
      control = point;
    }
  });

  commands.push(control ? `${pending}${formatPoint(points[0])}` : 'Z');

  return commands.join('');
};

export const contoursToPath = (contours: Contour[]): string => contours.map(contourToPath).join('');

export const pathToContours = (d: string): Contour[] => {
  const tokens = d.match(/[A-Za-z]|-?\d+(?:\.\d+)?/g) ?? [];
  const contours: Contour[] = [];
  let index = 0;
  let points: Contour | null = null;
  let current: Point = { x: 0, y: 0 };
  let control: Point | null = null;
  let pendingEnd: Point | null = null;

  const readPoint = (): Point => {
    const [x, y] = [tokens[index], tokens[index + 1]].map(Number);

    if (Number.isNaN(x) || Number.isNaN(y)) {
      const found = tokens.slice(index, index + 2).join(' ');

      throw new Error(`A coordinate pair is expected at ${JSON.stringify(found)}`);
    }

    index += 2;

    return { x, y: y === 0 ? 0 : -y };
  };
  const gridPoint = ({ x, y }: Point, onCurve: boolean): GlyphPoint => {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new Error(`Point ${x},${y} is not on the font unit grid`);
    }

    return { x, y, onCurve };
  };
  const contour = (): Contour => {
    if (!points) {
      throw new Error('A path must start with M');
    }

    return points;
  };
  const storePendingEnd = (): void => {
    if (pendingEnd) {
      contour().push(gridPoint(pendingEnd, true));
      pendingEnd = null;
    }
  };
  const finishContour = (closed: boolean): void => {
    if (!points) {
      return;
    }

    if (closed) {
      storePendingEnd();
    } else if (pendingEnd && (pendingEnd.x !== points[0].x || pendingEnd.y !== points[0].y)) {
      throw new Error('A contour without Z must end at its start point');
    }

    contours.push(points);
    points = null;
    pendingEnd = null;
    control = null;
  };

  while (index < tokens.length) {
    const command = tokens[index];

    index += 1;

    switch (command) {
      case 'M':
        finishContour(false);
        current = readPoint();
        points = [gridPoint(current, true)];
        break;
      case 'L':
        storePendingEnd();
        current = readPoint();
        contour();
        pendingEnd = current;
        control = null;
        break;
      case 'Q':
        storePendingEnd();
        control = readPoint();
        contour().push(gridPoint(control, false));
        current = readPoint();
        pendingEnd = current;
        break;
      case 'T': {
        if (!control) {
          throw new Error('T must follow Q or T');
        }

        control = { x: 2 * current.x - control.x, y: 2 * current.y - control.y };
        pendingEnd = null;
        contour().push(gridPoint(control, false));
        current = readPoint();
        pendingEnd = current;
        break;
      }
      case 'Z':
        finishContour(true);
        break;
      default:
        throw new Error(`Unsupported path command ${JSON.stringify(command)}: only absolute M, L, Q, T and Z`);
    }
  }

  finishContour(false);

  return contours;
};

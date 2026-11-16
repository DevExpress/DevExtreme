export interface Point {
  x: number;
  y: number;
}

interface Line {
  type: 'line';
  to: Point;
}

interface Quad {
  type: 'quad';
  control: Point;
  to: Point;
}

interface Cubic {
  type: 'cubic';
  control1: Point;
  control2: Point;
  to: Point;
}

export type Segment = Line | Quad | Cubic;

export interface SubPath {
  start: Point;
  segments: Segment[];
}

const COMMAND_ARGUMENTS: Record<string, number> = {
  M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, Z: 0,
};

const tokenize = (d: string): (string | number)[] => {
  const tokens: string[] = d.match(/[A-Za-z]|[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g) ?? [];

  return tokens.map((token) => (/[A-Za-z]/.test(token) ? token : Number(token)));
};

const reflect = (point: Point, center: Point): Point => ({
  x: 2 * center.x - point.x,
  y: 2 * center.y - point.y,
});

// Parses the path commands IcoMoon writes (no arcs) into absolute subpaths.
export const parsePath = (d: string): SubPath[] => {
  const tokens = tokenize(d);
  const subPaths: SubPath[] = [];
  let index = 0;
  let command = '';
  let current: Point = { x: 0, y: 0 };
  let subPath: SubPath | null = null;
  let lastCubicControl: Point | null = null;
  let lastQuadControl: Point | null = null;

  const readNumber = (): number => {
    const value = tokens[index];

    if (typeof value !== 'number') {
      throw new Error(`A number is expected after "${command}", found ${JSON.stringify(value)}`);
    }

    index += 1;

    return value;
  };
  const readPoint = (relative: boolean): Point => {
    const x = readNumber();
    const y = readNumber();

    return relative ? { x: current.x + x, y: current.y + y } : { x, y };
  };
  const push = (segment: Segment): void => {
    if (!subPath) {
      subPath = { start: current, segments: [] };
      subPaths.push(subPath);
    }

    subPath.segments.push(segment);
    current = segment.to;
  };

  while (index < tokens.length) {
    const token = tokens[index];

    if (typeof token === 'string') {
      command = token;
      index += 1;
    } else if (!command || command.toUpperCase() === 'Z') {
      throw new Error(`Unexpected number ${token} in the path data`);
    }

    const name = command.toUpperCase();
    const relative = command !== name;

    if (!(name in COMMAND_ARGUMENTS)) {
      throw new Error(`Unsupported path command "${command}": convert arcs and shapes to curves`);
    }

    if (name !== 'C' && name !== 'S') {
      lastCubicControl = null;
    }

    if (name !== 'Q' && name !== 'T') {
      lastQuadControl = null;
    }

    switch (name) {
      case 'M':
        current = readPoint(relative);
        subPath = { start: current, segments: [] };
        subPaths.push(subPath);
        command = relative ? 'l' : 'L';
        break;
      case 'L':
        push({ type: 'line', to: readPoint(relative) });
        break;
      case 'H':
        push({ type: 'line', to: { x: readNumber() + (relative ? current.x : 0), y: current.y } });
        break;
      case 'V':
        push({ type: 'line', to: { x: current.x, y: readNumber() + (relative ? current.y : 0) } });
        break;
      case 'C': {
        const control1 = readPoint(relative);
        const control2 = readPoint(relative);

        push({
          type: 'cubic', control1, control2, to: readPoint(relative),
        });
        lastCubicControl = control2;
        break;
      }
      case 'S': {
        const control1 = lastCubicControl ? reflect(lastCubicControl, current) : current;
        const control2 = readPoint(relative);

        push({
          type: 'cubic', control1, control2, to: readPoint(relative),
        });
        lastCubicControl = control2;
        break;
      }
      case 'Q': {
        const control = readPoint(relative);

        push({ type: 'quad', control, to: readPoint(relative) });
        lastQuadControl = control;
        break;
      }
      case 'T': {
        const control = lastQuadControl ? reflect(lastQuadControl, current) : current;

        push({ type: 'quad', control, to: readPoint(relative) });
        lastQuadControl = control;
        break;
      }
      default:
        if (subPath) {
          current = subPath.start;
        }

        subPath = null;
    }
  }

  return subPaths.filter(({ segments }) => segments.length > 0);
};

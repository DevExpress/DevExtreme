import { RecalculateCoordinatesFn, Coordinates, Size } from './types.d';
import { isDefined } from '../../../../core/utils/type';

const {
  max, min, PI, cos, sin, asin, round, ceil, floor,
} = Math;

const buildPath = (...points): string => points.join('');

function getArc(cornerRadius: number, xDirection: number, yDirection: number): string {
  return `a ${cornerRadius} ${cornerRadius} 0 0 1 ${xDirection * cornerRadius} ${yDirection * cornerRadius}`;
}

function getAbsoluteArc(cornerRadius: number, x: number, y: number): string {
  return `A ${cornerRadius} ${cornerRadius} 0 0 1 ${x} ${y}`;
}

function rotateSize({ width, height }: Size, angle: number): Size {
  if (angle % 90 === 0 && angle % 180 !== 0) {
    return { width: height, height: width };
  }
  return { width, height };
}

function rotateX({
  x, y, anchorX, anchorY,
}: Coordinates, angle: number): number {
  return (anchorX - x) * round(cos(angle)) + (anchorY - y) * round(sin(angle)) + x;
}

function rotateY({
  x, y, anchorX, anchorY,
}: Coordinates, angle: number): number {
  return -(anchorX - x) * round(sin(angle)) + (anchorY - y) * round(cos(angle)) + y;
}

export function getCloudPoints(
  size: Size,
  coordinates: Coordinates,
  { rotationAngle, radRotationAngle }: { rotationAngle: number; radRotationAngle: number },
  options: { arrowWidth: number; cornerRadius: number },
  bounded: boolean,
): string {
  const { x, y } = coordinates;
  const { width, height } = rotateSize(size, rotationAngle);
  const anchorX = rotateX(coordinates, radRotationAngle);
  const anchorY = rotateY(coordinates, radRotationAngle);
  const halfArrowWidth = options.arrowWidth / 2;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const xr = Math.ceil(x + halfWidth);
  const xl = Math.floor(x - halfWidth);
  const yt = Math.floor(y - halfHeight);
  const yb = Math.ceil(y + halfHeight);
  const leftTopCorner = [xl, yt];
  const rightTopCorner = [xr, yt];
  const rightBottomCorner = [xr, yb];
  const leftBottomCorner = [xl, yb];

  const getCoordinate = (cur: number, side1: number, side2: number): number => {
    if (cur <= side1) {
      return side1;
    }
    if (cur >= side2) {
      return side2;
    }
    return cur;
  };

  const arrowX = getCoordinate(anchorX, xl, xr);
  const arrowY = getCoordinate(anchorY, yt, yb);

  const arrowBaseBottom = min(arrowY + halfArrowWidth, yb);
  const arrowBaseTop = max(arrowY - halfArrowWidth, yt);
  const arrowBaseLeft = max(arrowX - halfArrowWidth, xl);

  const cornerRadius = Math.min(width / 2, height / 2, options.cornerRadius);

  let points;

  leftTopCorner[1] += cornerRadius;
  rightTopCorner[0] -= cornerRadius;
  rightBottomCorner[1] -= cornerRadius;
  leftBottomCorner[0] += cornerRadius;
  // 1 | 2 | 3
  // 8 | 0 | 4
  // 7 | 6 | 5
  if (!bounded || (xl <= anchorX && anchorX <= xr && yt <= anchorY && anchorY <= yb)) { // 0
    points = buildPath(leftTopCorner, getArc(cornerRadius, 1, -1), 'L', rightTopCorner, getArc(cornerRadius, 1, 1), 'L', rightBottomCorner, getArc(cornerRadius, -1, 1), 'L', leftBottomCorner, getArc(cornerRadius, -1, -1));
  } else if (anchorX > xr && anchorY < yt) { // 3
    const arrowAngle = (options.arrowWidth / cornerRadius) || 0;
    const angle = PI / 4 + arrowAngle / 2;
    const endAngle = PI / 4 - arrowAngle / 2;

    const arrowEndPointX = rightTopCorner[0] + cos(endAngle) * cornerRadius;
    const arrowEndPointY = rightTopCorner[1] + (1 - sin(endAngle)) * cornerRadius;

    let arrowArc = buildPath('L', rightTopCorner, getArc(cornerRadius, cos(angle), 1 - sin(angle)), 'L', [anchorX, anchorY, arrowEndPointX, arrowEndPointY],
      getAbsoluteArc(cornerRadius, rightTopCorner[0] + cornerRadius,
        rightTopCorner[1] + cornerRadius));

    if (Math.abs(angle) > PI / 2) {
      arrowArc = buildPath('L', [arrowBaseLeft, yt, anchorX, anchorY, xr, arrowBaseBottom]);
    }

    points = buildPath(leftTopCorner, getArc(cornerRadius, 1, -1), arrowArc, 'L', rightBottomCorner, getArc(cornerRadius, -1, 1), 'L', leftBottomCorner, getArc(cornerRadius, -1, -1));
  } else if (anchorX > xr && anchorY >= yt && anchorY <= yb) { // 4
    let arrowArc;

    if (arrowBaseTop >= rightTopCorner[1] + cornerRadius
        && arrowBaseBottom <= rightBottomCorner[1]) {
      arrowArc = buildPath(getArc(cornerRadius, 1, 1), 'L', [xr, arrowBaseTop, anchorX, anchorY, xr, arrowBaseBottom], 'L', rightBottomCorner, getArc(cornerRadius, -1, 1));
    } else if (arrowBaseTop < rightTopCorner[1] + cornerRadius
        && arrowBaseBottom >= rightTopCorner[1] + cornerRadius
        && arrowBaseBottom <= rightBottomCorner[1]) {
      const arrowWidthRest = rightTopCorner[1] + cornerRadius - arrowBaseTop;
      const angle = arrowWidthRest / cornerRadius;

      const arrowBaseTopX = rightTopCorner[0] + cos(angle) * cornerRadius;
      const arrowBaseTopY = rightTopCorner[1] + (1 - sin(angle)) * cornerRadius;
      arrowArc = buildPath(getArc(cornerRadius, cos(angle), 1 - sin(angle)), 'L', [arrowBaseTopX, arrowBaseTopY, anchorX, anchorY, xr, arrowBaseBottom], 'L', rightBottomCorner, getArc(cornerRadius, -1, 1));
    } else if (arrowBaseTop < rightTopCorner[1] + cornerRadius
        && arrowBaseBottom < rightTopCorner[1] + cornerRadius) {
      const arrowWidthRest = rightTopCorner[1] + cornerRadius - arrowBaseTop;
      const arrowAngle = arrowWidthRest / cornerRadius;
      const angle = arrowAngle;

      const arrowBaseTopX = rightTopCorner[0] + cos(angle) * cornerRadius;
      const arrowBaseTopY = rightTopCorner[1] + (1 - sin(angle)) * cornerRadius;

      const bottomAngle = Math.sin((rightTopCorner[1] + cornerRadius - arrowBaseBottom)
      / cornerRadius);

      const arrowBaseBottomX = rightTopCorner[0] + cornerRadius * cos(bottomAngle);
      const arrowBaseBottomY = rightTopCorner[1] + cornerRadius * (1 - sin(bottomAngle));

      arrowArc = buildPath(getArc(cornerRadius, cos(angle), 1 - sin(angle)),
        'L', [arrowBaseTopX, arrowBaseTopY, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY],
        getAbsoluteArc(cornerRadius, rightTopCorner[0] + cornerRadius,
          rightTopCorner[1] + cornerRadius),
        'L', rightBottomCorner,
        getArc(cornerRadius, -1, 1));
    } else if (arrowBaseTop <= rightTopCorner[1] + cornerRadius
        && arrowBaseBottom >= rightBottomCorner[1]) {
      const topAngle = asin((rightTopCorner[1] + cornerRadius - arrowBaseTop) / cornerRadius);
      const arrowBaseTopX = rightTopCorner[0] + cornerRadius * cos(topAngle);
      const arrowBaseTopY = rightTopCorner[1] + cornerRadius * (1 - sin(topAngle));

      const bottomAngle = asin((arrowBaseBottom - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseBottomX = rightBottomCorner[0] + cornerRadius * (cos(bottomAngle) - 1);
      const arrowBaseBottomY = rightBottomCorner[1] + cornerRadius * (sin(bottomAngle));

      arrowArc = buildPath(getArc(cornerRadius, cos(topAngle), 1 - sin(topAngle)),
        'L', [arrowBaseTopX, arrowBaseTopY, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY],
        getAbsoluteArc(cornerRadius, rightBottomCorner[0] - cornerRadius,
          rightBottomCorner[1] + cornerRadius));
    } else if (arrowBaseTop > rightTopCorner[1] + cornerRadius
        && arrowBaseTop <= rightBottomCorner[1] && arrowBaseBottom > rightBottomCorner[1]) {
      const bottomAngle = asin((arrowBaseBottom - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseBottomX = rightBottomCorner[0] + cornerRadius * (cos(bottomAngle) - 1);
      const arrowBaseBottomY = rightBottomCorner[1] + cornerRadius * (sin(bottomAngle));

      arrowArc = buildPath(getArc(cornerRadius, 1, 1),
        'L', [xr, arrowBaseTop, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY],
        getAbsoluteArc(cornerRadius, rightBottomCorner[0] - cornerRadius,
          rightBottomCorner[1] + cornerRadius));
    } else if (arrowBaseTop > rightTopCorner[1] + cornerRadius
        && arrowBaseBottom > rightBottomCorner[1]) {
      const bottomAngle = asin((arrowBaseBottom - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseBottomX = rightBottomCorner[0] + cornerRadius * (cos(bottomAngle) - 1);
      const arrowBaseBottomY = rightBottomCorner[1] + cornerRadius * (sin(bottomAngle));

      const topAngle = asin((arrowBaseTop - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseTopX = rightBottomCorner[0] + cornerRadius * (cos(topAngle) - 1);
      const arrowBaseTopY = rightBottomCorner[1] + cornerRadius * (sin(topAngle));

      arrowArc = buildPath(getArc(cornerRadius, 1, 1),
        'L', rightBottomCorner,
        getArc(cornerRadius, cos(topAngle) - 1, sin(topAngle)),
        'L', [arrowBaseTopX, arrowBaseTopY, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY],
        getAbsoluteArc(cornerRadius, rightBottomCorner[0] - cornerRadius,
          rightBottomCorner[1] + cornerRadius));
    }

    points = buildPath(leftTopCorner, getArc(cornerRadius, 1, -1), 'L', rightTopCorner, arrowArc, 'L', leftBottomCorner, getArc(cornerRadius, -1, -1));
  }

  return buildPath('M', points, 'Z');
}

export function recalculateCoordinates({
  canvas, anchorX, anchorY, x, y, size, offsetX = 0, offsetY = 0, offset, arrowLength,
}: RecalculateCoordinatesFn): Coordinates {
  const bounds = {
    xl: canvas.left,
    xr: canvas.width - canvas.right,
    width: canvas.width - canvas.right - canvas.left,
    yt: canvas.top,
    yb: canvas.height - canvas.bottom,
    height: canvas.height - canvas.bottom - canvas.top,
  };

  let correctedX = x;
  let correctedY = y;
  let correctedAnchorX = anchorX;
  let correctedAnchorY = anchorY;

  if (!isDefined(x)) {
    if (isDefined(offsetX)) {
      correctedX = anchorX + offsetX;
    } else if (bounds.width < size.width) {
      correctedX = round(bounds.xl + bounds.width / 2);
    } else {
      correctedX = min(
        max(anchorX, ceil(bounds.xl + size.width / 2)),
        floor(bounds.xr - size.width / 2),
      );
    }
  } else {
    correctedX = (correctedX || 0) + offsetX;
    if (!isDefined(anchorX)) {
      correctedAnchorX = x || 0;
    }
  }
  if (!isDefined(y)) {
    if (isDefined(offsetY)) {
      correctedY = anchorY + offsetY;
    } else {
      const yTop = anchorY - arrowLength - size.height / 2 - offset;
      const yBottom = anchorY + arrowLength + size.height / 2 + offset;

      if (bounds.height < size.height + arrowLength) {
        correctedY = round(bounds.yt + size.height / 2);
      } else if (yTop - size.height / 2 < bounds.yt) {
        if (yBottom + size.height / 2 < bounds.yb) {
          correctedY = yBottom;
          correctedAnchorY += offset;
        } else {
          correctedY = round(bounds.yt + size.height / 2);
        }
      } else {
        correctedY = yTop;
        correctedAnchorY -= offset;
      }
    }
  } else {
    correctedY = (correctedY || 0) + offsetY;
    if (!isDefined(anchorY)) {
      correctedAnchorY = (y || 0) + size.height / 2;
    }
  }

  return {
    x: correctedX,
    y: correctedY,
    anchorX: correctedAnchorX,
    anchorY: correctedAnchorY,
  };
}

export function getCloudAngle(
  { width, height }: Size,
  {
    x, y, anchorX, anchorY,
  }: Coordinates,
):
  { rotationAngle: number; radRotationAngle: number } {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const xr = Math.ceil(x + halfWidth);
  const xl = Math.floor(x - halfWidth);
  const yt = Math.floor(y - halfHeight);
  const yb = Math.ceil(y + halfHeight);

  // 1 | 2 | 3
  // 8 | 0 | 4
  // 7 | 6 | 5
  let angle = 0; // 0, 3, 4
  if (
    (anchorX < xl && anchorY < yt) // 1
        || (anchorX >= xl && anchorX <= xr && anchorY < yt) // 2
  ) {
    angle = 270;
  } if (
    (anchorX > xr && anchorY > yb) // 5
        || (anchorX >= xl && anchorX <= xr && anchorY > yb) // 6
  ) {
    angle = 90;
  } if (
    (anchorX < xl && anchorY > yb) // 7
        || (anchorX < xl && anchorY >= yt && anchorY <= yb) // 8
  ) {
    angle = 180;
  }

  return {
    rotationAngle: angle,
    radRotationAngle: (angle * PI) / 180,
  };
}

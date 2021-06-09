import {
  RecalculateCoordinates, TooltipCoordinates, Size, CustomizedOptions, CustomizeTooltipFn,
  InitialBorder, TooltipData, Font,
} from './types.d';
import { isFunction, isPlainObject, isDefined } from '../../../core/utils/type';
import domAdapter from '../../../core/dom_adapter';
import { getWindow } from '../../../core/utils/window';

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

function rotateSize({ width, height }: Required<Size>, angle: number): Required<Size> {
  if (angle % 90 === 0 && angle % 180 !== 0) {
    return { width: height, height: width };
  }
  return { width, height };
}

function rotateX({
  x, y, anchorX, anchorY,
}: TooltipCoordinates, angle: number): number {
  return (anchorX - x) * round(cos(angle)) + (anchorY - y) * round(sin(angle)) + x;
}

function rotateY({
  x, y, anchorX, anchorY,
}: TooltipCoordinates, angle: number): number {
  return -(anchorX - x) * round(sin(angle)) + (anchorY - y) * round(cos(angle)) + y;
}

export function getCloudPoints(
  size: Required<Size>,
  coordinates: TooltipCoordinates,
  rotationAngle: number,
  options: { arrowWidth: number; cornerRadius: number },
  bounded: boolean,
): string {
  const { x, y } = coordinates;
  const radRotationAngle = (rotationAngle * PI) / 180;
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

  const cornerRadius = Math.min(halfWidth, halfHeight, options.cornerRadius);

  let points = '';
  let arrowArc = '';

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

    if (Math.abs(angle) > PI / 2) {
      arrowArc = buildPath('L', [arrowBaseLeft, yt, anchorX, anchorY, xr, arrowBaseBottom]);
    } else {
      arrowArc = buildPath('L', rightTopCorner, getArc(cornerRadius, cos(angle), 1 - sin(angle)), 'L', [anchorX, anchorY, arrowEndPointX, arrowEndPointY],
        getAbsoluteArc(cornerRadius, rightTopCorner[0] + cornerRadius,
          rightTopCorner[1] + cornerRadius));
    }
    points = buildPath(leftTopCorner, getArc(cornerRadius, 1, -1), arrowArc, 'L', rightBottomCorner, getArc(cornerRadius, -1, 1), 'L', leftBottomCorner, getArc(cornerRadius, -1, -1));
  } else if (anchorX > xr && anchorY >= yt && anchorY <= yb) { // 4
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
      const arrowBaseBottomY = rightBottomCorner[1] + cornerRadius * sin(bottomAngle);

      arrowArc = buildPath(getArc(cornerRadius, cos(topAngle), 1 - sin(topAngle)),
        'L', [arrowBaseTopX, arrowBaseTopY, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY],
        getAbsoluteArc(cornerRadius, rightBottomCorner[0] - cornerRadius,
          rightBottomCorner[1] + cornerRadius));
    } else if (arrowBaseTop > rightTopCorner[1] + cornerRadius
        && arrowBaseTop <= rightBottomCorner[1] && arrowBaseBottom > rightBottomCorner[1]) {
      const bottomAngle = asin((arrowBaseBottom - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseBottomX = rightBottomCorner[0] + cornerRadius * (cos(bottomAngle) - 1);
      const arrowBaseBottomY = rightBottomCorner[1] + cornerRadius * sin(bottomAngle);

      arrowArc = buildPath(getArc(cornerRadius, 1, 1),
        'L', [xr, arrowBaseTop, anchorX, anchorY, arrowBaseBottomX, arrowBaseBottomY],
        getAbsoluteArc(cornerRadius, rightBottomCorner[0] - cornerRadius,
          rightBottomCorner[1] + cornerRadius));
    } else if (arrowBaseTop > rightTopCorner[1] + cornerRadius
        && arrowBaseBottom > rightBottomCorner[1]) {
      const bottomAngle = asin((arrowBaseBottom - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseBottomX = rightBottomCorner[0] + cornerRadius * (cos(bottomAngle) - 1);
      const arrowBaseBottomY = rightBottomCorner[1] + cornerRadius * sin(bottomAngle);

      const topAngle = asin((arrowBaseTop - rightBottomCorner[1]) / cornerRadius);
      const arrowBaseTopX = rightBottomCorner[0] + cornerRadius * (cos(topAngle) - 1);
      const arrowBaseTopY = rightBottomCorner[1] + cornerRadius * sin(topAngle);

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

export function getCanvas(container: HTMLElement): ClientRect {
  const containerBox = container.getBoundingClientRect();
  const html = domAdapter.getDocumentElement();
  const body = domAdapter.getBody();
  let left = (Number(getWindow()?.pageXOffset) || html.scrollLeft) ?? 0;
  let top = (Number(getWindow()?.pageYOffset) || html.scrollTop) ?? 0;

  const box = {
    left,
    top,
    width: max(body.clientWidth, html.clientWidth) + left,
    height: max(
      body.scrollHeight, html.scrollHeight,
      body.offsetHeight, html.offsetHeight,
      body.clientHeight, html.clientHeight,
    ),

    right: 0,
    bottom: 0,
  };

  if (container !== domAdapter.getBody()) {
    left = max(box.left, box.left + containerBox.left);
    top = max(box.top, box.top + containerBox.top);

    box.width = min(containerBox.width, box.width) + left + box.left;
    box.height = min(containerBox.height, box.height) + top + box.top;

    box.left = left;
    box.top = top;
  }

  return box;
}

export function recalculateCoordinates({
  canvas, anchorX, anchorY, size, offset, arrowLength,
}: RecalculateCoordinates): TooltipCoordinates | false {
  const bounds = {
    xl: canvas.left,
    xr: canvas.width - canvas.right,
    width: canvas.width - canvas.right - canvas.left,
    yt: canvas.top,
    yb: canvas.height - canvas.bottom,
    height: canvas.height - canvas.bottom - canvas.top,
  };

  if (anchorX < bounds.xl || bounds.xr < anchorX || anchorY < bounds.yt || bounds.yb < anchorY) {
    return false;
  }

  let x = Number.NaN;
  let y = Number.NaN;
  let correctedAnchorY = anchorY;

  if (bounds.width < size.width) {
    x = round(bounds.xl + bounds.width / 2);
  } else {
    x = min(
      max(anchorX, ceil(bounds.xl + size.width / 2)),
      floor(bounds.xr - size.width / 2),
    );
  }

  const halfHeightWithArrow = arrowLength + size.height / 2 + offset;
  const yTop = anchorY - halfHeightWithArrow;
  const yBottom = anchorY + halfHeightWithArrow;

  if (bounds.height < size.height + arrowLength) {
    y = round(bounds.yt + size.height / 2);
  } else if (yTop - size.height / 2 < bounds.yt) {
    if (yBottom + size.height / 2 < bounds.yb) {
      y = yBottom;
      correctedAnchorY += offset;
    } else {
      y = round(bounds.yt + size.height / 2);
    }
  } else {
    y = yTop;
    correctedAnchorY -= offset;
  }

  return {
    x,
    y,
    anchorX,
    anchorY: correctedAnchorY,
  };
}

export function getCloudAngle(
  { width, height }: Required<Size>,
  {
    x, y, anchorX, anchorY,
  }: TooltipCoordinates,
): number {
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
  }
  if (
    (anchorX > xr && anchorY > yb) // 5
        || (anchorX >= xl && anchorX <= xr && anchorY > yb) // 6
  ) {
    angle = 90;
  }
  if (
    (anchorX < xl && anchorY > yb) // 7
        || (anchorX < xl && anchorY >= yt && anchorY <= yb) // 8
  ) {
    angle = 180;
  }

  return angle;
}

export function prepareData(
  data: TooltipData, color: string,
  border: InitialBorder,
  font: Font,
  customizeTooltip?: CustomizeTooltipFn,
): CustomizedOptions {
  let customize = {} as CustomizedOptions;

  if (isFunction(customizeTooltip)) {
    customize = customizeTooltip.call(data, data);
    customize = isPlainObject(customize) ? customize : {};
    if ('text' in customize) {
      customize.text = isDefined(customize.text) ? String(customize.text) : '';
    }
    if ('html' in customize) {
      customize.html = isDefined(customize.html) ? String(customize.html) : '';
    }
  }
  if (!('text' in customize) && !('html' in customize)) {
    customize.text = (data.valueText ?? '') || (data.description ?? '');
  }
  customize.color = (customize.color ?? '') || color;
  customize.borderColor = (customize.borderColor ?? '') || border.color;
  customize.fontColor = (customize.fontColor ?? '') || font.color;
  return customize;
}

export function isTextEmpty({ text, html }: CustomizedOptions): boolean {
  return text === null || text === '' || html === '' || html === null;
}

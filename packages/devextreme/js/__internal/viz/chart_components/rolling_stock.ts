interface BoundingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RollingStockLabel {
  getBoundingRect: () => BoundingRect;
  hideInsideLabel: (coords: { x: number; y: number }) => boolean;
  getData: () => { value: number | string | Date };
  shift: (x: number, y: number) => void;
}

interface RollingStockBBox {
  start: number;
  end: number;
  width: number;
  oppositeStart: number;
  oppositeEnd: number;
}

export default class RollingStock {
  labels: RollingStockLabel[];

  #shiftFunction: (bBox: BoundingRect, shiftLength: number) => { x: number; y: number };

  #initialPosition: number;

  #bBox: RollingStockBBox;

  constructor(
    label: RollingStockLabel,
    isRotated: boolean,
    shiftFunction: (bBox: BoundingRect, shiftLength: number) => { x: number; y: number },
  ) {
    const bBox = label.getBoundingRect();
    const { x } = bBox;
    const { y } = bBox;
    const endX = bBox.x + bBox.width;
    const endY = bBox.y + bBox.height;

    this.labels = [label];
    this.#shiftFunction = shiftFunction;

    this.#bBox = {
      start: isRotated ? x : y,
      width: isRotated ? bBox.width : bBox.height,
      end: isRotated ? endX : endY,
      oppositeStart: isRotated ? y : x,
      oppositeEnd: isRotated ? endY : endX,
    };
    this.#initialPosition = isRotated ? bBox.x : bBox.y;
  }

  toChain(nextRollingStock: RollingStock): void {
    const nextRollingStockBBox = nextRollingStock.getBoundingRect();

    nextRollingStock.shift(nextRollingStockBBox.start - this.#bBox.end);

    this._changeBoxWidth(nextRollingStockBBox.width);
    this.labels = this.labels.concat(nextRollingStock.labels);
  }

  getBoundingRect(): RollingStockBBox {
    return this.#bBox;
  }

  shift(shiftLength: number): void {
    this.labels.forEach((label) => {
      const bBox = label.getBoundingRect();
      const coords = this.#shiftFunction(bBox, shiftLength);
      if (!label.hideInsideLabel(coords)) {
        label.shift(coords.x, coords.y);
      }
    });
    this.#bBox.end -= shiftLength;
    this.#bBox.start -= shiftLength;
  }

  setRollingStockInCanvas(canvas: { end: number }): void {
    if (this.#bBox.end > canvas.end) {
      this.shift(this.#bBox.end - canvas.end);
    }
  }

  getLabels(): RollingStockLabel[] {
    return this.labels;
  }

  value(): number | string | Date {
    return this.labels[0].getData().value;
  }

  getInitialPosition(): number {
    return this.#initialPosition;
  }

  _changeBoxWidth(width: number): void {
    this.#bBox.end += width;
    this.#bBox.width += width;
  }
}

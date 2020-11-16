export interface RtlCoordinatesConverter {
  convertFrom: (coordinate: number) => number;
  convertTo: (coordinate: number) => number;
}

export class StandardRtlCoordinatesConverter implements RtlCoordinatesConverter {
  private readonly rtlModifier = -1;

  convertFrom(coordinate: number): number {
    return this.convert(coordinate);
  }

  convertTo(coordinate: number): number {
    return this.convert(coordinate);
  }

  private convert(coordinate: number): number {
    return this.rtlModifier * coordinate;
  }
}

export class NonStandardRtlCoordinatesConverter implements RtlCoordinatesConverter {
  convertFrom = (coordinate: number) => coordinate as number;

  convertTo = (coordinate: number) => coordinate as number;
}

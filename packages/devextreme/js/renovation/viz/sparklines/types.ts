export interface ArgumentAxisRange {
  invert: boolean;
  min?: number;
  max?: number;
  axisType: string;
  dataType: string;
}

export interface ValueAxisRange {
  min?: number;
  max?: number;
  axisType: string;
  dataType: string;
}

export interface BulletScaleProps {
  inverted: boolean;
  value: number;
  target: number;
  startScaleValue: number;
  endScaleValue: number;
}

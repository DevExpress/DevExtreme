const ZOOM_DETECTION_THRESHOLD = 0.01;
const MAX_ROUNDING_ARTIFACT_SIZE = 1;

export function getAdjustedBaseContainerSize(
  rawContainerSize: number,
  baseContainerSize: number,
  baseContentSize: number,
): number {
  const isZoomed = Math.abs(rawContainerSize - baseContainerSize) > ZOOM_DETECTION_THRESHOLD;

  if (isZoomed
    && baseContentSize > baseContainerSize
    && baseContentSize - baseContainerSize <= MAX_ROUNDING_ARTIFACT_SIZE) {
    return baseContentSize;
  }

  return baseContainerSize;
}

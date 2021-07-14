import getElementComputedStyle from '../../../utils/get_computed_style';

export function getTranslateValues(element: Element | null): { left: number; top: number } {
  if (!element) return { left: 0, top: 0 };

  const matrix = getElementComputedStyle(element)?.transform ?? '';
  const regex = /matrix.*\((.+)\)/;
  const matrixValues = regex.exec(matrix);

  if (matrixValues) {
    const result = matrixValues[1].split(', ');

    return { left: Number(result[4]), top: Number(result[5]) };
  }
  return { left: 0, top: 0 };
}

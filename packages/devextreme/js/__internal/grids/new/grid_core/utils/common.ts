export const getName = (): string => 'dxCardView';
export const addWidgetPrefix = (className: string): string => `dx-${getName().slice(2).toLowerCase()}${className ? `-${className}` : ''}`;

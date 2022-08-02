import { IAllDayPanelBehavior } from '../types';

function compareAllDayPanelBehaviors(
  first: IAllDayPanelBehavior | undefined,
  second: IAllDayPanelBehavior | undefined,
): boolean {
  return first?.allDayStrategy === second?.allDayStrategy
    && first?.allDayPanelVisible === second?.allDayPanelVisible;
}

export default compareAllDayPanelBehaviors;

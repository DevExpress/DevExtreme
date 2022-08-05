import { IAllDayPanelBehavior } from '../types';

function compareAllDayPanelBehaviors(
  first?: IAllDayPanelBehavior,
  second?: IAllDayPanelBehavior,
): boolean {
  return first?.allDayStrategy === second?.allDayStrategy
    && first?.allDayPanelVisible === second?.allDayPanelVisible;
}

export default compareAllDayPanelBehaviors;

/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { state } from '@ts/core/reactive/index';
import { View } from '@ts/grids/new/grid_core/core/view';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MainViewProps {

}

// eslint-disable-next-line no-empty-pattern
function MainViewComponent({

}: MainViewProps): JSX.Element {
  return (<>
    This is cardView
  </>);
}

export class MainView extends View<MainViewProps> {
  protected override component = MainViewComponent;

  public static dependencies = [] as const;

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  protected override getProps() {
    return state({});
  }
}

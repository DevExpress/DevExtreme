/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { combined } from '@ts/core/reactive/index';
import { View } from '@ts/grids/new/grid_core/core/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { ComponentType } from 'inferno';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MainViewProps {
  Toolbar: ComponentType;
}

// eslint-disable-next-line no-empty-pattern
function MainViewComponent({
  Toolbar,
}: MainViewProps): JSX.Element {
  return (<>
    {/* @ts-expect-error */}
    <Toolbar/>
    This is cardView
  </>);
}

export class MainView extends View<MainViewProps> {
  protected override component = MainViewComponent;

  public static dependencies = [ToolbarView] as const;

  constructor(
    private readonly toolbar: ToolbarView,
  ) {
    super();
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  protected override getProps() {
    return combined({
      Toolbar: this.toolbar.asInferno(),
    });
  }
}

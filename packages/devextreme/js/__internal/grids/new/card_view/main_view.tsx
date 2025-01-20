/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { combined } from '@ts/core/reactive/index';
import { View } from '@ts/grids/new/grid_core/core/view';
import { PagerView } from '@ts/grids/new/grid_core/pager/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { ComponentType } from 'inferno';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MainViewProps {
  Toolbar: ComponentType;
  Pager: ComponentType;
}

function MainViewComponent({
  Toolbar, Pager,
}: MainViewProps): JSX.Element {
  return (<>
    {/* @ts-expect-error */}
    <Toolbar/>
    <div>
      {/*
        TODO:
        Pager, as renovated component, has strange disposing.
        See `inferno_renderer.remove` method.
        It somehow mutates $V prop of parent element.
        Without this div, CardView would be parent of Pager.
        In this case all `componentWillUnmount`s aren't called
      */}
      {/* @ts-expect-error */}
      <Pager/>
    </div>
  </>);
}

export class MainView extends View<MainViewProps> {
  protected override component = MainViewComponent;

  public static dependencies = [
    PagerView, ToolbarView,
  ] as const;

  constructor(
    private readonly pager: PagerView,
    private readonly toolbar: ToolbarView,
  ) {
    super();
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  protected override getProps() {
    return combined({
      Toolbar: this.toolbar.asInferno(),
      Pager: this.pager.asInferno(),
    });
  }
}

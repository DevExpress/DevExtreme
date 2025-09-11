import { infernoRenderer } from '@ts/core/m_inferno_renderer';
import { effect } from '@ts/core/state_manager/index';
import Widget from '@ts/core/widget/widget';
// eslint-disable-next-line spellcheck/spell-checker
import { type ComponentType, rerender } from 'inferno';

/*
 * Widget inherited from Class, its properties values and constructor are run after ctor and _initMarkup
 */
export abstract class InfernoWidget<TProperties extends {}> extends Widget<any> {
  protected cleanupRenderSubscription?: () => void;

  private props?: TProperties;

  private firstRender = true;

  protected abstract getComponent(): ComponentType<TProperties>;

  protected abstract getProps(): TProperties;

  protected infernoRender(): () => void {
    const root = this.$element().get(0) as HTMLDivElement;
    const ViewComponent = this.getComponent();
    const props = this.getProps();

    return effect(() => {
      this.props = props;
      const content = (
        <ViewComponent {...props}/>
      );

      // infernoRenderer.renderIntoContainer(content, root, !this.firstRender);
      infernoRenderer.render(ViewComponent, props, root, !this.firstRender);
      this.firstRender = false;
    });
  }

  // NOTE: this disables calling of _fireContentReadyAction on initial render
  public _renderContent(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._renderContentImpl();
  }

  public _initMarkup(): void {
    super._initMarkup();

    this.firstRender = true;

    this.cleanupRenderSubscription = this.infernoRender();
    // NOTE: We flush all Inferno async render operations after initial render
    // Because after component creation markup should be ready
    // eslint-disable-next-line spellcheck/spell-checker
    rerender();
  }

  public _clean(): void {
    this.cleanupRenderSubscription?.();
    // infernoRenderer.renderIntoContainer(null, this.$element().get(0), true);
    infernoRenderer.render(null, null, this.$element().get(0), true);
    super._clean();
  }
}

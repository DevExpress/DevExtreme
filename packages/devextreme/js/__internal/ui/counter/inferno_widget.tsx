import { infernoRenderer } from '@ts/core/m_inferno_renderer';
import { effect } from '@ts/core/state_manager';
import Widget from '@ts/core/widget/widget';
// eslint-disable-next-line spellcheck/spell-checker
import { type ComponentType, rerender } from 'inferno';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class InfernoWidget<TProperties extends {}> extends Widget<any> {
  protected viewRef?: any;

  protected cleanupRenderSubscription?: () => void;

  private props?: TProperties;

  private firstRender = true;

  protected component?: ComponentType<TProperties>;

  protected abstract getProps(): TProperties;

  protected abstract _initComponent(): void;

  protected infernoRender(): () => void {
    const root = this.$element().get(0) as HTMLDivElement;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ViewComponent = this.component!;
    const props = this.getProps();

    return effect(() => {
      this.props = props;
      const content = (
        <ViewComponent {...props} ref={(ref): void => { this.viewRef = ref; }}/>
      );

      infernoRenderer.renderIntoContainer(content, root, !this.firstRender);
      // infernoRenderer.render(this.component, props, root, !this.firstRender);
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

    if (!this.component) {
      this._initComponent();
    }

    this.cleanupRenderSubscription = this.infernoRender();
    // NOTE: We flush all Inferno async render operations after initial render
    // Because after component creation markup should be ready
    // eslint-disable-next-line spellcheck/spell-checker
    rerender();
  }

  public _clean(): void {
    this.cleanupRenderSubscription?.();
    infernoRenderer.renderIntoContainer(null, this.$element().get(0), true);
    // infernoRenderer.render(null, null, this.$element().get(0), true);
    super._clean();
  }
}

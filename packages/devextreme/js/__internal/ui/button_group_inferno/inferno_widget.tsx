import { infernoRenderer } from '@ts/core/m_inferno_renderer';
import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { effect } from '@ts/core/state_manager/index';
import Widget from '@ts/core/widget/widget';
// eslint-disable-next-line spellcheck/spell-checker
import { type ComponentType, rerender } from 'inferno';

export abstract class InfernoWidget<TProperties extends {}> extends Widget<TProperties> {
  protected cleanupRenderSubscription?: () => void;

  private props?: TProperties;

  private firstRender?: boolean;

  protected abstract getComponent(): ComponentType<TProperties>;

  protected abstract getProps(): ReadonlySignal<TProperties>;

  protected infernoRender(): () => void {
    const root = this.$element().get(0) as HTMLDivElement;
    const InfernoComponent = this.getComponent();
    const props = this.getProps();

    return effect(() => {
      this.props = props.value;

      const content = <InfernoComponent {...props.value} />;

      infernoRenderer.renderIntoContainer(content, root, !this.firstRender);

      this.firstRender = false;
    });
  }

  _initMarkup(): void {
    super._initMarkup();

    this.firstRender = true;

    this.cleanupRenderSubscription = this.infernoRender();
    // NOTE: We flush all Inferno async render operations after initial render
    // Because after component creation markup should be ready
    // eslint-disable-next-line spellcheck/spell-checker
    rerender();
  }

  _clean(): void {
    this.cleanupRenderSubscription?.();

    infernoRenderer.renderIntoContainer(null, this.$element().get(0), true);

    super._clean();
  }
}

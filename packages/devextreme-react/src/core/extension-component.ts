import { ComponentBase, IHtmlOptions } from './component-base';

class ExtensionComponent<P extends IHtmlOptions> extends ComponentBase<P> {
  public componentDidMount(): void {
    this.renderFinalizeCallback = (dxtemplates) => {
      const { onMounted } = this.props as any;
      if (onMounted) {
        onMounted(() => this._createWidget(dxtemplates));
      } else {
        this._createWidget(dxtemplates);
      }
    }
  }
}

export {
  ExtensionComponent,
};

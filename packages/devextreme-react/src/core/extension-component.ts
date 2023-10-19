import { ComponentBase, IHtmlOptions } from './component-base';

class ExtensionComponent<P extends IHtmlOptions> extends ComponentBase<P> {
  public componentDidMount(): void {
    const { onMounted } = this.props as any;
    if (onMounted) {
      onMounted(this._createWidget);
    } else {
      this._createWidget();
    }
  }
}

export {
  ExtensionComponent,
};

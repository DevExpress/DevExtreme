import { ComponentBase, IHtmlOptions } from './component-base';

class ExtensionComponent<P extends IHtmlOptions> extends ComponentBase<P> {
  public componentDidMount(): void {
    this.setState({
      templateOptions: {}
    });

    this.renderStage = 'main';

    this.lockOnRendered();

    this.renderFinalizeCallback = (dxtemplates) => {
      const { onMounted } = this.props as any;
      if (onMounted) {
        onMounted((element: Element | undefined) => this._createWidget(dxtemplates, element));
      } else {
        this._createWidget(dxtemplates);
      }

      this.unlockOnRendered();
    }
  }
}

export {
  ExtensionComponent,
};

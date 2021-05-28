import { Selector, ClientFunction } from 'testcafe';

const CLASS = {
  overlay: 'dx-overlay',
};

export default class Overlay {
  element: Selector;

  getOverlayInstance: ClientFunction;

  constructor() {
    this.element = Selector(`.${CLASS.overlay}`);

    const { element } = this;
    this.getOverlayInstance = ClientFunction(
      () => ($(element()) as any).dxOverlay('instance'),
      { dependencies: { element } },
    );
  }

  async getOverlayOffset(): Promise<any> {
    const { getOverlayInstance } = this;
    return ClientFunction(
      () => {
        const {
          offsetX, offsetY, pageX, pageY,
        // eslint-disable-next-line no-underscore-dangle
        } = (getOverlayInstance() as any)._position.of;

        return {
          offsetX, offsetY, pageX, pageY,
        };
      },
      { dependencies: { getOverlayInstance } },
    )();
  }
}

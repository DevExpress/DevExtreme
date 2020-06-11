import { Selector, ClientFunction } from 'testcafe';

const CLASS = {
    overlay: 'dx-overlay'
};

export default class Overlay {
    element: Selector;
    getOverlayInstance: ClientFunction<any>;

    constructor() {
        this.element = Selector(`.${CLASS.overlay}`);

        const { element } = this;
        this.getOverlayInstance = ClientFunction(
            () => $(element())['dxOverlay']('instance'),
            { dependencies: { element } }
        );
    }

    getOverlayOffset(): Promise<any> {
        const getOverlayInstance: any = this.getOverlayInstance;
        return ClientFunction(
            () => {
                const { offsetX, offsetY, pageX, pageY } = getOverlayInstance()._position.of;

                return { offsetX, offsetY, pageX, pageY };
            },
            { dependencies: { getOverlayInstance } }
        )();
    }
}
